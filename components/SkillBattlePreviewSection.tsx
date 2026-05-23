import { useTheme } from "@/context/ThemeContext";
import { db } from "@/lib/firebase";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { collection, getDocs } from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface Battle {
  id:               string;
  title:            string;
  description?:     string;
  sponsor?:         string;
  month?:           string;
  startDate?:       string;
  endDate?:         string;
  isActive?:        unknown;
  totalPool?:       string;
  participantCount?: number;
  vcoin_india?:     number;
  vcoin_state?:     number;
  vcoin_district?:  number;
}

const getTimeLeft = (endDate?: string): string => {
  if (!endDate) return "Ongoing";
  const diff = new Date(endDate).getTime() - Date.now();
  if (isNaN(diff)) return "Ongoing";
  if (diff <= 0) return "Ended";
  const d = Math.floor(diff / (1000 * 60 * 60 * 24));
  const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
  return d > 0 ? `${d}d ${h}h left` : `${h}h left`;
};

const fmt = (n: number) => (n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n));

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
  return (
    <Animated.View
      style={{ width: w, height: h, borderRadius: r, backgroundColor: "#334155", opacity: anim, marginRight: 12 }}
    />
  );
}

function BattleCard({ item }: { item: Battle }) {
  const timeLeft  = getTimeLeft(item.endDate);
  const ended     = timeLeft === "Ended";
  const isOngoing = timeLeft === "Ongoing";

  const statusLabel = ended ? "✅ Ended" : isOngoing ? "🔴 LIVE" : `⏰ ${timeLeft}`;
  const statusBg    = ended ? "#6b7280" : isOngoing ? "#ef4444" : "#f59e0b";
  const totalVCoins = (item.vcoin_india ?? 0) + (item.vcoin_state ?? 0) + (item.vcoin_district ?? 0);

  return (
    <TouchableOpacity
      style={S.cardWrap}
      onPress={() => router.push("/(drawer)/(tabs)/skillbattle")}
      activeOpacity={0.85}
    >
      <LinearGradient
        colors={["#1c0a00", "#7c2d12", "#c2410c"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0.7, y: 1 }}
        style={S.card}
      >
        <View style={[S.statusBadge, { backgroundColor: statusBg }]}>
          <Text style={S.statusText}>{statusLabel}</Text>
        </View>

        <Text style={S.trophy}>🏆</Text>
        <Text style={S.cardTitle} numberOfLines={2}>{item.title}</Text>

        {item.sponsor ? (
          <Text style={S.sponsor}>Powered by {item.sponsor}</Text>
        ) : null}

        {item.month ? (
          <View style={S.tagRow}>
            <View style={S.tag}><Text style={S.tagText}>📅 {item.month}</Text></View>
          </View>
        ) : null}

        <View style={S.divider} />

        {item.totalPool ? (
          <View style={S.rewardRow}>
            <Text style={S.rewardIcon}>🎁</Text>
            <Text style={S.rewardVal} numberOfLines={1}>{item.totalPool}</Text>
          </View>
        ) : null}

        {totalVCoins > 0 ? (
          <View style={S.rewardRow}>
            <Text style={S.rewardIcon}>🪙</Text>
            <Text style={S.rewardVal}>{fmt(totalVCoins)} VCoins</Text>
          </View>
        ) : null}

        {(item.participantCount ?? 0) > 0 ? (
          <View style={S.rewardRow}>
            <Text style={S.rewardIcon}>👥</Text>
            <Text style={S.rewardVal}>{fmt(item.participantCount!)} joined</Text>
          </View>
        ) : null}

        <TouchableOpacity
          style={[S.joinBtn, !ended && S.joinBtnActive]}
          onPress={() => router.push("/(drawer)/(tabs)/skillbattle")}
          activeOpacity={0.8}
        >
          <Text style={S.joinBtnText}>
            {ended ? "View Results →" : "Participate Now →"}
          </Text>
        </TouchableOpacity>
      </LinearGradient>
    </TouchableOpacity>
  );
}

export default function SkillBattlePreviewSection() {
  const { colors } = useTheme();
  const [items,   setItems]   = useState<Battle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const snap = await getDocs(collection(db, "skillBattles"));
        console.log("[SkillBattlePreview] docs fetched:", snap.docs.length);

        const all = snap.docs.map((d) => {
          const raw     = d.data();
          const cleaned: Record<string, unknown> = {};
          Object.entries(raw).forEach(([k, v]) => { cleaned[k.trim()] = v; });
          const battle = { id: d.id, ...cleaned } as Battle;
          console.log("[SkillBattlePreview] battle:", battle.id, "isActive:", battle.isActive, "title:", battle.title);
          return battle;
        });

        // truthy check — handles boolean true, number 1, string "true"
        const active = all.filter((b) => Boolean(b.isActive));
        console.log("[SkillBattlePreview] active count:", active.length);

        setItems(
          active
            .sort((a, b) => {
              const da  = new Date(a.startDate ?? a.month ?? "").getTime() || 0;
              const db_ = new Date(b.startDate ?? b.month ?? "").getTime() || 0;
              return db_ - da;
            })
            .slice(0, 5)
        );
      } catch (e) {
        console.log("[SkillBattlePreview] error:", e);
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
          <Text style={[S.sectionTitle, { color: colors.text }]}>⚔️ SkillBattle Challenge</Text>
          <Text style={[S.sectionSub, { color: colors.textSecondary }]}>
            Compete, rank higher, and win exciting prizes
          </Text>
        </View>
        <TouchableOpacity onPress={() => router.push("/(drawer)/(tabs)/skillbattle")}>
          <Text style={S.viewAll}>View All →</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={{ flexDirection: "row", paddingLeft: 16 }}>
          {[0, 1, 2].map((i) => <Pulse key={i} w={190} h={280} r={16} />)}
        </View>
      ) : error ? (
        <View style={S.empty}>
          <Text style={S.emptyIcon}>⚠️</Text>
          <Text style={[S.emptyText, { color: colors.textSecondary }]}>Could not load battles.</Text>
        </View>
      ) : items.length === 0 ? (
        <View style={S.empty}>
          <Text style={S.emptyIcon}>🏆</Text>
          <Text style={[S.emptyText, { color: colors.textSecondary }]}>New battles coming soon!</Text>
        </View>
      ) : (
        <FlatList
          horizontal
          data={items}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <BattleCard item={item} />}
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
  viewAll:      { fontSize: 13, fontWeight: "700", color: "#f97316", marginTop: 4 },

  cardWrap: { marginRight: 12, borderRadius: 16, overflow: "hidden", elevation: 6, shadowColor: "#ea580c", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 8 },
  card:     { width: 190, padding: 14, minHeight: 280 },

  statusBadge: { alignSelf: "flex-end", paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, marginBottom: 8 },
  statusText:  { color: "#fff", fontSize: 10, fontWeight: "800" },

  trophy:    { fontSize: 30, textAlign: "center", marginBottom: 6 },
  cardTitle: { color: "#fff", fontSize: 14, fontWeight: "800", lineHeight: 20, marginBottom: 4 },
  sponsor:   { color: "rgba(255,200,100,0.85)", fontSize: 10, fontWeight: "700", marginBottom: 8 },

  tagRow: { flexDirection: "row", flexWrap: "wrap", gap: 4, marginBottom: 8 },
  tag:    { backgroundColor: "rgba(255,255,255,0.15)", paddingHorizontal: 7, paddingVertical: 3, borderRadius: 6 },
  tagText:{ color: "rgba(255,255,255,0.9)", fontSize: 10, fontWeight: "700" },

  divider:    { height: 1, backgroundColor: "rgba(255,255,255,0.15)", marginVertical: 8 },
  rewardRow:  { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 5 },
  rewardIcon: { fontSize: 13 },
  rewardVal:  { color: "#fde68a", fontSize: 12, fontWeight: "700", flex: 1 },

  joinBtn:       { marginTop: 10, backgroundColor: "rgba(255,255,255,0.18)", borderRadius: 8, paddingVertical: 9, alignItems: "center", borderWidth: 1, borderColor: "rgba(255,255,255,0.3)" },
  joinBtnActive: { backgroundColor: "#ea580c", borderColor: "#ea580c" },
  joinBtnText:   { color: "#fff", fontSize: 12, fontWeight: "800" },

  empty:     { height: 150, alignItems: "center", justifyContent: "center", paddingHorizontal: 16 },
  emptyIcon: { fontSize: 36, marginBottom: 8 },
  emptyText: { fontSize: 13, fontWeight: "500", textAlign: "center" },
});
