// services/joinContest.ts

import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

export const joinContest = async (userId: string, contest: any) => {
  const docId = `${contest.id}_${userId}`;
  const ref = doc(db, "participant", docId);

  const snap = await getDoc(ref);

  if (snap.exists()) {
    return true; // already joined
  }

  await setDoc(ref, {
    userId,
    contestId: contest.id, // ✅ IMPORTANT FIX
    joinedAt: new Date(),
    score: 0,
    completed: false,
  });

  return true;
};