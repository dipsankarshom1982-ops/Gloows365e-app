import { useTheme } from "@/context/ThemeContext";
import { db } from "@/lib/firebase";
import { useRouter } from "expo-router";
import { VideoView, useVideoPlayer } from "expo-video";
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated, {
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

interface BannerData {
  title: string;
  caption: string;
  month: string;
  rewards: string;
  age: string;
  endDate: string;
  videoUrl: string;
}

export default function SkillBattleBanner() {
  const { colors } = useTheme();
  const router = useRouter();

  const [banner, setBanner] = useState<BannerData | null>(null);
  const [participants, setParticipants] = useState(0);
  const [leaders, setLeaders] = useState<any[]>([]);
  const [timeLeft, setTimeLeft] = useState("");

  const glow = useSharedValue(0);

  // ✅ ALWAYS HOOK AT TOP
  const videoUrl = banner?.videoUrl ?? "";

  const player = useVideoPlayer(videoUrl, (player) => {
    if (videoUrl) {
      player.loop = true;
      player.muted = true;
      player.play();
    }
  });

  // 🔥 DATA FETCH
  useEffect(() => {
    fetchData();
    glow.value = withRepeat(withTiming(1, { duration: 1500 }), -1, true);
  }, []);

  // ⏳ TIMER
  useEffect(() => {
    if (!banner) return;

    const interval = setInterval(() => {
      const diff =
        new Date(banner.endDate).getTime() - new Date().getTime();

      if (diff <= 0) {
        setTimeLeft("Ended");
        return;
      }

      const d = Math.floor(diff / (1000 * 60 * 60 * 24));
      const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const m = Math.floor((diff / (1000 * 60)) % 60);

      setTimeLeft(`${d}d ${h}h ${m}m`);
    }, 1000);

    return () => clearInterval(interval);
  }, [banner]);

  const fetchData = async () => {
    try {
      const bannerSnap = await getDocs(
        query(collection(db, "banners"), where("isActive", "==", true))
      );

      const bannerData = bannerSnap.docs[0]?.data();
      if (bannerData) setBanner(bannerData as BannerData);

      const usersSnap = await getDocs(collection(db, "skillboard"));
      setParticipants(usersSnap.size);

      const leaderSnap = await getDocs(
        query(
          collection(db, "skillboard"),
          orderBy("totalWatchtime", "desc"),
          limit(3)
        )
      );

      setLeaders(leaderSnap.docs.map((doc) => doc.data()));
    } catch (error) {
      console.log(error);
    }
  };

  const glowStyle = useAnimatedStyle(() => ({
    shadowOpacity: glow.value,
  }));

  if (!banner) return null;

  return (
    <Animated.View entering={FadeInDown.duration(800)}>
      <View style={styles.container}>
        
        {/* 🎥 VIDEO */}
        {videoUrl ? (
          <VideoView
            style={StyleSheet.absoluteFill}
            player={player}
            contentFit="cover"
          />
        ) : (
          <View style={[StyleSheet.absoluteFill, { backgroundColor: "#000" }]} />
        )}

        {/* OVERLAY */}
        <View style={styles.overlay} />

        {/* CONTENT */}
        <Text style={styles.title}>{banner.title}</Text>

        <Text style={styles.caption}>
          {banner.caption} • {banner.month}
        </Text>

        <Text style={styles.timer}>⏳ Ends in: {timeLeft}</Text>

        <Text style={styles.participants}>
          👥 {participants} Participants
        </Text>

        <View style={styles.leaderboard}>
          {leaders.map((l, i) => (
            <Text key={i} style={styles.leader}>
              #{i + 1} {l.userName}
            </Text>
          ))}
        </View>

        {/* BUTTON */}
        <Animated.View style={[styles.buttonWrap, glowStyle]}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push("/create-post")}
          >
            <Text style={styles.buttonText}>🚀 Participate Now</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Animated.View>
  );
}


const styles = StyleSheet.create({
  container: {
    height: 260,
    borderRadius: 20,
    overflow: "hidden",
    margin: 16,
    padding: 16,
    justifyContent: "flex-end",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  title: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  caption: {
    color: "#ccc",
    fontSize: 12,
  },
  timer: {
    color: "#FDE68A",
    marginTop: 6,
  },
  participants: {
    color: "#93C5FD",
    marginTop: 4,
  },
  leaderboard: {
    marginTop: 8,
  },
  leader: {
    color: "#fff",
    fontSize: 12,
  },
  buttonWrap: {
    marginTop: 10,
    shadowColor: "#6366F1",
    shadowRadius: 10,
    elevation: 10,
  },
  button: {
    backgroundColor: "#6366F1",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
  },

  // ✅ ADD THIS (FIX)
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
});