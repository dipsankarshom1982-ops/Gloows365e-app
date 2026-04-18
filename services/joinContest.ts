// services/joinContest.ts

import { db } from "@/lib/firebase";
import { getToday, normalizeDate } from "@/utils/contestUtils";
import { doc, getDoc, setDoc } from "firebase/firestore";

export const joinContest = async (userId: string, contest: any) => {
  const today = getToday();
  const contestDate = normalizeDate(contest.date);

  if (contestDate !== today || contest.status !== "active") {
    throw new Error("Contest not available");
  }

  const ref = doc(db, "contest_participants", `${contest.id}_${userId}`);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    await setDoc(ref, {
      userId,
      contestId: contest.id,
      joinedAt: new Date(),
      score: 0,
      completed: false,
    });
  }

  return true;
};