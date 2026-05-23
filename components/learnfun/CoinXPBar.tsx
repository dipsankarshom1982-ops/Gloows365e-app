// components/learnfun/CoinXPBar.tsx

import { useTheme } from "@/context/ThemeContext";
import { XP_PER_LEVEL } from "@/lib/learnfun/constants";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface CoinXPBarProps {
  coins: number;
  xp: number;
  level: number;
  streak: number;
}

export default function CoinXPBar({ coins, xp, level, streak }: CoinXPBarProps) {
  const { colors } = useTheme();

  const xpInCurrentLevel = xp % XP_PER_LEVEL;
  const xpProgress = xpInCurrentLevel / XP_PER_LEVEL;

  return (
    <View style={styles.container}>
      {/* Streak */}
      <View style={[styles.pill, { backgroundColor: "rgba(239,68,68,0.18)" }]}>
        <Text style={styles.pillEmoji}>🔥</Text>
        <Text style={[styles.pillValue, { color: "#EF4444" }]}>{streak}</Text>
      </View>

      {/* Coins */}
      <View style={[styles.pill, { backgroundColor: "rgba(245,158,11,0.18)" }]}>
        <Text style={styles.pillEmoji}>🪙</Text>
        <Text style={[styles.pillValue, { color: "#F59E0B" }]}>{coins.toLocaleString()}</Text>
      </View>

      {/* XP + Level */}
      <View style={[styles.xpPill, { backgroundColor: "rgba(56,189,248,0.15)" }]}>
        <Text style={styles.pillEmoji}>⚡</Text>
        <View style={styles.xpTextGroup}>
          <Text style={[styles.xpLabel, { color: colors.textSecondary }]}>
            Lv.{level}
          </Text>
          <View style={[styles.xpBarBg, { backgroundColor: "rgba(255,255,255,0.12)" }]}>
            <View
              style={[
                styles.xpBarFill,
                {
                  width: `${Math.min(xpProgress * 100, 100)}%`,
                  backgroundColor: colors.accent,
                },
              ]}
            />
          </View>
        </View>
        <Text style={[styles.xpCount, { color: colors.accent }]}>
          {xpInCurrentLevel}/{XP_PER_LEVEL}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flexWrap: "wrap",
  },
  pill: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
  },
  pillEmoji: {
    fontSize: 14,
  },
  pillValue: {
    fontSize: 13,
    fontWeight: "700",
  },
  xpPill: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
    flex: 1,
    minWidth: 120,
  },
  xpTextGroup: {
    flex: 1,
    gap: 3,
  },
  xpLabel: {
    fontSize: 10,
    fontWeight: "600",
  },
  xpBarBg: {
    height: 4,
    borderRadius: 2,
    overflow: "hidden",
    width: "100%",
  },
  xpBarFill: {
    height: "100%",
    borderRadius: 2,
  },
  xpCount: {
    fontSize: 11,
    fontWeight: "700",
  },
});
