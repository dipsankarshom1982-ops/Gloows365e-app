/**
 * Removes duplicate seekho_courses (and their lessons/practice questions)
 * caused by running the seed script more than once.
 *
 * Usage:
 *   $env:GOOGLE_APPLICATION_CREDENTIALS="C:\path\to\key.json"
 *   npx tsx scripts/deduplicateSeekho.ts
 */

import * as admin from "firebase-admin";

admin.initializeApp({ credential: admin.credential.applicationDefault() });
const db = admin.firestore();

async function dedup(): Promise<void> {
  console.log("🔍 Scanning seekho_courses for duplicates…\n");

  const snap = await db.collection("seekho_courses").get();
  const docs = snap.docs.map((d) => ({ id: d.id, ...d.data() } as any));

  // Group by (class, board, subject, chapterNumber)
  const groups: Record<string, typeof docs> = {};
  for (const doc of docs) {
    const key = `${doc.class}|${doc.board}|${doc.subject}|${doc.chapterNumber}`;
    if (!groups[key]) groups[key] = [];
    groups[key].push(doc);
  }

  let totalDeleted = 0;

  for (const [key, group] of Object.entries(groups)) {
    if (group.length <= 1) continue;
    console.log(`⚠️  Duplicate: ${key} → ${group.length} copies`);

    // Keep the first, delete the rest
    const toDelete = group.slice(1);
    for (const dup of toDelete) {
      // Delete its lessons
      const lessons = await db.collection("seekho_lessons")
        .where("courseId", "==", dup.id).get();
      for (const l of lessons.docs) {
        await l.ref.delete();
      }

      // Delete its practice questions
      const practice = await db.collection("seekho_practice")
        .where("courseId", "==", dup.id).get();
      for (const p of practice.docs) {
        await p.ref.delete();
      }

      // Delete the course itself
      await db.collection("seekho_courses").doc(dup.id).delete();
      console.log(`  🗑️  Deleted course ${dup.id} + ${lessons.size} lessons + ${practice.size} practice`);
      totalDeleted++;
    }
  }

  if (totalDeleted === 0) {
    console.log("✅ No duplicates found.");
  } else {
    console.log(`\n✅ Removed ${totalDeleted} duplicate course(s).`);
  }

  process.exit(0);
}

dedup().catch((e) => {
  console.error("❌ Failed:", e);
  process.exit(1);
});
