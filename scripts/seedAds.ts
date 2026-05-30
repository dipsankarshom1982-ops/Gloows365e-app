/**
 * Seed script — populate the `ads` Firestore collection with sample ads.
 *
 * ── HOW TO GET CREDENTIALS ────────────────────────────────────────────────────
 *
 * Option A — Service account JSON file (recommended for local dev):
 *   1. Go to Firebase Console → Project Settings → Service Accounts
 *   2. Click "Generate new private key" → download the JSON file
 *   3. Run: npx tsx scripts/seedAds.ts /full/path/to/serviceAccount.json
 *
 * Option B — GOOGLE_APPLICATION_CREDENTIALS env var:
 *   export GOOGLE_APPLICATION_CREDENTIALS=/full/path/to/serviceAccount.json
 *   npx tsx scripts/seedAds.ts
 *
 * Option C — FIREBASE_SERVICE_ACCOUNT env var (base64-encoded JSON):
 *   export FIREBASE_SERVICE_ACCOUNT=$(base64 -i serviceAccount.json)
 *   npx tsx scripts/seedAds.ts
 *
 * Option D — gcloud CLI (if you have Google Cloud SDK installed):
 *   gcloud auth application-default login
 *   npx tsx scripts/seedAds.ts
 *
 * ─────────────────────────────────────────────────────────────────────────────
 */

import * as admin from "firebase-admin";
import * as fs from "fs";
import * as path from "path";

function resolveCredential(): admin.credential.Credential {
  // 1. Explicit file path argument
  const keyArg = process.argv[2];
  if (keyArg) {
    const keyPath = path.resolve(keyArg);
    if (!fs.existsSync(keyPath)) {
      console.error(`\n❌ Service account file not found: ${keyPath}`);
      console.error(`\nHow to fix:`);
      console.error(`  1. Go to Firebase Console → Project Settings → Service Accounts`);
      console.error(`  2. Click "Generate new private key" → save the JSON file`);
      console.error(`  3. Run: npx tsx scripts/seedAds.ts /full/path/to/downloaded-key.json\n`);
      process.exit(1);
    }
    console.log(`🔑 Using service account: ${keyPath}`);
    return admin.credential.cert(keyPath);
  }

  // 2. Base64-encoded JSON in FIREBASE_SERVICE_ACCOUNT env var
  const b64 = process.env["FIREBASE_SERVICE_ACCOUNT"];
  if (b64) {
    try {
      const json = JSON.parse(Buffer.from(b64, "base64").toString("utf8"));
      console.log("🔑 Using FIREBASE_SERVICE_ACCOUNT env var");
      return admin.credential.cert(json);
    } catch {
      console.error("❌ FIREBASE_SERVICE_ACCOUNT env var is not valid base64-encoded JSON");
      process.exit(1);
    }
  }

  // 3. GOOGLE_APPLICATION_CREDENTIALS env var (set automatically by gcloud CLI)
  if (process.env["GOOGLE_APPLICATION_CREDENTIALS"]) {
    console.log(`🔑 Using GOOGLE_APPLICATION_CREDENTIALS: ${process.env["GOOGLE_APPLICATION_CREDENTIALS"]}`);
    return admin.credential.applicationDefault();
  }

  // 4. Fallback: Application Default Credentials (gcloud auth application-default login)
  console.log("🔑 Using Application Default Credentials (gcloud auth application-default login)");
  console.log("   If this fails, run: gcloud auth application-default login\n");
  return admin.credential.applicationDefault();
}

admin.initializeApp({ credential: resolveCredential(), projectId: "gloows-03b6sz" });
const db = admin.firestore();

const now   = admin.firestore.Timestamp.now();
const in30d = admin.firestore.Timestamp.fromMillis(Date.now() + 30 * 24 * 3600 * 1000);
const in7d  = admin.firestore.Timestamp.fromMillis(Date.now() +  7 * 24 * 3600 * 1000);

// ── Sample Ads ────────────────────────────────────────────────────────────────

const SAMPLE_ADS = [
  // ── 3 Feed Ads (education courses) ──────────────────────────────────────────
  {
    id: "ad_feed_coding",
    adType: "feed",
    title: "Learn Python Programming — Free for Class 8-10",
    description: "Master Python with fun projects. Beginner friendly. Start today!",
    imageUrl: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=800",
    ctaText: "Start Free",
    ctaUrl: "https://example.com/python-course",
    sponsorName: "CodeVidya Academy",
    adCategory: "course",
    targetModules: ["home", "seekho", "aiGuru"],
    targetClass: ["8", "9", "10", "all"],
    targetInterests: ["coding", "technology"],
    isActive: true,
    isApproved: true,  // set false in production
    priority: 10,
    startDate: now,
    endDate: in30d,
    reward: null,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "ad_feed_english",
    adType: "feed",
    title: "Spoken English in 30 Days — Special Offer",
    description: "Fluent English for Class 6-12 students. Live sessions with expert teachers.",
    imageUrl: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800",
    ctaText: "Join Now",
    ctaUrl: "https://example.com/english",
    sponsorName: "FluentEdge",
    adCategory: "education",
    targetModules: ["home", "seekho", "skillBoost"],
    targetClass: ["6", "7", "8", "9", "10", "all"],
    targetInterests: ["english", "communication"],
    isActive: true,
    isApproved: true,
    priority: 8,
    startDate: now,
    endDate: in30d,
    reward: null,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "ad_feed_jee",
    adType: "feed",
    title: "JEE 2025 Crash Course — Limited Seats",
    description: "Expert faculty. Full syllabus in 90 days. Mock tests + doubt clearing.",
    imageUrl: "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=800",
    ctaText: "Enroll Free",
    ctaUrl: "https://example.com/jee-crash",
    sponsorName: "ExamPro Institute",
    adCategory: "exam",
    targetModules: ["home", "aiGuru", "seekho"],
    targetClass: ["11", "12"],
    targetInterests: ["math", "science", "jee", "neet"],
    isActive: true,
    isApproved: true,
    priority: 9,
    startDate: now,
    endDate: in30d,
    reward: null,
    createdAt: now,
    updatedAt: now,
  },

  // ── 2 Scholarship Ads ────────────────────────────────────────────────────────
  {
    id: "ad_scholarship_merit",
    adType: "scholarship",
    title: "National Merit Scholarship 2025 — ₹25,000 Award",
    description: "Open for Class 9-12 students with >75% marks. Apply before deadline.",
    imageUrl: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800",
    ctaText: "Apply Now",
    ctaUrl: "https://example.com/merit-scholarship",
    sponsorName: "Vidya Foundation",
    adCategory: "scholarship",
    targetModules: ["home", "aiGuru", "vidyaStar", "all"],
    targetClass: ["9", "10", "11", "12"],
    targetInterests: ["scholarship", "awards"],
    isActive: true,
    isApproved: true,
    priority: 12,
    startDate: now,
    endDate: in7d,  // Expires in 7 days — creates urgency
    reward: null,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "ad_scholarship_olympiad",
    adType: "scholarship",
    title: "National Science Olympiad — Win ₹10,000",
    description: "India's biggest school olympiad. Register your school now.",
    imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800",
    ctaText: "Register School",
    ctaUrl: "https://example.com/olympiad",
    sponsorName: "Science India Foundation",
    adCategory: "olympiad",
    targetModules: ["home", "seekho", "skillBattle"],
    targetClass: ["6", "7", "8", "9", "10"],
    targetInterests: ["science", "competition"],
    isActive: true,
    isApproved: true,
    priority: 11,
    startDate: now,
    endDate: in30d,
    reward: null,
    createdAt: now,
    updatedAt: now,
  },

  // ── 1 Rewarded Ad (15s watch → 10 V-Coins) ───────────────────────────────
  {
    id: "ad_rewarded_skillcourse",
    adType: "rewarded",
    title: "Watch & Earn: SkillBoost Pro Preview",
    description: "See what SkillBoost Pro offers — 15 seconds to earn V-Coins!",
    imageUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800",
    videoUrl: "https://stream.cloudflare.com/placeholder-video-id/manifest/video.m3u8",
    ctaText: "Try SkillBoost Pro",
    ctaRoute: "/skillboost",
    sponsorName: "GLOOWS365E SkillBoost",
    adCategory: "skill",
    targetModules: ["skillBattle", "vidyaStar", "learnFun", "home"],
    targetClass: ["all"],
    targetInterests: ["skill", "competition"],
    isActive: true,
    isApproved: true,
    priority: 15,
    startDate: now,
    endDate: in30d,
    reward: {
      coins: 10,
      xp: 5,
      watchDurationSeconds: 15,
    },
    createdAt: now,
    updatedAt: now,
  },

  // ── 1 Sponsored Reel (placeholder) ──────────────────────────────────────
  {
    id: "ad_sponsored_reel_01",
    adType: "sponsored_reel",
    title: "The Future of Education is AI — GLOOWS365E",
    description: "See how AI Guru is changing how students learn in India.",
    imageUrl: "https://images.unsplash.com/photo-1485546246426-74dc88dec4d9?w=800",
    videoUrl: "https://stream.cloudflare.com/placeholder-reel-id/manifest/video.m3u8",
    ctaText: "Try AI Guru Free",
    ctaRoute: "/ai-guru",
    sponsorName: "GLOOWS365E",
    adCategory: "education",
    targetModules: ["home"],  // injected into reels feed
    targetClass: ["all"],
    targetInterests: ["technology", "ai"],
    isActive: true,
    isApproved: true,
    priority: 7,
    startDate: now,
    endDate: in30d,
    reward: null,
    createdAt: now,
    updatedAt: now,
  },
];

// ── Seed ─────────────────────────────────────────────────────────────────────

async function seed() {
  console.log("Seeding ads collection...");
  for (const ad of SAMPLE_ADS) {
    const { id, ...data } = ad;
    await db.collection("ads").doc(id).set(data, { merge: true });
    console.log(`  ✓ ads/${id} (${data.adType})`);
  }
  console.log(`\nDone. Seeded ${SAMPLE_ADS.length} ads.`);
  console.log("\n⚠️  In production, set isApproved: false and approve via admin portal.");
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
