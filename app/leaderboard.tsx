import { useEffect, useState } from "react";
import {
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import { listenLeaderboard } from "@/lib/listenLeaderboard";

// 🔥 MOCK USER (replace with auth user)
const user = {
  uid: "uid_123",
  stateCode: "TR",
  districtKey: "west_tripura",
};

export default function LeaderboardScreen() {
  const [data, setData] = useState<any[]>([]);
  const [tab, setTab] = useState("daily");
  const [scope, setScope] = useState("country");

  // 🔥 LISTENER
  useEffect(() => {
    const value =
      scope === "state"
        ? user.stateCode
        : scope === "district"
        ? user.districtKey
        : null;

    const unsub = listenLeaderboard(tab, scope, value, setData);

    return () => unsub();
  }, [tab, scope]);

  // 🧠 SPLIT DATA
  const podium = data.slice(0, 3);
  const rest = data.slice(3);

  // 👤 MY DATA
  const myIndex = data.findIndex((u) => u.userId === user.uid);
  const myData = data[myIndex];

  const gap =
    myIndex > 0 ? data[myIndex - 1]?.points - myData?.points : 0;

  return (
    <View style={styles.container}>
      {/* 🔥 TABS */}
      <View style={styles.tabs}>
        {["daily", "weekly", "monthly", "yearly"].map((t) => (
          <TouchableOpacity
            key={t}
            onPress={() => setTab(t)}
            style={[styles.tab, tab === t && styles.activeTab]}
          >
            <Text style={styles.tabText}>{t.toUpperCase()}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* 🔥 SCOPE */}
      <View style={styles.scopes}>
        {["country", "state", "district"].map((s) => (
          <TouchableOpacity
            key={s}
            onPress={() => setScope(s)}
            style={[styles.scope, scope === s && styles.activeScope]}
          >
            <Text style={styles.scopeText}>{s}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* 🏆 PODIUM */}
      <View style={styles.podium}>
        {podium.map((u) => (
          <View key={u.userId} style={styles.podItem}>
            <Text style={styles.rank}>#{u.rank}</Text>
            <Text style={styles.name}>{u.name}</Text>
            <Text style={styles.points}>{u.points}</Text>
          </View>
        ))}
      </View>

      {/* 📊 LIST */}
      <FlatList
        data={rest}
        keyExtractor={(item) => item.userId}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Text style={styles.rank}>#{item.rank}</Text>

            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.sub}>
                {item.state} · Class {item.class}
              </Text>
            </View>

            <Text style={styles.points}>{item.points}</Text>

            <Text style={styles.trend}>
              {item.trend === "up"
                ? "▲"
                : item.trend === "down"
                ? "▼"
                : "—"}
            </Text>
          </View>
        )}
      />

      {/* 👤 YOU */}
      {myData && (
        <View style={styles.meBox}>
          <Text style={styles.meText}>
            You: #{myData.rank} · {myData.points} pts
          </Text>
          {gap > 0 && (
            <Text style={styles.gapText}>
              {gap} pts to next rank
            </Text>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
    backgroundColor: "#fff",
  },

  tabs: {
    flexDirection: "row",
    marginBottom: 10,
  },
  tab: {
    flex: 1,
    padding: 8,
    borderWidth: 1,
    alignItems: "center",
    borderRadius: 6,
    marginHorizontal: 2,
  },
  activeTab: {
    backgroundColor: "#000",
  },
  tabText: {
    fontSize: 12,
    color: "#000",
  },

  scopes: {
    flexDirection: "row",
    marginBottom: 10,
  },
  scope: {
    flex: 1,
    padding: 6,
    borderWidth: 1,
    alignItems: "center",
    borderRadius: 6,
    marginHorizontal: 2,
  },
  activeScope: {
    backgroundColor: "#dfffe0",
  },
  scopeText: {
    fontSize: 12,
  },

  podium: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 15,
  },
  podItem: {
    alignItems: "center",
  },

  row: {
    flexDirection: "row",
    padding: 10,
    borderBottomWidth: 0.5,
    alignItems: "center",
  },

  rank: {
    width: 40,
    fontWeight: "bold",
  },

  name: {
    fontSize: 14,
    fontWeight: "500",
  },

  sub: {
    fontSize: 11,
    color: "#777",
  },

  points: {
    width: 70,
    textAlign: "right",
    fontWeight: "600",
  },

  trend: {
    width: 30,
    textAlign: "center",
  },

  meBox: {
    padding: 12,
    backgroundColor: "#eaffea",
    borderRadius: 8,
    marginTop: 10,
  },

  meText: {
    fontWeight: "600",
  },

  gapText: {
    fontSize: 12,
    color: "#555",
  },
});