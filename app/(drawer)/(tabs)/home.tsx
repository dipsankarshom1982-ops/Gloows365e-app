import { useTheme } from "@/context/ThemeContext";
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
import Chips from "@/components/Chips";
import PostCard from "@/components/FeedPostCard";
import Header from "@/components/header";
import Stories from "@/components/Stories";

import ExplorePreview from "@/components/explorePreview";
import ShortLearnPreview from "@/components/ShortLearnPreview";
import SkillShortPreview from "@/components/SkillShortPreview";

import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";

export default function Home() {
  const { colors } = useTheme();
  const [posts, setPosts] = useState<any[]>([]);

  // 🔥 FETCH POSTS - Only fetch photo and video type posts
  const fetchPosts = useCallback(async () => {
    try {
      const snap = await getDocs(collection(db, "posts"));
      const data = snap.docs
        .map((d) => ({
          id: d.id,
          ...d.data(),
        }))
        .filter((post: any) => post.postType === "photo" || post.postType === "video");
      setPosts(data);
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
    feed.push({ type: "chips" });

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
      feed.push({ type: "explore" });
    }

    return feed;
  };

  const feedData = generateFeed();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Header />
      <FlatList
        data={feedData}
        renderItem={({ item }) => (
          <View>
            {item.type === "aiguru" ? (
              <TouchableOpacity onPress={() => router.push("/ai-guru")}>
                <LinearGradient
                  colors={["#4f46e5", "#3b82f6"]}
                  style={styles.aiBox}
                >
                  <Text style={[styles.aiTitle, { color: colors.accent }]}>🤖 AI Guru</Text>
                  <Text style={[styles.aiSubtitle, { color: colors.text }]}>
                    Ask anything. Learn smarter.
                  </Text>
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
            ) : item.type === "chips" ? (
              <Chips />
            ) : item.type === "learning" ? (
              <ShortLearnPreview />
            ) : item.type === "explore" ? (
              <ExplorePreview />
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

  aiBox: {
    marginHorizontal: 15,
    marginVertical: 10,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(56, 189, 248, 0.2)",
  },

 aiTitle: {
  color: "#3b82f6",
  fontWeight: "800",
  fontSize: 18,
  marginBottom: 4,
  textShadowColor: "rgba(59,130,246,0.4)",
  textShadowOffset: { width: 0, height: 2 },
  textShadowRadius: 6,
},

 aiSubtitle: {
  color: "#cbd5e1", // ✅ balanced light gray
  fontSize: 14,
  fontWeight: "500",
},
});