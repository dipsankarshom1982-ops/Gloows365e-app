import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import SkillboardItem from "@/components/skillboard/SkillboardItem";
import TopSkillboard from "@/components/skillboard/TopSkillboard";

const TABS = ["Local", "District", "State", "India"];

export default function SkillBoardScreen() {
  const { user: authUser, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState("India");
  const [data, setData] = useState<any[]>([]);
  const [userLocation, setUserLocation] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const currentMonth = new Date().toISOString().slice(0, 7);

  // Fetch real user data from Firestore (non-blocking)
  useEffect(() => {
    if (authLoading) {
      return;
    }

    if (!authUser?.uid) {
      setError("User not authenticated");
      return;
    }

    const fetchUserLocation = async () => {
      try {
        const studentDoc = await getDoc(doc(db, "students", authUser.uid));
        if (studentDoc.exists()) {
          setUserLocation(studentDoc.data());
          setError(null);
        } else {
          // Don't show error - can still view India rankings
          console.warn("User profile not found for location filtering");
        }
      } catch (err: any) {
        console.error("Failed to fetch user location:", err);
        // Don't block leaderboard if location fetch fails
      }
    };

    fetchUserLocation();
  }, [authUser?.uid, authLoading]);

  const getQuery = () => {
    if (!userLocation) {
      return query(
        collection(db, "skillboard"),
        where("month", "==", currentMonth),
        orderBy("score", "desc")
      );
    }

    let filters: any[] = [where("month", "==", currentMonth)];

    if (activeTab === "Local") {
      filters.push(where("city", "==", userLocation.city));
    }

    if (activeTab === "District") {
      filters.push(where("district", "==", userLocation.district));
    }

    if (activeTab === "State") {
      filters.push(where("state", "==", userLocation.state));
    }

    if (activeTab === "India") {
      filters.push(where("country", "==", "India"));
    }

    return query(
      collection(db, "skillboard"),
      ...filters,
      orderBy("score", "desc")
    );
  };

  // Fetch leaderboard data (don't wait for userLocation)
  useEffect(() => {
    const q = getQuery();

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const list: any[] = [];
        snapshot.forEach((doc) => list.push({ id: doc.id, ...doc.data() }));
        setData(list);
        setLoading(false); // Data loaded, stop showing spinner
      },
      (err) => {
        console.error("Leaderboard query error:", err);
        setError("Failed to load leaderboard");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [activeTab, userLocation]);

  const top3 = data.slice(0, 3);

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text style={styles.loadingText}>Loading leaderboard...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.errorText}>⚠️ {error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* 🔥 Tabs */}
      <View style={styles.tabs}>
        {TABS.map((tab) => {
          const isLocationTab = tab !== "India";
          const isDisabled = isLocationTab && !userLocation;

          return (
            <TouchableOpacity
              key={tab}
              onPress={() => !isDisabled && setActiveTab(tab)}
              style={[
                styles.tab,
                activeTab === tab && styles.activeTab,
                isDisabled && styles.disabledTab,
              ]}
              disabled={isDisabled}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === tab && { color: "#fff" },
                  isDisabled && { opacity: 0.5 },
                ]}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* 🏆 Top 3 */}
      <TopSkillboard data={top3} />

      {/* 📊 List */}
      {data.length === 0 ? (
        <View style={[styles.centerContent, { marginTop: 40 }]}>
          <Text style={styles.emptyText}>📊 No leaderboard data yet</Text>
          <Text style={styles.emptySubtext}>
            Be the first to join the rankings!
          </Text>
        </View>
      ) : (
        <FlatList
          data={data.slice(3)}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => (
            <SkillboardItem item={item} index={index + 3} />
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f172a",
    paddingTop: 20,
  },

  centerContent: {
    justifyContent: "center",
    alignItems: "center",
  },

  tabs: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 16,
  },

  tab: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: "#1e293b",
  },

  activeTab: {
    backgroundColor: "#3b82f6",
  },

  disabledTab: {
    opacity: 0.5,
  },

  tabText: {
    color: "#94a3b8",
    fontWeight: "600",
  },

  loadingText: {
    color: "#94a3b8",
    marginTop: 16,
    fontSize: 14,
  },

  errorText: {
    color: "#ef4444",
    fontSize: 16,
    textAlign: "center",
    paddingHorizontal: 20,
  },

  emptyText: {
    color: "#e2e8f0",
    fontSize: 18,
    fontWeight: "600",
  },

  emptySubtext: {
    color: "#94a3b8",
    fontSize: 14,
    marginTop: 8,
  },
});