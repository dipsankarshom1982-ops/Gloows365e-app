import { useTheme } from "@/context/ThemeContext";
import { db } from "@/lib/firebase";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { collection, getDocs, limit, query } from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface ContestItem {
  id: string;
  title: string;
  prizePool?: string;
  startTime?: any;
  endTime?: any;
  description?: string;
  order?: number;
  isFeatured?: boolean;
}

function getContestStatus(item: ContestItem): "live" | "upcoming" | "ended" {
  const now = new Date();
  const start = item.startTime?.toDate?.() ?? (item.startTime?.seconds ? new Date(item.startTime.seconds * 1000) : null);
  const end   = item.endTime?.toDate?.()   ?? (item.endTime?.seconds   ? new Date(item.endTime.seconds * 1000)   : null);
  if (end && end < now) return "ended";
  if (start && start <= now && (!end || end > now)) return "live";
  return "upcoming";
}

const STATUS_CFG = {
  live:     { label: "🔴 LIVE",    bg: "#ef4444" },
  upcoming: { label: "⏰ Upcoming", bg: "#f59e0b" },
  ended:    { label: "✅ Ended",   bg: "#6b7280" },
};

function Pulse({ w, h, r = 10 }: { w: number; h: number; r?: number }) {
  const anim = useRef(new Animated.Value(0.4)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(anim, { toValue: 0.85, duration: 750, useNativeDriver: true }),
        Animated.timing(anim, { toValue: 0.4,  duration: 750, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, []);
  return <Animated.View style={{ width: w, height: h, borderRadius: r, backgroundColor: "#334155", opacity: anim, marginRight: 12 }} />;
}

function ContestCard({ item }: { item: ContestItem }) {
  const status = getContestStatus(item);
  const cfg    = STATUS_CFG[status];

  return (
    <TouchableOpacity
      style={S.card}
      onPress={() => router.push("/(drawer)/(tabs)/vidyastar")}
      activeOpacity={0.85}
    >
      <LinearGradient
        colors={["#1a0a2e", "#4a1259", "#7c3aed"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={S.cardGrad}
      >
        <View style={[S.statusBadge, { backgroundColor: cfg.bg }]}>
          <Text style={S.statusText}>{cfg.label}</Text>
        </View>

        <Text style={S.starIcon}>🌟</Text>
        <Text style={S.cardTitle} numberOfLines={2}>{item.title}</Text>

        {item.prizePool ? (
          <View style={S.prizeRow}>
            <Text style={S.prizeIcon}>🏆</Text>
            <Text style={S.prizeText}>{item.prizePool}</Text>
          </View>
        ) : null}

        {item.description ? (
          <Text style={S.desc} numberOfLines={2}>{item.description}</Text>
        ) : null}

        <View style={S.divider} />

        <TouchableOpacity
          style={[S.participateBtn, status === "live" && S.participateBtnLive]}
          onPress={() => router.push("/(drawer)/(tabs)/vidyastar")}
          activeOpacity={0.8}
        >
          <Text style={S.participateBtnText}>
            {status === "ended" ? "View Results →" : "Participate Now →"}
          </Text>
        </TouchableOpacity>
      </LinearGradient>
    </TouchableOpacity>
  );
}

export default function VidyaStarPreviewSection() {
  const { colors } = useTheme();
  const [contests, setContests] = useState<ContestItem[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const snap = await getDocs(query(collection(db, "contests"), limit(6)));
        setContests(
          snap.docs
            .map((d) => ({ id: d.id, ...(d.data() as any) }))
            .sort((a, b) => {
              if ((b.isFeatured ? 1 : 0) !== (a.isFeatured ? 1 : 0))
                return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
              return (a.order ?? 99) - (b.order ?? 99);
            })
        );
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <View style={S.section}>
      <View style={S.header}>
        <View style={{ flex: 1 }}>
          <Text style={[S.sectionTitle, { color: colors.text }]}>🌟 VidyaStar Contest</Text>
          <Text style={[S.sectionSub, { color: colors.textSecondary }]}>
            Showcase your talent and win prizes
          </Text>
        </View>
        <TouchableOpacity onPress={() => router.push("/(drawer)/(tabs)/vidyastar")}>
          <Text style={S.viewAll}>View All →</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={{ flexDirection: "row", paddingLeft: 16 }}>
          {[0, 1, 2].map((i) => <Pulse key={i} w={170} h={240} r={16} />)}
        </View>
      ) : error ? (
        <View style={S.empty}>
          <Text style={S.emptyIcon}>⚠️</Text>
          <Text style={[S.emptyText, { color: colors.textSecondary }]}>Could not load contests.</Text>
        </View>
      ) : contests.length === 0 ? (
        <View style={S.empty}>
          <Text style={S.emptyIcon}>🌟</Text>
          <Text style={[S.emptyText, { color: colors.textSecondary }]}>Exciting contests coming soon!</Text>
        </View>
      ) : (
        <FlatList
          horizontal
          data={contests}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <ContestCard item={item} />}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingLeft: 16, paddingRight: 4 }}
        />
      )}
    </View>
  );
}

const S = StyleSheet.create({
  section:      { marginVertical: 16 },
  header:       { flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", paddingHorizontal: 16, marginBottom: 12 },
  sectionTitle: { fontSize: 18, fontWeight: "800", marginBottom: 2 },
  sectionSub:   { fontSize: 12, fontWeight: "500" },
  viewAll:      { fontSize: 13, fontWeight: "700", color: "#7c3aed", marginTop: 4 },

  card:     { marginRight: 12, borderRadius: 16, overflow: "hidden", elevation: 6, shadowColor: "#7c3aed", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 },
  cardGrad: { width: 170, padding: 14, minHeight: 240 },

  statusBadge: { alignSelf: "flex-end", paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, marginBottom: 8 },
  statusText:  { color: "#fff", fontSize: 10, fontWeight: "800" },

  starIcon:  { fontSize: 32, textAlign: "center", marginBottom: 8 },
  cardTitle: { color: "#fff", fontSize: 13, fontWeight: "800", lineHeight: 19, marginBottom: 8 },

  prizeRow:  { flexDirection: "row", alignItems: "center", gap: 5, marginBottom: 6 },
  prizeIcon: { fontSize: 14 },
  prizeText: { color: "#fde68a", fontSize: 13, fontWeight: "800" },

  desc: { color: "rgba(255,255,255,0.7)", fontSize: 10, lineHeight: 14, marginBottom: 6 },

  divider: { height: 1, backgroundColor: "rgba(255,255,255,0.15)", marginVertical: 8 },

  participateBtn:     { backgroundColor: "rgba(255,255,255,0.18)", borderRadius: 8, paddingVertical: 9, alignItems: "center", borderWidth: 1, borderColor: "rgba(255,255,255,0.35)", marginTop: 4 },
  participateBtnLive: { backgroundColor: "#7c3aed", borderColor: "#7c3aed" },
  participateBtnText: { color: "#fff", fontSize: 12, fontWeight: "800" },

  empty:     { height: 150, alignItems: "center", justifyContent: "center", paddingHorizontal: 16 },
  emptyIcon: { fontSize: 36, marginBottom: 8 },
  emptyText: { fontSize: 13, fontWeight: "500", textAlign: "center" },
});
