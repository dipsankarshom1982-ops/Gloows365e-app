import { useTheme } from "@/context/ThemeContext";
import { streamPlaybackUrl } from "@/lib/cloudflareStream";
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

// ─── Comment presets ──────────────────────────────────────────
const COMMENT_GROUPS = [
  { title: "Encouragement",    options: ["Very good", "Keep it up", "Well done"] },
  { title: "Skill Praise",     options: ["Excellent work", "Super effort", "Amazing skill"] },
  { title: "Learning Support", options: ["Good try", "Nice learning", "You are improving"] },
];

const { height } = Dimensions.get("window");

type PostStatus = "pending" | "in_review" | "approved" | "rejected";

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
  status?: PostStatus;
  createdAt?: any;
};

// ─── Status watermark ─────────────────────────────────────────
const WATERMARK_CONFIG: Partial<Record<PostStatus, { label: string; emoji: string; bg: string }>> = {
  pending:   { label: "PENDING REVIEW", emoji: "⏳", bg: "rgba(243,156,18,0.82)" },
  in_review: { label: "IN REVIEW",      emoji: "🔍", bg: "rgba(52,152,219,0.82)"  },
  rejected:  { label: "REJECTED",       emoji: "❌", bg: "rgba(231,76,60,0.82)"   },
};

function StatusWatermark({ status }: { status?: PostStatus }) {
  if (!status) return null;
  const cfg = WATERMARK_CONFIG[status];
  if (!cfg) return null;
  return (
    <View style={wm.wrapper} pointerEvents="none">
      <View style={wm.dim} />
      <View style={[wm.banner, { backgroundColor: cfg.bg }]}>
        <Text style={wm.bannerText}>{cfg.emoji}  {cfg.label}</Text>
      </View>
    </View>
  );
}

const wm = StyleSheet.create({
  wrapper: { ...StyleSheet.absoluteFillObject, overflow: "hidden" },
  dim:     { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.38)" },
  banner: {
    position: "absolute", top: 36, left: -48,
    width: 220, paddingVertical: 6, alignItems: "center",
    transform: [{ rotate: "-35deg" }],
  },
  bannerText: { color: "#fff", fontSize: 11, fontWeight: "900", letterSpacing: 0.8 },
});

// ─── CF readiness check ──────────────────────────────────────
const WORKER_URL = process.env.EXPO_PUBLIC_CF_WORKER_URL ?? "";

function extractCfVideoId(url: string): string | null {
  const match = url?.match(/cloudflarestream\.com\/([a-zA-Z0-9]+)\//);
  return match?.[1] ?? null;
}

// Polls worker /video-status?uid=xxx until readyToStream = true.
// Worker calls CF Stream API which is the authoritative source.
async function waitForManifest(
  manifestUrl: string,
  onAttempt:   (attempt: number, max: number) => void,
  intervalMs = 10_000,
  maxAttempts = 30
): Promise<boolean> {
  const videoId = extractCfVideoId(manifestUrl);
  if (!videoId) {
    console.log("[CF-poll] could not extract videoId from:", manifestUrl);
    return false;
  }

  // Use worker status API — avoids CORS issues with direct manifest fetch
  const statusUrl = WORKER_URL
    ? `${WORKER_URL}/video-status?uid=${videoId}`
    : null;

  console.log("[CF-poll] videoId:", videoId);
  console.log("[CF-poll] statusUrl:", statusUrl?.slice(0, 80));

  for (let i = 1; i <= maxAttempts; i++) {
    onAttempt(i, maxAttempts);
    try {
      if (statusUrl) {
        const res  = await fetch(statusUrl);
        console.log(`[CF-poll] attempt ${i}/${maxAttempts} → worker HTTP ${res.status}`);

        if (res.status === 200) {
          const data = await res.json().catch(() => ({}));
          console.log(`[CF-poll] state: ${data.state} readyToStream: ${data.readyToStream}`);
          if (data.readyToStream === true || data.state === "ready") {
            console.log("[CF-poll] ✅ video ready");
            return true;
          }
        } else if (res.status === 404) {
          // Worker /video-status not deployed yet — fall through to manifest probe
          console.log("[CF-poll] worker /video-status not found, probing manifest...");
          const mRes = await fetch(manifestUrl, { method: "GET" });
          console.log(`[CF-poll] manifest HTTP ${mRes.status}`);
          if (mRes.status === 200) return true;
        }
      } else {
        const res = await fetch(manifestUrl, { method: "GET" });
        console.log(`[CF-poll] attempt ${i}/${maxAttempts} → manifest HTTP ${res.status}`);
        if (res.status === 200) return true;
      }
    } catch (e) {
      console.log(`[CF-poll] attempt ${i} error:`, e);
    }
    // Wait before next attempt (skip wait on last attempt)
    if (i < maxAttempts) {
      await new Promise((r) => setTimeout(r, intervalMs));
    }
  }
  return false;
}

// ─── Main Screen ──────────────────────────────────────────────
export default function Reels() {
  const { colors }  = useTheme();
  const navigation  = useNavigation();
  const params      = useLocalSearchParams<{ index?: string; postId?: string }>();

  const [approvedReels,   setApprovedReels]   = useState<Post[]>([]);
  const [ownPendingReels, setOwnPendingReels] = useState<Post[]>([]);
  const [lastDoc,         setLastDoc]         = useState<any>(null);
  const [loadingMore,     setLoadingMore]     = useState(false);
  const [currentIndex,    setCurrentIndex]    = useState(0);
  const [paused,          setPaused]          = useState(false);
  const [ready,           setReady]           = useState(false);

  const flatListRef = useRef<FlatList>(null);
  const viewed      = useRef(new Set<string>());
  const hasScrolled = useRef(false);

  // Deduplicate by id — prevents duplicate key warning when tapped post
  // is both prepended by fetchAndPrepend AND present in approvedReels snapshot
  const videos = (() => {
    const seen = new Set<string>();
    return [...ownPendingReels, ...approvedReels].filter((v) => {
      if (seen.has(v.id)) return false;
      seen.add(v.id);
      return true;
    });
  })();

  // ── Load reels ────────────────────────────────────────────
  useEffect(() => {
    const loadReels = async () => {
      if (params.postId) {
        // Step 1: Load the tapped post immediately so it shows first
        try {
          const snap = await getDoc(doc(db, "posts", params.postId as string));
          if (snap.exists()) {
            const tapped: Post = { id: snap.id, ...(snap.data() as Omit<Post, "id">) };
            setApprovedReels([tapped]);
            setReady(true);
            setCurrentIndex(0);
            hasScrolled.current = true;
          }
        } catch (e) {
          console.log("load tapped post:", e);
        }

        // Step 2: Load the rest of the feed in background
        // Tapped post stays at index 0, feed appends after it
        const q = query(
          collection(db, "posts"),
          where("postType", "==", "reel"),
          where("status",   "==", "approved"),
          orderBy("createdAt", "desc"),
          limit(10)
        );
        const feedSnap = await getDocs(q);
        const feedPosts: Post[] = feedSnap.docs
          .map((d) => ({ id: d.id, ...(d.data() as Omit<Post, "id">) }))
          .filter((p) => p.id !== params.postId); // exclude tapped post (already at 0)
        setApprovedReels((prev) => {
          const tapped = prev[0]; // keep tapped post at index 0
          return tapped ? [tapped, ...feedPosts] : feedPosts;
        });
        setLastDoc(feedSnap.docs[feedSnap.docs.length - 1] ?? null);
        return;
      }

      // Normal feed — no postId
      const q = query(
        collection(db, "posts"),
        where("postType", "==", "reel"),
        where("status",   "==", "approved"),
        orderBy("createdAt", "desc"),
        limit(10)
      );
      const unsub = onSnapshot(q, (snap) => {
        setApprovedReels(
          snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Post, "id">) }))
        );
        setLastDoc(snap.docs[snap.docs.length - 1] ?? null);
      });
      return () => unsub();
    };

    loadReels();
  }, [params.postId]);

  // ── Own pending / in-review reels ──────────────────────────
  useEffect(() => {
    let unsubQuery: (() => void) | null = null;
    const unsubAuth = auth.onAuthStateChanged((user) => {
      if (unsubQuery) { unsubQuery(); unsubQuery = null; }
      if (!user) { setOwnPendingReels([]); return; }
      const q = query(collection(db, "posts"), where("userId", "==", user.uid));
      unsubQuery = onSnapshot(q, (snap) => {
        setOwnPendingReels(
          snap.docs
            .filter((d) => {
              const data = d.data();
              return data.postType === "reel" && data.status !== "approved";
            })
            .map((d) => ({ id: d.id, ...(d.data() as Omit<Post, "id">) }))
            .sort((a, b) => (b.createdAt?.toMillis?.() || 0) - (a.createdAt?.toMillis?.() || 0))
        );
      }, () => setOwnPendingReels([]));
    });
    return () => { unsubAuth(); if (unsubQuery) unsubQuery(); };
  }, []);

  // ── Scroll to index on first load ──────────────────────────
  useEffect(() => {
    if (videos.length === 0 || hasScrolled.current) return;

    let target = 0;

    if (params.postId) {
      // Find the tapped post in the loaded list
      const found = videos.findIndex((v) => v.id === params.postId);
      target = found >= 0 ? found : 0;
    } else if (params.index) {
      target = Math.min(Math.max(parseInt(params.index, 10) || 0, 0), videos.length - 1);
    }

    hasScrolled.current = true;
    setCurrentIndex(target);
    setReady(true);

    if (target === 0) return;

    const timer = setTimeout(() => {
      flatListRef.current?.scrollToIndex({ index: target, animated: false });
    }, 150);
    return () => clearTimeout(timer);
  }, [videos]);

  // ── Load more ──────────────────────────────────────────────
  const loadMore = async () => {
    if (!lastDoc || loadingMore) return;
    setLoadingMore(true);
    try {
      const q = query(
        collection(db, "posts"),
        where("postType", "==", "reel"),
        where("status",   "==", "approved"),
        orderBy("createdAt", "desc"),
        startAfter(lastDoc),
        limit(5)
      );
      const snap = await getDocs(q);
      setApprovedReels((prev) => [
        ...prev,
        ...snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Post, "id">) })),
      ]);
      setLastDoc(snap.docs[snap.docs.length - 1] ?? null);
    } catch (e) { console.log("loadMore:", e); }
    finally { setLoadingMore(false); }
  };

  // ── Engagement ─────────────────────────────────────────────
  const handleView = async (item: Post) => {
    if (viewed.current.has(item.id)) return;
    viewed.current.add(item.id);
    await updateDoc(doc(db, "posts", item.id), { views: increment(1) });
  };

  const handleLike = async (item: Post): Promise<boolean> => {
    const uid = auth.currentUser?.uid;
    if (!uid) return false;
    const likeRef = doc(db, "posts", item.id, "likes", uid);
    const snap    = await getDoc(likeRef);
    if (snap.exists()) {
      await deleteDoc(likeRef);
      await updateDoc(doc(db, "posts", item.id), { likes: increment(-1) });
      return false;
    }
    await setDoc(likeRef, { liked: true, userId: uid, createdAt: serverTimestamp() });
    await updateDoc(doc(db, "posts", item.id), { likes: increment(1) });
    return true;
  };

  const handleShare = async (item: Post) => {
    try {
      const deepLink = `vidya://post/${item.id}`;
      const result   = await Share.share({
        message: `${item.title || "Vidya Reel"}\n\n${item.description || ""}\n\nOpen in Vidya: ${deepLink}`.trim(),
        url:     deepLink,
      });
      if (result.action === Share.sharedAction) {
        await updateDoc(doc(db, "posts", item.id), { shares: increment(1) });
      }
    } catch (e) { console.log("share:", e); }
  };

  // ── Render ─────────────────────────────────────────────────
  const renderItem = ({ item, index }: { item: Post; index: number }) => {
    if (index !== 0 && index % 5 === 0) {
      return (
        <View style={[styles.adContainer, { height, backgroundColor: colors.background }]}>
          <Text style={[styles.adText, { color: colors.accent }]}>🔥 Sponsored Ad</Text>
        </View>
      );
    }
    return (
      <VideoItem
        item={item}
        isActive={ready && index === currentIndex}
        paused={paused}
        onPauseToggle={() => setPaused((p) => !p)}
        onLike={handleLike}
        onShare={handleShare}
        onView={handleView}
        navigation={navigation}
        colors={colors}
      />
    );
  };

  const getItemLayout = (_: any, index: number) => ({
    length: height, offset: height * index, index,
  });

  if (videos.length === 0) {
    return (
      <View style={[styles.emptyContainer, { backgroundColor: colors.background }]}>
        <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No videos available</Text>
        <TouchableOpacity
          style={[styles.uploadBtn, { backgroundColor: colors.accent }]}
          onPress={() => router.push("/skillbattle")}
        >
          <Text style={[styles.uploadBtnText, { color: colors.background }]}>Upload First Video ＋</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <>
      <FlatList
        ref={flatListRef}
        data={videos}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        pagingEnabled
        snapToInterval={height}
        snapToAlignment="start"
        decelerationRate="fast"
        disableIntervalMomentum
        getItemLayout={getItemLayout}
        initialNumToRender={1}
        maxToRenderPerBatch={2}
        windowSize={3}
        removeClippedSubviews
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        onMomentumScrollEnd={(e) => {
          setCurrentIndex(Math.round(e.nativeEvent.contentOffset.y / height));
        }}
        onScrollToIndexFailed={(info) => {
          setTimeout(() => {
            flatListRef.current?.scrollToIndex({
              index: Math.min(info.index, videos.length - 1), animated: false,
            });
          }, 300);
        }}
        showsVerticalScrollIndicator={false}
      />
      <TouchableOpacity
        style={[styles.backBtn, { backgroundColor: colors.accent }]}
        onPress={() => router.push("/(drawer)/(tabs)/home")}
      >
        <Text style={[styles.btnText, { color: colors.background }]}>⬅</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.createBtn, { backgroundColor: colors.accent }]}
        onPress={() => router.push("/skillbattle")}
      >
        <Text style={[styles.btnText, { color: colors.background }]}>＋</Text>
      </TouchableOpacity>
    </>
  );
}

// ─── VideoItem ────────────────────────────────────────────────
interface VideoItemProps {
  item: Post; isActive: boolean; paused: boolean;
  onPauseToggle: () => void;
  onLike:  (item: Post) => Promise<boolean>;
  onShare: (item: Post) => Promise<void>;
  onView:  (item: Post) => Promise<void>;
  navigation: any; colors: any;
}

// Processing states
type CfState = "checking" | "processing" | "ready" | "error";

function VideoItem({ item, isActive, paused, onPauseToggle, onLike, onShare, onView, navigation, colors }: VideoItemProps) {
  const scaleAnim   = useRef(new Animated.Value(0)).current;
  const watchStart  = useRef<number | null>(null);
  const isActiveRef = useRef(isActive);
  const isPausedRef = useRef(paused);
  useEffect(() => { isActiveRef.current = isActive; }, [isActive]);
  useEffect(() => { isPausedRef.current = paused;    }, [paused]);

  const [studentInfo,     setStudentInfo]     = useState<any>(null);
  const [liked,           setLiked]           = useState(false);
  const [commentsVisible, setCommentsVisible] = useState(false);
  const [comments,        setComments]        = useState<any[]>([]);
  const [commentText,     setCommentText]     = useState("");
  const [commentCount,    setCommentCount]    = useState(item.comments || 0);

  // Cloudflare processing state
  const [cfState,       setCfState]       = useState<CfState>("checking");
  const [pollAttempt,   setPollAttempt]   = useState(0);
  const [pollMax,       setPollMax]       = useState(20);
  const pollingRef      = useRef(false);

  const isOwner = auth.currentUser?.uid === item.userId;

  // Resolve playback URL — ALWAYS extract the video ID and rebuild
  // using streamPlaybackUrl() so the correct customer subdomain is used.
  // Never use the stored mediaUrl directly — it may have a stale/wrong subdomain.
  const playbackUrl = (() => {
    if (!item.mediaUrl) {
      console.log("[Player] mediaUrl is empty for post:", item.id);
      return null;
    }

    // Extract Cloudflare video ID from any cloudflarestream.com URL format:
    //   https://customer-XXXX.cloudflarestream.com/{videoId}/manifest/video.m3u8
    //   https://customer-XXXX.cloudflarestream.com/{videoId}/...
    const cfMatch = item.mediaUrl.match(
      /cloudflarestream\.com\/([a-zA-Z0-9]+)/
    );
    if (cfMatch?.[1]) {
      const url = streamPlaybackUrl(cfMatch[1]);
      console.log("[Player] videoId:", cfMatch[1], "→ HLS URL:", url);
      return url;
    }

    // videodelivery.net format (older CF URLs)
    const vdMatch = item.mediaUrl.match(
      /videodelivery\.net\/([a-zA-Z0-9]+)/
    );
    if (vdMatch?.[1]) {
      const url = streamPlaybackUrl(vdMatch[1]);
      console.log("[Player] videoId (vd):", vdMatch[1], "→ HLS URL:", url);
      return url;
    }

    // Plain video ID stored directly (no domain)
    if (/^[a-zA-Z0-9]{32}$/.test(item.mediaUrl.trim())) {
      const url = streamPlaybackUrl(item.mediaUrl.trim());
      console.log("[Player] plain videoId:", item.mediaUrl, "→ HLS URL:", url);
      return url;
    }

    console.log("[Player] unrecognised mediaUrl format:", item.mediaUrl);
    return item.mediaUrl;
  })();

  // ── Poll Cloudflare until manifest is ready ───────────────
  useEffect(() => {
    if (!playbackUrl || pollingRef.current) return;

    const poll = async () => {
      pollingRef.current = true;
      setCfState("checking");

      const ready = await waitForManifest(
        playbackUrl,
        (attempt, max) => {
          setPollAttempt(attempt);
          setPollMax(max);
          if (attempt > 1) setCfState("processing");
        },
        10_000,
        30
      );

      pollingRef.current = false;
      setCfState(ready ? "ready" : "error");
    };

    poll();
  }, [playbackUrl]);

  // Manual retry
  const retryPoll = () => {
    if (pollingRef.current) return;
    pollingRef.current = false;
    setCfState("checking");
    setPollAttempt(0);

    const poll = async () => {
      pollingRef.current = true;
      const ready = await waitForManifest(
        playbackUrl!,
        (attempt, max) => { setPollAttempt(attempt); setPollMax(max); setCfState("processing"); },
        10_000,
        30
      );
      pollingRef.current = false;
      setCfState(ready ? "ready" : "error");
    };
    poll();
  };

  // ── Video player ─────────────────────────────────────────
  // Always created so the SurfaceVideoView always has a stable player reference.
  // We pass null until CF is ready — player stays idle until source is set.
  const [playerReady, setPlayerReady] = useState(false);

  const player = useVideoPlayer(null, (p) => {
    p.loop = true;
  });

  // Set the source once CF confirms the manifest is ready
  useEffect(() => {
    if (cfState !== "ready" || !playbackUrl || !player) return;
    try {
      player.replace(playbackUrl);
    } catch (e) {
      console.log("[Player] replace error:", e);
    }
  }, [cfState, playbackUrl]);

  // Listen for player status
  useEffect(() => {
    if (!player) return;
    const sub = player.addListener("statusChange", ({ status }: { status: string }) => {
      console.log("[Player] statusChange:", status);
      if (status === "readyToPlay") {
        setPlayerReady(true);
        if (isActiveRef.current && !isPausedRef.current) {
          player.play();
          onView(item);
        }
      } else if (status === "error") {
        console.log("[Player] error. URL:", playbackUrl);
        setPlayerReady(false);
      }
    });
    return () => sub.remove();
  }, [player]);

  // Play/pause when active state changes
  useEffect(() => {
    if (!player || !playerReady) return;
    if (isActive && !paused) {
      watchStart.current = Date.now();
      player.play();
      onView(item);
    } else {
      player.pause();
      if (watchStart.current) {
        const watched = Math.floor((Date.now() - watchStart.current) / 1000);
        if (watched > 2) {
          updateDoc(doc(db, "posts", item.id), { watchTime: increment(watched) }).catch(() => {});
        }
        watchStart.current = null;
      }
    }
  }, [isActive, paused, playerReady]);

  // Student info
  useEffect(() => {
    if (!item.userId) return;
    getDoc(doc(db, "students", item.userId))
      .then((s) => { if (s.exists()) setStudentInfo(s.data()); })
      .catch(() => {});
  }, [item.userId]);

  // Like status
  useEffect(() => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;
    getDoc(doc(db, "posts", item.id, "likes", uid))
      .then((s) => setLiked(s.exists()))
      .catch(() => {});
  }, [item.id]);

  // Comments
  useEffect(() => {
    if (!commentsVisible) return;
    const q     = query(collection(db, "posts", item.id, "comments"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      setComments(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      setCommentCount(snap.size);
    });
    return () => unsub();
  }, [commentsVisible, item.id]);

  useEffect(() => { setCommentCount(item.comments || 0); }, [item.comments]);

  const handleLikePress = async () => {
    scaleAnim.setValue(0);
    Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }).start();
    setLiked(await onLike(item));
  };

  const handleAddComment = async () => {
    const uid = auth.currentUser?.uid;
    if (!uid || !commentText.trim()) return;
    try {
      await addDoc(collection(db, "posts", item.id, "comments"), {
        userId: uid, userName: auth.currentUser?.displayName || "Student",
        text: commentText.trim(), createdAt: serverTimestamp(),
      });
      await updateDoc(doc(db, "posts", item.id), { comments: increment(1) });
      setCommentText("");
    } catch (e) { console.log("comment:", e); }
  };

  // ── Processing overlay ────────────────────────────────────
  const renderProcessingOverlay = () => {
    if (cfState === "ready") return null;

    const isChecking   = cfState === "checking";
    const isProcessing = cfState === "processing";
    const isError      = cfState === "error";

    const progressPct = pollMax > 0 ? Math.round((pollAttempt / pollMax) * 100) : 0;

    return (
      <View style={styles.processingOverlay}>
        {/* Dark background so text is readable over the poster frame */}
        <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
          {/* subtle gradient backdrop */}
        </View>

        {isError ? (
          <>
            <Text style={styles.processingIcon}>😕</Text>
            <Text style={styles.processingTitle}>Processing taking longer than usual</Text>
            <Text style={styles.processingSubText}>
              Cloudflare Stream is still encoding this video.{"\n"}
              Check back in a few minutes.
            </Text>
            <TouchableOpacity style={styles.retryBtn} onPress={retryPoll}>
              <Text style={styles.retryBtnText}>↺  Check Again</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <Text style={styles.processingIcon}>{isChecking ? "🔄" : "⚙️"}</Text>
            <Text style={styles.processingTitle}>
              {isChecking ? "Checking video…" : "Video is processing…"}
            </Text>
            <Text style={styles.processingSubText}>
              {isChecking
                ? "Verifying Cloudflare Stream is ready"
                : `Usually takes 1–3 minutes after upload\nAttempt ${pollAttempt} of ${pollMax}`}
            </Text>

            {/* Progress dots */}
            {isProcessing && (
              <View style={styles.progressDots}>
                {Array.from({ length: Math.min(pollAttempt, 10) }).map((_, i) => (
                  <View
                    key={i}
                    style={[
                      styles.progressDot,
                      { backgroundColor: i < pollAttempt ? "#ff9f43" : "rgba(255,255,255,0.2)" },
                    ]}
                  />
                ))}
              </View>
            )}

            <Text style={styles.processingHint}>
              This video will auto-play when ready
            </Text>
          </>
        )}
      </View>
    );
  };

  return (
    <>
      <Pressable
        style={{ height }}
        onPress={cfState === "ready" ? onPauseToggle : undefined}
        onLongPress={cfState === "ready" ? handleLikePress : undefined}
      >
        {/* VideoView always rendered — player starts with null source */}
        <VideoView player={player} style={StyleSheet.absoluteFill} contentFit="cover" />

        {/* CF processing overlay */}
        {renderProcessingOverlay()}

        {/* Status watermark (owner only, non-approved) */}
        {isOwner && item.status !== "approved" && (
          <>
            <StatusWatermark status={item.status} />
            {WATERMARK_CONFIG[item.status as PostStatus] && (
              <View style={[styles.ownStatusBar, { backgroundColor: WATERMARK_CONFIG[item.status as PostStatus]!.bg }]}>
                <Text style={styles.ownStatusIcon}>{WATERMARK_CONFIG[item.status as PostStatus]!.emoji}</Text>
                <View style={styles.ownStatusInfo}>
                  <Text style={styles.ownStatusLabel}>{WATERMARK_CONFIG[item.status as PostStatus]!.label}</Text>
                  <Text style={styles.ownStatusSub}>Only visible to you · Auto-publishes when approved</Text>
                </View>
              </View>
            )}
          </>
        )}

        {/* Heart animation */}
        <Animated.View
          style={[styles.heart, { transform: [{ scale: scaleAnim }], opacity: scaleAnim }]}
          pointerEvents="none"
        >
          <Text style={{ fontSize: 80 }}>❤️</Text>
        </Animated.View>

        {/* Back button */}
        <TouchableOpacity
          style={[styles.back, { backgroundColor: `${colors.accent}20`, borderRadius: 8, padding: 8 }]}
          onPress={() => navigation.goBack()}
        >
          <Text style={{ fontSize: 18, color: colors.accent }}>⬅</Text>
        </TouchableOpacity>

        {/* Caption */}
        <View style={[styles.caption, { backgroundColor: `${colors.background}80` }]}>
          <Text style={[styles.username, { color: colors.text }]}>
            @{studentInfo?.name || item.name || "student"}
          </Text>
          <Text style={[styles.school, { color: colors.textSecondary }]}>
            {studentInfo?.school || item.school || ""}
          </Text>
          {item.title ? (
            <Text style={[styles.captionText, { color: colors.text }]}>{item.title}</Text>
          ) : null}
        </View>

        {/* Actions */}
        <View style={styles.actionStack}>
          <TouchableOpacity
            style={[styles.actionBtn, { backgroundColor: `${colors.accent}20` }]}
            onPress={handleLikePress}
          >
            <Text style={{ fontSize: 18, color: liked ? colors.accent : colors.text }}>
              ❤️ {item.likes || 0}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionBtn, { backgroundColor: `${colors.accent}20` }]}
            onPress={() => setCommentsVisible(true)}
          >
            <Text style={{ fontSize: 18, color: colors.text }}>💬 {commentCount}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionBtn, { backgroundColor: `${colors.accent}20` }]}
            onPress={() => onShare(item)}
          >
            <Text style={{ fontSize: 18, color: colors.text }}>📤 {item.shares || 0}</Text>
          </TouchableOpacity>
        </View>

        <Text style={[styles.views, {
          color: colors.accent,
          backgroundColor: `${colors.background}80`,
          paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6,
        }]}>
          👁️ {item.views || 0}
        </Text>
      </Pressable>

      {/* Comments modal */}
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
              keyExtractor={(c) => c.id}
              ListEmptyComponent={
                <Text style={[styles.modalEmpty, { color: colors.textSecondary }]}>No comments yet</Text>
              }
              renderItem={({ item: c }) => (
                <View style={[styles.commentCard, { backgroundColor: colors.card }]}>
                  <Text style={[styles.commentAuthor, { color: colors.accent }]}>{c.userName || "Student"}</Text>
                  <Text style={[styles.commentText,   { color: colors.text }]}>{c.text}</Text>
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
                placeholder="Pick a suggestion or type..."
                placeholderTextColor={colors.textSecondary}
                style={[styles.commentInput, {
                  backgroundColor: colors.card, color: colors.text, borderColor: colors.border,
                }]}
              />
              <TouchableOpacity
                style={[styles.commentSendBtn, { backgroundColor: colors.accent }]}
                onPress={handleAddComment}
              >
                <Text style={styles.commentSendText}>Send</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

// ─── Styles ───────────────────────────────────────────────────
const styles = StyleSheet.create({
  back: { position: "absolute", top: 50, left: 20 },

  ownStatusBar: {
    position: "absolute", bottom: 0, left: 0, right: 0,
    flexDirection: "row", alignItems: "center", gap: 10,
    paddingHorizontal: 16, paddingVertical: 10,
  },
  ownStatusIcon:  { fontSize: 22 },
  ownStatusInfo:  { flex: 1 },
  ownStatusLabel: { color: "#fff", fontSize: 13, fontWeight: "800" },
  ownStatusSub:   { color: "rgba(255,255,255,0.78)", fontSize: 11, marginTop: 1 },

  actionStack: { position: "absolute", right: 20, bottom: 128, gap: 12 },
  actionBtn:   { borderRadius: 8, paddingHorizontal: 10, paddingVertical: 8 },

  views: { position: "absolute", left: 10, bottom: 60, fontSize: 14, fontWeight: "600" },

  caption: {
    position: "absolute", bottom: 100, left: 10,
    paddingHorizontal: 8, paddingVertical: 6, borderRadius: 8, maxWidth: "75%",
  },
  username:    { fontWeight: "bold", fontSize: 14 },
  school:      { fontSize: 12, marginBottom: 4 },
  captionText: { marginTop: 4, fontSize: 13 },

  heart: { position: "absolute", top: "40%", left: "40%" },

  backBtn:   { position: "absolute", top: 50, left: 20, width: 50, height: 50, borderRadius: 25, justifyContent: "center", alignItems: "center", zIndex: 10, elevation: 8 },
  createBtn: { position: "absolute", top: 50, right: 20, width: 50, height: 50, borderRadius: 25, justifyContent: "center", alignItems: "center", zIndex: 10, elevation: 8 },
  btnText:   { fontSize: 24, fontWeight: "bold" },

  // Processing overlay
  processingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.82)",
    justifyContent:  "center",
    alignItems:      "center",
    gap:             10,
    paddingHorizontal: 32,
  },
  processingIcon:    { fontSize: 48, marginBottom: 4 },
  processingTitle:   { color: "#fff", fontSize: 16, fontWeight: "800", textAlign: "center" },
  processingSubText: { color: "rgba(255,255,255,0.6)", fontSize: 12, fontWeight: "500", textAlign: "center", lineHeight: 18 },
  processingHint:    { color: "rgba(255,159,67,0.8)", fontSize: 11, fontWeight: "600", marginTop: 4 },
  progressDots:      { flexDirection: "row", gap: 5, marginTop: 4 },
  progressDot:       { width: 8, height: 8, borderRadius: 4 },
  retryBtn:          { marginTop: 12, paddingHorizontal: 24, paddingVertical: 10, borderRadius: 20, backgroundColor: "rgba(255,255,255,0.15)", borderWidth: 1, borderColor: "rgba(255,255,255,0.3)" },
  retryBtnText:      { color: "#fff", fontSize: 14, fontWeight: "700" },

  adContainer: { justifyContent: "center", alignItems: "center" },
  adText:      { fontSize: 20, fontWeight: "700" },

  emptyContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyText:      { fontSize: 18, marginBottom: 20, fontWeight: "600" },
  uploadBtn:      { paddingHorizontal: 24, paddingVertical: 14, borderRadius: 12, elevation: 8 },
  uploadBtnText:  { fontWeight: "700", fontSize: 16 },

  modalBackdrop: { flex: 1, justifyContent: "flex-end", backgroundColor: "rgba(0,0,0,0.45)" },
  modalCard: { minHeight: "50%", maxHeight: "80%", borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 16 },
  modalHeader:   { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 12 },
  modalTitle:    { fontSize: 18, fontWeight: "700" },
  modalClose:    { fontSize: 14, fontWeight: "700" },
  modalEmpty:    { textAlign: "center", marginTop: 20 },
  suggestionTitle:      { fontSize: 13, fontWeight: "700", marginBottom: 8 },
  suggestionGroup:      { marginBottom: 10 },
  suggestionGroupTitle: { fontSize: 12, fontWeight: "700", marginBottom: 6 },
  suggestionWrap:       { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 8 },
  suggestionChip:       { borderWidth: 1, borderRadius: 999, paddingHorizontal: 12, paddingVertical: 8 },
  suggestionText:       { fontSize: 12, fontWeight: "600" },
  commentCard:   { borderRadius: 12, padding: 12, marginBottom: 10 },
  commentAuthor: { fontSize: 12, fontWeight: "700", marginBottom: 4 },
  commentText:   { fontSize: 14, lineHeight: 20 },
  commentComposer: { flexDirection: "row", alignItems: "center", gap: 10, marginTop: 8 },
  commentInput:    { flex: 1, borderWidth: 1, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10 },
  commentSendBtn:  { borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12 },
  commentSendText: { color: "#fff", fontWeight: "700" },
});