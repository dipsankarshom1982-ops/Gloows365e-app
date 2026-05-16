import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "./firebase";

export async function initDashboard(userId: string) {
  const ref = doc(db, "dashboard", userId);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    await setDoc(ref, {
      courses: 0,
      streak: 0,
      coins: 0,
      rank: 0,
      currentCourse: "Start Learning",
      progress: 0,
      earnings: 0,
    });

    console.log("🔥 Dashboard created for user");
  }
}