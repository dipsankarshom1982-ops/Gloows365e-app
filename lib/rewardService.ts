import { doc, runTransaction } from "firebase/firestore";
import { db } from "./firebase";

export const giveCoins = async (userId: string, coins: number) => {
  const ref = doc(db, "users", userId);

  await runTransaction(db, async (tx) => {
    const userDoc = await tx.get(ref);

    const currentCoins = userDoc.data()?.coins || 0;

    tx.update(ref, {
      coins: currentCoins + coins,
    });
  });
};