import Header from "@/components/header";
import { useTheme } from "@/context/ThemeContext";
import { auth, db } from "@/lib/firebase";
import { getContestStatus, type ContestItem } from "@/components/shikshastar/ContestCard";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type QuizQuestion = {
  id: string;
  prompt: string;
  difficulty: "easy" | "medium" | "hard";
  options: string[];
  correctOptionIndex?: number;
};

type QuizDocument = {
  id: string;
  contestId: string;
  title?: string;
  questions: QuizQuestion[];
};

type ContestParticipant = {
  userId: string;
  contestId: string;
  score?: number;
  rank?: number | null;
  status?: string;
  winnings?: number;
};

type ContestAttempt = {
  id: string;
  score?: number;
  rank?: number | null;
  status?: string;
  correctAnswers?: number;
  timeTaken?: number;
  speedBonus?: number;
};

const normalizeDate = (value: unknown) => {
  if (
    value &&
    typeof value === "object" &&
    "toDate" in value &&
    typeof (value as { toDate: () => Date }).toDate === "function"
  ) {
    return (value as { toDate: () => Date }).toDate();
  }

  if (value instanceof Date) {
    return value;
  }

  if (typeof value === "string" || typeof value === "number") {
    return new Date(value);
  }

  return undefined;
};

const formatDuration = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}m ${secs.toString().padStart(2, "0")}s`;
};

export default function ContestDetailScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string | string[] }>();
  const contestId = Array.isArray(params.id) ? params.id[0] : params.id;

  const [contest, setContest] = useState<ContestItem | null>(null);
  const [quiz, setQuiz] = useState<QuizDocument | null>(null);
  const [participant, setParticipant] = useState<ContestParticipant | null>(null);
  const [attempt, setAttempt] = useState<ContestAttempt | null>(null);
  const [leaderboard, setLeaderboard] = useState<ContestParticipant[]>([]);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [quizStartedAt, setQuizStartedAt] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!contestId) {
      return;
    }

    const contestUnsubscribe = onSnapshot(doc(db, "contests", contestId), (snapshot) => {
      if (!snapshot.exists()) {
        setContest(null);
        setIsLoading(false);
        return;
      }

      const data = snapshot.data();
      setContest({
        id: snapshot.id,
        title: data.title || "Shikshastar 2026",
        sponsored: Boolean(data.sponsored),
        subject: data.subject || "All",
        startTime: normalizeDate(data.startTime) || new Date(),
        endTime: normalizeDate(data.endTime),
        prizePool: Number(data.prizePool || 0),
        totalSpots: Number(data.totalSpots || 0),
        joinedCount: Number(data.joinedCount || 0),
        entryFee: Number(data.entryFee || 0),
        status: data.status,
        createdAt: normalizeDate(data.createdAt),
      });
      setIsLoading(false);
    });

    const leaderboardUnsubscribe = onSnapshot(
      query(collection(db, "contestParticipants"), where("contestId", "==", contestId)),
      (snapshot) => {
        const nextLeaderboard = snapshot.docs
          .map((leaderboardDoc) => ({
            ...(leaderboardDoc.data() as ContestParticipant),
            userId: leaderboardDoc.data().userId,
            contestId: leaderboardDoc.data().contestId,
          }))
          .sort((left, right) => {
            const leftScore = Number(left.score || 0);
            const rightScore = Number(right.score || 0);
            if (rightScore !== leftScore) {
              return rightScore - leftScore;
            }

            return Number(left.rank || Number.MAX_SAFE_INTEGER) - Number(right.rank || Number.MAX_SAFE_INTEGER);
          });

        setLeaderboard(nextLeaderboard);
      }
    );

    const quizUnsubscribe = onSnapshot(
      query(collection(db, "quizzes"), where("contestId", "==", contestId)),
      (snapshot) => {
        if (snapshot.empty) {
          setQuiz(null);
          return;
        }

        const quizDoc = snapshot.docs[0];
        const data = quizDoc.data();
        setQuiz({
          id: quizDoc.id,
          contestId: data.contestId,
          title: data.title,
          questions: Array.isArray(data.questions) ? data.questions : [],
        });
      }
    );

    if (!auth.currentUser) {
      return () => {
        contestUnsubscribe();
        leaderboardUnsubscribe();
        quizUnsubscribe();
      };
    }

    const participantUnsubscribe = onSnapshot(
      doc(db, "contestParticipants", `${auth.currentUser.uid}_${contestId}`),
      (snapshot) => {
        setParticipant(snapshot.exists() ? (snapshot.data() as ContestParticipant) : null);
      }
    );

    const attemptsUnsubscribe = onSnapshot(
      query(
        collection(db, "attempts"),
        where("contestId", "==", contestId),
        where("userId", "==", auth.currentUser.uid),
        orderBy("submittedAt", "desc")
      ),
      (snapshot) => {
        if (snapshot.empty) {
          setAttempt(null);
          return;
        }

        const attemptDoc = snapshot.docs[0];
        const data = attemptDoc.data();
        setAttempt({
          id: attemptDoc.id,
          score: Number(data.score || 0),
          rank: data.rank ?? null,
          status: data.status,
          correctAnswers: Number(data.correctAnswers || 0),
          timeTaken: Number(data.timeTaken || 0),
          speedBonus: Number(data.speedBonus || 0),
        });
      }
    );

    return () => {
      contestUnsubscribe();
      leaderboardUnsubscribe();
      quizUnsubscribe();
      participantUnsubscribe();
      attemptsUnsubscribe();
    };
  }, [contestId]);

  const contestStatus = contest ? getContestStatus(contest) : "upcoming";

  useEffect(() => {
    if (contestStatus === "live" && quiz && !attempt && quizStartedAt === null) {
      setQuizStartedAt(Date.now());
    }
  }, [attempt, contestStatus, quiz, quizStartedAt]);

  const topTen = useMemo(() => leaderboard.slice(0, 10), [leaderboard]);

  const handleAnswer = (questionId: string, optionIndex: number) => {
    setAnswers((current) => ({
      ...current,
      [questionId]: optionIndex,
    }));
  };

  const handleSubmit = async () => {
    if (!auth.currentUser || !contest || !quiz) {
      return;
    }

    if (attempt) {
      Alert.alert("Already submitted", "Your quiz attempt is already recorded.");
      return;
    }

    const unanswered = quiz.questions.find((question, index) => {
      const key = question.id || `q${index + 1}`;
      return answers[key] === undefined;
    });

    if (unanswered) {
      Alert.alert("Incomplete quiz", "Answer every question before submitting.");
      return;
    }

    try {
      setIsSubmitting(true);
      await addDoc(collection(db, "attempts"), {
        contestId: contest.id,
        quizId: quiz.id,
        userId: auth.currentUser.uid,
        answers: quiz.questions.map((question, index) => ({
          questionId: question.id || `q${index + 1}`,
          selectedOptionIndex: answers[question.id || `q${index + 1}`],
        })),
        timeTaken: quizStartedAt ? Math.max(1, Math.floor((Date.now() - quizStartedAt) / 1000)) : 0,
        status: "submitted",
        createdAt: serverTimestamp(),
        submittedAt: serverTimestamp(),
      });
      Alert.alert("Submitted", "Your quiz was submitted. Rankings will update automatically.");
    } catch (error) {
      console.log("Quiz submission error:", error);
      Alert.alert("Submit failed", "Unable to submit your quiz right now.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
        <Header />
        <View style={styles.centerState}>
          <ActivityIndicator size="large" color={colors.accent} />
        </View>
      </SafeAreaView>
    );
  }

  if (!contestId || !contest) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
        <Header />
        <View style={styles.centerState}>
          <Text style={[styles.stateText, { color: colors.textSecondary }]}>Contest not found.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <Header />
      <ScrollView contentContainerStyle={styles.content}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={[styles.backText, { color: colors.accent }]}>← Back to contests</Text>
        </TouchableOpacity>

        <View style={[styles.heroCard, { backgroundColor: colors.card, borderColor: colors.border }]}> 
          <Text style={[styles.heroTitle, { color: colors.text }]}>{contest.title}</Text>
          <Text style={[styles.heroSub, { color: colors.textSecondary }]}>
            {contest.subject} • {contestStatus.toUpperCase()} • Prize ₹{contest.prizePool}
          </Text>
          <View style={styles.heroStats}>
            <View style={styles.statChip}>
              <Text style={[styles.statChipLabel, { color: colors.textSecondary }]}>Joined</Text>
              <Text style={[styles.statChipValue, { color: colors.text }]}>{contest.joinedCount || 0}</Text>
            </View>
            <View style={styles.statChip}>
              <Text style={[styles.statChipLabel, { color: colors.textSecondary }]}>Entry</Text>
              <Text style={[styles.statChipValue, { color: colors.text }]}>
                {contest.sponsored ? "FREE" : `${contest.entryFee || 0} Coins`}
              </Text>
            </View>
            <View style={styles.statChip}>
              <Text style={[styles.statChipLabel, { color: colors.textSecondary }]}>Your Rank</Text>
              <Text style={[styles.statChipValue, { color: colors.text }]}>{participant?.rank ?? "--"}</Text>
            </View>
          </View>
        </View>

        {participant && (
          <View style={[styles.resultCard, { backgroundColor: colors.card, borderColor: colors.border }]}> 
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Your Result</Text>
            <Text style={[styles.resultText, { color: colors.textSecondary }]}>Status: {participant.status || attempt?.status || "joined"}</Text>
            <Text style={[styles.resultText, { color: colors.textSecondary }]}>Score: {attempt?.score ?? participant.score ?? 0}</Text>
            <Text style={[styles.resultText, { color: colors.textSecondary }]}>Rank: {participant.rank ?? attempt?.rank ?? "Pending"}</Text>
            <Text style={[styles.resultText, { color: colors.textSecondary }]}>Winnings: {participant.winnings ? `${participant.winnings} coins` : "Pending"}</Text>
            {attempt?.timeTaken ? (
              <Text style={[styles.resultText, { color: colors.textSecondary }]}>Time Taken: {formatDuration(attempt.timeTaken)}</Text>
            ) : null}
          </View>
        )}

        {contestStatus === "live" && participant ? (
          <View style={[styles.quizCard, { backgroundColor: colors.card, borderColor: colors.border }]}> 
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Live Quiz</Text>
            {!quiz ? (
              <Text style={[styles.stateText, { color: colors.textSecondary }]}>Quiz questions are not published yet.</Text>
            ) : attempt ? (
              <Text style={[styles.stateText, { color: colors.textSecondary }]}>Quiz submitted. Waiting for leaderboard updates.</Text>
            ) : (
              <>
                {quiz.questions.map((question, questionIndex) => {
                  const questionId = question.id || `q${questionIndex + 1}`;

                  return (
                    <View key={questionId} style={[styles.questionCard, { borderColor: colors.border }]}> 
                      <Text style={[styles.questionMeta, { color: colors.accent }]}>
                        Q{questionIndex + 1} • {question.difficulty.toUpperCase()}
                      </Text>
                      <Text style={[styles.questionPrompt, { color: colors.text }]}>{question.prompt}</Text>
                      {question.options.map((option, optionIndex) => {
                        const isSelected = answers[questionId] === optionIndex;

                        return (
                          <TouchableOpacity
                            key={`${questionId}-${optionIndex}`}
                            style={[
                              styles.optionBtn,
                              {
                                backgroundColor: isSelected ? colors.accent : colors.background,
                                borderColor: isSelected ? colors.accent : colors.border,
                              },
                            ]}
                            onPress={() => handleAnswer(questionId, optionIndex)}
                          >
                            <Text style={{ color: isSelected ? "#fff" : colors.textSecondary }}>
                              {option}
                            </Text>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  );
                })}

                <TouchableOpacity
                  style={[styles.submitBtn, { backgroundColor: colors.accent }]}
                  onPress={handleSubmit}
                  disabled={isSubmitting}
                >
                  <Text style={styles.submitText}>{isSubmitting ? "Submitting..." : "Submit Quiz"}</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        ) : (
          <View style={[styles.quizCard, { backgroundColor: colors.card, borderColor: colors.border }]}> 
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Contest Status</Text>
            <Text style={[styles.stateText, { color: colors.textSecondary }]}> 
              {contestStatus === "upcoming"
                ? "This contest has not started yet. Join now and come back when it goes live."
                : contestStatus === "completed"
                  ? "This contest is completed. Results are shown below if available."
                  : "Join the contest to unlock the quiz."}
            </Text>
          </View>
        )}

        <View style={[styles.leaderboardCard, { backgroundColor: colors.card, borderColor: colors.border }]}> 
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Top 10 Leaderboard</Text>
          {topTen.length === 0 ? (
            <Text style={[styles.stateText, { color: colors.textSecondary }]}>No leaderboard data yet.</Text>
          ) : (
            topTen.map((entry, index) => (
              <View key={`${entry.userId}-${index}`} style={[styles.leaderRow, { borderColor: colors.border }]}> 
                <Text style={[styles.leaderRank, { color: colors.accent }]}>#{entry.rank || index + 1}</Text>
                <View style={styles.leaderMeta}>
                  <Text style={[styles.leaderName, { color: colors.text }]}>{entry.userId === auth.currentUser?.uid ? "You" : `User ${entry.userId.slice(0, 6)}`}</Text>
                  <Text style={[styles.leaderScore, { color: colors.textSecondary }]}>Score {entry.score || 0}</Text>
                </View>
                <Text style={[styles.leaderStatus, { color: colors.textSecondary }]}>{entry.status || "joined"}</Text>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  centerState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  backText: {
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 12,
  },
  heroCard: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 18,
    marginBottom: 16,
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: "800",
  },
  heroSub: {
    marginTop: 6,
    fontSize: 14,
  },
  heroStats: {
    flexDirection: "row",
    gap: 10,
    marginTop: 16,
  },
  statChip: {
    flex: 1,
  },
  statChipLabel: {
    fontSize: 12,
  },
  statChipValue: {
    fontSize: 16,
    fontWeight: "800",
    marginTop: 4,
  },
  resultCard: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 18,
    marginBottom: 16,
  },
  quizCard: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 18,
    marginBottom: 16,
  },
  leaderboardCard: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 18,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 12,
  },
  stateText: {
    fontSize: 14,
    lineHeight: 20,
  },
  questionCard: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
  },
  questionMeta: {
    fontSize: 12,
    fontWeight: "700",
    marginBottom: 8,
  },
  questionPrompt: {
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 12,
  },
  optionBtn: {
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 8,
  },
  submitBtn: {
    borderRadius: 14,
    alignItems: "center",
    paddingVertical: 14,
    marginTop: 6,
  },
  submitText: {
    color: "#fff",
    fontWeight: "800",
  },
  leaderRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  leaderRank: {
    width: 48,
    fontSize: 16,
    fontWeight: "800",
  },
  leaderMeta: {
    flex: 1,
  },
  leaderName: {
    fontSize: 15,
    fontWeight: "700",
  },
  leaderScore: {
    fontSize: 13,
    marginTop: 2,
  },
  leaderStatus: {
    fontSize: 12,
    fontWeight: "600",
  },
  resultText: {
    fontSize: 14,
    lineHeight: 22,
  },
});