import { StyleSheet, Text, View } from "react-native";

export default function ContestPro() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>🔥 Live Contest</Text>
      <Text style={styles.desc}>Class 10 Science - Win 500 Coins</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 16,
    padding: 16,
    backgroundColor: "#1E293B",
    borderRadius: 16,
  },
  title: { color: "#fff", fontSize: 16 },
  desc: { color: "#94A3B8" },
});