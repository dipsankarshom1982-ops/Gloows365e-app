import Header from "@/components/header";
import { useTheme } from "@/context/ThemeContext";
import { auth, db } from "@/lib/firebase";
import { LinearGradient } from "expo-linear-gradient";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function DashboardScreen() {
  const { colors } = useTheme();
  const [student, setStudent] = useState<any>(null);

  useEffect(() => {
    const fetchStudent = async () => {
      if (!auth.currentUser) return;
      const snap = await getDoc(doc(db, "students", auth.currentUser.uid));
      if (snap.exists()) setStudent(snap.data());
    };
    fetchStudent();
  }, []);

  const stats: Array<{
    label: string;
    value: string;
    color: [string, string];
  }> = [
    { label: "🎯 Posts", value: "12", color: ["#7b61ff", "#a855f7"] },
    { label: "❤️ Likes", value: "284", color: ["#ec4899", "#f43f5e"] },
    { label: "👁️ Views", value: "1.2K", color: ["#38bdf8", "#0ea5e9"] },
    { label: "🏆 Battles", value: "8", color: ["#fbbf24", "#f59e0b"] },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Header />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* PROFILE SUMMARY */}
        <LinearGradient
          colors={["#1e293b", "#0f172a"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.profileCard}
        >
          <Text style={[styles.greeting, { color: colors.accent }]}>Hey, {student?.name || "Creator"}! 👋</Text>
          <Text style={[styles.subgreeting, { color: colors.textSecondary }]}>Here's your performance</Text>
        </LinearGradient>

        {/* STATS GRID */}
        <View style={styles.statsGrid}>
          {stats.map((stat, idx) => (
            <LinearGradient
              key={idx}
              colors={stat.color}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.statCard}
            >
              <Text style={styles.statLabel}>{stat.label}</Text>
              <Text style={styles.statValue}>{stat.value}</Text>
            </LinearGradient>
          ))}
        </View>

        {/* QUICK ACTIONS */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Quick Actions</Text>
        <View style={styles.actionRow}>
          <TouchableOpacity style={[styles.actionBtn, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={styles.actionEmoji}>📤</Text>
            <Text style={[styles.actionText, { color: colors.text }]}>Create Post</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionBtn, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={styles.actionEmoji}>⚡</Text>
            <Text style={[styles.actionText, { color: colors.text }]}>Skill Battle</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.actionRow}>
          <TouchableOpacity style={[styles.actionBtn, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={styles.actionEmoji}>🎓</Text>
            <Text style={[styles.actionText, { color: colors.text }]}>Learn</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionBtn, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={styles.actionEmoji}>🏅</Text>
            <Text style={[styles.actionText, { color: colors.text }]}>Leaderboard</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  profileCard: {
    margin: 15,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(56, 189, 248, 0.2)",
  },
  greeting: {
    color: "#38bdf8",
    fontSize: 22,
    fontWeight: "800",
    marginBottom: 4,
  },
  subgreeting: {
    color: "#94a3b8",
    fontSize: 14,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 12,
    gap: 10,
  },
  statCard: {
    width: "48%",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  statLabel: {
    color: "#fff",
    fontSize: 12,
    marginBottom: 8,
    fontWeight: "600",
  },
  statValue: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "800",
  },
  sectionTitle: {
    color: "#e2e8f0",
    fontSize: 16,
    fontWeight: "700",
    marginTop: 20,
    marginLeft: 15,
  },
  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    marginTop: 12,
    gap: 10,
  },
  actionBtn: {
    flex: 1,
    backgroundColor: "#1e293b",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(56, 189, 248, 0.15)",
  },
  actionEmoji: {
    fontSize: 24,
    marginBottom: 4,
  },
  actionText: {
    color: "#e2e8f0",
    fontSize: 12,
    fontWeight: "600",
  },
});