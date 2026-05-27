import { useTheme } from "@/context/ThemeContext";
import { useAppTranslation } from "@/context/LanguageContext";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import AdsCard from "@/components/AdsCard";
import PostCard from "@/components/FeedPostCard";
import Header from "@/components/header";
import Stories from "@/components/Story";

//import ExplorePreview from "@/components/explorePreview";
import ShortLearnPreview from "@/components/ShortLearnPreview";
import SkillShortPreview from "@/components/SkillShortPreview";

import HomeAdsCarousel          from "@/components/HomeAdsCarousel";
import KnowledgeHubSection      from "@/components/KnowledgeHubSection";
import SeekhoPreviewSection     from "@/components/SeekhoPreviewSection";
import VidyaStarPreviewSection from "@/components/VidyaStarPreviewSection";
import SkillBattlePreviewSection from "@/components/SkillBattlePreviewSection";
import DiscoverPreviewSection  from "@/components/DiscoverPreviewSection";

import { functions } from "@/lib/firebase";
import { httpsCallable } from "firebase/functions";

export default function Home() {
  const { colors } = useTheme();
  const { t } = useAppTranslation();
  const [posts, setPosts] = useState<any[]>([]);

  const fetchPosts = useCallback(async () => {
    try {
      const getHomeFeed = httpsCallable<
        { classLevel?: string },
        { banners: unknown[]; posts: any[] }
      >(functions, "getHomeFeed");
      const { data } = await getHomeFeed({});
      const filtered = data.posts.filter(
        (p: any) => p.postType === "photo" || p.postType === "video"
      );
      setPosts(filtered);
    } catch (error) {
      console.log("Feed error:", error);
      setPosts([]);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  // 🔥 FEED ENGINE
  const generateFeed = () => {
    const feed: any[] = [];
    let postIndex = 0;

    // Add header section items
    feed.push({ type: "stories" });
    feed.push({ type: "aiguru" });
    feed.push({ type: "skillshorts" });
    feed.push({ type: "skillbattle_preview" });
    feed.push({ type: "home_ads" });
    feed.push({ type: "vidya_star" });
    feed.push({ type: "seekho_preview" });
    feed.push({ type: "discover_preview" });
    feed.push({ type: "knowledge_hub" });

    // Main feed loop
    while (postIndex < posts.length) {
      // 2 posts
      if (postIndex < posts.length) {
        feed.push({ type: "post", data: posts[postIndex] });
        postIndex++;
      }
      if (postIndex < posts.length) {
        feed.push({ type: "post", data: posts[postIndex] });
        postIndex++;
      }

      // Ads
      feed.push({ type: "ad" });

      // Learning Short
      feed.push({ type: "learning" });

      // Ads
      feed.push({ type: "ad" });

      // 2 posts
      if (postIndex < posts.length) {
        feed.push({ type: "post", data: posts[postIndex] });
        postIndex++;
      }
      if (postIndex < posts.length) {
        feed.push({ type: "post", data: posts[postIndex] });
        postIndex++;
      }

      // Explore
     // feed.push({ type: "explore" });
    }

    return feed;
  };

  const feedData = generateFeed();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Header />
      <FlatList
        data={feedData}
        extraData={colors}
        renderItem={({ item }) => (
          <View>
            {item.type === "aiguru" ? (
              <TouchableOpacity
                onPress={() => router.push("/ai-guru")}
                activeOpacity={0.88}
                style={styles.aiWrap}
              >
                <LinearGradient
                  colors={["#0f0c29", "#302b63", "#24243e"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.aiBox}
                >
                  {/* Glow orb decoration */}
                  <View style={styles.aiOrb} />

                  {/* Top row */}
                  <View style={styles.aiTopRow}>
                    <View style={styles.aiBadge}>
                      <Text style={styles.aiBadgeText}>✨ Powered by AI</Text>
                    </View>
                    <View style={styles.aiLiveTag}>
                      <View style={styles.aiPulseDot} />
                      <Text style={styles.aiLiveText}>Online</Text>
                    </View>
                  </View>

                  {/* Main content */}
                  <View style={styles.aiMain}>
                    <Text style={styles.aiEmoji}>🤖</Text>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.aiTitle}>{t("aiGuru")}</Text>
                      <Text style={styles.aiSubtitle}>{t("aiGuruSubtitle")}</Text>
                    </View>
                  </View>

                  {/* Feature chips */}
                  <View style={styles.aiChipsRow}>
                    {[t("askAnything"), t("instantAnswers"), t("studyHelp")].map((f) => (
                      <View key={f} style={styles.aiChip}>
                        <Text style={styles.aiChipText}>{f}</Text>
                      </View>
                    ))}
                  </View>

                  {/* CTA */}
                  <LinearGradient
                    colors={["#6366f1", "#8b5cf6"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.aiCta}
                  >
                    <Text style={styles.aiCtaText}>{t("startChatting")}</Text>
                  </LinearGradient>
                </LinearGradient>
              </TouchableOpacity>
            ) : item.type === "post" ? (
              <PostCard data={item.data} />
            ) : item.type === "ad" ? (
              <AdsCard />
            ) : item.type === "skillshorts" ? (
              <SkillShortPreview />
            ) : item.type === "stories" ? (
              <Stories />
            ) : item.type === "learning" ? (
              <ShortLearnPreview />
            ) : item.type === "skillbattle_preview" ? (
              <SkillBattlePreviewSection />
            ) : item.type === "home_ads" ? (
              <HomeAdsCarousel />
            ) : item.type === "vidya_star" ? (
              <VidyaStarPreviewSection />
            ) : item.type === "seekho_preview" ? (
              <SeekhoPreviewSection />
            ) : item.type === "discover_preview" ? (
              <DiscoverPreviewSection />
            ) : item.type === "knowledge_hub" ? (
              <KnowledgeHubSection />
           // ) : item.type === "explore" ? (
           //   <ExplorePreview />
            ) : null}
          </View>
        )}
        keyExtractor={(_, i) => i.toString()}
      />
    </SafeAreaView>
  );
}

// ================= STYLES =================

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  aiWrap: {
    marginHorizontal: 15,
    marginVertical: 10,
    borderRadius: 20,
    elevation: 8,
    shadowColor: "#6366f1",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
  },
  aiBox: {
    borderRadius: 20,
    padding: 18,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(99,102,241,0.35)",
  },
  aiOrb: {
    position: "absolute",
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: "rgba(99,102,241,0.18)",
    top: -40,
    right: -40,
  },
  aiTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  aiBadge: {
    backgroundColor: "rgba(99,102,241,0.25)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(139,92,246,0.4)",
  },
  aiBadgeText: {
    color: "#a5b4fc",
    fontSize: 11,
    fontWeight: "700",
  },
  aiLiveTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "rgba(16,185,129,0.15)",
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(16,185,129,0.3)",
  },
  aiPulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#10b981",
  },
  aiLiveText: {
    color: "#10b981",
    fontSize: 11,
    fontWeight: "700",
  },
  aiMain: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 14,
  },
  aiEmoji: {
    fontSize: 44,
  },
  aiTitle: {
    color: "#fff",
    fontWeight: "900",
    fontSize: 22,
    letterSpacing: 0.3,
  },
  aiSubtitle: {
    color: "rgba(255,255,255,0.55)",
    fontSize: 12,
    fontWeight: "500",
    marginTop: 2,
  },
  aiChipsRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 16,
    flexWrap: "wrap",
  },
  aiChip: {
    backgroundColor: "rgba(255,255,255,0.08)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
  },
  aiChipText: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 11,
    fontWeight: "600",
  },
  aiCta: {
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
  },
  aiCtaText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "800",
    letterSpacing: 0.3,
  },
});