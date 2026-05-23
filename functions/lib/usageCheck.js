"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSubscription = getSubscription;
exports.checkGenerationLimit = checkGenerationLimit;
exports.checkFollowUpLimit = checkFollowUpLimit;
exports.incrementGenerationUsage = incrementGenerationUsage;
exports.incrementFollowUpUsage = incrementFollowUpUsage;
const admin = require("firebase-admin");
const FREE_DAILY_LESSONS = 2;
const FREE_DAILY_FOLLOWUPS = 5;
function todayKey() {
    return new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"
}
async function getSubscription(uid, db) {
    try {
        const snap = await db.doc(`subscriptions/${uid}`).get();
        if (!snap.exists)
            return { isPremium: false };
        const data = snap.data();
        const now = Date.now();
        const endDate = data.endDate?.toMillis?.() ?? 0;
        const isPremium = data.status === "active" && endDate > now;
        return { isPremium };
    }
    catch {
        return { isPremium: false };
    }
}
async function checkGenerationLimit(uid, db) {
    const { isPremium } = await getSubscription(uid, db);
    if (isPremium)
        return;
    const ref = db.doc(`aiGuruUsage/${uid}/daily/${todayKey()}`);
    const snap = await ref.get();
    const used = snap.exists ? (snap.data()?.generationsUsed ?? 0) : 0;
    if (used >= FREE_DAILY_LESSONS) {
        throw new Error(`FREE_LIMIT_REACHED:You have used your ${FREE_DAILY_LESSONS} free lessons for today. Upgrade to Premium for unlimited lessons.`);
    }
}
async function checkFollowUpLimit(uid, db) {
    const { isPremium } = await getSubscription(uid, db);
    if (isPremium)
        return;
    const ref = db.doc(`aiGuruUsage/${uid}/daily/${todayKey()}`);
    const snap = await ref.get();
    const used = snap.exists ? (snap.data()?.quizAttempts ?? 0) : 0;
    if (used >= FREE_DAILY_FOLLOWUPS) {
        throw new Error(`FREE_LIMIT_REACHED:You have used your ${FREE_DAILY_FOLLOWUPS} free follow-ups for today.`);
    }
}
async function incrementGenerationUsage(uid, db) {
    const ref = db.doc(`aiGuruUsage/${uid}/daily/${todayKey()}`);
    await ref.set({
        generationsUsed: admin.firestore.FieldValue.increment(1),
        lastGeneratedAt: admin.firestore.FieldValue.serverTimestamp(),
    }, { merge: true });
}
async function incrementFollowUpUsage(uid, db) {
    const ref = db.doc(`aiGuruUsage/${uid}/daily/${todayKey()}`);
    await ref.set({ quizAttempts: admin.firestore.FieldValue.increment(1) }, { merge: true });
}
//# sourceMappingURL=usageCheck.js.map