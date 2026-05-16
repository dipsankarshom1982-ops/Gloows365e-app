import * as admin from "firebase-admin";
import {
  Change,
  DocumentSnapshot,
  FirestoreEvent,
  onDocumentWritten,
} from "firebase-functions/v2/firestore";

admin.initializeApp();
const db = admin.firestore();

// ─── Types ─────────────────────────────────────────────
interface PostData {
  userId?: string;
  name?: string;
  profilePic?: string;
  school?: string;
  class?: string | number;
  postType?: string;
  isSkillBattle?: boolean;
  month?: string;
  likes?: number;
  views?: number;
  watchTime?: number;
  shares?: number;
  comments?: number;
  location?: {
    city?: string;
    district?: string;
    state?: string;
    pincode?: string;
  };
}

interface RanksMap {
  local: number;
  district: number;
  state: number;
  india: number;
}

// ─── MAIN FUNCTION ─────────────────────────────────────
export const updateSkillboard = onDocumentWritten(
  "posts/{postId}",
  async (
    event: FirestoreEvent<Change<DocumentSnapshot> | undefined>
  ): Promise<null> => {
    const change = event.data;
    if (!change) return null;

    const after = change.after.exists
      ? (change.after.data() as PostData)
      : null;

    if (!after || after.postType !== "reel" || !after.isSkillBattle) {
      return null;
    }

    const userId = after.userId;
    const month = after.month;
    const cls = after.class !== undefined ? String(after.class) : "";
    const pincode = after.location?.pincode ?? "";
    const district = after.location?.district ?? "";
    const state = after.location?.state ?? "";

    if (!userId || !month || !cls) return null;

    // ── Aggregate Posts ─────────────────────────────
    const postsSnap = await db
      .collection("posts")
      .where("userId", "==", userId)
      .where("month", "==", month)
      .where("postType", "==", "reel")
      .where("isSkillBattle", "==", true)
      .get();

    let totalLikes = 0,
      totalViews = 0,
      totalWatchtime = 0,
      totalShares = 0,
      totalComments = 0;

    postsSnap.forEach((d) => {
      const p = d.data() as PostData;
      totalLikes += p.likes ?? 0;
      totalViews += p.views ?? 0;
      totalWatchtime += p.watchTime ?? 0;
      totalShares += p.shares ?? 0;
      totalComments += p.comments ?? 0;
    });

    const totalScore =
      totalLikes * 5 +
      totalComments * 3 +
      totalShares * 4 +
      totalViews * 1 +
      totalWatchtime * 2;

    // ── Write Skillboard Doc ────────────────────────
    const skillboardId = `${userId}_${cls}_${month}`;
    const skillboardRef = db.collection("skillboard").doc(skillboardId);

    await skillboardRef.set(
      {
        userId,
        name: after.name ?? "",
        profilePic: after.profilePic ?? "",
        school: after.school ?? "",
        class: cls,
        location: {
          city: after.location?.city ?? "",
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
        ranks: { local: 0, district: 0, state: 0, india: 0 },
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true }
    );

    // ── Recalculate Rankings ────────────────────────
    await Promise.all([
      recalculateRank("india", { class: cls, month }),
      recalculateRank("state", {
        class: cls,
        month,
        "location.state": state,
      }),
      recalculateRank("district", {
        class: cls,
        month,
        "location.district": district,
      }),
      recalculateRank("local", {
        class: cls,
        month,
        "location.pincode": pincode,
      }),
    ]);

    return null;
  }
);

// ─── RANK FUNCTION (OUTSIDE MAIN FUNCTION) ─────────────
async function recalculateRank(
  scopeKey: keyof RanksMap,
  filters: Record<string, string>
): Promise<void> {
  let q: admin.firestore.Query = db.collection("skillboard");

  for (const [field, value] of Object.entries(filters)) {
    q = q.where(field, "==", value);
  }

  const snap = await q
    .orderBy("totalScore", "desc")
    .limit(100)
    .get();

  const batch = db.batch();

  snap.docs.forEach((doc, index) => {
    batch.update(doc.ref, {
      [`ranks.${scopeKey}`]: index + 1,
    });
  });

  await batch.commit();
}