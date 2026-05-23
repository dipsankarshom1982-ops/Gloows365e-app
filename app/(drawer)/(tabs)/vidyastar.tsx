import { useTheme } from "@/context/ThemeContext";
import { useContests } from "@/hooks/useContests";
import { useUserContests } from "@/hooks/useUserContests";
import { joinContest } from "@/services/joinContest";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { getAuth } from "firebase/auth";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Header from "@/components/header";
import { useAppTranslation } from "@/context/LanguageContext";
import UserService from "@/lib/userService";

const { width } = Dimensions.get("window");

const getDate = (t: any) => {
  if (!t) return null;
  if (typeof t.toDate === "function") return t.toDate();
  if (t.seconds) return new Date(t.seconds * 1000);
  return null;
};

// 🔥 Ultra Premium Chip
const Chip = ({ label, active, onPress, icon }: any) => (
  <TouchableOpacity
    onPress={onPress}
    activeOpacity={0.8}
    style={[
      styles.chipBase,
      active ? styles.chipActive : styles.chipInactive,
    ]}
  >
    <Text style={[styles.chipText, { color: active ? "#fff" : "#6366f1" }]}>
      {label}
    </Text>
  </TouchableOpacity>
);

// 🔥 Modern Action Button
const ActionButton = ({ title, onPress, colors, icon }: any) => (
  <TouchableOpacity onPress={onPress} activeOpacity={0.9}>
    <LinearGradient
      colors={colors}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={styles.actionBtn}
    >
      <Text style={styles.actionBtnText}>{title}</Text>
      <Ionicons name={icon} size={18} color="#fff" style={{ marginLeft: 8 }} />
    </LinearGradient>
  </TouchableOpacity>
);

const ContestCard = ({ item, joined, completed }: any) => {
  const router = useRouter();
  const { t } = useAppTranslation();
  const userId = getAuth().currentUser?.uid;
  const isJoined = joined[item.id];
  const isCompleted = completed[item.id];
  const now = new Date();
  const start = getDate(item.startTime);
  const end = getDate(item.endTime);
  const isLive = start && end && start <= now && now <= end;

  const progress =
    isLive && start && end
      ? ((now.getTime() - start.getTime()) / (end.getTime() - start.getTime())) * 100
      : 0;

  const handleJoin = async () => {
    if (!userId) return Alert.alert(t("loginRequired"));
    await joinContest(userId, item);
  };

  return (
    <View style={styles.cardContainer}>
      <LinearGradient colors={["#ffffff", "#f8faff"]} style={styles.cardInner}>
        {/* TOP BADGE ROW */}
        <View style={styles.cardHeader}>
          <View style={styles.titleContainer}>
            <Text style={styles.contestTitle} numberOfLines={1}>
              {item.title}
            </Text>
            {isLive && (
              <View style={styles.liveBadge}>
                <View style={styles.pulseDot} />
                <Text style={styles.liveText}>{t("live").toUpperCase()}</Text>
              </View>
            )}
          </View>
          {isCompleted && (
            <View style={styles.doneBadge}>
              <Ionicons name="checkmark-circle" size={14} color="#10b981" />
              <Text style={styles.doneText}>{t("completed")}</Text>
            </View>
          )}
        </View>

        {/* PRIZE INFO */}
        <View style={styles.prizeRow}>
          <MaterialCommunityIcons name="trophy-outline" size={20} color="#f59e0b" />
          <Text style={styles.prizeLabel}>{t("prizePool")}</Text>
          <Text style={styles.prizeValue}>{item.prizePool}</Text>
        </View>

        {/* SPOTS */}
        {(item.joinedCount != null || item.totalSpots != null) && (
          <View style={styles.spotsRow}>
            <Ionicons name="people-outline" size={15} color="#6b7280" />
            <Text style={styles.spotsText}>
              {item.joinedCount ?? 0} / {item.totalSpots ?? "∞"} joined
            </Text>
          </View>
        )}

        {/* PROGRESS BAR */}
        {isLive && (
          <View style={styles.progressContainer}>
            <View style={styles.progressBarBg}>
              <View style={[styles.progressBarFill, { width: `${progress}%` }]} />
            </View>
            <Text style={styles.progressTimeText}>{t("endingSoon")}</Text>
          </View>
        )}

        {/* CTA SECTION */}
        <View style={styles.ctaWrapper}>
          {isCompleted && (
            <ActionButton
              title={t("viewResult")}
              colors={["#10b981", "#059669"]}
              icon="stats-chart"
              onPress={() =>
                router.push({
                  pathname: "../contest/result",
                  params: { contestId: item.id },
                })
              }
            />
          )}

          {!isCompleted && isLive && (
            <>
              {!isJoined ? (
                <ActionButton
                  title={t("joinNow")}
                  colors={["#6366f1", "#4f46e5"]}
                  icon="flash"
                  onPress={handleJoin}
                />
              ) : (
                <ActionButton
                  title={t("participate")}
                  colors={["#4f46e5", "#3730a3"]}
                  icon="play"
                  onPress={() =>
                    router.push({
                      pathname: "../contest/video",
                      params: { contestId: item.id },
                    })
                  }
                />
              )}
            </>
          )}

          {!isCompleted && !isLive && start > now && (
            <>
              {!isJoined ? (
                <ActionButton
                  title={t("reserveSpot")}
                  colors={["#6366f1", "#4f46e5"]}
                  icon="calendar"
                  onPress={handleJoin}
                />
              ) : (
                <View style={styles.timerBadge}>
                  <Ionicons name="time-outline" size={18} color="#f59e0b" />
                  <Text style={styles.timerText}>{t("startsSoon")}</Text>
                </View>
              )}
            </>
          )}
        </View>
      </LinearGradient>
    </View>
  );
};

export default function ShikshastarScreen() {
  const { colors } = useTheme();
  const { t } = useAppTranslation();
  const { contests = [], loading: contestsLoading } = useContests();
  const userId = getAuth().currentUser?.uid;
  const { joined = {}, completed = {} } = useUserContests(userId || "");

  const [chip, setChip] = useState("all");
  const [userClass, setUserClass] = useState<number | null>(null);

  useEffect(() => {
    UserService.getUserClass().then(setUserClass);
  }, []);

  const now = new Date();

  const classFiltered = contests.filter((c: any) => {
    if (!userClass) return true;
    return !c.class || c.class.includes(userClass) || c.class.includes("all");
  });

  const limited = classFiltered.slice(0, 10);
  const live = limited.filter((c: any) => {
    const s = getDate(c.startTime);
    const e = getDate(c.endTime);
    return s && e && s <= now && now <= e;
  });
  const upcoming = limited.filter((c: any) => {
    const s = getDate(c.startTime);
    return s && s > now;
  });
  const done = limited.filter((c: any) => completed[c.id]);

  const data =
    chip === "all" ? limited : chip === "live" ? live : chip === "upcoming" ? upcoming : done;

  if (contestsLoading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4f46e5" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f3f4f6" }}>
      <Header />
      <View style={{ paddingHorizontal: 16, paddingVertical: 10 }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {(["all", "live", "upcoming", "completed"] as const).map((c) => (
            <Chip
              key={c}
              label={t(c === "all" ? "all" : c === "live" ? "live" : c === "upcoming" ? "upcoming" : "completed")}
              active={chip === c}
              onPress={() => setChip(c)}
            />
          ))}
        </ScrollView>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {data.map((item: any) => (
          <ContestCard key={item.id} item={item} joined={joined} completed={completed} />
        ))}
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  chipBase: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginRight: 10,
    borderRadius: 30,
    borderWidth: 1,
  },
  chipActive: {
    backgroundColor: "#4f46e5",
    borderColor: "#4f46e5",
    elevation: 4,
  },
  chipInactive: {
    backgroundColor: "#fff",
    borderColor: "#e5e7eb",
  },
  chipText: { fontSize: 13, fontWeight: "700", letterSpacing: 0.5 },
  cardContainer: {
    marginBottom: 18,
    borderRadius: 24,
    backgroundColor: "#fff",
    // Shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 15,
    elevation: 6,
  },
  cardInner: {
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.6)",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  titleContainer: { flexDirection: "row", alignItems: "center", flex: 1 },
  contestTitle: { fontSize: 18, fontWeight: "800", color: "#1f2937", marginRight: 8 },
  liveBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fee2e2",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  pulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#ef4444",
    marginRight: 4,
  },
  liveText: { fontSize: 10, fontWeight: "800", color: "#ef4444" },
  doneBadge: { flexDirection: "row", alignItems: "center" },
  doneText: { fontSize: 12, color: "#10b981", fontWeight: "700", marginLeft: 4 },
  prizeRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#f3f4f6",
  },
  prizeLabel: { fontSize: 14, color: "#6b7280", marginLeft: 8 },
  prizeValue: { fontSize: 15, fontWeight: "700", color: "#1f2937", marginLeft: "auto" },
  spotsRow: { flexDirection: "row", alignItems: "center", marginTop: 8, gap: 6 },
  spotsText: { fontSize: 12, color: "#6b7280", fontWeight: "600" },
  progressContainer: { marginTop: 15 },
  progressBarBg: { height: 8, backgroundColor: "#e5e7eb", borderRadius: 4, overflow: "hidden" },
  progressBarFill: { height: "100%", backgroundColor: "#4f46e5" },
  progressTimeText: { fontSize: 11, color: "#9ca3af", marginTop: 4, textAlign: "right" },
  ctaWrapper: { marginTop: 16 },
  actionBtn: {
    paddingVertical: 14,
    borderRadius: 16,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  actionBtnText: { color: "#fff", fontWeight: "800", fontSize: 15, letterSpacing: 0.5 },
  timerBadge: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    backgroundColor: "#fffbeb",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#fef3c7",
  },
  timerText: { color: "#d97706", fontWeight: "700", marginLeft: 8 },
});
