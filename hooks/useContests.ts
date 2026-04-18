// hooks/useContests.ts

import { db } from "@/lib/firebase";
import { filterContests } from "@/utils/contestUtils";
import { collection, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";

export const useContests = () => {
  const [live, setLive] = useState<any[]>([]);
  const [upcoming, setUpcoming] = useState<any[]>([]);
  const [completed, setCompleted] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "contests"), (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const { live, upcoming, completed } = filterContests(data);

      setLive(live);
      setUpcoming(upcoming);
      setCompleted(completed);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  return { live, upcoming, completed, loading };
};