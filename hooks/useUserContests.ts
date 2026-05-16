// hooks/useUserContests.ts

import { db } from "@/lib/firebase";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";

export const useUserContests = (userId: string) => {
  const [joined, setJoined] = useState<any>({});
  const [completed, setCompleted] = useState<any>({});

  useEffect(() => {
    if (!userId) return;

    const q = query(
      collection(db, "participant"), // ✅ FIXED
      where("userId", "==", userId)
    );

    const unsub = onSnapshot(q, (snap) => {
      const j: any = {};
      const c: any = {};

      snap.docs.forEach((doc) => {
        const data = doc.data();

        j[data.contestId] = true;

        if (data.completed) {
          c[data.contestId] = data;
        }
      });

      setJoined(j);
      setCompleted(c);
    });

    return () => unsub();
  }, [userId]);

  return { joined, completed };
};