import * as admin from "firebase-admin";
import * as functionsV1 from "firebase-functions/v1";
import { getRedis, TTL, RK } from "./redish";

const db = admin.firestore();

// ─── getHomeFeed ──────────────────────────────────────────────────────────────
// Returns banners (30 min cache) + recent posts for a given class (5 min cache).
// Clients call this instead of two separate Firestore queries.

export const getHomeFeed = functionsV1
  .runWith({ timeoutSeconds: 30, memory: "256MB", secrets: ["REDIS_URL", "REDIS_TOKEN"] })
  .https.onCall(async (
    data: { classLevel?: string },
    context
  ) => {
    if (!context.auth) {
      throw new functionsV1.https.HttpsError("unauthenticated", "Login required");
    }

    const cls = data.classLevel ?? "all";

    // ── Banners (shared across all users, 30 min TTL) ────────
    let banners: unknown[] = [];
    const bannersKey = RK.banners();

    try {
      const cached = await getRedis().get<unknown[]>(bannersKey);
      if (cached) {
        banners = cached;
      } else {
        const snap = await db.collection("banners").orderBy("createdAt", "desc").limit(10).get();
        banners = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        getRedis().set(bannersKey, banners, { ex: TTL.banners }).catch(() => {});
      }
    } catch {
      const snap = await db.collection("banners").orderBy("createdAt", "desc").limit(10).get();
      banners = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    }

    // ── Posts feed (per class, 5 min TTL) ────────────────────
    let posts: unknown[] = [];
    const feedKey = RK.homeFeed(cls);

    try {
      const cached = await getRedis().get<unknown[]>(feedKey);
      if (cached) {
        posts = cached;
      } else {
        posts = await fetchPosts(cls);
        getRedis().set(feedKey, posts, { ex: TTL.homeFeed }).catch(() => {});
      }
    } catch {
      posts = await fetchPosts(cls);
    }

    return { banners, posts };
  });

async function fetchPosts(cls: string): Promise<unknown[]> {
  let q: admin.firestore.Query = db
    .collection("posts")
    .where("postType", "==", "post")
    .orderBy("createdAt", "desc")
    .limit(30);

  if (cls !== "all") {
    q = db
      .collection("posts")
      .where("postType", "==", "post")
      .where("class", "==", cls)
      .orderBy("createdAt", "desc")
      .limit(30);
  }

  const snap = await q.get();
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

// ─── getReelsFeed ─────────────────────────────────────────────────────────────
// Returns trending reels sorted by views. Supports cursor-based pagination.
// First page (no cursor) is cached for 5 min per class.

export const getReelsFeed = functionsV1
  .runWith({ timeoutSeconds: 30, memory: "256MB", secrets: ["REDIS_URL", "REDIS_TOKEN"] })
  .https.onCall(async (
    data: { classLevel?: string; cursor?: string; limit?: number },
    context
  ) => {
    if (!context.auth) {
      throw new functionsV1.https.HttpsError("unauthenticated", "Login required");
    }

    const cls         = data.classLevel ?? "all";
    const pageSize    = Math.min(data.limit ?? 20, 50);
    const hasCursor   = !!data.cursor;
    const cacheKey    = RK.reelsFeed(cls);

    // Only cache the first page (no cursor)
    if (!hasCursor) {
      try {
        const cached = await getRedis().get<unknown[]>(cacheKey);
        if (cached) return { reels: cached, cursor: null };
      } catch { /* Redis unavailable */ }
    }

    // Build Firestore query
    let q: admin.firestore.Query = db
      .collection("posts")
      .where("postType", "==", "reel")
      .orderBy("views", "desc");

    if (cls !== "all") {
      q = db
        .collection("posts")
        .where("postType", "==", "reel")
        .where("class", "==", cls)
        .orderBy("views", "desc");
    }

    if (data.cursor) {
      const cursorDoc = await db.doc(`posts/${data.cursor}`).get();
      if (cursorDoc.exists) q = q.startAfter(cursorDoc);
    }

    const snap   = await q.limit(pageSize).get();
    const reels  = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    const cursor = snap.docs.length === pageSize ? snap.docs[snap.docs.length - 1].id : null;

    if (!hasCursor) {
      getRedis().set(cacheKey, reels, { ex: TTL.reelsFeed }).catch(() => {});
    }

    return { reels, cursor };
  });
