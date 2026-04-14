import { useTheme } from "@/context/ThemeContext";
import { auth, db } from "@/lib/firebase";
import { useRouter } from "expo-router";
import {
  doc,
  getDoc,
  runTransaction,
  serverTimestamp,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export type ContestItem = {
  id: string;
  title: string;
  sponsored?: boolean;
  subject?: string;
  startTime: Date | string;
  endTime?: Date | string;
  prizePool?: number;
  totalSpots?: number;
  joinedCount?: number;
  entryFee?: number;
  status?: "upcoming" | "live" | "completed";
  createdAt?: Date | string;
};

/* 🔥 CONTEST CARD */
export const ContestCard = ({ item }: { item: ContestItem }) => {
  const { colors } = useTheme();
  const router = useRouter();
  const isSponsored = item.sponsored;
  const contestStatus = getContestStatus(item);
  const isLive = contestStatus === "live";

  const [hasJoined, setHasJoined] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadParticipation = async () => {
      if (!auth.currentUser) {
        setHasJoined(false);
        return;
      }

      const participationRef = doc(
        db,
        "contestParticipants",
        `${auth.currentUser.uid}_${item.id}`
      );
      const participationSnap = await getDoc(participationRef);
      setHasJoined(participationSnap.exists());
    };

    loadParticipation();
  }, [item.id]);

  const totalSpots = item.totalSpots || 1000;
  const joined = item.joinedCount || 0;
  const effectiveJoined = hasJoined ? Math.max(joined, 1) : joined;
  const spotsLeft = Math.max(totalSpots - effectiveJoined, 0);
  const challengeName = item.title || "Skill Challenge";
  const challengeCategory = item.subject || "Other";

  const progress = Math.min(effectiveJoined / totalSpots, 1);

  const openCreatePost = () => {
    router.push({
      pathname: "/create-post",
      params: {
        challengeId: item.id,
        challengeName,
        category: challengeCategory,
        caption: "Skill Battle",
      },
    });
  };

  const openContest = () => {
    router.push({
      pathname: "/contest/[id]",
      params: { id: item.id },
    });
  };

  const handleJoin = async () => {
    if (!auth.currentUser) {
      Alert.alert("Login required", "Please log in to join this contest.");
      return;
    }

    if (hasJoined) {
      openContest();
      return;
    }

    try {
      setIsSubmitting(true);
      await runTransaction(db, async (transaction) => {
        const contestRef = doc(db, "contests", item.id);
        const participantRef = doc(
          db,
          "contestParticipants",
          `${auth.currentUser?.uid}_${item.id}`
        );
        const userRef = doc(db, "users", auth.currentUser!.uid);
        const studentRef = doc(db, "students", auth.currentUser!.uid);

        const [contestSnap, participantSnap, userSnap, studentSnap] = await Promise.all([
          transaction.get(contestRef),
          transaction.get(participantRef),
          transaction.get(userRef),
          transaction.get(studentRef),
        ]);

        if (!contestSnap.exists()) {
          throw new Error("contest-not-found");
        }

        if (participantSnap.exists()) {
          return;
        }

        const contestData = contestSnap.data();
        const currentJoinedCount = Number(contestData.joinedCount || 0);
        const contestTotalSpots = Number(contestData.totalSpots || totalSpots);
        const contestIsSponsored = Boolean(contestData.sponsored);
        const contestEntryFee = Number(contestData.entryFee || item.entryFee || 0);
        const contestStatus = getContestStatus({
          startTime: contestData.startTime?.toDate?.() || item.startTime,
          endTime: contestData.endTime?.toDate?.() || item.endTime,
          status: contestData.status,
        });

        if (contestStatus === "completed") {
          throw new Error("contest-completed");
        }

        if (currentJoinedCount >= contestTotalSpots) {
          throw new Error("contest-full");
        }

        const walletCoins = Number(
          userSnap.data()?.coins ?? studentSnap.data()?.stats?.coins ?? 0
        );

        if (!contestIsSponsored && walletCoins < contestEntryFee) {
          throw new Error("insufficient-coins");
        }

        const nextCoins = contestIsSponsored
          ? walletCoins
          : walletCoins - contestEntryFee;

        transaction.set(participantRef, {
          contestId: item.id,
          userId: auth.currentUser!.uid,
          joinedAt: serverTimestamp(),
          score: 0,
          rank: null,
          status: "joined",
        });

        transaction.update(contestRef, {
          joinedCount: currentJoinedCount + 1,
          updatedAt: serverTimestamp(),
        });

        transaction.set(
          userRef,
          {
            role: "student",
            roles: ["student"],
            coins: nextCoins,
            updatedAt: serverTimestamp(),
          },
          { merge: true }
        );

        if (studentSnap.exists()) {
          transaction.update(studentRef, {
            "stats.coins": nextCoins,
            updatedAt: serverTimestamp(),
          });
        }
      });

      setHasJoined(true);
      openContest();
    } catch (error) {
      const message =
        error instanceof Error && error.message === "contest-full"
          ? "This contest is already full."
          : error instanceof Error && error.message === "insufficient-coins"
            ? `You need ${item.entryFee || 0} coins to join this contest.`
            : error instanceof Error && error.message === "contest-completed"
              ? "This contest has already ended."
              : error instanceof Error && error.message === "contest-not-found"
                ? "This contest is no longer available."
                : "Unable to save your participation right now.";

      Alert.alert("Join failed", message);
      console.log("Error joining contest:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: colors.card, borderColor: colors.border },
      ]}
    >
      {/* 🔴 LIVE BADGE */}
      {isLive && (
        <View style={styles.liveBadge}>
          <Text style={styles.liveText}>LIVE</Text>
        </View>
      )}

      {/* 🏆 TITLE */}
      <Text style={[styles.title, { color: colors.text }]}>
        {isSponsored ? item.title : "Shikshastar 2026"}
      </Text>

      {/* 📚 SUBJECT */}
      <Text style={[styles.subText, { color: colors.textSecondary }]}>Subject: {item.subject}</Text>

      {/* ⏱ TIMER */}
      <Text style={[styles.timer, { color: colors.accent }]}>
        {getCountdown(item.startTime)}
      </Text>

      {/* 🏆 PRIZE ROW */}
      <View style={styles.row}>
        <Text style={[styles.prizeLabel, { color: colors.textSecondary }]}>Prize Pool</Text>
        <Text style={[styles.prize, { color: colors.accent }]}>₹{item.prizePool}</Text>
      </View>

      {/* 📊 PROGRESS BAR */}
      <View style={[styles.progressContainer, { backgroundColor: colors.border }]}>
        <View
          style={[
            styles.progressFill,
            {
              width: `${progress * 100}%`,
              backgroundColor: colors.accent,
            },
          ]}
        />
      </View>

      {/* 👥 SPOTS */}
      <View style={styles.row}>
        <Text style={[styles.spotsLeft, { color: colors.accent }]}>{spotsLeft} spots left</Text>
        <Text style={[styles.totalSpots, { color: colors.textSecondary }]}>{totalSpots} spots</Text>
      </View>

      {/* 💰 ENTRY + BUTTON */}
      <View style={styles.bottomRow}>
        <Text style={[styles.entryFee, { color: colors.accent }]}>
          {isSponsored ? "FREE" : `${item.entryFee || 49} Coins`}
        </Text>

        <TouchableOpacity
          style={[
            styles.joinBtn,
            hasJoined && styles.joinedBtn,
          ]}
          onPress={handleJoin}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.joinText}>
              {hasJoined
                ? contestStatus === "completed"
                  ? "View Result"
                  : contestStatus === "live"
                    ? "Start Quiz"
                    : "View Contest"
                : isSponsored
                  ? "Join Now"
                  : "Join"}
            </Text>
          )}
        </TouchableOpacity>
      </View>

      {hasJoined && (
        <TouchableOpacity onPress={openCreatePost} style={styles.secondaryAction}>
          <Text style={[styles.secondaryActionText, { color: colors.textSecondary }]}>
            Create challenge post
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

/* 🔥 STATUS */
export const getContestStatus = ({
  startTime,
  endTime,
  status,
}: Pick<ContestItem, "startTime" | "endTime" | "status">) => {
  if (status === "upcoming" || status === "live" || status === "completed") {
    return status;
  }

  const now = Date.now();
  const start = new Date(startTime).getTime();
  const end = endTime ? new Date(endTime).getTime() : Number.POSITIVE_INFINITY;

  if (now < start) return "upcoming";
  if (now <= end) return "live";

  return "completed";
};

/* 🔥 COUNTDOWN */
const getCountdown = (startTime: ContestItem["startTime"]) => {
  const diff = new Date(startTime).getTime() - Date.now();

  if (diff <= 0) return "🔥 Live Now";

  const mins = Math.floor(diff / 60000);
  const hrs = Math.floor(mins / 60);

  return `Starts in ${hrs}h ${mins % 60}m`;
};

/* 🎨 DREAM11 STYLE */
const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
  },

  liveBadge: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "#DC2626",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },

  liveText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
  },

  title: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 4,
  },

  subText: {
    fontSize: 13,
  },

  timer: {
    fontSize: 13,
    marginTop: 4,
    fontWeight: "600",
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },

  prizeLabel: {
    fontSize: 12,
  },

  prize: {
    fontWeight: "bold",
    fontSize: 15,
  },

  progressContainer: {
    height: 6,
    borderRadius: 10,
    marginTop: 10,
    overflow: "hidden",
  },

  progressFill: {
    height: "100%",
  },

  spotsLeft: {
    fontSize: 12,
    marginTop: 4,
  },

  totalSpots: {
    fontSize: 12,
    marginTop: 4,
  },

  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
  },

  entryFee: {
    fontWeight: "700",
  },

  joinBtn: {
    backgroundColor: "#2563EB",
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 8,
  },

  joinedBtn: {
    backgroundColor: "#16A34A",
  },

  secondaryAction: {
    marginTop: 10,
    alignSelf: "flex-end",
  },

  secondaryActionText: {
    fontSize: 12,
    fontWeight: "600",
  },

  joinText: {
    color: "#fff",
    fontWeight: "700",
  },
});