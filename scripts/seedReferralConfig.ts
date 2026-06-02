// ─────────────────────────────────────────────────────────────────────────────
// FILE: scripts/seedReferralConfig.ts  (NEW FILE)
// PATH: scripts/seedReferralConfig.ts
// Run: npx ts-node scripts/seedReferralConfig.ts
// ─────────────────────────────────────────────────────────────────────────────
// This script seeds the initial referralConfig document in Firestore.
// Run once after deploying. Admin can then update values from the admin panel.
// ─────────────────────────────────────────────────────────────────────────────

import * as admin from "firebase-admin";
import * as serviceAccount from "../firebase-service-account.json"; // update path as needed

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
});

const db = admin.firestore();

async function seedReferralConfig() {
  const ref = db.doc("appConfig/referralConfig");
  const snap = await ref.get();

  if (snap.exists) {
    console.log("✅ referralConfig already exists — skipping seed");
    return;
  }

  await ref.set({
    referrerCoins:  50,
    refereeCoins:   30,
    giftEnabled:    false,
    giftLabel:      "",
    giftImageUrl:   "",
    triggerEvent:   "signup",
    maxReferrals:   0,
    isActive:       true,
    milestones:     [
      {
        every:     5,
        giftLabel: "Super Referrer Badge 🏅",
        giftType:  "coins",
        giftValue: 200,
      },
    ],
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  console.log("✅ referralConfig seeded at appConfig/referralConfig");
  process.exit(0);
}

seedReferralConfig().catch(console.error);
