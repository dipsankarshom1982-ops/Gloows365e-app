import { useEffect, useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { auth } from "@/lib/firebase";
import { getRemainingLessons, isSubscribed } from "@/services/aiGuruFirestore";
import AiGuruAvatar from "@/components/aiGuru/AiGuruAvatar";
import { FREE_DAILY_LESSONS } from "@/lib/aiGuru/constants";

type MenuCard = {
  title: string;
  subtitle: string;
  emoji: string;
  gradient: [string, string];
  route: string;
  premium: boolean;
};

const MENU_CARDS: MenuCard[] = [
  {
    title: "Generate Lesson",
    subtitle: "AI creates a full lesson for you",
    emoji: "✨",
    gradient: ["#312e81", "#4f46e5"],
    route: "/ai-guru/setup",
    premium: false,
  },
  {
    title: "My AI Lessons",
    subtitle: "Resume or review past lessons",
    emoji: "📚",
    gradient: ["#064e3b", "#059669"],
    route: "/ai-guru/my-lessons",
    premium: false,
  },
  {
    title: "Revision Reels",
    subtitle: "Short video revision sessions",
    emoji: "🎬",
    gradient: ["#1e3a5f", "#0284c7"],
    route: "/ai-guru/my-lessons",
    premium: true,
  },
  {
    title: "Practice Tests",
    subtitle: "Exam-style practice with analysis",
    emoji: "📝",
    gradient: ["#450a0a", "#dc2626"],
    route: "/ai-guru/my-lessons",
    premium: true,
  },
  {
    title: "Ask AI Guru",
    subtitle: "Ask any doubt, get instant answer",
    emoji: "🤖",
    gradient: ["#1a1a2e", "#6366f1"],
    route: "/ai-guru/setup",
    premium: false,
  },
];

export default function AiGuruHomeScreen() {
  const [remaining, setRemaining] = useState<number>(FREE_DAILY_LESSONS);
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;
    Promise.all([getRemainingLessons(uid), isSubscribed(uid)]).then(([rem, sub]) => {
      setRemaining(rem);
      setSubscribed(sub);
      setLoading(false);
    });
  }, []);

  const handleCardPress = (card: MenuCard) => {
    if (card.premium && !subscribed) {
      Alert.alert(
        "Premium Feature",
        "Upgrade to AI Guru Premium to unlock this feature.",
        [{ text: "Maybe Later", style: "cancel" }, { text: "Upgrade", onPress: () => {} }]
      );
      return;
    }
    router.push(card.route as any);
  };

  return (
    <LinearGradient colors={["#0a0a1a", "#0f172a"]} style={S.bg}>
      <ScrollView contentContainerStyle={S.scroll} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={S.header}>
          <TouchableOpacity onPress={() => router.back()} style={S.backBtn}>
            <Ionicons name="chevron-back" size={22} color="#94a3b8" />
          </TouchableOpacity>
          {subscribed && (
            <View style={S.premiumBadge}>
              <Ionicons name="star" size={12} color="#fbbf24" />
              <Text style={S.premiumText}>PREMIUM</Text>
            </View>
          )}
        </View>

        {/* Avatar + welcome */}
        <View style={S.heroSection}>
          <AiGuruAvatar size={80} />
          <Text style={S.heroTitle}>AI Guru</Text>
          <Text style={S.heroSubtitle}>Your personal AI classroom{"\n"}powered by Gemini</Text>
        </View>

        {/* Usage counter (free users) */}
        {!loading && !subscribed && (
          <View style={S.usageCard}>
            <View style={S.usageLeft}>
              <Text style={S.usageNum}>{remaining}</Text>
              <Text style={S.usageLabel}>free lessons left today</Text>
            </View>
            <View style={S.usageDots}>
              {Array.from({ length: FREE_DAILY_LESSONS }).map((_, i) => (
                <View
                  key={i}
                  style={[S.usageDot, i < remaining && S.usageDotActive]}
                />
              ))}
            </View>
          </View>
        )}

        {subscribed && !loading && (
          <View style={[S.usageCard, { borderColor: "#fbbf24" }]}>
            <Ionicons name="star" size={18} color="#fbbf24" />
            <Text style={S.unlimitedText}>Unlimited Premium Access Active</Text>
          </View>
        )}

        {/* Menu grid */}
        <View style={S.grid}>
          {MENU_CARDS.map((card) => (
            <TouchableOpacity
              key={card.title}
              style={S.cardWrap}
              activeOpacity={0.85}
              onPress={() => handleCardPress(card)}
            >
              <LinearGradient colors={card.gradient} style={S.card}>
                {card.premium && !subscribed && (
                  <View style={S.lockBadge}>
                    <Ionicons name="lock-closed" size={10} color="#fff" />
                    <Text style={S.lockText}>PRO</Text>
                  </View>
                )}
                <Text style={S.cardEmoji}>{card.emoji}</Text>
                <Text style={S.cardTitle}>{card.title}</Text>
                <Text style={S.cardSubtitle}>{card.subtitle}</Text>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>
    </LinearGradient>
  );
}

const S = StyleSheet.create({
  bg:            { flex: 1 },
  scroll:        { paddingHorizontal: 16, paddingBottom: 24 },
  header:        { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingTop: 56, paddingBottom: 8 },
  backBtn:       { width: 40, height: 40, borderRadius: 12, backgroundColor: "rgba(255,255,255,0.08)", justifyContent: "center", alignItems: "center" },
  premiumBadge:  { flexDirection: "row", alignItems: "center", gap: 4, backgroundColor: "rgba(251,191,36,0.15)", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10, borderWidth: 1, borderColor: "#fbbf24" },
  premiumText:   { color: "#fbbf24", fontSize: 10, fontWeight: "900", letterSpacing: 0.5 },
  heroSection:   { alignItems: "center", paddingVertical: 24, gap: 10 },
  heroTitle:     { color: "#f1f5f9", fontSize: 30, fontWeight: "900", letterSpacing: -0.5 },
  heroSubtitle:  { color: "#64748b", fontSize: 14, textAlign: "center", lineHeight: 22 },
  usageCard:     { flexDirection: "row", alignItems: "center", justifyContent: "space-between", backgroundColor: "#1e293b", borderRadius: 16, padding: 16, marginBottom: 20, borderWidth: 1, borderColor: "#334155", gap: 12 },
  usageLeft:     { flexDirection: "row", alignItems: "baseline", gap: 6 },
  usageNum:      { color: "#6366f1", fontSize: 28, fontWeight: "900" },
  usageLabel:    { color: "#64748b", fontSize: 13 },
  usageDots:     { flexDirection: "row", gap: 6 },
  usageDot:      { width: 16, height: 16, borderRadius: 8, backgroundColor: "#334155" },
  usageDotActive:{ backgroundColor: "#6366f1" },
  unlimitedText: { color: "#fbbf24", fontSize: 14, fontWeight: "700", flex: 1 },
  grid:          { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  cardWrap:      { width: "47.5%" },
  card:          { borderRadius: 20, padding: 18, gap: 8, minHeight: 140, justifyContent: "flex-end" },
  lockBadge:     { position: "absolute", top: 12, right: 12, flexDirection: "row", alignItems: "center", gap: 3, backgroundColor: "rgba(0,0,0,0.4)", borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2 },
  lockText:      { color: "#fff", fontSize: 9, fontWeight: "900" },
  cardEmoji:     { fontSize: 32 },
  cardTitle:     { color: "#f1f5f9", fontSize: 16, fontWeight: "900" },
  cardSubtitle:  { color: "rgba(255,255,255,0.55)", fontSize: 12, lineHeight: 16 },
});
