import * as admin from "firebase-admin";
import * as functionsV1 from "firebase-functions/v1";
import { getRedis, todayIST, TTL, RK } from "./redish";

const db = admin.firestore();

// ─── Activity catalogue ───────────────────────────────────────────────────────
// maxPerDay = 1 means a simple SETNX lock (claim once).
// maxPerDay > 1 means a daily counter lock.
// daily: false = one-time-ever (profile_complete, etc.)

interface ActivityDef {
  coins: number;
  daily: boolean;
  maxPerDay: number;
}

const ACTIVITIES: Record<string, ActivityDef> = {
  daily_login:        { coins: 5,   daily: true,  maxPerDay: 1  },
  lesson_complete:    { coins: 10,  daily: true,  maxPerDay: 5  },
  practice_complete:  { coins: 20,  daily: true,  maxPerDay: 3  },
  quiz_pass:          { coins: 15,  daily: true,  maxPerDay: 5  },
  chapter_complete:   { coins: 100, daily: true,  maxPerDay: 3  },
  video_watch:        { coins: 5,   daily: true,  maxPerDay: 10 },
  story_view:         { coins: 2,   daily: true,  maxPerDay: 20 },
  post_like:          { coins: 1,   daily: true,  maxPerDay: 30 },
  profile_complete:   { coins: 50,  daily: false, maxPerDay: 1  },
  first_post:         { coins: 25,  daily: false, maxPerDay: 1  },
  referral:           { coins: 100, daily: false, maxPerDay: 1  },
};

// ─── claimVCoinReward ─────────────────────────────────────────────────────────
// Atomically checks dedup lock in Redis, writes Firestore transaction + balance,
// then invalidates balance cache.

export const claimVCoinReward = functionsV1
  .runWith({ timeoutSeconds: 30, memory: "128MB", secrets: ["REDIS_URL", "REDIS_TOKEN"] })
  .https.onCall(async (
    data: { activityId: string; referenceId?: string },
    context
  ) => {
    if (!context.auth) {
      throw new functionsV1.https.HttpsError("unauthenticated", "Login required");
    }

    const userId     = context.auth.uid;
    const { activityId, referenceId = "" } = data;
    const activity   = ACTIVITIES[activityId];

    if (!activity) {
      throw new functionsV1.https.HttpsError("invalid-argument", `Unknown activity: ${activityId}`);
    }

    const today = todayIST();

    // ── Redis dedup lock ───────────────────────────────────
    try {
      if (activity.maxPerDay > 1) {
        // Count-based: e.g. max 5 lesson_complete per day
        const countKey = RK.vcoinCount(userId, activityId, today);
        const count    = await getRedis().incr(countKey);
        if (count === 1) await getRedis().expire(countKey, 86400);
        if (count > activity.maxPerDay) {
          await getRedis().decr(countKey); // rollback
          throw new functionsV1.https.HttpsError(
            "resource-exhausted",
            `Daily limit reached for ${activityId}`
          );
        }
      } else {
        // Simple lock — SETNX returns 0 if already set
        const lockSuffix = activity.daily ? `${today}:${referenceId}` : referenceId;
        const lockKey    = RK.vcoinLock(userId, activityId, lockSuffix);
        const locked     = await getRedis().setnx(lockKey, 1);
        if (locked === 0) {
          throw new functionsV1.https.HttpsError("already-exists", "Activity already claimed");
        }
        const lockTTL = activity.daily ? 86400 : 60 * 60 * 24 * 365; // 1 yr for permanent
        await getRedis().expire(lockKey, lockTTL);
      }
    } catch (e: unknown) {
      // Re-throw our own HttpsErrors; swallow Redis infra errors (fall through to Firestore)
      if (
        e instanceof functionsV1.https.HttpsError &&
        (e.code === "already-exists" || e.code === "resource-exhausted")
      ) throw e;
      console.warn("vcoin Redis lock check failed — falling through:", e);
    }

    // ── Write Firestore transaction + update balance ──────
    const userRef = db.doc(`users/${userId}`);
    const txRef   = userRef.collection("vCoinTransactions").doc();

    const batch = db.batch();
    batch.set(txRef, {
      amount:     activity.coins,
      type:       "CREDIT",
      status:     "SUCCESS",
      activityId,
      referenceId,
      createdAt:  admin.firestore.FieldValue.serverTimestamp(),
    });
    batch.update(userRef, {
      vCoins: admin.firestore.FieldValue.increment(activity.coins),
    });

    await batch.commit();

    // Invalidate cached balance
    getRedis().del(RK.vcoinBalance(userId)).catch(() => {});

    console.log(`✅ VCoin: user=${userId} activity=${activityId} coins=+${activity.coins}`);
    return { success: true, coinsAwarded: activity.coins };
  });

// ─── getVCoinBalance ──────────────────────────────────────────────────────────
// Returns user's V-Coin balance from Redis cache (5 min) or Firestore.

export const getVCoinBalance = functionsV1
  .runWith({ timeoutSeconds: 15, memory: "128MB", secrets: ["REDIS_URL", "REDIS_TOKEN"] })
  .https.onCall(async (_data, context) => {
    if (!context.auth) {
      throw new functionsV1.https.HttpsError("unauthenticated", "Login required");
    }

    const userId   = context.auth.uid;
    const cacheKey = RK.vcoinBalance(userId);

    try {
      const cached = await getRedis().get<number>(cacheKey);
      if (cached !== null) return { balance: cached };
    } catch { /* Redis unavailable */ }

    const snap    = await db.doc(`users/${userId}`).get();
    const balance = snap.data()?.vCoins ?? 0;

    getRedis().set(cacheKey, balance, { ex: TTL.vcoinBalance }).catch(() => {});

    return { balance };
  });
