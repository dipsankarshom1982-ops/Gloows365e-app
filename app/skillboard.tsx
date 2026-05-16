import Header from "@/components/header";
import { useTheme } from "@/context/ThemeContext";
import { auth, db } from "@/lib/firebase";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// ─── Types ──────────────────────────────────────────────────
type LocationScope = "local" | "district" | "state" | "india";
type BoardType = "free" | "sponsored";
type MonthKey = string; // e.g. "2026-04"

interface RanksMap {
  local: number;
  district: number;
  state: number;
  india: number;
}

interface SkillboardEntry {
  id: string;
  userId: string;
  name: string;
  profilePic: string;
  school: string;
  class: string;
  location: {
    city: string;
    district: string;
    state: string;
    pincode: string;
    country: string;
  };
  month: string;
  totalLikes: number;
  totalViews: number;
  totalWatchtime: number;
  totalShares: number;
  totalComments: number;
  totalScore: number;
  ranks: RanksMap;
}

interface StudentMeta {
  name: string;
  class: string;
  profilePic: string;
  location: {
    city: string;
    district: string;
    state: string;
    pincode: string;
  };
}

interface PrizeRow {
  rankLabel: string;
  badge: string;
  cash: string;
  extra: string;
  medalEmoji: string;
  rankMin: number;
  rankMax: number;
}

interface SponsorInfo {
  name: string;
  logo: string;
  totalPool: string;
  prizes: PrizeRow[];
}

// ─── Constants ───────────────────────────────────────────────
const LOCATION_TABS: { key: LocationScope; label: string; icon: string }[] = [
  { key: "local",    label: "Local",    icon: "🏘️" },
  { key: "district", label: "District", icon: "📍" },
  { key: "state",    label: "State",    icon: "🗺️" },
  { key: "india",    label: "India",    icon: "🇮🇳" },
];

const SPONSOR: SponsorInfo = {
  name: "Vedantu × Shikshakool",
  logo: "🏪",
  totalPool: "₹50,000",
  prizes: [
    { rankLabel: "Rank 1",   badge: "Champion",     cash: "₹15,000", extra: "+ Tablet + Certificate", medalEmoji: "🥇", rankMin: 1,  rankMax: 1  },
    { rankLabel: "Rank 2",   badge: "Runner-Up",    cash: "₹8,000",  extra: "+ Certificate",          medalEmoji: "🥈", rankMin: 2,  rankMax: 2  },
    { rankLabel: "Rank 3",   badge: "Rising Star",  cash: "₹4,000",  extra: "+ Certificate",          medalEmoji: "🥉", rankMin: 3,  rankMax: 3  },
    { rankLabel: "Rank 4–10",badge: "Top 10 Elite", cash: "₹1,000",  extra: "Each",                   medalEmoji: "🏅", rankMin: 4,  rankMax: 10 },
    { rankLabel: "Rank 11–25",badge: "Top 25",      cash: "₹500",    extra: "Each",                   medalEmoji: "⭐", rankMin: 11, rankMax: 25 },
    { rankLabel: "Rank 26–50",badge: "Top 50",      cash: "₹200",    extra: "Each",                   medalEmoji: "🎖️", rankMin: 26, rankMax: 50 },
  ],
};

// ─── Helpers ─────────────────────────────────────────────────
const getAvailableMonths = (): MonthKey[] => {
  const months: MonthKey[] = [];
  const now = new Date();
  for (let i = 0; i < 3; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`);
  }
  return months;
};

const getMonthLabel = (m: MonthKey): string =>
  new Date(Number(m.split("-")[0]), Number(m.split("-")[1]) - 1)
    .toLocaleDateString("en-IN", { month: "long", year: "numeric" });

const getMedalEmoji = (rank: number): string => {
  if (rank === 1) return "🥇";
  if (rank === 2) return "🥈";
  if (rank === 3) return "🥉";
  return "";
};

const getMedalColor = (rank: number): string => {
  if (rank === 1) return "#FFD700";
  if (rank === 2) return "#C0C0C0";
  if (rank === 3) return "#CD7F32";
  return "transparent";
};

const fmt = (n: number): string => {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
};

const getSponsorPrize = (rank: number): string => {
  const p = SPONSOR.prizes.find((pr) => rank >= pr.rankMin && rank <= pr.rankMax);
  return p ? p.cash : "—";
};

const getScopeLabel = (scope: LocationScope, meta: StudentMeta | null): string => {
  if (!meta) return "";
  switch (scope) {
    case "local":    return meta.location.pincode  || "Local";
    case "district": return meta.location.district || "District";
    case "state":    return meta.location.state    || "State";
    case "india":    return "All India 🇮🇳";
  }
};

// ─── Component ───────────────────────────────────────────────
export default function SkillboardScreen() {
  const { colors } = useTheme();
  const router = useRouter();

  // ── State ─────────────────────────────────────────────────
  const [boardType,      setBoardType]      = useState<BoardType>("free");
  const [activeScope,    setActiveScope]    = useState<LocationScope>("local");
  const [activeMonth,    setActiveMonth]    = useState<MonthKey>(getAvailableMonths()[0]);
  const [loading,        setLoading]        = useState<boolean>(true);
  const [entries,        setEntries]        = useState<SkillboardEntry[]>([]);
  const [studentMeta,    setStudentMeta]    = useState<StudentMeta | null>(null);
  const [myDoc,          setMyDoc]          = useState<SkillboardEntry | null>(null);
  const [historyDocs,    setHistoryDocs]    = useState<Record<MonthKey, SkillboardEntry | null>>({});
  const [myRanks,        setMyRanks]        = useState<RanksMap>({ local: 0, district: 0, state: 0, india: 0 });
  const availableMonths = getAvailableMonths();
  const isSp = boardType === "sponsored";

  // Theme colors
  const accent  = isSp ? "#ff9f43" : colors.accent;
  const accent2 = isSp ? "#ff6b6b" : "#ff6b9d";

  // ── Fetch student meta ────────────────────────────────────
  useEffect(() => {
    const fetch = async () => {
      const uid = auth.currentUser?.uid;
      if (!uid) return;
      const snap = await getDoc(doc(db, "students", uid));
      if (snap.exists()) {
        const d = snap.data();
        setStudentMeta({
          name:       d.name        ?? "",
          class:      d.class !== undefined ? String(d.class) : "",
          profilePic: d.profilePic  ?? "",
          location: {
            city:     d.location?.city     ?? "",
            district: d.location?.district ?? "",
            state:    d.location?.state    ?? "",
            pincode:  d.location?.pincode  ?? "",
          },
        });
      }
    };
    fetch();
  }, []);

  // ── Fetch my skillboard doc for all 3 months (history) ───
  useEffect(() => {
    if (!studentMeta) return;
    const fetchHistory = async () => {
      const uid = auth.currentUser?.uid;
      if (!uid) return;
      const results: Record<MonthKey, SkillboardEntry | null> = {};
      await Promise.all(
        availableMonths.map(async (m) => {
          const docId = `${uid}_${studentMeta.class}_${m}`;
          const snap  = await getDoc(doc(db, "skillboard", docId));
          results[m]  = snap.exists()
            ? ({ id: snap.id, ...snap.data() } as SkillboardEntry)
            : null;
        })
      );
      setHistoryDocs(results);
      setMyDoc(results[activeMonth] ?? null);
    };
    fetchHistory();
  }, [studentMeta]);

  // ── Update myDoc when month changes ──────────────────────
  useEffect(() => {
    setMyDoc(historyDocs[activeMonth] ?? null);
  }, [activeMonth, historyDocs]);

  // ── Fetch my 4 ranks from skillboard doc ─────────────────
  // One doc read gives all 4 location ranks simultaneously
  const fetchMyRanks = useCallback(async (): Promise<void> => {
    const uid = auth.currentUser?.uid;
    const cls = studentMeta?.class;
    if (!uid || !cls) return;

    const docId = `${uid}_${cls}_${activeMonth}`;
    try {
      const snap = await getDoc(doc(db, "skillboard", docId));
      if (snap.exists()) {
        const data = snap.data();
        setMyRanks({
          local:    data.ranks?.local    ?? 0,
          district: data.ranks?.district ?? 0,
          state:    data.ranks?.state    ?? 0,
          india:    data.ranks?.india    ?? 0,
        });
      } else {
        // No entry yet for this month — reset all ranks
        setMyRanks({ local: 0, district: 0, state: 0, india: 0 });
      }
    } catch (e) {
      console.error("fetchMyRanks error:", e);
      setMyRanks({ local: 0, district: 0, state: 0, india: 0 });
    }
  }, [studentMeta, activeMonth]);

  // Re-fetch my ranks whenever month or studentMeta changes
  useEffect(() => {
    fetchMyRanks();
  }, [fetchMyRanks]);

  // ── Fetch leaderboard ────────────────────────────────────
  useEffect(() => {
    if (studentMeta) fetchLeaderboard();
  }, [activeScope, activeMonth, studentMeta]);

  const fetchLeaderboard = async () => {
    if (!studentMeta) return;
    setLoading(true);
    try {
      const base = collection(db, "skillboard");
      const cls  = studentMeta.class;
      let q;

      switch (activeScope) {
        case "local":
          q = query(base,
            where("class",            "==", cls),
            where("month",            "==", activeMonth),
            where("location.pincode", "==", studentMeta.location.pincode),
            orderBy("totalScore", "desc"), limit(100));
          break;
        case "district":
          q = query(base,
            where("class",              "==", cls),
            where("month",              "==", activeMonth),
            where("location.district",  "==", studentMeta.location.district),
            orderBy("totalScore", "desc"), limit(100));
          break;
        case "state":
          q = query(base,
            where("class",           "==", cls),
            where("month",           "==", activeMonth),
            where("location.state",  "==", studentMeta.location.state),
            orderBy("totalScore", "desc"), limit(100));
          break;
        case "india":
        default:
          q = query(base,
            where("class", "==", cls),
            where("month", "==", activeMonth),
            orderBy("totalScore", "desc"), limit(100));
      }

      const snap = await getDocs(q);
      const data = snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      })) as SkillboardEntry[];

      setEntries(data);
    } catch (e) {
      console.error("Skillboard fetch error:", e);
    } finally {
      setLoading(false);
    }
  };

  // ── Get rank for current scope from myRanks state ────────
  // myRanks is populated by fetchMyRanks (single doc read = 4 ranks)
  const getMyRankForScope = (scope: LocationScope): number =>
    myRanks[scope] ?? 0;

  const myRank = getMyRankForScope(activeScope);

  // ── Podium ────────────────────────────────────────────────
  const renderPodium = () => {
    const top3 = entries.slice(0, 3);
    if (top3.length < 1) return null;
    const order   = [top3[1], top3[0], top3[2]].filter(Boolean);
    const heights = [90, 120, 72];
    const ranks   = [2, 1, 3];

    return (
      <View style={styles.podiumRow}>
        {order.map((entry, i) => (
          <View key={entry.userId} style={styles.podiumItem}>
            <View style={styles.podiumAvatarWrap}>
              {ranks[i] === 1 && <Text style={styles.crown}>👑</Text>}
              {entry.profilePic ? (
                <Image
                  source={{ uri: entry.profilePic }}
                  style={[
                    styles.podiumAvatar,
                    ranks[i] === 1 && styles.podiumAvatarLarge,
                    { borderColor: getMedalColor(ranks[i]) },
                  ]}
                />
              ) : (
                <View style={[
                  styles.podiumAvatarPlaceholder,
                  ranks[i] === 1 && styles.podiumAvatarLarge,
                  { borderColor: getMedalColor(ranks[i]), backgroundColor: `${accent}25` },
                ]}>
                  <Text style={[styles.podiumInitial, { color: accent }]}>
                    {entry.name?.charAt(0).toUpperCase() || "S"}
                  </Text>
                </View>
              )}
              <Text style={styles.podiumMedal}>{getMedalEmoji(ranks[i])}</Text>
            </View>
            <Text style={[styles.podiumName, { color: colors.text }]} numberOfLines={1}>
              {entry.name}
            </Text>
            <Text style={[styles.podiumScore, { color: accent }]}>
              {fmt(entry.totalScore)} pts
            </Text>
            {isSp && (
              <Text style={styles.podiumPrize}>{getSponsorPrize(ranks[i])}</Text>
            )}
            <View style={[
              styles.podiumBar,
              { height: heights[i], backgroundColor: `${accent}${ranks[i] === 1 ? "CC" : "55"}` },
            ]} />
          </View>
        ))}
      </View>
    );
  };

  // ── My Rank Summary Grid (all 4 scopes) ──────────────────
  const renderMyRankGrid = () => {
    const hasAnyRank = Object.values(myRanks).some((r) => r > 0);
    if (!hasAnyRank || !myDoc) return null;
    return (
      <View style={[styles.myRankGrid, { borderColor: `${accent}40`, backgroundColor: `${accent}10` }]}>
        <Text style={[styles.myRankGridTitle, { color: accent }]}>
          🎯 {studentMeta?.name} — {getMonthLabel(activeMonth)}
        </Text>
        <Text style={[styles.myRankGridSub, { color: colors.textSecondary }]}>
          Class {studentMeta?.class} students only
        </Text>
        <View style={styles.myRankGridRow}>
          {LOCATION_TABS.map((tab) => {
            // ✅ Read from myRanks state — populated by single fetchMyRanks doc read
            const rank     = myRanks[tab.key] ?? 0;
            const isActive = tab.key === activeScope;
            return (
              <TouchableOpacity
                key={tab.key}
                style={[
                  styles.myRankGridItem,
                  {
                    backgroundColor: isActive ? `${accent}25` : colors.card,
                    borderColor:     isActive ? accent : colors.border,
                  },
                ]}
                onPress={() => setActiveScope(tab.key)}
              >
                <Text style={styles.myRankGridIcon}>{tab.icon}</Text>
                <Text style={[styles.myRankGridLabel, { color: colors.textSecondary }]}>
                  {tab.label}
                </Text>
                <Text style={[styles.myRankGridRank, { color: accent }]}>
                  {rank > 0 ? (getMedalEmoji(rank) || `#${rank}`) : "—"}
                </Text>
                {rank > 0 && (
                  <Text style={[styles.myRankGridPts, { color: colors.text }]}>
                    {fmt(myDoc.totalScore)} pts
                  </Text>
                )}
                {isSp && rank > 0 && (
                  <Text style={[styles.myRankGridPrize, { color: "#06d6a0" }]}>
                    {getSponsorPrize(rank)}
                  </Text>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    );
  };

  // ── History Banner ────────────────────────────────────────
  const renderHistory = () => (
    <View style={[styles.histBanner, { borderColor: colors.border, backgroundColor: colors.card }]}>
      <Text style={[styles.histTitle, { color: colors.textSecondary }]}>
        📅 Rank History — {getScopeLabel(activeScope, studentMeta)}
      </Text>
      {availableMonths.map((m) => {
        const d       = historyDocs[m];
        const rank    = d?.ranks?.[activeScope] ?? 0;
        const isCur   = m === activeMonth;
        const aprRank = historyDocs[availableMonths[0]]?.ranks?.[activeScope] ?? 0;
        const delta   = m !== availableMonths[0] && rank > 0 && aprRank > 0
          ? rank - aprRank : 0;

        return (
          <TouchableOpacity
            key={m}
            style={[
              styles.histRow,
              { borderBottomColor: colors.border },
              isCur && { backgroundColor: `${accent}12` },
            ]}
            onPress={() => setActiveMonth(m)}
          >
            <View style={{ flex: 1 }}>
              <Text style={[styles.histMonth, { color: colors.text }]}>
                {getMonthLabel(m)}
              </Text>
              <Text style={[styles.histScope, { color: colors.textSecondary }]}>
                {getScopeLabel(activeScope, studentMeta)}
              </Text>
            </View>
            <View style={[
              styles.histRankBadge,
              {
                backgroundColor: rank > 0
                  ? delta > 0 ? "rgba(255,107,157,0.12)"
                  : delta < 0 ? "rgba(6,214,160,0.12)"
                  : `${accent}15`
                  : colors.border,
              },
            ]}>
              <Text style={[
                styles.histRankNum,
                { color: rank > 0 ? (delta > 0 ? "#ff6b9d" : delta < 0 ? "#06d6a0" : accent) : colors.textSecondary },
              ]}>
                {rank > 0 ? `#${rank}` : "—"}
              </Text>
            </View>
            {delta !== 0 && (
              <Text style={[styles.histDelta, { color: delta > 0 ? "#ff6b9d" : "#06d6a0" }]}>
                {delta > 0 ? `▼${delta}` : `▲${Math.abs(delta)}`}
              </Text>
            )}
            <Text style={[styles.histPts, { color: accent }]}>
              {d ? `${d.totalScore} pts` : "—"}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );

  // ── My Progress Card ──────────────────────────────────────
  const renderMyCard = () => {
    if (!myDoc || !studentMeta) return null;
    const rank      = myRanks[activeScope] ?? 0;
    const top10Score = entries[9]?.totalScore ?? 0;
    const gap        = top10Score > myDoc.totalScore ? top10Score - myDoc.totalScore : 0;
    const pct        = top10Score > 0
      ? Math.max(15, Math.min(90, Math.round((myDoc.totalScore / top10Score) * 100)))
      : 15;

    return (
      <View style={[styles.myCard, { borderColor: `${accent}40` }]}>
        <LinearGradient
          colors={isSp ? ["#2a1200", "#1a1800"] : ["#1e1550", "#162050"]}
          style={StyleSheet.absoluteFill}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
        <View style={styles.myCardTop}>
          {studentMeta.profilePic ? (
            <Image source={{ uri: studentMeta.profilePic }} style={[styles.myAvatar, { borderColor: accent }]} />
          ) : (
            <View style={[styles.myAvatarPlaceholder, { backgroundColor: `${accent}25`, borderColor: accent }]}>
              <Text style={[styles.myAvatarInitial, { color: accent }]}>
                {studentMeta.name.charAt(0).toUpperCase()}
              </Text>
            </View>
          )}
          <View style={{ flex: 1 }}>
            <Text style={[styles.myName, { color: colors.text }]}>{studentMeta.name}</Text>
            <View style={styles.myMetaRow}>
              <View style={[styles.myScopeBadge, { backgroundColor: `${accent}18`, borderColor: `${accent}35` }]}>
                <Text style={[styles.myScopeBadgeText, { color: accent }]}>
                  {getScopeLabel(activeScope, studentMeta)}
                </Text>
              </View>
              <Text style={[styles.myMetaText, { color: colors.textSecondary }]}>
                📍 {studentMeta.location.pincode}
              </Text>
            </View>
          </View>
          <View style={[styles.myRankBox, { borderColor: `${accent}45`, backgroundColor: `${accent}12` }]}>
            <Text style={[styles.myRankNum, { color: "#ffd166" }]}>
              {rank > 0 ? `#${rank.toLocaleString()}` : "—"}
            </Text>
            <Text style={[styles.myRankLabel, { color: "#ffd16680" }]}>Your Rank</Text>
          </View>
        </View>

        {/* Stats row */}
        <View style={styles.myStatsRow}>
          {[
            { v: myDoc.totalScore.toLocaleString(), l: "Score" },
            { v: fmt(myDoc.totalLikes),   l: "Likes" },
            { v: fmt(myDoc.totalViews),   l: "Views" },
            { v: fmt(myDoc.totalShares),  l: "Shares" },
            ...(isSp ? [{ v: getSponsorPrize(rank), l: "Prize" }] : []),
          ].map((s, i) => (
            <View key={i} style={[styles.myStatItem, { backgroundColor: "rgba(255,255,255,0.05)" }]}>
              <Text style={[styles.myStatVal, { color: accent }]}>{s.v}</Text>
              <Text style={[styles.myStatLbl, { color: colors.textSecondary }]}>{s.l}</Text>
            </View>
          ))}
        </View>

        {/* Progress bar */}
        {gap > 0 && (
          <View style={{ position: "relative" }}>
            <View style={styles.progressLabelRow}>
              <Text style={[styles.progressLabel, { color: colors.textSecondary }]}>
                Progress to Top 10
              </Text>
              <Text style={[styles.progressLabel, { color: "#ffd166" }]}>
                {top10Score} pts needed
              </Text>
            </View>
            <View style={[styles.progressBg, { backgroundColor: "rgba(255,255,255,0.07)" }]}>
              <LinearGradient
                colors={[accent, accent2]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[styles.progressFill, { width: `${pct}%` }]}
              />
            </View>
            <Text style={[styles.progressHint, { color: "#ffd166" }]}>
              🔥 <Text style={{ color: "#fff", fontWeight: "900" }}>{gap} pts</Text> away from Top 10!
            </Text>
          </View>
        )}
      </View>
    );
  };

  // ── Prize Track (Sponsored) ───────────────────────────────
  const renderPrizeTrack = () => {
    if (!isSp) return null;
    const myR = myRanks[activeScope] ?? 0;

    return (
      <View style={[styles.prizeTrack, { borderColor: "rgba(255,159,67,0.3)" }]}>
        <LinearGradient
          colors={["rgba(255,159,67,0.15)", "rgba(255,107,107,0.08)"]}
          style={styles.prizeTrackHeader}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <Text style={styles.prizeTrackTitle}>🎁 Prize Structure</Text>
          <Text style={styles.prizeTrackSub}>{SPONSOR.name} · {SPONSOR.totalPool}</Text>
        </LinearGradient>
        {SPONSOR.prizes.map((prize, i) => {
          const isMe = myR > 0 && myR >= prize.rankMin && myR <= prize.rankMax;
          return (
            <View
              key={i}
              style={[
                styles.prizeRow,
                { borderBottomColor: "rgba(255,159,67,0.1)" },
                isMe && { backgroundColor: "rgba(255,159,67,0.12)" },
              ]}
            >
              <Text style={styles.prizeMedal}>{prize.medalEmoji}</Text>
              <View style={{ flex: 1 }}>
                <Text style={[styles.prizeRankLabel, { color: colors.text }]}>
                  {prize.rankLabel}
                  {isMe && (
                    <Text style={styles.youPrizeTag}> YOU</Text>
                  )}
                </Text>
                <Text style={[styles.prizeBadgeName, { color: "rgba(255,159,67,0.7)" }]}>
                  {prize.badge}
                </Text>
              </View>
              <View style={{ alignItems: "flex-end" }}>
                <Text style={styles.prizeCash}>{prize.cash}</Text>
                <Text style={[styles.prizeExtra, { color: "rgba(255,159,67,0.6)" }]}>
                  {prize.extra}
                </Text>
              </View>
            </View>
          );
        })}
      </View>
    );
  };

  // ── Leaderboard Row ───────────────────────────────────────
  // Layout: Avatar | Name+Sub | Score | Rank | Prize
  const renderRow = ({ item, index }: { item: SkillboardEntry; index: number }) => {
    const rank  = index + 4; // since we skip top 3 (shown in podium)
    const isMe  = item.userId === auth.currentUser?.uid;
    const prize = isSp ? getSponsorPrize(rank) : "—";
    const isTop10 = rank <= 10;

    return (
      <View style={[
        styles.row,
        { backgroundColor: colors.card, borderColor: colors.border },
        isTop10 && { borderLeftColor: accent, borderLeftWidth: 3 },
        isMe && { backgroundColor: `${accent}12`, borderColor: `${accent}50` },
      ]}>
        {/* Col 1: Avatar */}
        <View style={styles.rowAvatarCol}>
          {item.profilePic ? (
            <Image source={{ uri: item.profilePic }} style={styles.rowAvatar} />
          ) : (
            <View style={[styles.rowAvatarPlaceholder, { backgroundColor: `${accent}20` }]}>
              <Text style={[styles.rowAvatarInitial, { color: accent }]}>
                {item.name?.charAt(0).toUpperCase() || "S"}
              </Text>
            </View>
          )}
        </View>

        {/* Col 2: Name + sub */}
        <View style={styles.rowInfoCol}>
          <Text style={[styles.rowName, { color: colors.text }]} numberOfLines={1}>
            {item.name}
            {isMe && <Text style={styles.youTag}> YOU</Text>}
          </Text>
          <Text style={[styles.rowSub, { color: colors.textSecondary }]} numberOfLines={1}>
            {item.school} · {item.class}
          </Text>
          <Text style={[styles.rowLoc, { color: colors.textSecondary }]} numberOfLines={1}>
            📍 {[item.location?.city, item.location?.district].filter(Boolean).join(", ")}
          </Text>
        </View>

        {/* Col 3: Score / Points */}
        <View style={styles.rowScoreCol}>
          <Text style={[styles.rowScore, { color: accent }]}>{fmt(item.totalScore)}</Text>
          <Text style={[styles.rowScoreLbl, { color: colors.textSecondary }]}>pts</Text>
        </View>

        {/* Col 4: Rank */}
        <View style={styles.rowRankCol}>
          {rank <= 3 ? (
            <Text style={styles.rowRankEmoji}>{getMedalEmoji(rank)}</Text>
          ) : (
            <Text style={[styles.rowRankNum, { color: colors.textSecondary }]}>#{rank}</Text>
          )}
        </View>

        {/* Col 5: Prize */}
        <View style={styles.rowPrizeCol}>
          <Text style={[
            styles.rowPrize,
            prize !== "—"
              ? { color: "#06d6a0", backgroundColor: "rgba(6,214,160,0.1)" }
              : { color: colors.textSecondary },
          ]}>
            {prize}
          </Text>
        </View>

        {/* Sponsored ribbon */}
        {isSp && <View style={styles.spRibbon}><Text style={styles.spRibbonText}>SP</Text></View>}
      </View>
    );
  };

  // ── Sponsor Banner ────────────────────────────────────────
  const renderSponsorBanner = () => {
    if (!isSp) return null;
    return (
      <View style={styles.sponsorBanner}>
        <LinearGradient
          colors={["rgba(255,159,67,0.2)", "rgba(255,107,107,0.12)"]}
          style={StyleSheet.absoluteFill}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        />
        <Text style={styles.sponsorLogo}>{SPONSOR.logo}</Text>
        <View style={{ flex: 1 }}>
          <Text style={styles.sponsorName}>{SPONSOR.name}</Text>
          <Text style={styles.sponsorTag}>Official Sponsor · {getMonthLabel(activeMonth)}</Text>
        </View>
        <View style={styles.sponsorPoolBox}>
          <Text style={styles.sponsorPoolAmt}>{SPONSOR.totalPool}</Text>
          <Text style={styles.sponsorPoolLbl}>Prize Pool</Text>
        </View>
      </View>
    );
  };

  // ── Main ──────────────────────────────────────────────────
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Header hideMenu={true} />

      {/* ── HEADER ── */}
      <LinearGradient
        colors={isSp ? ["#2a1500", "#1a0e00"] : ["#170d40", "#0d1a4a"]}
        style={styles.topHeader}
      >
        {/* Board type toggle */}
        <View style={[styles.boardToggle, { backgroundColor: "rgba(0,0,0,0.3)", borderColor: "rgba(255,255,255,0.07)" }]}>
          {(["free", "sponsored"] as BoardType[]).map((t) => {
            const active = boardType === t;
            return (
              <TouchableOpacity
                key={t}
                style={[styles.boardToggleBtn, active && { backgroundColor: accent }]}
                onPress={() => setBoardType(t)}
              >
                <Text style={styles.boardToggleBtnIcon}>{t === "free" ? "🎓" : "🏅"}</Text>
                <Text style={[styles.boardToggleBtnLbl, { color: active ? "#fff" : colors.textSecondary }]}>
                  {t === "free" ? "Free Skillboard" : "Sponsored"}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Sponsor banner */}
        {renderSponsorBanner()}

        {/* Title row */}
        <View style={styles.titleRow}>
          <View>
            <Text style={styles.appTitle}>🎓 Skillboard</Text>
            <Text style={[styles.appSubtitle, { color: "rgba(196,178,255,0.7)" }]}>
              Class {studentMeta?.class} · {getScopeLabel(activeScope, studentMeta)}
            </Text>
          </View>
        </View>

        {/* Month chips */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.monthScroll}>
          {availableMonths.map((m) => {
            const active = m === activeMonth;
            return (
              <TouchableOpacity
                key={m}
                style={[
                  styles.monthChip,
                  { borderColor: active ? accent : "rgba(255,255,255,0.07)", backgroundColor: active ? `${accent}35` : "rgba(255,255,255,0.04)" },
                ]}
                onPress={() => setActiveMonth(m)}
              >
                <Text style={[styles.monthChipText, { color: active ? "#fff" : colors.textSecondary }]}>
                  {getMonthLabel(m)}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Location tabs */}
        <View style={styles.locTabs}>
          {LOCATION_TABS.map((tab) => {
            const active = activeScope === tab.key;
            return (
              <TouchableOpacity
                key={tab.key}
                style={[
                  styles.locTab,
                  active && { backgroundColor: `${accent}22`, borderColor: `${accent}55` },
                ]}
                onPress={() => setActiveScope(tab.key)}
              >
                <Text style={styles.locTabIcon}>{tab.icon}</Text>
                <Text style={[styles.locTabLabel, { color: active ? "#fff" : colors.textSecondary }]}>
                  {tab.label}
                </Text>
                <Text style={[styles.locTabScope, { color: active ? `${accent}CC` : colors.textSecondary }]} numberOfLines={1}>
                  {getScopeLabel(tab.key, studentMeta)}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </LinearGradient>

      {/* ── LIST ── */}
      <FlatList
        data={entries.slice(3)}
        keyExtractor={(item) => item.id}
        renderItem={renderRow}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <>
            {/* Scope pill */}
            <View style={[styles.scopePill, { backgroundColor: isSp ? "rgba(255,159,67,0.1)" : "rgba(34,211,238,0.08)", borderColor: isSp ? "rgba(255,159,67,0.3)" : "rgba(34,211,238,0.2)" }]}>
              <Text style={[styles.scopePillText, { color: isSp ? "#ff9f43" : "#22d3ee" }]}>
                {isSp ? "🏅" : "🎯"} {getScopeLabel(activeScope, studentMeta)} · Class {studentMeta?.class} · {getMonthLabel(activeMonth)}
              </Text>
            </View>

            {/* History */}
            {renderHistory()}

            {/* My card */}
            {renderMyCard()}

            {/* My rank grid */}
            {renderMyRankGrid()}

            {/* Prize track */}
            {renderPrizeTrack()}

            {/* Section header */}
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
                🏆 Top 100
                <Text style={[styles.sectionBadge, { backgroundColor: accent }]}>
                  {" "}{getMonthLabel(activeMonth)}
                </Text>
              </Text>
              <Text style={[styles.sectionCount, { color: colors.textSecondary }]}>
                {entries.length} students
              </Text>
            </View>

            {/* Row column labels */}
            <View style={styles.colLabels}>
              <Text style={[styles.colLbl, { color: colors.textSecondary, width: 50 }]}>Avatar</Text>
              <Text style={[styles.colLbl, { color: colors.textSecondary, flex: 1 }]}>Name</Text>
              <Text style={[styles.colLbl, { color: colors.textSecondary, width: 44, textAlign: "center" }]}>Pts</Text>
              <Text style={[styles.colLbl, { color: colors.textSecondary, width: 36, textAlign: "center" }]}>Rank</Text>
              <Text style={[styles.colLbl, { color: colors.textSecondary, width: 52, textAlign: "right" }]}>Prize</Text>
            </View>

            {/* Loading */}
            {loading && (
              <View style={styles.centered}>
                <ActivityIndicator size="large" color={accent} />
                <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
                  Loading skillboard...
                </Text>
              </View>
            )}

            {/* Podium */}
            {!loading && entries.length >= 3 && renderPodium()}

            {/* Empty */}
            {!loading && entries.length === 0 && (
              <View style={styles.centered}>
                <Text style={{ fontSize: 44 }}>🏅</Text>
                <Text style={[styles.emptyTitle, { color: colors.text }]}>No entries yet</Text>
                <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                  No Class {studentMeta?.class} students found{"\n"}
                  in {getScopeLabel(activeScope, studentMeta)}{"\n"}
                  for {getMonthLabel(activeMonth)}.{"\n"}
                  Post reels with #SkillBattle to rank!
                </Text>
              </View>
            )}

            {/* Rank 4+ label */}
            {!loading && entries.length > 3 && (
              <Text style={[styles.rankListLabel, { color: colors.textSecondary }]}>
                Rankings 4 – {entries.length}
              </Text>
            )}
          </>
        }
      />
    </SafeAreaView>
  );
}

// ─── Styles ──────────────────────────────────────────────────
const styles = StyleSheet.create({
  container:   { flex: 1 },
  listContent: { paddingBottom: 40 },
  centered:    { alignItems: "center", paddingVertical: 40, gap: 12 },
  loadingText: { fontSize: 14, fontWeight: "500" },
  emptyTitle:  { fontSize: 18, fontWeight: "800", marginTop: 8 },
  emptyText:   { fontSize: 13, fontWeight: "500", textAlign: "center", lineHeight: 22 },

  // ── HEADER ──
  topHeader: { paddingHorizontal: 16, paddingBottom: 0 },

  boardToggle: {
    flexDirection: "row", borderRadius: 14, padding: 3,
    borderWidth: 1, marginBottom: 8,
  },
  boardToggleBtn: {
    flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center",
    gap: 5, paddingVertical: 7, borderRadius: 11,
  },
  boardToggleBtnIcon: { fontSize: 13 },
  boardToggleBtnLbl:  { fontSize: 11, fontWeight: "800" },

  sponsorBanner: {
    flexDirection: "row", alignItems: "center", gap: 10,
    borderRadius: 12, padding: 9, marginBottom: 8,
    overflow: "hidden", borderWidth: 1, borderColor: "rgba(255,159,67,0.3)",
    position: "relative",
  },
  sponsorLogo:    { fontSize: 24 },
  sponsorName:    { fontSize: 12, fontWeight: "900", color: "#ff9f43" },
  sponsorTag:     { fontSize: 9, color: "rgba(255,159,67,0.65)", fontWeight: "700" },
  sponsorPoolBox: { alignItems: "flex-end" },
  sponsorPoolAmt: { fontSize: 14, fontWeight: "900", color: "#ff9f43" },
  sponsorPoolLbl: { fontSize: 8, color: "rgba(255,159,67,0.6)", fontWeight: "700", textTransform: "uppercase" },

  titleRow:    { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 10 },
  appTitle:    { fontSize: 22, fontWeight: "900", color: "#fff", fontFamily: undefined },
  appSubtitle: { fontSize: 11, fontWeight: "700", marginTop: 1 },

  monthScroll: { marginBottom: 10 },
  monthChip: {
    paddingHorizontal: 12, paddingVertical: 6,
    borderRadius: 20, borderWidth: 1.5, marginRight: 7, flexShrink: 0,
  },
  monthChipText: { fontSize: 11, fontWeight: "800" },

  locTabs: { flexDirection: "row", gap: 5, paddingBottom: 14 },
  locTab: {
    flex: 1, alignItems: "center", gap: 2, paddingVertical: 6,
    borderRadius: 12, borderWidth: 1.5, borderColor: "transparent",
  },
  locTabIcon:  { fontSize: 14 },
  locTabLabel: { fontSize: 10, fontWeight: "800" },
  locTabScope: { fontSize: 8, fontWeight: "600", textAlign: "center", maxWidth: 72 },

  // ── SCOPE PILL ──
  scopePill: {
    marginHorizontal: 14, marginTop: 12, marginBottom: 8,
    paddingHorizontal: 12, paddingVertical: 5,
    borderRadius: 10, borderWidth: 1, alignSelf: "flex-start",
  },
  scopePillText: { fontSize: 10, fontWeight: "800" },

  // ── HISTORY ──
  histBanner: {
    marginHorizontal: 14, marginBottom: 10,
    borderRadius: 16, borderWidth: 1, overflow: "hidden",
  },
  histTitle: {
    paddingHorizontal: 14, paddingVertical: 7,
    fontSize: 10, fontWeight: "800", textTransform: "uppercase", letterSpacing: 0.8,
    borderBottomWidth: 1, borderBottomColor: "rgba(255,255,255,0.05)",
  },
  histRow: {
    flexDirection: "row", alignItems: "center", gap: 8,
    paddingHorizontal: 14, paddingVertical: 9,
    borderBottomWidth: 1,
  },
  histMonth:     { fontSize: 12, fontWeight: "800" },
  histScope:     { fontSize: 9, fontWeight: "600" },
  histRankBadge: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 9 },
  histRankNum:   { fontSize: 13, fontWeight: "900" },
  histDelta:     { fontSize: 10, fontWeight: "700", minWidth: 28 },
  histPts:       { fontSize: 11, fontWeight: "800", minWidth: 54, textAlign: "right" },

  // ── MY CARD ──
  myCard: {
    marginHorizontal: 14, marginBottom: 10,
    borderRadius: 20, borderWidth: 1, padding: 13,
    overflow: "hidden", position: "relative",
  },
  myCardTop:          { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 10 },
  myAvatar:           { width: 46, height: 46, borderRadius: 23, borderWidth: 2.5 },
  myAvatarPlaceholder:{ width: 46, height: 46, borderRadius: 23, borderWidth: 2.5, justifyContent: "center", alignItems: "center" },
  myAvatarInitial:    { fontSize: 18, fontWeight: "900" },
  myName:             { fontSize: 14, fontWeight: "900" },
  myMetaRow:          { flexDirection: "row", alignItems: "center", gap: 5, marginTop: 3, flexWrap: "wrap" },
  myScopeBadge:       { paddingHorizontal: 7, paddingVertical: 2, borderRadius: 7, borderWidth: 1 },
  myScopeBadgeText:   { fontSize: 9, fontWeight: "800" },
  myMetaText:         { fontSize: 9, fontWeight: "600" },
  myRankBox:          { alignItems: "center", paddingHorizontal: 10, paddingVertical: 6, borderRadius: 12, borderWidth: 1.5 },
  myRankNum:          { fontSize: 20, fontWeight: "900", lineHeight: 22 },
  myRankLabel:        { fontSize: 8, fontWeight: "800", textTransform: "uppercase", letterSpacing: 0.5 },

  myStatsRow:   { flexDirection: "row", gap: 6, marginBottom: 10 },
  myStatItem:   { flex: 1, borderRadius: 9, padding: 7, alignItems: "center" },
  myStatVal:    { fontSize: 12, fontWeight: "900" },
  myStatLbl:    { fontSize: 8, fontWeight: "700", marginTop: 1 },

  progressLabelRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 5 },
  progressLabel:    { fontSize: 9, fontWeight: "700" },
  progressBg:       { height: 7, borderRadius: 5, overflow: "hidden", marginBottom: 5 },
  progressFill:     { height: "100%", borderRadius: 5 },
  progressHint:     { fontSize: 10, fontWeight: "800" },

  // ── MY RANK GRID ──
  myRankGrid: {
    marginHorizontal: 14, marginBottom: 10,
    borderRadius: 16, borderWidth: 1.5, padding: 12,
  },
  myRankGridTitle: { fontSize: 12, fontWeight: "800", marginBottom: 2 },
  myRankGridSub:   { fontSize: 10, fontWeight: "600", marginBottom: 10 },
  myRankGridRow:   { flexDirection: "row", gap: 7 },
  myRankGridItem:  { flex: 1, alignItems: "center", padding: 9, borderRadius: 12, borderWidth: 1, gap: 2 },
  myRankGridIcon:  { fontSize: 17 },
  myRankGridLabel: { fontSize: 9, fontWeight: "700" },
  myRankGridRank:  { fontSize: 16, fontWeight: "900" },
  myRankGridPts:   { fontSize: 9, fontWeight: "700" },
  myRankGridPrize: { fontSize: 9, fontWeight: "800" },

  // ── PRIZE TRACK ──
  prizeTrack: {
    marginHorizontal: 14, marginBottom: 10,
    borderRadius: 16, borderWidth: 1, overflow: "hidden",
  },
  prizeTrackHeader: { paddingHorizontal: 14, paddingVertical: 9 },
  prizeTrackTitle:  { fontSize: 13, fontWeight: "800", color: "#ff9f43" },
  prizeTrackSub:    { fontSize: 9, color: "rgba(255,159,67,0.6)", fontWeight: "700" },
  prizeRow: {
    flexDirection: "row", alignItems: "center", gap: 10,
    paddingHorizontal: 14, paddingVertical: 9,
    borderBottomWidth: 1,
  },
  prizeMedal:     { fontSize: 18, width: 24, textAlign: "center" },
  prizeRankLabel: { fontSize: 11, fontWeight: "800" },
  youPrizeTag:    { fontSize: 9, color: "#ffd166", fontWeight: "900" },
  prizeBadgeName: { fontSize: 9, fontWeight: "700" },
  prizeCash:      { fontSize: 14, fontWeight: "900", color: "#06d6a0" },
  prizeExtra:     { fontSize: 9, fontWeight: "700" },

  // ── PODIUM ──
  podiumRow: {
    flexDirection: "row", alignItems: "flex-end", justifyContent: "center",
    marginHorizontal: 14, marginBottom: 12, gap: 6,
  },
  podiumItem:              { flex: 1, alignItems: "center" },
  podiumAvatarWrap:        { position: "relative", marginBottom: 5 },
  podiumAvatar:            { width: 48, height: 48, borderRadius: 24, borderWidth: 3 },
  podiumAvatarLarge:       { width: 58, height: 58, borderRadius: 29 },
  podiumAvatarPlaceholder: { width: 48, height: 48, borderRadius: 24, borderWidth: 3, justifyContent: "center", alignItems: "center" },
  podiumInitial:           { fontSize: 18, fontWeight: "800" },
  crown:                   { position: "absolute", top: -12, left: "50%", fontSize: 14, zIndex: 1 },
  podiumMedal:             { position: "absolute", bottom: -3, right: -3, fontSize: 13 },
  podiumName:              { fontSize: 10, fontWeight: "800", textAlign: "center", maxWidth: 74 },
  podiumScore:             { fontSize: 11, fontWeight: "900", marginBottom: 2 },
  podiumPrize:             { fontSize: 9, fontWeight: "800", color: "#06d6a0", backgroundColor: "rgba(6,214,160,0.1)", paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6, marginBottom: 3 },
  podiumBar:               { width: "100%", borderTopLeftRadius: 6, borderTopRightRadius: 6 },

  // ── SECTION ──
  sectionHeader:  { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginHorizontal: 14, marginBottom: 6, marginTop: 4 },
  sectionTitle:   { fontSize: 11, fontWeight: "800", textTransform: "uppercase", letterSpacing: 0.8 },
  sectionBadge:   { fontSize: 9, color: "#fff", paddingHorizontal: 7, paddingVertical: 2, borderRadius: 7, overflow: "hidden" },
  sectionCount:   { fontSize: 9, fontWeight: "700" },

  colLabels: {
    flexDirection: "row", alignItems: "center",
    marginHorizontal: 14, marginBottom: 4, paddingHorizontal: 4,
  },
  colLbl: { fontSize: 9, fontWeight: "800", textTransform: "uppercase", letterSpacing: 0.5 },

  rankListLabel: {
    marginHorizontal: 14, marginBottom: 8,
    fontSize: 10, fontWeight: "800", textTransform: "uppercase", letterSpacing: 0.8,
  },

  // ── ROW: Avatar | Name | Score | Rank | Prize ──
  row: {
    flexDirection: "row", alignItems: "center",
    marginHorizontal: 14, marginBottom: 7,
    paddingVertical: 9, paddingHorizontal: 10,
    borderRadius: 14, borderWidth: 1,
    position: "relative", overflow: "hidden",
  },
  rowAvatarCol:         { width: 46, marginRight: 8 },
  rowAvatar:            { width: 40, height: 40, borderRadius: 20 },
  rowAvatarPlaceholder: { width: 40, height: 40, borderRadius: 20, justifyContent: "center", alignItems: "center" },
  rowAvatarInitial:     { fontSize: 15, fontWeight: "900" },
  rowInfoCol:           { flex: 1, marginRight: 4 },
  rowName:              { fontSize: 12, fontWeight: "800" },
  youTag:               { fontSize: 9, color: "#ffd166", fontWeight: "900" },
  rowSub:               { fontSize: 9, marginTop: 1 },
  rowLoc:               { fontSize: 9, marginTop: 1 },
  rowScoreCol:          { width: 44, alignItems: "center", marginRight: 2 },
  rowScore:             { fontSize: 13, fontWeight: "900", lineHeight: 15 },
  rowScoreLbl:          { fontSize: 8, fontWeight: "700" },
  rowRankCol:           { width: 34, alignItems: "center", marginRight: 2 },
  rowRankEmoji:         { fontSize: 17 },
  rowRankNum:           { fontSize: 11, fontWeight: "900" },
  rowPrizeCol:          { width: 52, alignItems: "flex-end" },
  rowPrize:             { fontSize: 10, fontWeight: "800", paddingHorizontal: 5, paddingVertical: 2, borderRadius: 7 },
  spRibbon:             { position: "absolute", top: 0, right: 0, backgroundColor: "#ff9f43", paddingHorizontal: 5, paddingVertical: 2, borderBottomLeftRadius: 7, borderTopRightRadius: 14 },
  spRibbonText:         { fontSize: 7, fontWeight: "900", color: "#fff", letterSpacing: 0.3 },
});
