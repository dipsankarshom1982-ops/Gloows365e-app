import { StyleSheet, Text, View } from "react-native";

export default function LearningPro({ data }: any) {
  if (!data) return null;

  return (
    <View>
      <Text>{data?.currentCourse ?? "Start Learning"}</Text>
      <Text>{data?.progress ?? 0}%</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 16,
    backgroundColor: "#0F172A",
    padding: 16,
    borderRadius: 16,
  },
  title: { color: "#fff", fontSize: 16 },
  progress: { color: "#94A3B8", marginVertical: 6 },
  progressBar: {
    height: 6,
    backgroundColor: "#1E293B",
    borderRadius: 10,
  },
  fill: {
    height: 6,
    backgroundColor: "#3B82F6",
    borderRadius: 10,
  },
  button: {
    marginTop: 12,
    backgroundColor: "#3B82F6",
    padding: 10,
    borderRadius: 10,
  },
  btnText: { color: "#fff", textAlign: "center" },
});