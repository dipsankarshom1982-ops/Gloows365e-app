import { StyleSheet, Text, View } from "react-native";

export default function StatsPro({ data }: any) {
  if (!data) return null; // 🔥 REQUIRED

  return (
    <View>
      <Text>{data?.courses ?? 0}</Text>
      <Text>{data?.streak ?? 0}</Text>
      <Text>{data?.coins ?? 0}</Text>
      <Text>{data?.rank ?? 0}</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
  },
  card: {
    backgroundColor: "rgba(255,255,255,0.05)",
    padding: 16,
    borderRadius: 16,
    width: "22%",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  value: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
  label: {
    color: "#94A3B8",
    fontSize: 12,
  },
});