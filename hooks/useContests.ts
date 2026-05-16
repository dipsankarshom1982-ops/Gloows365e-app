import { db } from "@/lib/firebase";
import { collection, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";

export const useContests = () => {
  const [contests, setContests] = useState<any[]>([]); // ✅ default []

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "contests"), (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      console.log("🔥 contests:", data);

      setContests(data);
    });

    return () => unsub();
  }, []);

  return { contests }; // ✅ ALWAYS defined
};