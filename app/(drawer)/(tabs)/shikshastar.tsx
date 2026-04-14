import Header from "@/components/header";
import {
  ContestCard,
  type ContestItem,
  getContestStatus,
} from "@/components/shikshastar/ContestCard";
import { useTheme } from "@/context/ThemeContext";
import { db } from "@/lib/firebase";
import { collection, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const TABS = ["Home", "Live", "Upcoming", "Completed"];

const normalizeStartTime = (startTime: unknown) => {
  if (
    startTime &&
    typeof startTime === "object" &&
    "toDate" in startTime &&
    typeof (startTime as { toDate: () => Date }).toDate === "function"
  ) {
    return (startTime as { toDate: () => Date }).toDate();
  }

  if (startTime instanceof Date) {
    return startTime;
  }

  if (typeof startTime === "string" || typeof startTime === "number") {
    return new Date(startTime);
  }

  return new Date();
};

const normalizeOptionalDate = (value: unknown) => {
  if (!value) {
    return undefined;
  }

  return normalizeStartTime(value);
};

export default function ShikshastarScreen() {
  const { colors, isDarkMode } = useTheme();
  const [activeTab, setActiveTab] = useState("Home");
  const [contests, setContests] = useState<ContestItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "contests"),
      (snapshot) => {
        const nextContests = snapshot.docs.map((contestDoc) => {
          const data = contestDoc.data();

          return {
            id: contestDoc.id,
            title: data.title || "Shikshastar 2026",
            sponsored: Boolean(data.sponsored),
            subject: data.subject || "All",
            startTime: normalizeStartTime(data.startTime),
            endTime: normalizeOptionalDate(data.endTime),
            prizePool: Number(data.prizePool || 0),
            totalSpots: Number(data.totalSpots || 1000),
            joinedCount: Number(data.joinedCount || 0),
            entryFee: Number(data.entryFee || 49),
            status: data.status,
            createdAt: normalizeOptionalDate(data.createdAt),
          } satisfies ContestItem;
        });

        setContests(nextContests);
        setLoadError(null);
        setIsLoading(false);
      },
      () => {
        setLoadError("Unable to load contests from Firebase.");
        setIsLoading(false);
      }
    );

    return unsubscribe;
  }, []);

  const filteredContests = contests.filter((contest) => {
    if (activeTab === "Home") return true;
    return getContestStatus(contest) === activeTab.toLowerCase();
  });

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: colors.background }]}
      edges={["top", "left", "right"]}
    >
      <View style={styles.container}>
        {/* 🔥 YOUR HEADER (ONLY ONCE) */}
        <Header />

        {/* 🔥 CHIPS */}
        <View style={styles.chipContainer}>
          {TABS.map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[
                styles.chip,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                },
                activeTab === tab && styles.activeChip,
                activeTab === tab && {
                  backgroundColor: colors.accent,
                  borderColor: colors.accent,
                },
              ]}
              onPress={() => setActiveTab(tab)}
            >
              <Text
                style={[
                  activeTab === tab
                    ? styles.activeChipText
                    : styles.chipText,
                  {
                    color: activeTab === tab
                      ? isDarkMode
                        ? colors.background
                        : "#ffffff"
                      : colors.textSecondary,
                  },
                ]}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* 🔥 LIST */}
        {isLoading ? (
          <View style={styles.stateContainer}>
            <ActivityIndicator size="large" color={colors.accent} />
            <Text style={[styles.stateText, { color: colors.textSecondary }]}>Loading contests...</Text>
          </View>
        ) : loadError ? (
          <View style={styles.stateContainer}>
            <Text style={[styles.stateText, { color: colors.textSecondary }]}>{loadError}</Text>
          </View>
        ) : (
          <FlatList
            data={filteredContests}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <ContestCard item={item} />}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.stateContainer}>
                <Text style={[styles.stateText, { color: colors.textSecondary }]}>No contests available right now.</Text>
              </View>
            }
          />
        )}
      </View>
    </SafeAreaView>
  );
}

/* 🎨 STYLES */
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#0B1020",
  },

  container: {
    flex: 1,
  },

  chipContainer: {
    flexDirection: "row",
    paddingHorizontal: 12,
    marginVertical: 10,
  },

  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
  },

  activeChip: {
    transform: [{ translateY: -1 }],
  },

  chipText: {
    fontSize: 13,
  },

  activeChipText: {
    fontWeight: "bold",
  },

  listContent: {
    paddingHorizontal: 12,
    paddingBottom: 20,
  },

  stateContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 40,
  },

  stateText: {
    fontSize: 14,
    marginTop: 12,
    textAlign: "center",
  },
});