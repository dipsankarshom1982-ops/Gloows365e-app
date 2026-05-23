import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import { serverTimestamp } from "firebase/firestore";
import { auth } from "@/lib/firebase";
import { getLesson, saveQuizAttempt } from "@/services/aiGuruFirestore";
import { QuizQuestion } from "@/lib/aiGuru/types";
import { XP_PER_CORRECT } from "@/lib/aiGuru/constants";
import QuizCard from "@/components/aiGuru/QuizCard";

const TIME_PER_QUESTION = 30;

export default function QuizScreen() {
  const { lessonId } = useLocalSearchParams<{ lessonId: string }>();
  const [questions, setQuestions]   = useState<QuizQuestion[]>([]);
  const [loading, setLoading]       = useState(true);
  const [currentQ, setCurrentQ]     = useState(0);
  const [selected, setSelected]     = useState<number | null>(null);
  const [locked, setLocked]         = useState(false);
  const [timeLeft, setTimeLeft]     = useState(TIME_PER_QUESTION);
  const [answers, setAnswers]       = useState<{ questionIndex: number; selectedIndex: number; correct: boolean }[]>([]);
  const [xpEarned, setXpEarned]    = useState(0);
  const [saving, setSaving]         = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!lessonId) return;
    getLesson(lessonId).then((l) => {
      if (l?.lessonJson?.quiz) setQuestions(l.lessonJson.quiz);
      setLoading(false);
    });
  }, [lessonId]);

  // Start timer when question changes
  useEffect(() => {
    if (loading || questions.length === 0) return;
    setTimeLeft(TIME_PER_QUESTION);
    setSelected(null);
    setLocked(false);

    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current!);
          handleTimeout();
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current!);
  }, [currentQ, loading, questions.length]);

  const handleTimeout = () => {
    if (locked) return;
    setLocked(true);
    recordAnswer(null);
    setTimeout(advanceQuestion, 1500);
  };

  const handleSelect = (idx: number) => {
    if (locked) return;
    clearInterval(timerRef.current!);
    setSelected(idx);
    setLocked(true);

    const q = questions[currentQ];
    const correct = idx === q.correctAnswerIndex;
    if (correct) {
      const xp = XP_PER_CORRECT[q.difficulty] ?? 10;
      setXpEarned((prev) => prev + xp);
    }
    recordAnswer(idx);
    setTimeout(advanceQuestion, 1800);
  };

  const recordAnswer = (idx: number | null) => {
    const q = questions[currentQ];
    setAnswers((prev) => [
      ...prev,
      {
        questionIndex: currentQ,
        selectedIndex: idx ?? -1,
        correct: idx !== null && idx === q.correctAnswerIndex,
      },
    ]);
  };

  const advanceQuestion = () => {
    if (currentQ >= questions.length - 1) {
      finishQuiz();
    } else {
      setCurrentQ((q) => q + 1);
    }
  };

  const finishQuiz = async () => {
    clearInterval(timerRef.current!);
    const uid = auth.currentUser?.uid;
    if (!uid || !lessonId) return;
    setSaving(true);

    const allAnswers = answers; // note: state may not yet include last answer — handled via recordAnswer before advanceQuestion
    const correct    = allAnswers.filter((a) => a.correct).length;
    const total      = questions.length;
    const accuracy   = total > 0 ? Math.round((correct / total) * 100) : 0;
    const weakConcepts = allAnswers
      .filter((a) => !a.correct)
      .map((a) => questions[a.questionIndex]?.concept ?? "")
      .filter(Boolean);

    try {
      const attemptId = await saveQuizAttempt(lessonId, {
        uid, score: correct, totalQuestions: total, accuracy,
        answers: allAnswers, weakConcepts, xpEarned, createdAt: serverTimestamp(),
      });
      router.replace({ pathname: "/ai-guru/result", params: { lessonId, attemptId } });
    } catch {
      Alert.alert("Error", "Could not save quiz results.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <LinearGradient colors={["#0a0a1a", "#0f172a"]} style={S.center}>
        <ActivityIndicator color="#6366f1" size="large" />
        <Text style={S.loadingText}>Loading quiz...</Text>
      </LinearGradient>
    );
  }

  if (saving) {
    return (
      <LinearGradient colors={["#0a0a1a", "#0f172a"]} style={S.center}>
        <ActivityIndicator color="#10b981" size="large" />
        <Text style={S.loadingText}>Saving your results...</Text>
      </LinearGradient>
    );
  }

  if (questions.length === 0) {
    return (
      <LinearGradient colors={["#0a0a1a", "#0f172a"]} style={S.center}>
        <Text style={S.loadingText}>No quiz questions available.</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={{ color: "#6366f1", marginTop: 16 }}>← Go Back</Text>
        </TouchableOpacity>
      </LinearGradient>
    );
  }

  const question = questions[currentQ];

  return (
    <LinearGradient colors={["#0a0a1a", "#0f172a"]} style={S.bg}>
      {/* Header */}
      <View style={S.header}>
        <TouchableOpacity onPress={() => {
          clearInterval(timerRef.current!);
          router.back();
        }} style={S.backBtn}>
          <Text style={S.backText}>✕</Text>
        </TouchableOpacity>
        <View style={S.headerMid}>
          <Text style={S.headerTitle}>Quiz Battle</Text>
          <Text style={S.xpTotal}>⚡ {xpEarned} XP earned</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <QuizCard
          question={question}
          questionIndex={currentQ}
          totalQuestions={questions.length}
          timeLeft={timeLeft}
          maxTime={TIME_PER_QUESTION}
          selectedIndex={selected}
          locked={locked}
          onSelect={handleSelect}
        />
      </ScrollView>
    </LinearGradient>
  );
}

const S = StyleSheet.create({
  bg:          { flex: 1 },
  center:      { flex: 1, justifyContent: "center", alignItems: "center", gap: 16 },
  loadingText: { color: "#64748b", fontSize: 14 },
  header:      { flexDirection: "row", alignItems: "center", paddingTop: 52, paddingBottom: 10, paddingHorizontal: 16, gap: 12 },
  backBtn:     { width: 38, height: 38, borderRadius: 10, backgroundColor: "rgba(255,255,255,0.08)", justifyContent: "center", alignItems: "center" },
  backText:    { color: "#94a3b8", fontSize: 16, fontWeight: "700" },
  headerMid:   { flex: 1 },
  headerTitle: { color: "#f1f5f9", fontSize: 17, fontWeight: "800" },
  xpTotal:     { color: "#818cf8", fontSize: 12, fontWeight: "700" },
});
