// app/contest/result.tsx

import { useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";

export default function ResultScreen() {
  const { contestId } = useLocalSearchParams();

  return (
    <View style={{ padding: 20 }}>
      <Text>🏆 Contest Result</Text>
      <Text>Contest ID: {contestId}</Text>
    </View>
  );
}