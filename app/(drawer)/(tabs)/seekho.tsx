import { useAppTranslation } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";
import { db } from "@/lib/firebase";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import {
  collection,
  getDocs,
  limit,
  query,
  where,
} from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Header from "@/components/header";

// ─── Types ────────────────────────────────────────────────────
interface SeekhoVideo {
  id:           string;
  title:        string;
  thumbnailUrl?: string;
  videoUrl?:    string;
  videoType?:   string;
  className?:   string;
  subject?:     string;
  chapter?:     string;
  category?:    string;
  teacherName?: string;
  duration?:    string;
  viewsCount?:  number;
  likesCount?:  number;
  isFeatured?:  boolean;
  isActive:     boolean;
  order?:       number;
  description?: string;
}

// ─── Constants ────────────────────────────────────────────────
const CATEGORIES = [
  { label: "All",              emoji: "🌟" },
  { label: "Class 5",         emoji: "📗" },
  { label: "Class 6",         emoji: "📘" },
  { label: "Class 7",         emoji: "📙" },
  { label: "Class 8",         emoji: "📕" },
  { label: "Class 9",         emoji: "📒" },
  { label: "Class 10",        emoji: "📓" },
  { label: "Class 11",        emoji: "📔" },
  { label: "Class 12",        emoji: "📃" },
  { label: "English Speaking",emoji: "🗣️" },
  { label: "Computer",        emoji: "💻" },
  { label: "Dance",           emoji: "💃" },
  { label: "Singing",         emoji: "🎵" },
  { label: "Craft",           emoji: "✂️" },
  { label: "Drawing",         emoji: "🎨" },
  { label: "General Skills",  emoji: "🌐" },
];

const fmtViews = (n?: number) => {
  if (!n) return "0";
  return n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n);
};

// ─── Skeleton pulse ───────────────────────────────────────────
function Pulse({ w, h, r = 10 }: { w: number | string; h: number; r?: number }) {
  const anim = useRef(new Animated.Value(0.35)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(anim, { toValue: 0.8,  duration: 700, useNativeDriver: true }),
        Animated.timing(anim, { toValue: 0.35, duration: 700, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, []);
  return (
    <Animated.View
      style={{ width: w as any, height: h, borderRadius: r, backgroundColor: "#334155", opacity: anim, marginBottom: 10 }}
    />
  );
}

// ─── Featured banner card ─────────────────────────────────────
function FeaturedCard({ item }: { item: SeekhoVideo }) {
  const { t } = useAppTranslation();
  return (
    <TouchableOpacity
      style={S.featuredWrap}
      activeOpacity={0.88}
      onPress={() =>
        router.push({
          pathname: "/video-detail" as any,
          params: { id: item.id, videoUrl: item.videoUrl ?? "", title: item.title },
        })
      }
    >
      <View style={S.featuredThumbWrap}>
        {item.thumbnailUrl ? (
          <Image source={{ uri: item.thumbnailUrl }} style={S.featuredThumb} resizeMode="cover" />
        ) : (
          <LinearGradient colors={["#1e1b4b", "#4f46e5"]} style={S.featuredThumb}>
            <Ionicons name="book-outline" size={48} color="#a5b4fc" />
          </LinearGradient>
        )}

        {/* Dark overlay for text readability */}
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.85)"]}
          style={S.featuredOverlay}
        />

        {/* Featured badge */}
        <View style={S.featuredBadge}>
          <Text style={S.featuredBadgeText}>⭐ {t("featured")}</Text>
        </View>

        {/* Play button */}
        <View style={S.featuredPlay}>
          <Ionicons name="play" size={22} color="#fff" />
        </View>

        {/* Duration */}
        {item.duration ? (
          <View style={S.durBadge}>
            <Text style={S.durText}>{item.duration}</Text>
          </View>
        ) : null}

        {/* Bottom text on image */}
        <View style={S.featuredBottom}>
          <Text style={S.featuredTitle} numberOfLines={2}>{item.title}</Text>
          <View style={S.featuredMeta}>
            {item.subject   ? <Text style={S.featuredMetaText}>📚 {item.subject}</Text>   : null}
            {item.className ? <Text style={S.featuredMetaText}>🎓 {item.className}</Text> : null}
            {item.teacherName ? <Text style={S.featuredMetaText}>👤 {item.teacherName}</Text> : null}
          </View>
          <Text style={S.featuredViews}>👁 {fmtViews(item.viewsCount)} views</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

// ─── Video list card (full-width) ─────────────────────────────
function VideoCard({ item }: { item: SeekhoVideo }) {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      style={[S.videoCard, { backgroundColor: colors.card }]}
      activeOpacity={0.85}
      onPress={() =>
        router.push({
          pathname: "/video-detail" as any,
          params: { id: item.id, videoUrl: item.videoUrl ?? "", title: item.title },
        })
      }
    >
      {/* Thumbnail */}
      <View style={S.videoThumbWrap}>
        {item.thumbnailUrl ? (
          <Image source={{ uri: item.thumbnailUrl }} style={S.videoThumb} resizeMode="cover" />
        ) : (
          <LinearGradient colors={["#1e1b4b", "#4f46e5"]} style={S.videoThumb}>
            <Ionicons name="book-outline" size={30} color="#a5b4fc" />
          </LinearGradient>
        )}
        <View style={S.videoPlayBtn}>
          <Ionicons name="play" size={14} color="#fff" />
        </View>
        {item.duration ? (
          <View style={S.durBadge}>
            <Text style={S.durText}>{item.duration}</Text>
          </View>
        ) : null}
        {item.isFeatured ? (
          <View style={S.featBadgeSmall}>
            <Text style={S.featBadgeSmallText}>⭐</Text>
          </View>
        ) : null}
      </View>

      {/* Info */}
      <View style={S.videoInfo}>
        <Text style={[S.videoTitle, { color: colors.text }]} numberOfLines={2}>
          {item.title}
        </Text>

        <View style={S.videoTagRow}>
          {item.subject ? (
            <View style={[S.videoTag, { backgroundColor: colors.background }]}>
              <Text style={[S.videoTagText, { color: colors.textSecondary }]}>📚 {item.subject}</Text>
            </View>
          ) : null}
          {item.className ? (
            <View style={[S.videoTag, { backgroundColor: colors.background }]}>
              <Text style={[S.videoTagText, { color: colors.textSecondary }]}>🎓 {item.className}</Text>
            </View>
          ) : null}
        </View>

        {item.chapter ? (
          <Text style={[S.videoChapter, { color: colors.textSecondary }]} numberOfLines={1}>
            Ch: {item.chapter}
          </Text>
        ) : null}

        {item.teacherName ? (
          <Text style={[S.videoTeacher, { color: colors.textSecondary }]} numberOfLines={1}>
            👤 {item.teacherName}
          </Text>
        ) : null}

        <View style={S.videoBottomRow}>
          <Text style={[S.videoViews, { color: colors.textSecondary }]}>
            👁 {fmtViews(item.viewsCount)}
          </Text>
          {item.likesCount ? (
            <Text style={[S.videoViews, { color: colors.textSecondary }]}>
              ❤️ {fmtViews(item.likesCount)}
            </Text>
          ) : null}
        </View>
      </View>
    </TouchableOpacity>
  );
}

// ─── Skeleton loader ──────────────────────────────────────────
function SkeletonList() {
  return (
    <View style={{ padding: 16, gap: 12 }}>
      {[0, 1, 2, 3].map((i) => (
        <View key={i} style={{ flexDirection: "row", gap: 12 }}>
          <Pulse w={120} h={82} r={12} />
          <View style={{ flex: 1, gap: 8, paddingTop: 4 }}>
            <Pulse w="80%" h={14} r={6} />
            <Pulse w="55%" h={11} r={6} />
            <Pulse w="40%" h={11} r={6} />
          </View>
        </View>
      ))}
    </View>
  );
}

// ─── Main screen ─────────────────────────────────────────────
export default function SeekhoScreen() {
  const { colors } = useTheme();
  const { t } = useAppTranslation();

  const [videos,      setVideos]      = useState<SeekhoVideo[]>([]);
  const [loading,     setLoading]     = useState(true);
  const [activeCat,   setActiveCat]   = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const snap = await getDocs(query(
          collection(db, "seekhoVideos"),
          where("isActive", "==", true),
          limit(50)
        ));
        const data: SeekhoVideo[] = snap.docs
          .map((d) => ({ id: d.id, ...(d.data() as any) }))
          .sort((a, b) => {
            if ((b.isFeatured ? 1 : 0) !== (a.isFeatured ? 1 : 0))
              return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
            return (a.order ?? 99) - (b.order ?? 99);
          });
        setVideos(data);
      } catch (e) {
        console.log("Seekho fetch:", e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Filter by category + search
  const filtered = videos.filter((v) => {
    const matchCat =
      activeCat === "All" ||
      v.category === activeCat ||
      v.className === activeCat;

    const q = searchQuery.trim().toLowerCase();
    const matchSearch =
      !q ||
      v.title?.toLowerCase().includes(q) ||
      v.subject?.toLowerCase().includes(q) ||
      v.teacherName?.toLowerCase().includes(q) ||
      v.chapter?.toLowerCase().includes(q);

    return matchCat && matchSearch;
  });

  const featured  = filtered.find((v) => v.isFeatured) ?? null;
  const listItems = featured ? filtered.filter((v) => v.id !== featured.id) : filtered;

  return (
    <SafeAreaView style={[S.container, { backgroundColor: colors.background }]}>
      <Header />

      {/* ── Search bar ── */}
      <View style={[S.searchWrap, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Ionicons name="search-outline" size={18} color={colors.textSecondary} />
        <TextInput
          style={[S.searchInput, { color: colors.text }]}
          placeholder={t("searchVideos")}
          placeholderTextColor={colors.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
          returnKeyType="search"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery("")}>
            <Ionicons name="close-circle" size={18} color={colors.textSecondary} />
          </TouchableOpacity>
        )}
      </View>

      {/* ── Category chips ── */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={S.chipsScroll}
      >
        {CATEGORIES.map((cat) => {
          const active = activeCat === cat.label;
          return (
            <TouchableOpacity
              key={cat.label}
              style={[
                S.chip,
                {
                  backgroundColor: active ? "#4f46e5" : colors.card,
                  borderColor:     active ? "#4f46e5" : colors.border,
                },
              ]}
              onPress={() => setActiveCat(cat.label)}
              activeOpacity={0.75}
            >
              <Text style={S.chipEmoji}>{cat.emoji}</Text>
              <Text style={[S.chipText, { color: active ? "#fff" : colors.textSecondary }]}>
                {cat.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* ── Content ── */}
      {loading ? (
        <SkeletonList />
      ) : filtered.length === 0 ? (
        <View style={S.emptyWrap}>
          <Text style={S.emptyIcon}>📚</Text>
          <Text style={[S.emptyTitle, { color: colors.text }]}>{t("noVideosFound")}</Text>
          <Text style={[S.emptyText, { color: colors.textSecondary }]}>
            {searchQuery
              ? `No results for "${searchQuery}"`
              : activeCat === "All"
                ? t("videosComingSoon")
                : `No videos for "${activeCat}" yet.`}
          </Text>
          {(searchQuery || activeCat !== "All") && (
            <TouchableOpacity
              style={S.resetBtn}
              onPress={() => { setSearchQuery(""); setActiveCat("All"); }}
            >
              <Text style={S.resetBtnText}>{t("clearFilters")}</Text>
            </TouchableOpacity>
          )}
        </View>
      ) : (
        <FlatList
          data={listItems}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 32 }}
          ListHeaderComponent={
            featured ? (
              <View>
                <FeaturedCard item={featured} />
                {listItems.length > 0 && (
                  <View style={S.listHeader}>
                    <Text style={[S.listHeaderText, { color: colors.text }]}>
                      {activeCat === "All" ? t("allVideos") : activeCat}
                      <Text style={[S.listHeaderCount, { color: colors.textSecondary }]}>
                        {"  "}({listItems.length})
                      </Text>
                    </Text>
                  </View>
                )}
              </View>
            ) : listItems.length > 0 ? (
              <View style={S.listHeader}>
                <Text style={[S.listHeaderText, { color: colors.text }]}>
                  {activeCat === "All" ? t("allVideos") : activeCat}
                  <Text style={[S.listHeaderCount, { color: colors.textSecondary }]}>
                    {"  "}({listItems.length})
                  </Text>
                </Text>
              </View>
            ) : null
          }
          renderItem={({ item }) => <VideoCard item={item} />}
          ItemSeparatorComponent={() => (
            <View style={[S.separator, { backgroundColor: colors.border }]} />
          )}
        />
      )}
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────
const S = StyleSheet.create({
  container: { flex: 1 },

  // Search
  searchWrap: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 16,
    marginTop: 10,
    marginBottom: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1.5,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    fontWeight: "500",
    padding: 0,
  },

  // Chips
  chipsScroll: { paddingHorizontal: 16, paddingBottom: 10, gap: 8 },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1.5,
  },
  chipEmoji: { fontSize: 13 },
  chipText:  { fontSize: 12, fontWeight: "700" },

  // Featured card
  featuredWrap:      { marginHorizontal: 16, marginBottom: 8, borderRadius: 18, overflow: "hidden", elevation: 5, shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8 },
  featuredThumbWrap: { height: 220, position: "relative", justifyContent: "center", alignItems: "center" },
  featuredThumb:     { ...StyleSheet.absoluteFillObject, width: "100%", height: "100%" } as any,
  featuredOverlay:   { ...StyleSheet.absoluteFillObject },
  featuredBadge:     { position: "absolute", top: 12, left: 12, backgroundColor: "#f59e0b", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  featuredBadgeText: { color: "#fff", fontSize: 11, fontWeight: "800" },
  featuredPlay:      { width: 52, height: 52, borderRadius: 26, backgroundColor: "rgba(99,102,241,0.85)", justifyContent: "center", alignItems: "center", borderWidth: 2, borderColor: "#fff" },
  durBadge:          { position: "absolute", bottom: 54, right: 12, backgroundColor: "rgba(0,0,0,0.7)", borderRadius: 5, paddingHorizontal: 6, paddingVertical: 2 },
  durText:           { color: "#fff", fontSize: 10, fontWeight: "700" },
  featuredBottom:    { position: "absolute", bottom: 0, left: 0, right: 0, padding: 14 },
  featuredTitle:     { color: "#fff", fontSize: 16, fontWeight: "800", lineHeight: 22, marginBottom: 6 },
  featuredMeta:      { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 4 },
  featuredMetaText:  { color: "rgba(255,255,255,0.75)", fontSize: 11, fontWeight: "600" },
  featuredViews:     { color: "rgba(255,255,255,0.55)", fontSize: 10, fontWeight: "600" },

  // List header
  listHeader:      { paddingHorizontal: 16, paddingVertical: 12 },
  listHeaderText:  { fontSize: 16, fontWeight: "800" },
  listHeaderCount: { fontSize: 13, fontWeight: "500" },

  // Video card
  videoCard:     { flexDirection: "row", gap: 12, paddingHorizontal: 16, paddingVertical: 12 },
  videoThumbWrap:{ position: "relative", width: 130, height: 84, borderRadius: 12, overflow: "hidden", flexShrink: 0 },
  videoThumb:    { width: 130, height: 84, justifyContent: "center", alignItems: "center" },
  videoPlayBtn:  { position: "absolute", top: "50%", left: "50%", marginLeft: -14, marginTop: -14, width: 28, height: 28, borderRadius: 14, backgroundColor: "rgba(0,0,0,0.6)", justifyContent: "center", alignItems: "center", borderWidth: 1.5, borderColor: "#fff" },
  featBadgeSmall:{ position: "absolute", top: 4, left: 4, backgroundColor: "#f59e0b", borderRadius: 4, paddingHorizontal: 4, paddingVertical: 1 },
  featBadgeSmallText: { color: "#fff", fontSize: 9, fontWeight: "800" },

  videoInfo:     { flex: 1, justifyContent: "center" },
  videoTitle:    { fontSize: 13, fontWeight: "700", lineHeight: 18, marginBottom: 5 },
  videoTagRow:   { flexDirection: "row", flexWrap: "wrap", gap: 5, marginBottom: 4 },
  videoTag:      { paddingHorizontal: 7, paddingVertical: 2, borderRadius: 6 },
  videoTagText:  { fontSize: 10, fontWeight: "600" },
  videoChapter:  { fontSize: 10, fontWeight: "500", marginBottom: 2 },
  videoTeacher:  { fontSize: 10, fontWeight: "600", marginBottom: 4 },
  videoBottomRow:{ flexDirection: "row", gap: 10 },
  videoViews:    { fontSize: 10, fontWeight: "600" },

  separator: { height: 1, marginLeft: 158 },

  // Empty
  emptyWrap:  { flex: 1, alignItems: "center", justifyContent: "center", paddingVertical: 80 },
  emptyIcon:  { fontSize: 52, marginBottom: 12 },
  emptyTitle: { fontSize: 18, fontWeight: "800", marginBottom: 6 },
  emptyText:  { fontSize: 13, fontWeight: "500", textAlign: "center", paddingHorizontal: 32, marginBottom: 20 },
  resetBtn:   { backgroundColor: "#4f46e5", paddingHorizontal: 24, paddingVertical: 10, borderRadius: 12 },
  resetBtnText: { color: "#fff", fontSize: 13, fontWeight: "700" },
});
