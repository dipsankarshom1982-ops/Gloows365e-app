import { useTheme } from "@/context/ThemeContext";
import { useRouter } from "expo-router";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Header from "@/components/header";
import SkillShortPreview from "@/components/SkillShortPreview";
import UltimateSkillBanner from "@/components/UltimateSkillBanner";

export default function SkillBattleScreen() {
  const router = useRouter();
  const { colors } = useTheme();

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]} edges={["top"]}>
      <View style={styles.container}>
        
        {/* 🔥 HEADER ONLY (VidyaAI already inside) */}
        <Header />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          
          {/* 🎯 BANNER */}
          <UltimateSkillBanner />

          {/* ⚡ QUICK ACTIONS */}
          <View style={styles.actionsContainer}>
            
            <TouchableOpacity
              style={[styles.actionBtn, styles.boardBtn]}
              onPress={() => router.push("/skillboard")}
            >
              <Text style={styles.actionText}>🏆 Skill Board</Text>
              <Text style={styles.subText}>View Rankings</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionBtn, styles.participateBtn]}
              onPress={() => router.push("/create-post")}
            >
              <Text style={styles.actionText}>🚀 Participate</Text>
              <Text style={styles.subText}>Upload Skill</Text>
            </TouchableOpacity>

          </View>

          {/* 🎥 REELS */}
          <SkillShortPreview />

        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#020617",
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  actionsContainer: {
    flexDirection: "row",
    marginHorizontal: 16,
    marginTop: 10,
  },
  actionBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    marginHorizontal: 5,
  },
  boardBtn: {
    backgroundColor: "#0EA5E9",
  },
  participateBtn: {
    backgroundColor: "#6366F1",
  },
  actionText: {
    color: "#fff",
    fontWeight: "bold",
  },
  subText: {
    color: "#E2E8F0",
    fontSize: 10,
  },
});