# Shikshastar Firebase Setup

## Firestore Collections

### contests

Each contest document in `contests` should contain:

```json
{
  "title": "Amul Shikshastar 2026",
  "sponsored": true,
  "subject": "Education",
  "startTime": "Firestore Timestamp",
  "endTime": "Firestore Timestamp",
  "prizePool": 10000,
  "totalSpots": 1000,
  "joinedCount": 280,
  "entryFee": 0,
  "status": "upcoming",
  "createdAt": "Firestore Timestamp"
}
```

Example document IDs:

- `amul-shikshastar-2026`
- `monthly-maths-champion`
- `science-live-skill-battle`

### contestParticipants

The app writes contest joins into `contestParticipants` using a deterministic document id:

```json
{
  "contestId": "CONTEST_DOC_ID",
  "userId": "USER_UID",
  "joinedAt": "Firestore Timestamp",
  "score": 0,
  "rank": null,
  "status": "joined"
}
```

Document id format:

- `USER_UID_CONTEST_DOC_ID`

### quizzes

Each quiz document should contain:

```json
{
  "contestId": "science-live-skill-battle",
  "title": "Science Live Skill Battle Quiz",
  "questions": [
    {
      "id": "q1",
      "prompt": "Water boils at what temperature at sea level?",
      "difficulty": "easy",
      "options": ["80°C", "90°C", "100°C", "120°C"],
      "correctOptionIndex": 2
    }
  ]
}
```

### attempts

Each attempt document should contain:

```json
{
  "contestId": "science-live-skill-battle",
  "quizId": "science-live-skill-battle-quiz",
  "userId": "USER_UID",
  "answers": [
    {
      "questionId": "q1",
      "selectedOptionIndex": 2
    }
  ],
  "timeTaken": 28,
  "status": "submitted",
  "createdAt": "Firestore Timestamp",
  "submittedAt": "Firestore Timestamp"
}
```

## Seed Sample Contests

The repo now includes [scripts/seed-contests.js](scripts/seed-contests.js) and the npm command below:

```bash
npm run seed:contests
```

Authentication options for the script:

1. Set `GOOGLE_APPLICATION_CREDENTIALS` to a Firebase service account JSON file path.
2. Or set `FIREBASE_SERVICE_ACCOUNT_JSON` to the raw JSON string contents of the service account.

PowerShell example:

```powershell
$env:GOOGLE_APPLICATION_CREDENTIALS="C:\path\to\service-account.json"
npm run seed:contests
```

## Create Post Flow

When a user taps Join on a contest card:

1. The app stores participation in `contestParticipants`.
2. The app navigates to `/create-post`.
3. The challenge fields are prefilled with the contest title, subject, and default caption.

## Quiz And Leaderboard Flow

1. User joins a contest from the Shikshastar list.
2. User opens the contest detail screen.
3. When the contest is live, the quiz is shown from `quizzes`.
4. User submits answers to `attempts`.
5. Cloud Functions calculate score, update `contestParticipants`, assign ranks, and distribute winnings when the contest completes.

## Wallet Model

The app keeps the primary wallet in `users/{userId}`:

```json
{
  "role": "student",
  "roles": ["student"],
  "coins": 200
}
```

For compatibility with current profile screens, the same coin value is mirrored to `students/{userId}.stats.coins` during registration and contest joins.

## Required Rules

Make sure the `contests` read rule and `contestParticipants` create rule from [firestore.rules](firestore.rules) are published before testing.

## Cloud Functions Deployment

The repo now includes a deployable Firebase Functions scaffold in [functions/package.json](functions/package.json) and [functions/tsconfig.json](functions/tsconfig.json).

Run:

```bash
cd functions
npm install
npm run build
cd ..
firebase deploy --only functions
```