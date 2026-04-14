import { useTheme } from "@/context/ThemeContext";
import { useNavigation } from "@react-navigation/native";
import { router, useLocalSearchParams } from "expo-router";
import { VideoView, useVideoPlayer } from "expo-video";
import { useEffect, useRef, useState } from "react";

import {
    Animated,
    Dimensions,
    FlatList,
    Modal,
    Pressable,
    Share,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

import { auth, db } from "@/lib/firebase";
import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    increment,
    limit,
    onSnapshot,
    orderBy,
    query,
    serverTimestamp,
    setDoc,
    startAfter,
    updateDoc,
    where,
} from "firebase/firestore";

const COMMENT_GROUPS = [
  {
    title: "Encouragement",
    options: ["Very good", "Keep it up", "Well done"],
  },
  {
    title: "Skill Praise",
    options: ["Excellent work", "Super effort", "Amazing skill"],
  },
  {
    title: "Learning Support",
    options: ["Good try", "Nice learning", "You are improving"],
  },
];

const { height } = Dimensions.get("window");

type Post = {
  id: string;
  mediaUrl: string;
  userId?: string;
  name?: string;
  school?: string;
  profilePic?: string;
  title?: string;
  description?: string;
  likes?: number;
  comments?: number;
  views?: number;
  shares?: number;
};

export default function Reels() {
  const { colors } = useTheme();
  const params = useLocalSearchParams<{ index?: string; postId?: string }>();
  const startIndex = params.postId ? 0 : parseInt(params.index || "0", 10) || 0;

  const [videos, setVideos] = useState<Post[]>([]);
  const [lastDoc, setLastDoc] = useState<any>(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(startIndex);
  const [paused, setPaused] = useState(false);

  const flatListRef = useRef<FlatList>(null);
  const viewed = useRef(new Set<string>());

  const navigation = useNavigation();

  useEffect(() => {
    if (params.postId) {
      const loadSingleReel = async () => {
        try {
          const snap = await getDoc(doc(db, "posts", params.postId as string));
          if (snap.exists()) {
            const postData = snap.data() as Omit<Post, "id">;

            if (postData.postType === "reel") {
              setVideos([{ id: snap.id, ...postData }]);
              setLastDoc(null);
            } else {
              setVideos([]);
            }
          } else {
            setVideos([]);
          }
        } catch (error) {
          console.log("Load deep-linked reel error:", error);
          setVideos([]);
        }
      };

      loadSingleReel();
      return;
    }

    const q = query(
      collection(db, "posts"),
      where("postType", "==", "reel"),
      orderBy("createdAt", "desc"),
      limit(5)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data: Post[] = snapshot.docs.map((postDoc) => ({
        id: postDoc.id,
        ...(postDoc.data() as Omit<Post, "id">),
      }));

      setVideos(data);
      setLastDoc(snapshot.docs[snapshot.docs.length - 1]);
    });

    return () => unsubscribe();
  }, [params.postId]);

  const loadMore = async () => {
    if (params.postId) return;
    if (!lastDoc || loadingMore) return;

    setLoadingMore(true);

    const q = query(
      collection(db, "posts"),
      where("postType", "==", "reel"),
      orderBy("createdAt", "desc"),
      startAfter(lastDoc),
      limit(5)
    );

    const snap = await getDocs(q);

    const newData: Post[] = snap.docs.map((postDoc) => ({
      id: postDoc.id,
      ...(postDoc.data() as Omit<Post, "id">),
    }));

    setVideos((prev) => [...prev, ...newData]);
    setLastDoc(snap.docs[snap.docs.length - 1]);
    setLoadingMore(false);
  };

  useEffect(() => {
    if (videos.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToIndex({
          index: startIndex,
          animated: false,
        });
      }, 100);
    }
  }, [videos, startIndex]);

  const handleView = async (item: Post) => {
    if (viewed.current.has(item.id)) return;

    viewed.current.add(item.id);

    await updateDoc(doc(db, "posts", item.id), {
      views: increment(1),
    });
  };

  const handleLike = async (item: Post) => {
    const userId = auth.currentUser?.uid;
    if (!userId) return false;

    const likeRef = doc(db, "posts", item.id, "likes", userId);
    const snap = await getDoc(likeRef);

    if (snap.exists()) {
      await deleteDoc(likeRef);
      await updateDoc(doc(db, "posts", item.id), {
        likes: increment(-1),
      });
      return false;
    }

    await setDoc(likeRef, {
      liked: true,
      userId,
      createdAt: serverTimestamp(),
    });

    await updateDoc(doc(db, "posts", item.id), {
      likes: increment(1),
    });

    return true;
  };

  const handleShare = async (item: Post) => {
    try {
      const deepLink = `vidya://post/${item.id}`;
      const result = await Share.share({
        message: `${item.title || "Vidya Reel"}\n\n${item.description || ""}\n\nOpen in Vidya: ${deepLink}`.trim(),
        url: deepLink,
      });

      if (result.action === Share.sharedAction) {
        await updateDoc(doc(db, "posts", item.id), {
          shares: increment(1),
        });
      }
    } catch (error) {
      console.log("Share error:", error);
    }
  };

  const renderItem = ({ item, index }: any) => {
    if (index !== 0 && index % 5 === 0) {
      return (
        <View style={[styles.adContainer, { height, backgroundColor: colors.background }]}>
          <Text style={[styles.adText, { color: colors.accent }]}>🔥 Sponsored Ad</Text>
        </View>
      );
    }

    const isActive = index === currentIndex;

    return (
      <VideoItem
        item={item}
        isActive={isActive}
        paused={paused}
        onPauseToggle={() => setPaused((prev) => !prev)}
        onLike={handleLike}
        onShare={handleShare}
        onView={handleView}
        navigation={navigation}
        colors={colors}
      />
    );
  };

  return (
    <>
      {videos.length === 0 ? (
        <View style={[styles.emptyContainer, { backgroundColor: colors.background }]}>
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No videos available</Text>
          <TouchableOpacity
            style={[styles.uploadBtn, { backgroundColor: colors.accent, shadowColor: colors.accent }]}
            onPress={() => router.push("/skillbattle")}
          >
            <Text style={[styles.uploadBtnText, { color: colors.background }]}>Upload First Video ＋</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <FlatList
            ref={flatListRef}
            data={videos}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            pagingEnabled
            snapToInterval={height}
            decelerationRate="fast"
            onEndReached={loadMore}
            onEndReachedThreshold={0.5}
            onMomentumScrollEnd={(e) => {
              const newIndex = Math.round(e.nativeEvent.contentOffset.y / height);
              setCurrentIndex(newIndex);
            }}
          />

          <TouchableOpacity
            style={[styles.backBtn, { backgroundColor: colors.accent, shadowColor: colors.accent }]}
            onPress={() => router.push("/(drawer)/(tabs)/home")}
          >
            <Text style={[styles.btnText, { color: colors.background }]}>⬅</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.createBtn, { backgroundColor: colors.accent, shadowColor: colors.accent }]}
            onPress={() => router.push("/create-post")}
          >
            <Text style={[styles.btnText, { color: colors.background }]}>＋</Text>
          </TouchableOpacity>
        </>
      )}
    </>
  );
}

interface VideoItemProps {
  item: Post;
  isActive: boolean;
  paused: boolean;
  onPauseToggle: () => void;
  onLike: (item: Post) => Promise<boolean>;
  onShare: (item: Post) => Promise<void>;
  onView: (item: Post) => Promise<void>;
  navigation: any;
  colors: any;
}

function VideoItem({
  item,
  isActive,
  paused,
  onPauseToggle,
  onLike,
  onShare,
  onView,
  navigation,
  colors,
}: VideoItemProps) {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const watchStart = useRef<number | null>(null);
  const playerRef = useRef<any>(null);
  const [studentInfo, setStudentInfo] = useState<any>(null);
  const [liked, setLiked] = useState(false);
  const [commentsVisible, setCommentsVisible] = useState(false);
  const [comments, setComments] = useState<any[]>([]);
  const [commentText, setCommentText] = useState("");
  const [commentCount, setCommentCount] = useState(item.comments || 0);

  useEffect(() => {
    if (item.userId) {
      const fetchStudentData = async () => {
        try {
          const studentDoc = await getDoc(doc(db, "students", item.userId));
          if (studentDoc.exists()) {
            setStudentInfo(studentDoc.data());
          }
        } catch (error) {
          console.log("Error fetching student:", error);
        }
      };
      fetchStudentData();
    }
  }, [item.userId]);

  useEffect(() => {
    setCommentCount(item.comments || 0);
  }, [item.comments]);

  useEffect(() => {
    const userId = auth.currentUser?.uid;
    if (!userId) return;

    const fetchLikeStatus = async () => {
      try {
        const likeSnap = await getDoc(doc(db, "posts", item.id, "likes", userId));
        setLiked(likeSnap.exists());
      } catch (error) {
        console.log("Reel like status error:", error);
      }
    };

    fetchLikeStatus();
  }, [item.id]);

  useEffect(() => {
    if (!commentsVisible) return;

    const commentsQuery = query(
      collection(db, "posts", item.id, "comments"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(commentsQuery, (snapshot) => {
      setComments(
        snapshot.docs.map((commentDoc) => ({
          id: commentDoc.id,
          ...commentDoc.data(),
        }))
      );
      setCommentCount(snapshot.size);
    });

    return unsubscribe;
  }, [commentsVisible, item.id]);

  const player = useVideoPlayer(item.mediaUrl?.trim() ? item.mediaUrl : null);
  playerRef.current = player;

  useEffect(() => {
    if (!playerRef.current) return;

    if (isActive && !paused) {
      watchStart.current = Date.now();
      playerRef.current.play();
      onView(item);
    } else {
      playerRef.current.pause();

      if (watchStart.current) {
        const watched = Math.floor((Date.now() - watchStart.current) / 1000);
        if (watched > 2) {
          updateDoc(doc(db, "posts", item.id), {
            watchTime: increment(watched),
          }).catch((err) => console.log("Watch time update error:", err));
        }
        watchStart.current = null;
      }
    }
  }, [isActive, paused, item, onView]);

  const handleLikePress = async () => {
    scaleAnim.setValue(0);
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();

    const nextLiked = await onLike(item);
    setLiked(nextLiked);
  };

  const handleAddComment = async () => {
    const userId = auth.currentUser?.uid;
    if (!userId || !commentText.trim()) return;

    try {
      await addDoc(collection(db, "posts", item.id, "comments"), {
        userId,
        userName: auth.currentUser?.displayName || "Student",
        text: commentText.trim(),
        createdAt: serverTimestamp(),
      });

      await updateDoc(doc(db, "posts", item.id), {
        comments: increment(1),
      });

      setCommentText("");
    } catch (error) {
      console.log("Reel comment add error:", error);
    }
  };

  return (
    <>
      <Pressable style={{ height }} onPress={onPauseToggle} onLongPress={handleLikePress}>
        <VideoView player={player} style={{ flex: 1 }} contentFit="cover" />

        <Animated.View
          style={[
            styles.heart,
            { transform: [{ scale: scaleAnim }], opacity: scaleAnim },
          ]}
        >
          <Text style={{ fontSize: 80 }}>❤️</Text>
        </Animated.View>

        <TouchableOpacity
          style={[styles.back, { backgroundColor: `${colors.accent}20`, borderRadius: 8, padding: 8 }]}
          onPress={() => navigation.goBack()}
        >
          <Text style={[styles.white, { color: colors.accent }]}>⬅</Text>
        </TouchableOpacity>

        <View style={[styles.caption, { backgroundColor: `${colors.background}80` }]}>
          <Text style={[styles.username, { color: colors.text }]}>@{studentInfo?.name || item.name || "student"}</Text>
          <Text style={[styles.school, { color: colors.textSecondary }]}>{studentInfo?.school || item.school || ""}</Text>
          <Text style={[styles.captionText, { color: colors.text }]}>{item.title}</Text>
        </View>

        <View style={styles.actionStack}>
          <TouchableOpacity style={[styles.actionBtn, { backgroundColor: `${colors.accent}20` }]} onPress={handleLikePress}>
            <Text style={[styles.white, { color: liked ? colors.accent : colors.text }]}>❤️ {item.likes || 0}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.actionBtn, { backgroundColor: `${colors.accent}20` }]} onPress={() => setCommentsVisible(true)}>
            <Text style={[styles.white, { color: colors.text }]}>💬 {commentCount}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.actionBtn, { backgroundColor: `${colors.accent}20` }]} onPress={() => onShare(item)}>
            <Text style={[styles.white, { color: colors.text }]}>📤 {item.shares || 0}</Text>
          </TouchableOpacity>
        </View>

        <Text style={[styles.views, { color: colors.accent, backgroundColor: `${colors.background}80`, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 }]}>👁️ {item.views || 0}</Text>
      </Pressable>

      <Modal visible={commentsVisible} animationType="slide" transparent>
        <View style={styles.modalBackdrop}>
          <View style={[styles.modalCard, { backgroundColor: colors.background }]}> 
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>Comments</Text>
              <TouchableOpacity onPress={() => setCommentsVisible(false)}>
                <Text style={[styles.modalClose, { color: colors.accent }]}>Close</Text>
              </TouchableOpacity>
            </View>

            <FlatList
              data={comments}
              keyExtractor={(comment) => comment.id}
              ListEmptyComponent={<Text style={[styles.modalEmpty, { color: colors.textSecondary }]}>No comments yet</Text>}
              renderItem={({ item: comment }) => (
                <View style={[styles.commentCard, { backgroundColor: colors.card }]}> 
                  <Text style={[styles.commentAuthor, { color: colors.accent }]}>{comment.userName || "Student"}</Text>
                  <Text style={[styles.commentText, { color: colors.text }]}>{comment.text}</Text>
                </View>
              )}
            />

            <Text style={[styles.suggestionTitle, { color: colors.text }]}>Suggested comments</Text>
            {COMMENT_GROUPS.map((group) => (
              <View key={group.title} style={styles.suggestionGroup}>
                <Text style={[styles.suggestionGroupTitle, { color: colors.textSecondary }]}>{group.title}</Text>
                <View style={styles.suggestionWrap}>
                  {group.options.map((preset) => (
                    <TouchableOpacity
                      key={preset}
                      style={[styles.suggestionChip, { backgroundColor: colors.card, borderColor: colors.border }]}
                      onPress={() => setCommentText(preset)}
                    >
                      <Text style={[styles.suggestionText, { color: colors.text }]}>{preset}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            ))}

            <View style={styles.commentComposer}>
              <TextInput
                value={commentText}
                onChangeText={setCommentText}
                placeholder="Pick a suggestion or edit your comment..."
                placeholderTextColor={colors.textSecondary}
                style={[styles.commentInput, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]}
              />
              <TouchableOpacity style={[styles.commentSendBtn, { backgroundColor: colors.accent }]} onPress={handleAddComment}>
                <Text style={styles.commentSendText}>Send</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  white: { fontSize: 18 },
  back: { position: "absolute", top: 50, left: 20 },

  actionStack: {
    position: "absolute",
    right: 20,
    bottom: 128,
    gap: 12,
  },

  actionBtn: {
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },

  views: {
    position: "absolute",
    left: 10,
    bottom: 60,
    fontSize: 14,
    fontWeight: "600",
  },

  caption: {
    position: "absolute",
    bottom: 100,
    left: 10,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 8,
    maxWidth: "85%",
  },

  username: { fontWeight: "bold", fontSize: 14 },
  school: { fontSize: 12, marginBottom: 4 },
  captionText: { marginTop: 4, fontSize: 13 },

  heart: {
    position: "absolute",
    top: "40%",
    left: "40%",
  },

  createBtn: {
    position: "absolute",
    top: 50,
    right: 20,
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },

  backBtn: {
    position: "absolute",
    top: 50,
    left: 20,
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },

  btnText: {
    fontSize: 24,
    fontWeight: "bold",
  },

  adContainer: {
    justifyContent: "center",
    alignItems: "center",
  },

  adText: {
    fontSize: 20,
    fontWeight: "700",
  },

  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  emptyText: {
    fontSize: 18,
    marginBottom: 20,
    fontWeight: "600",
  },

  uploadBtn: {
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },

  uploadBtnText: {
    fontWeight: "700",
    fontSize: 16,
  },

  modalBackdrop: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.45)",
  },

  modalCard: {
    minHeight: "50%",
    maxHeight: "80%",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
  },

  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
  },

  modalClose: {
    fontSize: 14,
    fontWeight: "700",
  },

  modalEmpty: {
    textAlign: "center",
    marginTop: 20,
  },

  suggestionTitle: {
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 8,
  },

  suggestionGroup: {
    marginBottom: 10,
  },

  suggestionGroupTitle: {
    fontSize: 12,
    fontWeight: "700",
    marginBottom: 6,
  },

  suggestionWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 8,
  },

  suggestionChip: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },

  suggestionText: {
    fontSize: 12,
    fontWeight: "600",
  },

  commentCard: {
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
  },

  commentAuthor: {
    fontSize: 12,
    fontWeight: "700",
    marginBottom: 4,
  },

  commentText: {
    fontSize: 14,
    lineHeight: 20,
  },

  commentComposer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 8,
  },

  commentInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },

  commentSendBtn: {
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },

  commentSendText: {
    color: "#fff",
    fontWeight: "700",
  },
});