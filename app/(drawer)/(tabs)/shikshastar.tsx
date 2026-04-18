// app/(drawer)/(tabs)/shikshastar.tsx

import { useContests } from "@/hooks/useContests";
import { useUserContests } from "@/hooks/useUserContests";
import { joinContest } from "@/services/joinContest";
import { useRouter } from "expo-router";
import { getAuth } from "firebase/auth";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// 🔥 Contest state (time-based)
const getContestState = (contest: any) => {
  const now = new Date();
  const start = new Date(contest.startTime);
  const end = new Date(contest.endTime);

  if (now < start) return "upcoming";
  if (now >= start && now <= end) return "live";
  return "completed";
};

// 🔥 Contest Card
const ContestCard = ({ item, joined, completed }: any) => {
  const router = useRouter();
  const state = getContestState(item);

  const userId = getAuth().currentUser?.uid;

  const isJoined = joined[item.id];
  const isCompleted = completed[item.id];

  const handleJoin = async () => {
    try {
      if (!userId) {
        Alert.alert("Login Required", "Please login first");
        return;
      }

      await joinContest(userId, item);

      Alert.alert("Success", "Joined successfully!");
    } catch (err: any) {
      Alert.alert("Error", err.message);
    }
  };

  const handleParticipate = () => {
    router.push({
      pathname: "../contest/video",
      params: { contestId: item.id },
    });
  };

  const handleResult = () => {
    router.push({
      pathname: "../contest/result",
      params: { contestId: item.id },
    });
  };

  return (
    <View
      style={{
        backgroundColor: "#fff",
        padding: 15,
        marginBottom: 10,
        borderRadius: 12,
        elevation: 3,
      }}
    >
      <Text style={{ fontSize: 16, fontWeight: "bold" }}>
        {item.title}
      </Text>

      <Text>Subject: {item.subject}</Text>
      <Text>Prize: {item.prizePool}</Text>
      <Text>Joined: {item.joinedCount}</Text>

      {/* 🔵 COMPLETED */}
      {isCompleted && (
        <TouchableOpacity onPress={handleResult}>
          <Text style={{ color: "blue", marginTop: 8 }}>
            📊 View Result
          </Text>
        </TouchableOpacity>
      )}

      {/* 🟢 LIVE */}
      {!isCompleted && state === "live" && (
        <>
          {!isJoined ? (
            <TouchableOpacity onPress={handleJoin}>
              <Text style={{ color: "green", marginTop: 8 }}>
                ▶ Join Now
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={handleParticipate}>
              <Text style={{ color: "green", marginTop: 8 }}>
                ▶ Participate Now
              </Text>
            </TouchableOpacity>
          )}
        </>
      )}

      {/* 🟡 UPCOMING (ONLY IF JOINED) */}
      {!isCompleted && state === "upcoming" && isJoined && (
        <Text style={{ color: "orange", marginTop: 8 }}>
          ⏳ Starts Soon
        </Text>
      )}
    </View>
  );
};

// 🔥 Section
const Section = ({ title, data, joined, completed }: any) => {
  if (!data.length) return null;

  return (
    <View style={{ marginBottom: 20 }}>
      <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>
        {title}
      </Text>

      {data.map((item: any) => (
        <ContestCard
          key={item.id}
          item={item}
          joined={joined}
          completed={completed}
        />
      ))}
    </View>
  );
};

// 🔥 MAIN SCREEN
export default function ShikshastarScreen() {
  const { live, upcoming, completed: allCompleted, loading } = useContests();

  const userId = getAuth().currentUser?.uid;
  const { joined, completed } = useUserContests(userId || "");

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: "center" }}>
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  // 🔥 FINAL FILTERING

  const liveContests = live;

  const upcomingContests = upcoming.filter((c: any) => joined[c.id]);

  const completedContests = allCompleted.filter(
    (c: any) => completed[c.id]
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={{ padding: 12, paddingBottom: 30 }}
        showsVerticalScrollIndicator={false}
      >
        <Section
          title="🔥 Live Contests"
          data={liveContests}
          joined={joined}
          completed={completed}
        />

        <Section
          title="🟡 Upcoming Contests"
          data={upcomingContests}
          joined={joined}
          completed={completed}
        />

        <Section
          title="🔵 Completed Contests"
          data={completedContests}
          joined={joined}
          completed={completed}
        />
      </ScrollView>
    </SafeAreaView>
  );
}