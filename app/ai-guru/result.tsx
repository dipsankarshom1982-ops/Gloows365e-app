import { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { getLesson, getQuizAttempt } from "@/services/aiGuruFirestore";
import { AiGuruLesson, QuizAttempt } from "@/lib/aiGuru/types";

export default function ResultScreen() {
  const { lessonId, attemptId } = useLocalSearchParams<{ lessonId: string; attemptId: string }>();
  const [attempt, setAttempt] = useState<QuizAttempt | null>(null);
  const [lesson,  setLesson]  = useState<AiGuruLesson | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!lessonId || !attemptId) return;
    Promise.all([getQuizAttempt(lessonId, attemptId), getLesson(lessonId)]).then(([att, les]) => {
      setAttempt(att);
      setLesson(les);
      setLoading(false);
    });
  }, [lessonId, attemptId]);

  if (loading || !attempt) {
    return (
      <LinearGradient colors={["#0a0a1a", "#0f172a"]} style={S.center}>
        <ActivityIndicator color="#6366f1" size="large" />
        <Text style={S.loadingText}>Loading results...</Text>
      </LinearGradient>
    );
  }

  const { score, totalQuestions, accuracy, xpEarned, weakConcepts } = attempt;
  const grade = accuracy >= 90 ? "A+" : accuracy >= 75 ? "A" : accuracy >= 60 ? "B" : accuracy >= 40 ? "C" : "D";
  const gradeColor = accuracy >= 75 ? "#10b981" : accuracy >= 50 ? "#f59e0b" : "#ef4444";
  const passed = accuracy >= 50;

  return (
    <LinearGradient colors={["#0a0a1a", "#0f172a"]} style={S.bg}>
      <View style={S.header}>
        <TouchableOpacity onPress={() => router.replace({ pathname: "/ai-guru/player", params: { lessonId } })} style={S.backBtn}>
          <Ionicons name="chevron-back" size={22} color="#94a3b8" />
        </TouchableOpacity>
        <Text style={S.headerTitle}>Quiz Result</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={S.scroll} showsVerticalScrollIndicator={false}>
        {/* Score ring */}
        <View style={S.ringSection}>
          <View style={[S.ring, { borderColor: gradeColor }]}>
            <Text style={[S.ringGrade, { color: gradeColor }]}>{grade}</Text>
            <Text style={S.ringScore}>{score}/{totalQuestions}</Text>
            <Text style={S.ringAcc}>{accuracy}%</Text>
          </View>
          <Text style={[S.resultMsg, { color: gradeColor }]}>
            {passed ? (accuracy >= 90 ? "🏆 Outstanding!" : "✅ Well done!") : "📚 Keep practising!"}
          </Text>
        </View>

        {/* Stats row */}
        <View style={S.statsRow}>
          <StatCard icon="flash" label="XP Earned" value={`+${xpEarned}`} color="#818cf8" />
          <StatCard icon="checkmark-circle" label="Correct" value={`${score}`} color="#10b981" />
          <StatCard icon="close-circle" label="Wrong" value={`${totalQuestions - score}`} color="#ef4444" />
        </View>

        {/* XP badge */}
        <LinearGradient colors={["#312e81", "#4f46e5"]} style={S.xpCard}>
          <Text style={S.xpEmoji}>⚡</Text>
          <View>
            <Text style={S.xpLabel}>XP Earned This Session</Text>
            <Text style={S.xpValue}>{xpEarned} XP</Text>
          </View>
        </LinearGradient>

        {/* Weak concepts */}
        {weakConcepts && weakConcepts.length > 0 && (
          <View style={S.weakCard}>
            <Text style={S.weakTitle}>⚠️ Concepts to Revise</Text>
            {[...new Set(weakConcepts)].map((concept, i) => (
              <View key={i} style={S.weakRow}>
                <Ionicons name="book-outline" size={14} color="#f59e0b" />
                <Text style={S.weakText}>{concept}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Lesson info */}
        {lesson && (
          <View style={S.lessonInfo}>
            <Text style={S.lessonInfoText}>
              {lesson.subject} • {lesson.chapter} • Class {lesson.classLevel}
            </Text>
          </View>
        )}

        {/* Action buttons */}
        <View style={S.actions}>
          <TouchableOpacity
            style={S.actionBtn}
            onPress={() => router.replace({ pathname: "/ai-guru/quiz", params: { lessonId } })}
            activeOpacity={0.85}
          >
            <LinearGradient colors={["#312e81", "#4f46e5"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={S.actionGrad}>
              <Ionicons name="refresh" size={18} color="#a5b4fc" />
              <Text style={S.actionText}>Take Test Again</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={S.actionBtn}
            onPress={() => router.replace({ pathname: "/ai-guru/player", params: { lessonId } })}
            activeOpacity={0.85}
          >
            <LinearGradient colors={["#064e3b", "#059669"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={S.actionGrad}>
              <Ionicons name="book" size={18} color="#6ee7b7" />
              <Text style={[S.actionText, { color: "#6ee7b7" }]}>Back to Lesson</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={S.actionBtn}
            onPress={() => router.replace("/ai-guru")}
            activeOpacity={0.85}
          >
            <View style={[S.actionGrad, { backgroundColor: "#1e293b", borderWidth: 1, borderColor: "#334155" }]}>
              <Ionicons name="home-outline" size={18} color="#64748b" />
              <Text style={[S.actionText, { color: "#64748b" }]}>AI Guru Home</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>
    </LinearGradient>
  );
}

function StatCard({ icon, label, value, color }: { icon: any; label: string; value: string; color: string }) {
  return (
    <View style={S.statCard}>
      <Ionicons name={icon} size={20} color={color} />
      <Text style={[S.statValue, { color }]}>{value}</Text>
      <Text style={S.statLabel}>{label}</Text>
    </View>
  );
}

const S = StyleSheet.create({
  bg:           { flex: 1 },
  center:       { flex: 1, justifyContent: "center", alignItems: "center", gap: 16 },
  loadingText:  { color: "#64748b", fontSize: 14 },
  header:       { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingTop: 56, paddingBottom: 12, paddingHorizontal: 16 },
  backBtn:      { width: 40, height: 40, borderRadius: 12, backgroundColor: "rgba(255,255,255,0.08)", justifyContent: "center", alignItems: "center" },
  headerTitle:  { color: "#f1f5f9", fontSize: 18, fontWeight: "800" },
  scroll:       { paddingHorizontal: 16, gap: 16 },
  ringSection:  { alignItems: "center", gap: 12, paddingVertical: 16 },
  ring:         { width: 140, height: 140, borderRadius: 70, borderWidth: 6, justifyContent: "center", alignItems: "center", gap: 2 },
  ringGrade:    { fontSize: 36, fontWeight: "900" },
  ringScore:    { color: "#f1f5f9", fontSize: 14, fontWeight: "700" },
  ringAcc:      { color: "#64748b", fontSize: 12 },
  resultMsg:    { fontSize: 18, fontWeight: "800" },
  statsRow:     { flexDirection: "row", gap: 10 },
  statCard:     { flex: 1, backgroundColor: "#1e293b", borderRadius: 14, padding: 14, alignItems: "center", gap: 6 },
  statValue:    { fontSize: 22, fontWeight: "900" },
  statLabel:    { color: "#475569", fontSize: 11, fontWeight: "600" },
  xpCard:       { flexDirection: "row", borderRadius: 16, padding: 18, gap: 16, alignItems: "center" },
  xpEmoji:      { fontSize: 32 },
  xpLabel:      { color: "#a5b4fc", fontSize: 12, fontWeight: "700" },
  xpValue:      { color: "#fff", fontSize: 24, fontWeight: "900" },
  weakCard:     { backgroundColor: "#1e293b", borderRadius: 16, padding: 16, gap: 10, borderWidth: 1, borderColor: "#f59e0b" },
  weakTitle:    { color: "#f59e0b", fontSize: 13, fontWeight: "800" },
  weakRow:      { flexDirection: "row", alignItems: "center", gap: 8 },
  weakText:     { color: "#cbd5e1", fontSize: 13, flex: 1 },
  lessonInfo:   { paddingVertical: 4 },
  lessonInfoText:{ color: "#334155", fontSize: 12, textAlign: "center" },
  actions:      { gap: 10 },
  actionBtn:    { borderRadius: 14, overflow: "hidden" },
  actionGrad:   { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10, paddingVertical: 16, borderRadius: 14 },
  actionText:   { color: "#a5b4fc", fontSize: 15, fontWeight: "800" },
});
