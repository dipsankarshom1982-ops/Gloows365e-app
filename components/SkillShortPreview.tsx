import { useAppTranslation } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { router } from "expo-router";

import { auth, db } from "@/lib/firebase";
import { collection, onSnapshot, query, where } from "firebase/firestore";

const STATUS_CFG: Record<string, { emoji: string; label: string; bg: string }> = {
  pending:   { emoji: "⏳", label: "Pending Review", bg: "rgba(243,156,18,0.92)" },
  in_review: { emoji: "🔍", label: "In Review",      bg: "rgba(52,152,219,0.92)"  },
  rejected:  { emoji: "❌", label: "Rejected",        bg: "rgba(231,76,60,0.92)"   },
};

export default function SkillShortPreview() {
  const { colors } = useTheme();
  const { t } = useAppTranslation();
  const [reels,      setReels]      = useState<any[]>([]);
  const [ownPending, setOwnPending] = useState<any[]>([]);

  // 🎥 APPROVED SKILL BATTLE REELS — real-time listener
  useEffect(() => {
    const q = query(
      collection(db, "posts"),
      where("isSkillBattle", "==", true),
      where("status",        "==", "approved")
    );
    const unsub = onSnapshot(q, (snap) => {
      const sorted = snap.docs
        .map((d) => ({ id: d.id, ...d.data() }))
        .sort((a: any, b: any) => (b.views || 0) - (a.views || 0))
        .slice(0, 10);
      setReels(sorted);
    }, () => setReels([]));
    return () => unsub();
  }, []);

  // 👤 OWN PENDING / IN-REVIEW REELS — shown first with status badge
  useEffect(() => {
    let unsubQuery: (() => void) | null = null;

    const unsubAuth = auth.onAuthStateChanged((user) => {
      if (unsubQuery) { unsubQuery(); unsubQuery = null; }
      if (!user) { setOwnPending([]); return; }

      // Simple single-field query — no composite index needed
      const q = query(
        collection(db, "posts"),
        where("userId", "==", user.uid)
      );
      unsubQuery = onSnapshot(q, (snap) => {
        const pending = snap.docs
          .filter((d) => {
            const data = d.data();
            return data.isSkillBattle === true && data.status !== "approved";
          })
          .map((d) => ({ id: d.id, ...d.data() }))
          .sort((a: any, b: any) =>
            (b.createdAt?.toMillis?.() || 0) - (a.createdAt?.toMillis?.() || 0)
          );
        setOwnPending(pending);
      }, () => setOwnPending([]));
    });

    return () => {
      unsubAuth();
      if (unsubQuery) unsubQuery();
    };
  }, []);

  const displayReels = [...ownPending, ...reels];

  // 🎯 RENDER ITEM
  const renderItem = ({ item }: any) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        router.push({
          pathname: "/reels",
          params: { postId: item.id, filter: "skillbattle" },
        })
      }
      activeOpacity={0.8}
    >
      <Image
        source={{
          uri:
            item.thumbnail ||
            item.mediaUrl ||
            "https://via.placeholder.com/120x180?text=No+Video",
        }}
        style={styles.image}
      />

      {/* 🎥 GRADIENT OVERLAY */}
      <LinearGradient
        colors={["transparent", "rgba(0,0,0,0.8)"]}
        style={styles.gradient}
      />

      {/* ▶️ PLAY BUTTON */}
      <View style={styles.playContainer}>
        <Ionicons name="play" size={16} color="#fff" />
      </View>

      {/* 🔥 VIEWS */}
      <Text style={styles.views}>🔥 {item.views || 0}</Text>

      {/* 📝 TITLE */}
      {item.title && (
        <Text style={styles.cardTitle} numberOfLines={2}>
          {item.title}
        </Text>
      )}

      {/* 🎯 BADGE */}
      <View style={styles.badge}>
        <Text style={styles.badgeText}>{t("battleBadge")}</Text>
      </View>

      {/* 🕐 STATUS PILL — own pending/in_review reels */}
      {item.status !== "approved" && STATUS_CFG[item.status] && (
        <View style={[styles.statusPill, { backgroundColor: STATUS_CFG[item.status].bg }]}>
          <Text style={styles.statusPillText}>
            {STATUS_CFG[item.status].emoji} {STATUS_CFG[item.status].label}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>
          {t("skillBattleShortsTitle")}
        </Text>
        <TouchableOpacity
          onPress={() =>
            router.push({ pathname: "/reels", params: { filter: "skillbattle" } })
          }
        >
          <Text style={styles.viewAll}>{t("viewAll")}</Text>
        </TouchableOpacity>
      </View>

      {displayReels.length > 0 ? (
        <FlatList
          horizontal
          data={displayReels}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          showsHorizontalScrollIndicator={false}
          scrollEventThrottle={16}
        />
      ) : (
        <View style={styles.empty}>
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
            {t("noSkillBattleVideos")}
          </Text>
        </View>
      )}
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    marginVertical:   15,
    paddingHorizontal: 15,
  },

  header: {
    flexDirection:   "row",
    alignItems:      "center",
    justifyContent:  "space-between",
    marginBottom:    12,
  },

  title: {
    color:      "#fff",
    fontSize:   20,
    fontWeight: "800",
  },

  viewAll: {
    fontSize:   13,
    fontWeight: "700",
    color:      "#f97316",
  },

  card: {
    marginRight:     12,
    borderRadius:    14,
    overflow:        "hidden",
    shadowColor:     "#000",
    shadowOffset:    { width: 0, height: 4 },
    shadowOpacity:   0.25,
    shadowRadius:    6,
    elevation:       5,
    backgroundColor: "#fff",
  },

  image: {
    width:           120,
    height:          180,
    borderRadius:    12,
    backgroundColor: "#e5e7eb",
  },

  gradient: {
    position:     "absolute",
    top:          0,
    left:         0,
    right:        0,
    bottom:       0,
    borderRadius: 12,
  },

  views: {
    position:        "absolute",
    bottom:          8,
    left:            8,
    backgroundColor: "rgba(0,0,0,0.6)",
    color:           "#fff",
    fontSize:        12,
    fontWeight:      "600",
    paddingHorizontal: 6,
    paddingVertical:   3,
    borderRadius:    4,
  },

  playContainer: {
    position:        "absolute",
    top:             "50%",
    left:            "50%",
    marginLeft:      -15,
    marginTop:       -15,
    backgroundColor: "rgba(255,255,255,0.3)",
    width:           30,
    height:          30,
    borderRadius:    15,
    justifyContent:  "center",
    alignItems:      "center",
    borderWidth:     2,
    borderColor:     "#fff",
  },

  cardTitle: {
    position:   "absolute",
    bottom:     32,
    left:       8,
    right:      8,
    color:      "#fff",
    fontSize:   11,
    fontWeight: "600",
    lineHeight: 14,
  },

  badge: {
    position:        "absolute",
    top:             8,
    left:            8,
    backgroundColor: "rgba(252,33,33,0.9)",
    paddingHorizontal: 8,
    paddingVertical:   4,
    borderRadius:    6,
  },

  badgeText: {
    color:      "#fff",
    fontSize:   11,
    fontWeight: "bold",
  },

  empty: {
    height:         150,
    justifyContent: "center",
    alignItems:     "center",
  },

  emptyText: {
    color:      "#94a3b8",
    fontSize:   14,
    fontWeight: "500",
  },

  statusPill: {
    position:        "absolute",
    bottom:          8,
    right:           8,
    paddingHorizontal: 7,
    paddingVertical:   4,
    borderRadius:    6,
  },

  statusPillText: {
    color:      "#fff",
    fontSize:   10,
    fontWeight: "800",
  },
});