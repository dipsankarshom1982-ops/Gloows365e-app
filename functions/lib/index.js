"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.finalizeCompletedContests = exports.syncContestStatuses = exports.evaluateContestAttempt = exports.updateSkillBoard = void 0;
const admin = __importStar(require("firebase-admin"));
const firestore_1 = require("firebase-functions/v2/firestore");
const scheduler_1 = require("firebase-functions/v2/scheduler");
admin.initializeApp();
const db = admin.firestore();
const fieldValue = admin.firestore.FieldValue;
const DIFFICULTY_POINTS = {
    easy: 10,
    medium: 20,
    hard: 30,
};
// 🔥 Helper: get current month
const getMonthKey = () => {
    const now = new Date();
    return now.toISOString().slice(0, 7); // "2026-04"
};
// 🔥 Score calculator
const calculateScore = ({ views, likes, comments, shares, watchTime, }) => {
    return (views +
        likes * 3 +
        comments * 5 +
        shares * 6 +
        watchTime * 0.05);
};
const normalizeMillis = (value) => {
    if (!value)
        return null;
    if (typeof value.toMillis === "function")
        return value.toMillis();
    const timestamp = new Date(value).getTime();
    return Number.isNaN(timestamp) ? null : timestamp;
};
const getContestStatus = (contest) => {
    if (contest?.status === "upcoming" || contest?.status === "live" || contest?.status === "completed") {
        return contest.status;
    }
    const now = Date.now();
    const startTime = normalizeMillis(contest?.startTime);
    const endTime = normalizeMillis(contest?.endTime);
    if (startTime && now < startTime) {
        return "upcoming";
    }
    if ((!startTime || now >= startTime) && (!endTime || now <= endTime)) {
        return "live";
    }
    return "completed";
};
const calculateQuizAttemptScore = (questions = [], answers = [], timeTaken = 0) => {
    const answerMap = new Map(answers.map((answer) => [answer.questionId, Number(answer.selectedOptionIndex)]));
    let score = 0;
    let correctAnswers = 0;
    questions.forEach((question, index) => {
        const questionId = question.id || `q${index + 1}`;
        const selectedOptionIndex = answerMap.get(questionId);
        const correctOptionIndex = Number(question.correctOptionIndex);
        const difficulty = (question.difficulty || "easy");
        const basePoints = DIFFICULTY_POINTS[difficulty] || DIFFICULTY_POINTS.easy;
        if (selectedOptionIndex === correctOptionIndex) {
            score += basePoints;
            correctAnswers += 1;
            return;
        }
        if (selectedOptionIndex !== undefined) {
            score -= 5;
        }
    });
    const speedBonus = questions.length > 0 && timeTaken > 0 && timeTaken <= questions.length * 15 ? 10 : 0;
    return {
        score: score + speedBonus,
        correctAnswers,
        speedBonus,
    };
};
const recomputeContestLeaderboard = async (contestId) => {
    const participantsSnap = await db
        .collection("contestParticipants")
        .where("contestId", "==", contestId)
        .get();
    const rankedParticipants = participantsSnap.docs
        .map((participantDoc) => ({
        ref: participantDoc.ref,
        ...participantDoc.data(),
    }))
        .sort((left, right) => {
        const scoreGap = Number(right.score || 0) - Number(left.score || 0);
        if (scoreGap !== 0) {
            return scoreGap;
        }
        const leftTimestamp = normalizeMillis(left.updatedAt || left.joinedAt) || Number.MAX_SAFE_INTEGER;
        const rightTimestamp = normalizeMillis(right.updatedAt || right.joinedAt) || Number.MAX_SAFE_INTEGER;
        return leftTimestamp - rightTimestamp;
    });
    const batch = db.batch();
    rankedParticipants.forEach((participant, index) => {
        batch.update(participant.ref, {
            rank: index + 1,
            updatedAt: fieldValue.serverTimestamp(),
        });
    });
    if (!rankedParticipants.length) {
        return;
    }
    await batch.commit();
};
const distributeContestPrizes = async (contestId, prizePool) => {
    const participantsSnap = await db
        .collection("contestParticipants")
        .where("contestId", "==", contestId)
        .get();
    const rankedParticipants = participantsSnap.docs
        .map((participantDoc) => ({
        id: participantDoc.id,
        ref: participantDoc.ref,
        ...participantDoc.data(),
    }))
        .sort((left, right) => Number(left.rank || 0) - Number(right.rank || 0));
    const prizeDistribution = [0.5, 0.3, 0.2];
    const batch = db.batch();
    rankedParticipants.forEach((participant) => {
        batch.set(participant.ref, {
            status: "completed",
            updatedAt: fieldValue.serverTimestamp(),
        }, { merge: true });
    });
    rankedParticipants.slice(0, 3).forEach((participant, index) => {
        const winnings = Math.floor(prizePool * prizeDistribution[index]);
        const userRef = db.collection("users").doc(participant.userId);
        const studentRef = db.collection("students").doc(participant.userId);
        batch.set(participant.ref, {
            winnings,
            status: "winner",
            updatedAt: fieldValue.serverTimestamp(),
        }, { merge: true });
        batch.set(userRef, {
            coins: fieldValue.increment(winnings),
            updatedAt: fieldValue.serverTimestamp(),
        }, { merge: true });
        batch.set(studentRef, {
            stats: {
                coins: fieldValue.increment(winnings),
            },
            updatedAt: fieldValue.serverTimestamp(),
        }, { merge: true });
    });
    if (!rankedParticipants.length) {
        return;
    }
    await batch.commit();
};
// 🚀 MAIN FUNCTION
exports.updateSkillBoard = (0, firestore_1.onDocumentWritten)("posts/{postId}", async (event) => {
    try {
        const change = event.data;
        if (!change)
            return null;
        const newData = change.after.exists ? change.after.data() : null;
        const oldData = change.before.exists ? change.before.data() : null;
        // ❌ If deleted → skip
        if (!newData)
            return null;
        const userId = newData.userId;
        if (!userId)
            return null;
        // ❌ Only SkillBattle posts
        if (!newData.isSkillBattle)
            return null;
        const currentMonth = newData.month || getMonthKey();
        // 🔥 Fetch all posts of user for current month
        const postsSnap = await db
            .collection("posts")
            .where("userId", "==", userId)
            .where("isSkillBattle", "==", true)
            .where("month", "==", currentMonth)
            .get();
        let totalViews = 0;
        let totalLikes = 0;
        let totalComments = 0;
        let totalShares = 0;
        let totalWatchTime = 0;
        postsSnap.forEach((doc) => {
            const p = doc.data();
            totalViews += p.views || 0;
            totalLikes += p.likes || 0;
            totalComments += p.comments || 0;
            totalShares += p.shares || 0;
            totalWatchTime += p.totalWatchTime || 0;
        });
        // 🔥 Calculate score
        const score = calculateScore({
            views: totalViews,
            likes: totalLikes,
            comments: totalComments,
            shares: totalShares,
            watchTime: totalWatchTime,
        });
        // 🔥 Get user info
        const userDoc = await db.collection("students").doc(userId).get();
        let userData = {};
        if (userDoc.exists) {
            userData = userDoc.data();
        }
        // 🔥 Check existing leaderboard entry
        const existingSnap = await db
            .collection("skillboard")
            .where("userId", "==", userId)
            .where("month", "==", currentMonth)
            .limit(1)
            .get();
        const leaderboardData = {
            userId,
            name: userData?.name || "User",
            profilePic: userData?.profilePic || "",
            city: userData?.city || "",
            district: userData?.district || "",
            state: userData?.state || "",
            country: userData?.country || "India",
            totalViews,
            totalLikes,
            totalComments,
            totalShares,
            totalWatchTime,
            score,
            avgWatchTime: totalViews > 0 ? totalWatchTime / totalViews : 0,
            month: currentMonth,
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        };
        // 🔥 UPSERT
        if (!existingSnap.empty) {
            const docId = existingSnap.docs[0].id;
            await db.collection("skillboard").doc(docId).update(leaderboardData);
        }
        else {
            await db.collection("skillboard").add(leaderboardData);
        }
        console.log(`✅ Skillboard updated for user: ${userId}`);
        return null;
    }
    catch (error) {
        console.error("❌ Skillboard error:", error);
        return null;
    }
});
exports.evaluateContestAttempt = (0, firestore_1.onDocumentCreated)("attempts/{attemptId}", async (event) => {
    try {
        const snapshot = event.data;
        if (!snapshot)
            return null;
        const attemptData = snapshot.data();
        if (!attemptData?.contestId || !attemptData?.quizId || !attemptData?.userId) {
            return null;
        }
        const quizSnap = await db.collection("quizzes").doc(attemptData.quizId).get();
        if (!quizSnap.exists) {
            return null;
        }
        const quizData = quizSnap.data() || {};
        const { score, correctAnswers, speedBonus } = calculateQuizAttemptScore(quizData.questions || [], attemptData.answers || [], Number(attemptData.timeTaken || 0));
        const participantRef = db.collection("contestParticipants").doc(`${attemptData.userId}_${attemptData.contestId}`);
        const batch = db.batch();
        batch.set(snapshot.ref, {
            score,
            correctAnswers,
            speedBonus,
            status: "evaluated",
            evaluatedAt: fieldValue.serverTimestamp(),
            updatedAt: fieldValue.serverTimestamp(),
        }, { merge: true });
        batch.set(participantRef, {
            contestId: attemptData.contestId,
            userId: attemptData.userId,
            score,
            status: "submitted",
            lastAttemptId: snapshot.id,
            updatedAt: fieldValue.serverTimestamp(),
        }, { merge: true });
        await batch.commit();
        await recomputeContestLeaderboard(attemptData.contestId);
        return null;
    }
    catch (error) {
        console.error("❌ Contest attempt evaluation failed:", error);
        return null;
    }
});
exports.syncContestStatuses = (0, scheduler_1.onSchedule)({ schedule: "every 5 minutes" }, async () => {
    try {
        const contestsSnap = await db.collection("contests").get();
        const batch = db.batch();
        let hasUpdates = false;
        contestsSnap.forEach((contestDoc) => {
            const contestData = contestDoc.data();
            const derivedStatus = getContestStatus(contestData);
            if (contestData.status !== derivedStatus) {
                batch.update(contestDoc.ref, {
                    status: derivedStatus,
                    updatedAt: fieldValue.serverTimestamp(),
                });
                hasUpdates = true;
            }
        });
        if (hasUpdates) {
            await batch.commit();
        }
        return;
    }
    catch (error) {
        console.error("❌ Contest status sync failed:", error);
        return;
    }
});
exports.finalizeCompletedContests = (0, scheduler_1.onSchedule)({ schedule: "every 10 minutes" }, async () => {
    try {
        const contestsSnap = await db
            .collection("contests")
            .where("status", "==", "completed")
            .get();
        for (const contestDoc of contestsSnap.docs) {
            const contestData = contestDoc.data();
            if (contestData.prizeDistributed) {
                continue;
            }
            await recomputeContestLeaderboard(contestDoc.id);
            await distributeContestPrizes(contestDoc.id, Number(contestData.prizePool || 0));
            await contestDoc.ref.set({
                prizeDistributed: true,
                updatedAt: fieldValue.serverTimestamp(),
            }, { merge: true });
        }
        return;
    }
    catch (error) {
        console.error("❌ Contest finalization failed:", error);
        return;
    }
});
