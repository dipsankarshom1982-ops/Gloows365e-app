/**
 * Seed script — populate appModules and subscriptionPlans in Firestore
 *
 * Mirrors the values previously hardcoded in:
 *   - app/(drawer)/(tabs)/_layout.tsx  (tab definitions)
 *   - lib/seekho/constants.ts          (PLAN_CONFIG)
 *
 * Usage:
 *   npx tsx scripts/seedAppConfig.ts
 *
 * Requires GOOGLE_APPLICATION_CREDENTIALS env var pointing to a service account JSON,
 * or run with FIRESTORE_EMULATOR_HOST=localhost:8080 for local emulator.
 */

import * as admin from "firebase-admin";
import * as fs from "fs";
import * as path from "path";

// Accept an explicit service account path: npx tsx scripts/seedAppConfig.ts path/to/key.json
// Falls back to GOOGLE_APPLICATION_CREDENTIALS or Application Default Credentials.
const keyArg = process.argv[2];
let credential: admin.credential.Credential;

if (keyArg) {
  const keyPath = path.resolve(keyArg);
  if (!fs.existsSync(keyPath)) {
    console.error(`Service account file not found: ${keyPath}`);
    process.exit(1);
  }
  credential = admin.credential.cert(keyPath);
} else {
  credential = admin.credential.applicationDefault();
}

admin.initializeApp({ credential, projectId: "gloows-03b6sz" });

const db = admin.firestore();

// ─── App Modules (tabs) ───────────────────────────────────────────────────────

const APP_MODULES = [
  { id: "home",        name: "Home",         icon: "home",           order: 1, isEnabled: true },
  { id: "skillboost",  name: "SkillBoost",   icon: "flash",          order: 2, isEnabled: true },
  { id: "seekho",      name: "Seekho",       icon: "school-outline", order: 3, isEnabled: true },
  { id: "skillbattle", name: "Skill-Battle", icon: "trophy",         order: 4, isEnabled: true },
  { id: "vidyastar",   name: "VidyaStar",    icon: "star",           order: 5, isEnabled: true },
  // learnFun is pre-built but disabled by default — enable from Firebase Console when ready
  { id: "learnFun",    name: "LearnFun",     icon: "game-controller", order: 6, isEnabled: false },
  // aiGuru module — always enabled as it's a launch module
  { id: "aiGuru",      name: "AI Guru",      icon: "school-outline",  order: 7, isEnabled: true  },
];

// ─── Subscription Plans ───────────────────────────────────────────────────────

const SUBSCRIPTION_PLANS = [
  {
    id: "free",
    name: "Seekho Free",
    emoji: "🆓",
    monthlyPrice: 0,
    annualPrice: 0,
    annualMonthly: 0,
    features: [
      "2 free lessons per chapter",
      "Limited practice questions",
      "Basic progress tracking",
    ],
    gradient: ["#1e293b", "#334155"],
    highlight: false,
    isActive: true,
    order: 1,
  },
  {
    id: "plus",
    name: "Seekho Plus",
    emoji: "⭐",
    monthlyPrice: 149,
    annualPrice: 999,
    annualMonthly: 83,
    features: [
      "1 class full access",
      "All 4 subjects",
      "Video lessons + notes",
      "Chapter practice tests",
      "Spaced revision",
    ],
    gradient: ["#1e1b4b", "#6366f1"],
    highlight: true,
    isActive: true,
    order: 2,
  },
  {
    id: "pro",
    name: "Seekho Pro",
    emoji: "🚀",
    monthlyPrice: 299,
    annualPrice: 1999,
    annualMonthly: 167,
    features: [
      "All classes 6–12",
      "Exam mode + study planner",
      "Daily revision reminders",
      "AI Guru integration",
      "Priority support",
    ],
    gradient: ["#4c1d95", "#7c3aed"],
    highlight: false,
    isActive: true,
    order: 3,
  },
  // ── AI Guru plans — module: "aiGuru" ─────────────────────────────────────────
  // Admin can toggle isActive or add new plans from Firebase Console without app update
  {
    id: "aiGuru_premium",
    module: "aiGuru",
    name: "AI Guru Premium",
    emoji: "✨",
    monthlyPrice: 149,
    annualPrice: 999,
    annualMonthly: 83,
    features: [
      "Unlimited AI lessons every day",
      "All lesson styles — Story, Exam, Game, Practical",
      "Unlimited VidyaGuru AI chat",
      "Ask AI Guru — unlimited questions",
      "AI Guru in all 22 Indian languages",
      "Detailed quiz analysis & weak concept tracking",
      "Priority lesson generation",
    ],
    gradient: ["#1e1b4b", "#6366f1"],
    highlight: true,
    isActive: true,
    order: 4,
  },
];

// ─── Seed ─────────────────────────────────────────────────────────────────────

async function seed() {
  console.log("Seeding appModules...");
  for (const mod of APP_MODULES) {
    const { id, ...data } = mod;
    await db.collection("appModules").doc(id).set(data, { merge: true });
    console.log(`  ✓ appModules/${id}`);
  }

  console.log("Seeding subscriptionPlans...");
  for (const plan of SUBSCRIPTION_PLANS) {
    const { id, ...data } = plan;
    await db.collection("subscriptionPlans").doc(id).set(data, { merge: true });
    console.log(`  ✓ subscriptionPlans/${id}`);
  }

  console.log("Done.");
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
