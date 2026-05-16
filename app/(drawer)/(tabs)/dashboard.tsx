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
import Animated, { FadeInDown } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

// Hooks & Libs
import { useTheme } from "@/context/ThemeContext";
import useDashboard from "@/hooks/useDashboard";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";

// Components
import ContestPro from "@/components/ContestPro";
import EarningsPro from "@/components/EarningsPro";
import LearningPro from "@/components/LearningPro";
import StatsPro from "@/components/StatsPro";
import Header from "@/components/header"; // ✅ ADD HEADER

export default function Dashboard() {
  const { colors } = useTheme();
  const [student, setStudent] = useState<any>(null);

  const { data, loading, error } = useDashboard();

  // 🔥 Student fetch (safe)
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) return;

      try {
        const ref = doc(db, "students", user.uid);
        const snap = await getDoc(ref);

        if (snap && snap.exists()) {
          setStudent(snap.data());
        } else {
          setStudent(null);
        }
      } catch (err) {
        console.log("Student fetch error:", err);
      }
    });

    return () => unsub();
  }, []);

  // 🔄 LOADING STATE
  if (loading) {
    return (
      <SafeAreaView style={[styles.center, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.textSecondary }}>Loading...</Text>
      </SafeAreaView>
    );
  }

  // ❌ ERROR STATE
  if (error) {
    return (
      <SafeAreaView style={[styles.center, { backgroundColor: colors.background }]}>
        <Text style={{ color: "red" }}>Error: {error}</Text>
      </SafeAreaView>
    );
  }

  // ⚠️ NO DATA
  if (!data) {
    return (
      <SafeAreaView style={[styles.center, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.textSecondary }}>No dashboard data</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      
      {/* ✅ HEADER */}
      <Header title="Vidya" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 30 }}
      >
        {/* 1. WELCOME */}
        <Animated.View entering={FadeInDown.delay(100)} style={styles.profileCard}>
          <LinearGradient
            colors={["#1e293b", "#0f172a"]}
            style={styles.gradientBorder}
          >
            <Text style={[styles.greeting, { color: colors.accent }]}>
              Hey, {student?.name || "Creator"} 👋
            </Text>

            <Text style={[styles.subgreeting, { color: colors.textSecondary }]}>
              Here's your performance for today
            </Text>
          </LinearGradient>
        </Animated.View>

        {/* 2. STATS */}
        <Animated.View entering={FadeInDown.delay(200)}>
          <StatsPro data={data || {}} />
        </Animated.View>

        {/* 3. LEARNING */}
        <Animated.View entering={FadeInDown.delay(300)}>
          <LearningPro data={data || {}} />
        </Animated.View>

        {/* 4. QUICK ACTIONS */}
        <Animated.View entering={FadeInDown.delay(400)}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Quick Actions
          </Text>

          <View style={styles.actionGrid}>
            <ActionBtn emoji="📤" label="Create Post" colors={colors} />
            <ActionBtn emoji="⚡" label="Skill Battle" colors={colors} />
            <ActionBtn emoji="🎓" label="Learn" colors={colors} />
            <ActionBtn emoji="🏅" label="Leaderboard" colors={colors} />
          </View>
        </Animated.View>

        {/* 5. CONTEST + EARNINGS */}
        <Animated.View entering={FadeInDown.delay(500)}>
          <ContestPro />
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(600)}>
          <EarningsPro data={data || {}} />
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

// 🔹 Action Button
const ActionBtn = ({ emoji, label, colors }: any) => (
  <TouchableOpacity
    style={[
      styles.actionBtn,
      { backgroundColor: colors.card, borderColor: colors.border },
    ]}
  >
    <Text style={styles.actionEmoji}>{emoji}</Text>
    <Text style={[styles.actionText, { color: colors.text }]}>{label}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  profileCard: {
    margin: 16,
    borderRadius: 16,
    overflow: "hidden",
  },
  gradientBorder: {
    padding: 16,
    borderRadius: 16,
  },
  greeting: {
    fontSize: 18,
    fontWeight: "600",
  },
  subgreeting: {
    fontSize: 13,
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginHorizontal: 16,
    marginBottom: 10,
  },
  actionGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  actionBtn: {
    width: "48%",
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 12,
    alignItems: "center",
  },
  actionEmoji: { fontSize: 22 },
  actionText: {
    marginTop: 6,
    fontSize: 13,
    fontWeight: "500",
  },
});