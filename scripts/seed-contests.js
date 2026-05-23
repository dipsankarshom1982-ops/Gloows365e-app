const admin = require("firebase-admin");

const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;

if (!admin.apps.length) {
  if (serviceAccountJson) {
    admin.initializeApp({
      credential: admin.credential.cert(JSON.parse(serviceAccountJson)),
    });
  } else {
    admin.initializeApp();
  }
}

const db = admin.firestore();
const { Timestamp } = admin.firestore;

const contests = [
  {
    id: "amul-shikshastar-2026",
    title: "Amul Shikshastar 2026",
    sponsored: true,
    subject: "Education",
    startTime: Timestamp.fromDate(new Date(Date.now() + 60 * 60 * 1000)),
    endTime: Timestamp.fromDate(new Date(Date.now() + 2 * 60 * 60 * 1000)),
    prizePool: 9999,
    totalSpots: 1000,
    joinedCount: 280,
    entryFee: 0,
    status: "upcoming",
    createdAt: Timestamp.now(),
  },
  {
    id: "monthly-maths-champion",
    title: "Monthly Maths Champion",
    sponsored: false,
    subject: "Math",
    startTime: Timestamp.fromDate(new Date(Date.now() + 3 * 60 * 60 * 1000)),
    endTime: Timestamp.fromDate(new Date(Date.now() + 4 * 60 * 60 * 1000)),
    prizePool: 5000,
    totalSpots: 500,
    joinedCount: 126,
    entryFee: 49,
    status: "upcoming",
    createdAt: Timestamp.now(),
  },
  {
    id: "science-live-skill-battle",
    title: "Science Live Skill Battle",
    sponsored: false,
    subject: "Science",
    startTime: Timestamp.fromDate(new Date(Date.now() - 30 * 60 * 1000)),
    endTime: Timestamp.fromDate(new Date(Date.now() + 30 * 60 * 1000)),
    prizePool: 2000,
    totalSpots: 300,
    joinedCount: 189,
    entryFee: 29,
    status: "live",
    createdAt: Timestamp.now(),
  },
];

const quizzes = [
  {
    id: "amul-shikshastar-2026-quiz",
    contestId: "amul-shikshastar-2026",
    title: "Amul Shikshastar 2026 Quiz",
    questions: [
      {
        id: "q1",
        prompt: "Which nutrient is the main source of energy in milk?",
        difficulty: "easy",
        options: ["Protein", "Carbohydrate", "Calcium", "Vitamin C"],
        correctOptionIndex: 1,
      },
      {
        id: "q2",
        prompt: "Which organ pumps blood through the body?",
        difficulty: "medium",
        options: ["Brain", "Lungs", "Heart", "Liver"],
        correctOptionIndex: 2,
      },
      {
        id: "q3",
        prompt: "What is the value of 12 x 12?",
        difficulty: "hard",
        options: ["124", "144", "132", "154"],
        correctOptionIndex: 1,
      },
    ],
  },
  {
    id: "monthly-maths-champion-quiz",
    contestId: "monthly-maths-champion",
    title: "Monthly Maths Champion Quiz",
    questions: [
      {
        id: "q1",
        prompt: "What is 25% of 200?",
        difficulty: "easy",
        options: ["25", "40", "50", "75"],
        correctOptionIndex: 2,
      },
      {
        id: "q2",
        prompt: "Solve: 18 + 6 x 2",
        difficulty: "medium",
        options: ["48", "30", "24", "20"],
        correctOptionIndex: 1,
      },
      {
        id: "q3",
        prompt: "A triangle has angles 60°, 60°, 60°. What type is it?",
        difficulty: "hard",
        options: ["Scalene", "Right", "Equilateral", "Obtuse"],
        correctOptionIndex: 2,
      },
    ],
  },
  {
    id: "science-live-skill-battle-quiz",
    contestId: "science-live-skill-battle",
    title: "Science Live Skill Battle Quiz",
    questions: [
      {
        id: "q1",
        prompt: "Water boils at what temperature at sea level?",
        difficulty: "easy",
        options: ["80°C", "90°C", "100°C", "120°C"],
        correctOptionIndex: 2,
      },
      {
        id: "q2",
        prompt: "Plants prepare food using which process?",
        difficulty: "medium",
        options: ["Respiration", "Photosynthesis", "Digestion", "Evaporation"],
        correctOptionIndex: 1,
      },
      {
        id: "q3",
        prompt: "Which particle has a negative charge?",
        difficulty: "hard",
        options: ["Proton", "Neutron", "Electron", "Photon"],
        correctOptionIndex: 2,
      },
    ],
  },
];

async function seedContests() {
  for (const contest of contests) {
    const { id, ...data } = contest;
    await db.collection("contests").doc(id).set(data, { merge: true });
    console.log(`Seeded contest: ${id}`);
  }

  for (const quiz of quizzes) {
    const { id, ...data } = quiz;
    await db.collection("quizzes").doc(id).set(data, { merge: true });
    console.log(`Seeded quiz: ${id}`);
  }

  console.log("Contest seeding complete.");
}

seedContests().catch((error) => {
  console.error("Failed to seed contests:", error);
  process.exit(1);
});