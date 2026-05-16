import {
    collection,
    limit,
    onSnapshot,
    orderBy,
    query,
    where,
} from "firebase/firestore";

import { db } from "@/lib/firebase";
import { addRanking } from "@/lib/rankUtils";

let prevRanks: any = {};

export const listenLeaderboard = (
  tab: string,
  scope: string,
  value: string | null,
  cb: (data: any[]) => void
) => {
  let q;

  const basePath = `leaderboards/${tab}/country`;

  if (scope === "country") {
    q = query(
      collection(db, basePath),
      orderBy("points", "desc"),
      limit(50)
    );
  } else if (scope === "state") {
    q = query(
      collection(db, basePath),
      where("stateCode", "==", value),
      orderBy("points", "desc"),
      limit(50)
    );
  } else {
    q = query(
      collection(db, basePath),
      where("districtKey", "==", value),
      orderBy("points", "desc"),
      limit(50)
    );
  }

  return onSnapshot(q, (snap) => {
    const raw = snap.docs.map((d) => d.data());

    const ranked = addRanking(raw, prevRanks);

    prevRanks = {};
    ranked.forEach((u) => {
      prevRanks[u.userId] = u.rank;
    });

    cb(ranked);
  });
};