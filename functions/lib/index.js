"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.followUp = exports.generateLesson = exports.onPostCreated = exports.updateSkillboard = void 0;
const admin = require("firebase-admin");
const firestore_1 = require("firebase-functions/v2/firestore");
const functionsV1 = require("firebase-functions/v1");
const gemini_1 = require("./gemini");
const usageCheck_1 = require("./usageCheck");
const validateLesson_1 = require("./validateLesson");
admin.initializeApp();
const db = admin.firestore();
// ───────────────────────────────────────────────────────────
// FUNCTION 1: updateSkillboard
// Triggers on any post write — updates skillboard + ranks
// ───────────────────────────────────────────────────────────
exports.updateSkillboard = (0, firestore_1.onDocumentWritten)("posts/{postId}", async (event) => {
    const change = event.data;
    if (!change)
        return null;
    const after = change.after.exists
        ? change.after.data()
        : null;
    // Only process skill battle reels
    if (!after || after.postType !== "reel" || !after.isSkillBattle) {
        return null;
    }
    const userId = after.userId;
    const month = after.month;
    const cls = after.class !== undefined ? String(after.class) : "";
    if (!userId || !month || !cls) {
        console.warn("⚠️ Missing userId, month or class — skipping");
        return null;
    }
    // ── Get location from post ────────────────────────────
    let city = after.location?.city ?? "";
    let district = after.location?.district ?? "";
    let state = after.location?.state ?? "";
    let pincode = after.location?.pincode ?? "";
    // ── Fallback: fetch location from students collection ─
    // This runs when post location fields are empty
    if (!district || !state || !pincode) {
        try {
            const studentSnap = await db
                .collection("students")
                .doc(userId)
                .get();
            if (studentSnap.exists) {
                const student = studentSnap.data();
                city = city || student.location?.city || "";
                district = district || student.location?.district || "";
                state = state || student.location?.state || "";
                pincode = pincode || student.location?.pincode || "";
                console.log(`📍 Location from students: ${pincode}/${district}/${state}`);
            }
        }
        catch (err) {
            console.error("❌ Failed to fetch student location:", err);
        }
    }
    // ── Aggregate all qualifying posts for this user+month ─
    const postsSnap = await db
        .collection("posts")
        .where("userId", "==", userId)
        .where("month", "==", month)
        .where("postType", "==", "reel")
        .where("isSkillBattle", "==", true)
        .get();
    let totalLikes = 0;
    let totalViews = 0;
    let totalWatchtime = 0;
    let totalShares = 0;
    let totalComments = 0;
    postsSnap.forEach((postDoc) => {
        const p = postDoc.data();
        totalLikes += p.likes ?? 0;
        totalViews += p.views ?? 0;
        totalWatchtime += p.watchTime ?? 0;
        totalShares += p.shares ?? 0;
        totalComments += p.comments ?? 0;
    });
    // ── Score formula ─────────────────────────────────────
    // (likes×5) + (comments×3) + (shares×4) + (views×1) + (watchtime×2)
    const totalScore = totalLikes * 5 +
        totalComments * 3 +
        totalShares * 4 +
        totalViews * 1 +
        totalWatchtime * 2;
    console.log(`📊 Score for ${userId}: ${totalScore} | ` +
        `likes=${totalLikes} comments=${totalComments} ` +
        `shares=${totalShares} views=${totalViews} watchtime=${totalWatchtime}`);
    // ── Write skillboard doc ──────────────────────────────
    // Doc ID: userId_class_month  e.g. "XkxPlrf_8_2026-05"
    const skillboardId = `${userId}_${cls}_${month}`;
    const skillboardRef = db.collection("skillboard").doc(skillboardId);
    const docData = {
        userId,
        name: after.name ?? "",
        profilePic: after.profilePic ?? "",
        school: after.school ?? "",
        class: cls,
        location: {
            city,
            district,
            state,
            pincode,
            country: "India",
        },
        month,
        totalLikes,
        totalViews,
        totalWatchtime,
        totalShares,
        totalComments,
        totalScore,
        // ✅ Always initialize ranks to 0 — recalculated below
        ranks: {
            local: 0,
            district: 0,
            state: 0,
            india: 0,
        },
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };
    // ✅ merge: false — ensures ranks map is always freshly written
    // If merge:true, existing ranks from previous run persist even if score dropped
    await skillboardRef.set(docData);
    console.log(`✅ Skillboard doc written: ${skillboardId} | score: ${totalScore}`);
    // ── Recalculate all 4 location-scoped ranks ───────────
    await Promise.all([
        recalculateRank("india", { class: cls, month }),
        recalculateRank("state", { class: cls, month, "location.state": state }),
        recalculateRank("district", { class: cls, month, "location.district": district }),
        recalculateRank("local", { class: cls, month, "location.pincode": pincode }),
    ]);
    return null;
});
// ───────────────────────────────────────────────────────────
// FUNCTION 2: onPostCreated
// Increments participantCount on skillBattles when new post added
// ───────────────────────────────────────────────────────────
exports.onPostCreated = (0, firestore_1.onDocumentWritten)("posts/{postId}", async (event) => {
    const change = event.data;
    if (!change)
        return null;
    // Only trigger on CREATE (before didn't exist, after exists)
    const wasCreated = !change.before.exists && change.after.exists;
    if (!wasCreated)
        return null;
    const post = change.after.data();
    // Only count skill battle posts
    if (!post?.battleId || !post?.isSkillBattle)
        return null;
    try {
        await db
            .collection("skillBattles")
            .doc(post.battleId)
            .update({
            participantCount: admin.firestore.FieldValue.increment(1),
        });
        console.log(`✅ participantCount incremented for battle: ${post.battleId}`);
    }
    catch (err) {
        console.error("❌ Failed to increment participantCount:", err);
    }
    return null;
});
// ───────────────────────────────────────────────────────────
// HELPER: recalculateRank
// Recalculates rank for one location scope (india/state/district/local)
// ───────────────────────────────────────────────────────────
// ───────────────────────────────────────────────────────────
// AI GURU FUNCTIONS
// ───────────────────────────────────────────────────────────
async function verifyAuthToken(req) {
    const auth = req.headers.authorization;
    if (!auth?.startsWith("Bearer "))
        throw new Error("UNAUTHENTICATED");
    const decoded = await admin.auth().verifyIdToken(auth.split("Bearer ")[1]);
    return decoded.uid;
}
function setCorsHeaders(res) {
    res.set("Access-Control-Allow-Origin", "*");
    res.set("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
}
function buildLessonPromptInline(body) {
    const { board, classLevel, subject, chapter, topic, language, difficulty, lessonStyle, inputText } = body;
    return `You are AI Guru, a friendly Indian AI teacher for school students.
Convert the content into an interactive self-learning lesson.
Rules: Teach at Class ${classLevel} level, ${board} board. Use ${language}. Style: ${lessonStyle}. Difficulty: ${difficulty}.
Keep each narration under 120 words. Use Indian examples. Return ONLY valid JSON, no markdown.

Board: ${board}, Class: ${classLevel}, Subject: ${subject}, Chapter: ${chapter}, Topic: ${topic ?? "Full Chapter"}

Student Content:
${inputText || `Create a comprehensive lesson on "${chapter}" for Class ${classLevel} ${subject} (${board}).`}

Return exactly this JSON (populate ALL fields, minimum 5 scenes, 8 quiz, 8 flashcards, 5 keyConcepts):
{"lessonTitle":"","shortIntro":"","estimatedDurationMinutes":0,"learningObjectives":[""],"prerequisites":[""],"storyHook":{"title":"","narration":"","studentMission":""},"scenes":[{"sceneNumber":1,"sceneTitle":"","visualType":"animation","visualDescription":"","narration":"","keyConcept":"","example":"","studentAction":"","checkQuestion":{"question":"","options":["","","",""],"correctAnswerIndex":0,"explanation":""}}],"keyConcepts":[{"term":"","simpleMeaning":"","realLifeExample":""}],"practicalActivity":{"title":"","instructions":[""],"expectedOutput":"","aiEvaluationCriteria":[""]},"flashcards":[{"front":"","back":""}],"quickRevisionNotes":[""],"quiz":[{"question":"","options":["","","",""],"correctAnswerIndex":0,"explanation":"","difficulty":"easy","concept":""}],"finalMission":{"title":"","task":"","successCriteria":[""],"rewardText":""},"commonMistakes":[{"mistake":"","correction":""}],"examTips":[""],"followUpPrompts":["Explain this chapter again in simpler way","Give me real-life examples","Take my test","Create revision notes"]}`;
}
exports.generateLesson = functionsV1
    .runWith({ timeoutSeconds: 300, memory: "512MB", secrets: ["GEMINI_API_KEY"] })
    .https.onRequest(async (req, res) => {
    setCorsHeaders(res);
    if (req.method === "OPTIONS") {
        res.status(204).send("");
        return;
    }
    if (req.method !== "POST") {
        res.status(405).json({ error: "Method not allowed" });
        return;
    }
    let uid;
    let lessonId;
    try {
        uid = await verifyAuthToken(req);
    }
    catch {
        res.status(401).json({ error: "Unauthorized" });
        return;
    }
    try {
        await (0, usageCheck_1.checkGenerationLimit)(uid, db);
        const { board, classLevel, subject, chapter, topic = "", language, difficulty, lessonStyle, inputText = "", imageBase64, imageMimeType } = req.body;
        const inputType = imageBase64 ? "image" : inputText.trim() ? "text" : "topic";
        const lessonRef = await db.collection("aiGuruLessons").add({
            uid, board, classLevel, subject, chapter, topic, language,
            difficulty, lessonStyle, inputType,
            inputText: inputType === "text" ? inputText : "",
            status: "generating", aiModel: "gemini-2.5-flash", progress: 0,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
        lessonId = lessonRef.id;
        const prompt = buildLessonPromptInline(req.body);
        const rawResponse = imageBase64 && imageMimeType
            ? await (0, gemini_1.callGeminiWithImage)(prompt, imageBase64, imageMimeType)
            : await (0, gemini_1.callGeminiText)(prompt);
        const lessonJson = (0, gemini_1.parseJsonFromResponse)(rawResponse);
        (0, validateLesson_1.validateLessonJson)(lessonJson);
        await lessonRef.update({
            status: "completed", lessonJson, progress: 0,
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
        await (0, usageCheck_1.incrementGenerationUsage)(uid, db);
        res.status(200).json({ lessonId, lessonJson });
    }
    catch (err) {
        console.error("generateLesson error:", err.message);
        if (lessonId) {
            await db.doc(`aiGuruLessons/${lessonId}`).update({
                status: "failed", errorMessage: err.message,
                updatedAt: admin.firestore.FieldValue.serverTimestamp(),
            }).catch(() => { });
        }
        if (err.message?.startsWith("FREE_LIMIT_REACHED:")) {
            res.status(429).json({ error: err.message.replace("FREE_LIMIT_REACHED:", ""), code: "FREE_LIMIT_REACHED" });
        }
        else {
            res.status(500).json({ error: "Failed to generate lesson. Please try again." });
        }
    }
});
exports.followUp = functionsV1
    .runWith({ timeoutSeconds: 120, memory: "256MB", secrets: ["GEMINI_API_KEY"] })
    .https.onRequest(async (req, res) => {
    setCorsHeaders(res);
    if (req.method === "OPTIONS") {
        res.status(204).send("");
        return;
    }
    if (req.method !== "POST") {
        res.status(405).json({ error: "Method not allowed" });
        return;
    }
    let uid;
    try {
        uid = await verifyAuthToken(req);
    }
    catch {
        res.status(401).json({ error: "Unauthorized" });
        return;
    }
    try {
        await (0, usageCheck_1.checkFollowUpLimit)(uid, db);
        const { lessonId, question, language = "English", mode = "ask_doubt" } = req.body;
        if (!lessonId || !question) {
            res.status(400).json({ error: "lessonId and question required" });
            return;
        }
        const lessonSnap = await db.doc(`aiGuruLessons/${lessonId}`).get();
        if (!lessonSnap.exists || lessonSnap.data()?.uid !== uid) {
            res.status(403).json({ error: "Lesson not found or access denied" });
            return;
        }
        const lesson = lessonSnap.data();
        const modeMap = {
            explain_simple: "Explain in the simplest possible way.",
            real_life_example: "Give 2-3 relatable real-life Indian examples.",
            translate: `Translate the explanation into ${language}.`,
            ask_doubt: "Answer the student's doubt clearly, step by step.",
            generate_more_questions: "Generate 3 new MCQ practice questions on this concept.",
            exam_focus: "Give exam tips and likely exam questions.",
            evaluate_practical: "Evaluate the student's practical activity and give feedback.",
        };
        const prompt = `You are AI Guru helping a Class ${lesson.classLevel} student about "${lesson.chapter}" (${lesson.subject}, ${lesson.board}).
Language: ${language}. ${modeMap[mode] ?? "Answer helpfully."}
Student input: ${question}
Return ONLY this JSON (no markdown): {"answer":"","example":"","miniQuestion":"","miniQuestionAnswer":"","suggestedNextAction":""}`;
        const raw = await (0, gemini_1.callGeminiText)(prompt);
        const parsed = (0, gemini_1.parseJsonFromResponse)(raw);
        await (0, usageCheck_1.incrementFollowUpUsage)(uid, db);
        res.status(200).json(parsed);
    }
    catch (err) {
        console.error("followUp error:", err.message);
        if (err.message?.startsWith("FREE_LIMIT_REACHED:")) {
            res.status(429).json({ error: err.message.replace("FREE_LIMIT_REACHED:", ""), code: "FREE_LIMIT_REACHED" });
        }
        else {
            res.status(500).json({ error: "Failed to process your question." });
        }
    }
});
// ───────────────────────────────────────────────────────────
// HELPER: recalculateRank
// ───────────────────────────────────────────────────────────
async function recalculateRank(scopeKey, filters) {
    // ✅ Skip if scope value is empty string
    // e.g. if pincode is "" — don't rank by empty pincode
    if (scopeKey !== "india") {
        const scopeFieldMap = {
            state: "location.state",
            district: "location.district",
            local: "location.pincode",
        };
        const scopeField = scopeFieldMap[scopeKey];
        const scopeValue = filters[scopeField] ?? "";
        if (!scopeValue) {
            console.warn(`⚠️ Skipping ${scopeKey} rank — scope value is empty`);
            return;
        }
    }
    try {
        // Build query with all filters
        let q = db.collection("skillboard");
        for (const [field, value] of Object.entries(filters)) {
            if (value && value.trim() !== "") {
                q = q.where(field, "==", value);
            }
        }
        const snap = await q
            .orderBy("totalScore", "desc")
            .limit(100)
            .get();
        if (snap.empty) {
            console.log(`ℹ️ No docs found for ${scopeKey} rank — skipping batch`);
            return;
        }
        const batch = db.batch();
        snap.docs.forEach((rankDoc, index) => {
            // ✅ Dot notation update — safe since ranks map always exists (set above)
            batch.update(rankDoc.ref, {
                [`ranks.${scopeKey}`]: index + 1,
            });
        });
        await batch.commit();
        console.log(`✅ ${scopeKey} ranks updated for ${snap.size} students ` +
            `(class=${filters.class}, month=${filters.month})`);
    }
    catch (err) {
        console.error(`❌ recalculateRank(${scopeKey}) failed:`, err);
    }
}
//# sourceMappingURL=index.js.map