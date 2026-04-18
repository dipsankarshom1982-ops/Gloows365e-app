// hooks/useUserContests.ts

import { db } from "@/lib/firebase";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";

export const useUserContests = (userId: string) => {
  const [joined, setJoined] = useState<{ [key: string]: boolean }>({});
  const [completed, setCompleted] = useState<any>({});

  useEffect(() => {
    if (!userId) return;

    const q = query(
      collection(db, "contest_participants"),
      where("userId", "==", userId)
    );

    const unsub = onSnapshot(q, (snapshot) => {
      const joinedMap: any = {};
      const completedMap: any = {};

      snapshot.docs.forEach((doc) => {
        const data = doc.data();

        // ✅ Mark joined
        joinedMap[data.contestId] = true;

        // ✅ Mark completed
        if (data.completed) {
          completedMap[data.contestId] = data;
        }
      });

      setJoined(joinedMap);
      setCompleted(completedMap);
    });

    return () => unsub();
  }, [userId]);

  return { joined, completed };
};