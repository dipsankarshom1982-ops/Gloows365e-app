// app/vcoins/wallet.tsx

import {
  formatVCoins,
  formatTransactionDate,
  getTransactionColor,
  getVCoinsSourceIcon,
  getVCoinsSourceIconBg,
  getVCoinsSourceIconColor,
  getVCoinsSourceLabel,
  getStatusColor,
} from "@/utils/formatVCoins";
import { VCoinTransaction } from "@/services/vCoinsService";
import { useVCoins } from "@/hooks/useVCoins";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import {
  ActivityIndicator,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type FilterTab = "ALL" | "EARNED" | "SPENT" | "PENDING";

const FILTER_TABS: { key: FilterTab; label: string }[] = [
  { key: "ALL",     label: "All" },
  { key: "EARNED",  label: "Earned" },
  { key: "SPENT",   label: "Spent" },
  { key: "PENDING", label: "Pending" },
];

const EARN_SOURCES = [
  { icon: "time-outline",         label: "Learning Time",  bg: "#EDE9FE", color: "#7C3AED" },
  { icon: "play-circle-outline",  label: "Watch Reels",    bg: "#FEF3C7", color: "#D97706" },
  { icon: "videocam-outline",     label: "Watch Videos",   bg: "#DBEAFE", color: "#2563EB" },
  { icon: "sparkles-outline",     label: "AI Guru",        bg: "#F0FDF4", color: "#16A34A" },
  { icon: "trophy-outline",       label: "SkillBattle",    bg: "#FEF9C3", color: "#CA8A04" },
];

import { useState } from "react";

export default function VCoinsWalletScreen() {
  const router  = useRouter();
  const insets  = useSafeAreaInsets();
  const { balance, lifetimeEarned, lifetimeSpent, thisMonthEarned, transactions, loading } = useVCoins();
  const [activeTab, setActiveTab] = useState<FilterTab>("ALL");

  const filtered = transactions.filter((tx) => {
    if (activeTab === "ALL")     return true;
    if (activeTab === "EARNED")  return tx.type === "CREDIT" && tx.status === "SUCCESS";
    if (activeTab === "SPENT")   return tx.type === "DEBIT";
    if (activeTab === "PENDING") return tx.status === "PENDING";
    return true;
  });

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#F59E0B" />
      </View>
    );
  }

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color="#111" />
        </TouchableOpacity>
        <Text style={styles.screenTitle}>V-Coins Wallet</Text>
        <View style={{ width: 36 }} />
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
        ListHeaderComponent={
          <View>
            {/* ── Balance Card ───────────────────────────────────────────── */}
            <LinearGradient
              colors={["#7C3AED", "#F59E0B"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.balanceCard}
            >
              <Text style={styles.balanceLabel}>V-Coins Balance</Text>
              <Text style={styles.balanceAmount}>
                {formatVCoins(balance ?? 0)}
              </Text>
              <View style={styles.statsRow}>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{formatVCoins(lifetimeEarned)}</Text>
                  <Text style={styles.statLabel}>Total Earned</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{formatVCoins(lifetimeSpent)}</Text>
                  <Text style={styles.statLabel}>Total Spent</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{formatVCoins(thisMonthEarned)}</Text>
                  <Text style={styles.statLabel}>This Month</Text>
                </View>
              </View>
            </LinearGradient>

            {/* ── Earn Section ───────────────────────────────────────────── */}
            <Text style={styles.sectionTitle}>Earn V-Coins</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.earnScroll}
            >
              {EARN_SOURCES.map((src) => (
                <View key={src.label} style={styles.earnCard}>
                  <View style={[styles.earnIconCircle, { backgroundColor: src.bg }]}>
                    <Ionicons name={src.icon as any} size={20} color={src.color} />
                  </View>
                  <Text style={styles.earnLabel}>{src.label}</Text>
                </View>
              ))}
            </ScrollView>

            {/* ── Filter Tabs ────────────────────────────────────────────── */}
            <Text style={styles.sectionTitle}>Transaction History</Text>
            <View style={styles.tabs}>
              {FILTER_TABS.map((tab) => (
                <TouchableOpacity
                  key={tab.key}
                  onPress={() => setActiveTab(tab.key)}
                  style={[styles.tab, activeTab === tab.key && styles.tabActive]}
                >
                  <Text style={[styles.tabText, activeTab === tab.key && styles.tabTextActive]}>
                    {tab.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        }
        renderItem={({ item }) => (
          <TransactionRow tx={item} onPress={() => router.push(`/vcoins/transaction-detail?id=${item.id}`)} />
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="wallet-outline" size={52} color="#D1D5DB" />
            <Text style={styles.emptyText}>No transactions yet</Text>
            <Text style={styles.emptySubText}>
              Start watching videos and learning to earn V-Coins!
            </Text>
          </View>
        }
      />
    </View>
  );
}

// ── Transaction Row ──────────────────────────────────────────────────────────

function TransactionRow({ tx, onPress }: { tx: VCoinTransaction; onPress: () => void }) {
  const amountColor  = getTransactionColor(tx.type, tx.status);
  const iconName     = getVCoinsSourceIcon(tx.source) as any;
  const iconBg       = getVCoinsSourceIconBg(tx.source);
  const iconColor    = getVCoinsSourceIconColor(tx.source);
  const statusColor  = getStatusColor(tx.status);
  const prefix       = tx.type === "CREDIT" ? "+" : "-";
  const dateStr      = formatTransactionDate(tx.createdAt);

  return (
    <TouchableOpacity onPress={onPress} style={styles.txRow} activeOpacity={0.7}>
      <View style={[styles.txIconCircle, { backgroundColor: iconBg }]}>
        <Ionicons name={iconName} size={20} color={iconColor} />
      </View>

      <View style={styles.txMid}>
        <Text style={styles.txTitle} numberOfLines={1}>{tx.title}</Text>
        <Text style={styles.txDate}>{dateStr}</Text>
      </View>

      <View style={styles.txRight}>
        <Text style={[styles.txAmount, { color: amountColor }]}>
          {prefix}{formatVCoins(tx.amount)}
        </Text>
        <View style={[styles.statusPill, { backgroundColor: `${statusColor}18` }]}>
          <Text style={[styles.statusText, { color: statusColor }]}>{tx.status}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

// ── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#F9FAFB" },

  centered: { flex: 1, alignItems: "center", justifyContent: "center" },

  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  backBtn:     { width: 36, alignItems: "flex-start" },
  screenTitle: { fontSize: 17, fontWeight: "700", color: "#111" },

  balanceCard: {
    margin: 16,
    borderRadius: 20,
    padding: 24,
  },
  balanceLabel:  { color: "rgba(255,255,255,0.8)", fontSize: 13, fontWeight: "600" },
  balanceAmount: { color: "#fff", fontSize: 40, fontWeight: "800", marginTop: 4, marginBottom: 20 },

  statsRow:    { flexDirection: "row", alignItems: "center" },
  statItem:    { flex: 1, alignItems: "center" },
  statValue:   { color: "#fff", fontWeight: "700", fontSize: 15 },
  statLabel:   { color: "rgba(255,255,255,0.75)", fontSize: 11, marginTop: 2 },
  statDivider: { width: 1, height: 32, backgroundColor: "rgba(255,255,255,0.25)" },

  sectionTitle: { fontSize: 15, fontWeight: "700", color: "#111", marginHorizontal: 16, marginTop: 8, marginBottom: 10 },

  earnScroll: { paddingHorizontal: 16, gap: 10 },
  earnCard:   { alignItems: "center", gap: 6, marginBottom: 12 },
  earnIconCircle: { width: 52, height: 52, borderRadius: 26, alignItems: "center", justifyContent: "center" },
  earnLabel:  { fontSize: 11, fontWeight: "600", color: "#374151", textAlign: "center", maxWidth: 64 },

  tabs: { flexDirection: "row", paddingHorizontal: 16, gap: 8, marginBottom: 12 },
  tab: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: "#F3F4F6",
  },
  tabActive:     { backgroundColor: "#7C3AED" },
  tabText:       { fontSize: 13, fontWeight: "600", color: "#6B7280" },
  tabTextActive: { color: "#fff" },

  txRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#F9FAFB",
  },
  txIconCircle: { width: 44, height: 44, borderRadius: 22, alignItems: "center", justifyContent: "center" },
  txMid:        { flex: 1 },
  txTitle:      { fontSize: 14, fontWeight: "600", color: "#111" },
  txDate:       { fontSize: 12, color: "#9CA3AF", marginTop: 2 },
  txRight:      { alignItems: "flex-end", gap: 4 },
  txAmount:     { fontSize: 15, fontWeight: "700" },
  statusPill:   { paddingHorizontal: 7, paddingVertical: 2, borderRadius: 10 },
  statusText:   { fontSize: 10, fontWeight: "700" },

  empty: { alignItems: "center", paddingVertical: 48, gap: 8 },
  emptyText:    { fontSize: 16, fontWeight: "700", color: "#374151" },
  emptySubText: { fontSize: 13, color: "#9CA3AF", textAlign: "center", maxWidth: 240 },
});
