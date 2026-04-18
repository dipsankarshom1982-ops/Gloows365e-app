// services/submitContest.ts

import { db } from "@/lib/firebase";
import { getAuth } from "firebase/auth";
import { collection, doc, getDocs, updateDoc } from "firebase/firestore";

export const submitContest = async (contestId: string, score: number) => {
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) {
    throw new Error("User not logged in");
  }

  const userId = user.uid;

  const ref = doc(db, "contest_participants", `${contestId}_${userId}`);

  // ✅ Update score
  await updateDoc(ref, {
    score,
    completed: true,
  });

  // 🔥 Get all participants of this contest
  const snap = await getDocs(collection(db, "contest_participants"));

  const all = snap.docs
    .map((d) => d.data())
    .filter((c) => c.contestId === contestId)
    .sort((a, b) => b.score - a.score);

  const rank = all.findIndex((c) => c.userId === userId) + 1;

  // ✅ Update rank
  await updateDoc(ref, { rank });

  return rank;
};