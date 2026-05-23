import { auth, db } from "@/lib/firebase";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  collection,
  doc,
  getDoc,
  getDocs,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type LeaderRow = { userId: string; name: string; score: number; pct: number };

function getGrade(pct: number) {
  if (pct >= 90) return { label: "Excellent", emoji: "🌟", color: "#10b981" };
  if (pct >= 70) return { label: "Good",      emoji: "👍", color: "#6366f1" };
  if (pct >= 50) return { label: "Average",   emoji: "🙂", color: "#f59e0b" };
  return          { label: "Keep Practicing", emoji: "💪", color: "#ef4444" };
}

function ScoreRing({ pct, score, total }: { pct: number; score: number; total: number }) {
  const grade = getGrade(pct);
  return (
    <View style={SR.wrap}>
      <LinearGradient colors={["#1e293b", "#0f172a"]} style={SR.ring}>
        <Text style={[SR.score, { color: grade.color }]}>{score}</Text>
        <Text style={SR.outOf}>/ {total}</Text>
        <Text style={[SR.grade, { color: grade.color }]}>{grade.label}</Text>
      </LinearGradient>
      <Text style={SR.emoji}>{grade.emoji}</Text>
      <Text style={[SR.pct, { color: grade.color }]}>{pct}%</Text>
    </View>
  );
}

const SR = StyleSheet.create({
  wrap:  { alignItems: "center", marginVertical: 8 },
  ring:  { width: 140, height: 140, borderRadius: 70, justifyContent: "center", alignItems: "center", borderWidth: 3, borderColor: "#334155" },
  score: { fontSize: 40, fontWeight: "900" },
  outOf: { color: "rgba(255,255,255,0.3)", fontSize: 13, fontWeight: "600", marginTop: -2 },
  grade: { fontSize: 12, fontWeight: "800", marginTop: 4 },
  emoji: { fontSize: 28, marginTop: 12 },
  pct:   { fontSize: 18, fontWeight: "800", marginTop: 4 },
});

export default function ContestResultScreen() {
  const { contestId, score: scoreParam, total: totalParam } =
    useLocalSearchParams<{ contestId: string; score?: string; total?: string }>();
  const router = useRouter();
  const userId = auth.currentUser?.uid;

  const [contest, setContest]       = useState<any>(null);
  const [score, setScore]           = useState(parseInt(scoreParam ?? "0", 10));
  const [total, setTotal]           = useState(parseInt(totalParam ?? "0", 10));
  const [pct, setPct]               = useState(0);
  const [rank, setRank]             = useState<number | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderRow[]>([]);
  const [loading, setLoading]       = useState(true);

  useEffect(() => {
    if (!contestId || !userId) return;
    (async () => {
      const [contestSnap, participantSnap, mySnap] = await Promise.all([
        getDoc(doc(db, "contests", contestId as string)),
        // All participants live in the subcollection contests/{id}/participant
        getDocs(collection(db, "contests", contestId as string, "participant")),
        getDoc(doc(db, "contests", contestId as string, "participant", userId)),
      ]);

      if (contestSnap.exists()) setContest({ id: contestSnap.id, ...contestSnap.data() });

      // Use participant doc values if route params weren't passed
      if (mySnap.exists()) {
        const d = mySnap.data();
        const s = d.score ?? score;
        const t = total || 1;
        const p = d.pct ?? Math.round((s / t) * 100);
        setScore(s);
        setPct(p);
      } else {
        setPct(total > 0 ? Math.round((score / total) * 100) : 0);
      }

      // Build leaderboard
      const sorted = participantSnap.docs
        .map((d) => ({ userId: d.data().userId, score: d.data().score ?? 0, pct: d.data().pct ?? 0 }))
        .sort((a, b) => b.pct - a.pct)
        .slice(0, 10);

      const userRankIdx = sorted.findIndex((r) => r.userId === userId);
      setRank(userRankIdx >= 0 ? userRankIdx + 1 : null);

      // Fetch names
      const rows: LeaderRow[] = await Promise.all(
        sorted.map(async (r) => {
          try {
            const snap = await getDoc(doc(db, "students", r.userId));
            const name = snap.exists() ? (snap.data().name ?? "Student") : "Student";
            return { ...r, name };
          } catch {
            return { ...r, name: "Student" };
          }
        })
      );
      setLeaderboard(rows);
      setLoading(false);
    })();
  }, [contestId, userId]);

  if (loading) {
    return (
      <SafeAreaView style={S.center}>
        <ActivityIndicator size="large" color="#6366f1" />
        <Text style={S.loadingText}>Loading results...</Text>
      </SafeAreaView>
    );
  }

  const grade = getGrade(pct);

  return (
    <SafeAreaView style={S.container}>
      <LinearGradient colors={["#0f0c29", "#302b63", "#0f172a"]} style={S.header}>
        <Text style={S.headerTitle}>🎉 Quiz Complete!</Text>
        <Text style={S.headerSub}>{contest?.title ?? "Contest Result"}</Text>
      </LinearGradient>

      <ScrollView contentContainerStyle={S.scroll} showsVerticalScrollIndicator={false}>
        {/* Score ring */}
        <View style={S.ringCard}>
          <ScoreRing pct={pct} score={score} total={total} />
          <Text style={[S.gradeMsg, { color: grade.color }]}>
            {grade.emoji} {grade.label}!
          </Text>
          {rank !== null && (
            <View style={S.rankBadge}>
              <Ionicons name="trophy" size={16} color="#f59e0b" />
              <Text style={S.rankText}>Your Rank: #{rank}</Text>
            </View>
          )}
        </View>

        {/* Prize pool */}
        {contest?.prizePool && (
          <LinearGradient
            colors={["#92400e", "#d97706", "#fbbf24"]}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
            style={S.prizeCard}
          >
            <Ionicons name="trophy" size={24} color="#fff" />
            <View style={{ flex: 1 }}>
              <Text style={S.prizeLabel}>Prize Pool</Text>
              <Text style={S.prizeValue}>₹{contest.prizePool}</Text>
            </View>
            <Text style={S.prizeNote}>Winners announced by admin</Text>
          </LinearGradient>
        )}

        {/* Leaderboard */}
        {leaderboard.length > 0 && (
          <View style={S.leaderCard}>
            <Text style={S.leaderTitle}>🏆 Top Participants</Text>
            {leaderboard.map((row, i) => {
              const isMe = row.userId === userId;
              return (
                <View key={row.userId} style={[S.leaderRow, isMe && S.leaderRowMe]}>
                  <Text style={[S.leaderRank, i === 0 && S.gold, i === 1 && S.silver, i === 2 && S.bronze]}>
                    {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `#${i + 1}`}
                  </Text>
                  <Text style={[S.leaderName, isMe && S.leaderNameMe]} numberOfLines={1}>
                    {isMe ? "You" : row.name}
                  </Text>
                  <Text style={S.leaderScore}>{row.score} pts ({row.pct}%)</Text>
                </View>
              );
            })}
          </View>
        )}

        {/* Actions */}
        <View style={S.actions}>
          <TouchableOpacity
            style={S.primaryBtn}
            onPress={() => router.replace("/(drawer)/(tabs)/vidyastar")}
            activeOpacity={0.85}
          >
            <LinearGradient
              colors={["#6366f1", "#4f46e5"]}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
              style={S.btnGrad}
            >
              <Text style={S.primaryBtnText}>Back to Contests</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={S.secondaryBtn}
            onPress={() => router.replace("/(drawer)/(tabs)/home")}
            activeOpacity={0.85}
          >
            <Text style={S.secondaryBtnText}>Go Home</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const S = StyleSheet.create({
  container:   { flex: 1, backgroundColor: "#0f172a" },
  center:      { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#0f172a", gap: 12 },
  loadingText: { color: "#94a3b8", fontSize: 15, fontWeight: "600" },
  header:      { paddingHorizontal: 20, paddingVertical: 24, alignItems: "center", gap: 6 },
  headerTitle: { color: "#f1f5f9", fontSize: 26, fontWeight: "900" },
  headerSub:   { color: "#a5b4fc", fontSize: 14, fontWeight: "600", textAlign: "center" },
  scroll:      { padding: 16 },

  ringCard:    { backgroundColor: "#1e293b", borderRadius: 24, padding: 24, alignItems: "center", marginBottom: 16, gap: 10 },
  gradeMsg:    { fontSize: 20, fontWeight: "900" },
  rankBadge:   { flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: "rgba(251,191,36,0.1)", borderRadius: 12, paddingHorizontal: 14, paddingVertical: 6 },
  rankText:    { color: "#fbbf24", fontSize: 15, fontWeight: "800" },

  prizeCard:   { borderRadius: 18, padding: 18, flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 16 },
  prizeLabel:  { color: "rgba(255,255,255,0.8)", fontSize: 12, fontWeight: "600" },
  prizeValue:  { color: "#fff", fontSize: 22, fontWeight: "900" },
  prizeNote:   { color: "rgba(255,255,255,0.7)", fontSize: 10, textAlign: "right", maxWidth: 80 },

  leaderCard:  { backgroundColor: "#1e293b", borderRadius: 20, padding: 16, marginBottom: 16, gap: 4 },
  leaderTitle: { color: "#f1f5f9", fontSize: 16, fontWeight: "800", marginBottom: 8 },
  leaderRow:   { flexDirection: "row", alignItems: "center", paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: "#334155", gap: 12 },
  leaderRowMe: { backgroundColor: "rgba(99,102,241,0.1)", borderRadius: 10, paddingHorizontal: 8 },
  leaderRank:  { width: 32, color: "#94a3b8", fontWeight: "800", textAlign: "center" },
  gold:        { color: "#fbbf24" },
  silver:      { color: "#94a3b8" },
  bronze:      { color: "#d97706" },
  leaderName:  { flex: 1, color: "#cbd5e1", fontSize: 14, fontWeight: "600" },
  leaderNameMe:{ color: "#818cf8", fontWeight: "800" },
  leaderScore: { color: "#94a3b8", fontSize: 13, fontWeight: "700" },

  actions:     { gap: 12 },
  primaryBtn:  { borderRadius: 16, overflow: "hidden" },
  btnGrad:     { paddingVertical: 16, alignItems: "center" },
  primaryBtnText: { color: "#fff", fontSize: 16, fontWeight: "900" },
  secondaryBtn:{ borderRadius: 16, borderWidth: 1, borderColor: "#334155", paddingVertical: 14, alignItems: "center" },
  secondaryBtnText: { color: "#94a3b8", fontSize: 15, fontWeight: "700" },
});
