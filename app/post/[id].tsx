import { useTheme } from "@/context/ThemeContext";
import { db } from "@/lib/firebase";
import { useLocalSearchParams, useRouter } from "expo-router";
import { VideoView, useVideoPlayer } from "expo-video";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type SharedPost = {
  id: string;
  postType?: string;
  mediaUrl?: string;
  title?: string;
  description?: string;
  name?: string;
  school?: string;
  likes?: number;
  comments?: number;
  views?: number;
  shares?: number;
};

export default function SharedPostScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string }>();
  const [post, setPost] = useState<SharedPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPost = async () => {
      if (!params.id) {
        setLoading(false);
        return;
      }

      try {
        const snap = await getDoc(doc(db, "posts", params.id));
        if (snap.exists()) {
          const data = snap.data() as Omit<SharedPost, "id">;

          if (data.postType === "reel") {
            router.replace({
              pathname: "/reels",
              params: { postId: snap.id },
            });
            return;
          }

          setPost({
            id: snap.id,
            ...data,
          });
        } else {
          setPost(null);
        }
      } catch (error) {
        console.log("Shared post load error:", error);
        setPost(null);
      } finally {
        setLoading(false);
      }
    };

    loadPost();
  }, [params.id]);

  const player = useVideoPlayer(
    post?.postType === "video" || post?.postType === "reel"
      ? post?.mediaUrl || null
      : null
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}> 
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={[styles.backText, { color: colors.accent }]}>Back</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Shared Post</Text>
        <View style={styles.headerSpacer} />
      </View>

      {loading ? (
        <View style={styles.centerBox}>
          <ActivityIndicator color={colors.accent} size="large" />
        </View>
      ) : !post ? (
        <View style={styles.centerBox}>
          <Text style={[styles.emptyTitle, { color: colors.text }]}>Post not found</Text>
          <Text style={[styles.emptySub, { color: colors.textSecondary }]}>This shared link is unavailable or the post was removed.</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.content}>
          <View style={[styles.authorCard, { backgroundColor: colors.card, borderColor: colors.border }]}> 
            <Text style={[styles.authorName, { color: colors.text }]}>{post.name || "Student"}</Text>
            <Text style={[styles.authorSchool, { color: colors.textSecondary }]}>{post.school || "Vidya"}</Text>
          </View>

          {post.mediaUrl ? (
            <View style={[styles.mediaCard, { backgroundColor: colors.card, borderColor: colors.border }]}> 
              {post.postType === "video" || post.postType === "reel" ? (
                <VideoView player={player} style={styles.media} contentFit="cover" nativeControls />
              ) : (
                <Image source={{ uri: post.mediaUrl }} style={styles.media} resizeMode="cover" />
              )}
            </View>
          ) : null}

          {post.title ? (
            <Text style={[styles.title, { color: colors.text }]}>{post.title}</Text>
          ) : null}

          {post.description ? (
            <Text style={[styles.description, { color: colors.textSecondary }]}>{post.description}</Text>
          ) : null}

          <View style={[styles.statsRow, { backgroundColor: colors.card, borderColor: colors.border }]}> 
            <Text style={[styles.stat, { color: colors.textSecondary }]}>❤️ {post.likes || 0}</Text>
            <Text style={[styles.stat, { color: colors.textSecondary }]}>💬 {post.comments || 0}</Text>
            <Text style={[styles.stat, { color: colors.textSecondary }]}>📤 {post.shares || 0}</Text>
            <Text style={[styles.stat, { color: colors.textSecondary }]}>👁️ {post.views || 0}</Text>
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  backText: {
    fontSize: 14,
    fontWeight: "700",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "800",
  },
  headerSpacer: {
    width: 40,
  },
  centerBox: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "800",
    marginBottom: 8,
  },
  emptySub: {
    textAlign: "center",
    fontSize: 14,
    lineHeight: 20,
  },
  content: {
    padding: 16,
    gap: 14,
  },
  authorCard: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
  },
  authorName: {
    fontSize: 16,
    fontWeight: "800",
  },
  authorSchool: {
    fontSize: 13,
    marginTop: 4,
  },
  mediaCard: {
    borderWidth: 1,
    borderRadius: 18,
    overflow: "hidden",
  },
  media: {
    width: "100%",
    aspectRatio: 16 / 9,
  },
  title: {
    fontSize: 20,
    fontWeight: "800",
    lineHeight: 26,
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    borderWidth: 1,
    borderRadius: 14,
    paddingVertical: 12,
  },
  stat: {
    fontSize: 13,
    fontWeight: "700",
  },
});