import { StyleSheet, Text, View } from "react-native";

export default function EarningsPro({ data }: any) {
  if (!data) return null;

  return (
    <View>
      <Text>₹ {data?.earnings ?? 0}</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    margin: 16,
    padding: 16,
    backgroundColor: "#052e16",
    borderRadius: 16,
    alignItems: "center",
  },
  amount: {
    color: "#22C55E",
    fontSize: 22,
    fontWeight: "700",
  },
  label: { color: "#94A3B8" },
  button: {
    marginTop: 10,
    backgroundColor: "#22C55E",
    padding: 10,
    borderRadius: 10,
  },
  btn: { color: "#fff" },
});