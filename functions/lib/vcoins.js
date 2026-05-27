"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getVCoinBalance = exports.claimVCoinReward = void 0;
const admin = require("firebase-admin");
const functionsV1 = require("firebase-functions/v1");
const redish_1 = require("./redish");
const db = admin.firestore();
const ACTIVITIES = {
    daily_login: { coins: 5, daily: true, maxPerDay: 1 },
    lesson_complete: { coins: 10, daily: true, maxPerDay: 5 },
    practice_complete: { coins: 20, daily: true, maxPerDay: 3 },
    quiz_pass: { coins: 15, daily: true, maxPerDay: 5 },
    chapter_complete: { coins: 100, daily: true, maxPerDay: 3 },
    video_watch: { coins: 5, daily: true, maxPerDay: 10 },
    story_view: { coins: 2, daily: true, maxPerDay: 20 },
    post_like: { coins: 1, daily: true, maxPerDay: 30 },
    profile_complete: { coins: 50, daily: false, maxPerDay: 1 },
    first_post: { coins: 25, daily: false, maxPerDay: 1 },
    referral: { coins: 100, daily: false, maxPerDay: 1 },
};
// ─── claimVCoinReward ─────────────────────────────────────────────────────────
// Atomically checks dedup lock in Redis, writes Firestore transaction + balance,
// then invalidates balance cache.
exports.claimVCoinReward = functionsV1
    .runWith({ timeoutSeconds: 30, memory: "128MB", secrets: ["REDIS_URL", "REDIS_TOKEN"] })
    .https.onCall(async (data, context) => {
    if (!context.auth) {
        throw new functionsV1.https.HttpsError("unauthenticated", "Login required");
    }
    const userId = context.auth.uid;
    const { activityId, referenceId = "" } = data;
    const activity = ACTIVITIES[activityId];
    if (!activity) {
        throw new functionsV1.https.HttpsError("invalid-argument", `Unknown activity: ${activityId}`);
    }
    const today = (0, redish_1.todayIST)();
    // ── Redis dedup lock ───────────────────────────────────
    try {
        if (activity.maxPerDay > 1) {
            // Count-based: e.g. max 5 lesson_complete per day
            const countKey = redish_1.RK.vcoinCount(userId, activityId, today);
            const count = await (0, redish_1.getRedis)().incr(countKey);
            if (count === 1)
                await (0, redish_1.getRedis)().expire(countKey, 86400);
            if (count > activity.maxPerDay) {
                await (0, redish_1.getRedis)().decr(countKey); // rollback
                throw new functionsV1.https.HttpsError("resource-exhausted", `Daily limit reached for ${activityId}`);
            }
        }
        else {
            // Simple lock — SETNX returns 0 if already set
            const lockSuffix = activity.daily ? `${today}:${referenceId}` : referenceId;
            const lockKey = redish_1.RK.vcoinLock(userId, activityId, lockSuffix);
            const locked = await (0, redish_1.getRedis)().setnx(lockKey, 1);
            if (locked === 0) {
                throw new functionsV1.https.HttpsError("already-exists", "Activity already claimed");
            }
            const lockTTL = activity.daily ? 86400 : 60 * 60 * 24 * 365; // 1 yr for permanent
            await (0, redish_1.getRedis)().expire(lockKey, lockTTL);
        }
    }
    catch (e) {
        // Re-throw our own HttpsErrors; swallow Redis infra errors (fall through to Firestore)
        if (e instanceof functionsV1.https.HttpsError &&
            (e.code === "already-exists" || e.code === "resource-exhausted"))
            throw e;
        console.warn("vcoin Redis lock check failed — falling through:", e);
    }
    // ── Write Firestore transaction + update balance ──────
    const userRef = db.doc(`users/${userId}`);
    const txRef = userRef.collection("vCoinTransactions").doc();
    const batch = db.batch();
    batch.set(txRef, {
        amount: activity.coins,
        type: "CREDIT",
        status: "SUCCESS",
        activityId,
        referenceId,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    batch.update(userRef, {
        vCoins: admin.firestore.FieldValue.increment(activity.coins),
    });
    await batch.commit();
    // Invalidate cached balance
    (0, redish_1.getRedis)().del(redish_1.RK.vcoinBalance(userId)).catch(() => { });
    console.log(`✅ VCoin: user=${userId} activity=${activityId} coins=+${activity.coins}`);
    return { success: true, coinsAwarded: activity.coins };
});
// ─── getVCoinBalance ──────────────────────────────────────────────────────────
// Returns user's V-Coin balance from Redis cache (5 min) or Firestore.
exports.getVCoinBalance = functionsV1
    .runWith({ timeoutSeconds: 15, memory: "128MB", secrets: ["REDIS_URL", "REDIS_TOKEN"] })
    .https.onCall(async (_data, context) => {
    if (!context.auth) {
        throw new functionsV1.https.HttpsError("unauthenticated", "Login required");
    }
    const userId = context.auth.uid;
    const cacheKey = redish_1.RK.vcoinBalance(userId);
    try {
        const cached = await (0, redish_1.getRedis)().get(cacheKey);
        if (cached !== null)
            return { balance: cached };
    }
    catch { /* Redis unavailable */ }
    const snap = await db.doc(`users/${userId}`).get();
    const balance = snap.data()?.vCoins ?? 0;
    (0, redish_1.getRedis)().set(cacheKey, balance, { ex: redish_1.TTL.vcoinBalance }).catch(() => { });
    return { balance };
});
//# sourceMappingURL=vcoins.js.map