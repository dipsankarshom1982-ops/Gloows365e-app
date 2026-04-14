import { useTheme } from "@/context/ThemeContext";
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const demoStories = [
  {
    id: "1",
    name: "Vidya",
    image: "https://i.pravatar.cc/150?img=1",
  },
  {
    id: "2",
    name: "Rahul",
    image: "https://i.pravatar.cc/150?img=2",
  },
  {
    id: "3",
    name: "Priya",
    image: "https://i.pravatar.cc/150?img=3",
  },
  {
    id: "4",
    name: "Amit",
    image: "https://i.pravatar.cc/150?img=4",
  },
  {
    id: "5",
    name: "Neha",
    image: "https://i.pravatar.cc/150?img=5",
  },
  {
    id: "6",
    name: "Rohan",
    image: "https://i.pravatar.cc/150?img=6",
  },
  {
    id: "7",
    name: "Sneha",
    image: "https://i.pravatar.cc/150?img=7",
  },
];

export default function Stories() {
  const { colors } = useTheme();

  const renderItem = ({ item }: any) => (
    <TouchableOpacity style={styles.storyItem}>
      <View style={[styles.storyRing, { backgroundColor: colors.accent }]}>
        <Image source={{ uri: item.image }} style={styles.avatar} />
      </View>
      <Text style={[styles.name, { color: colors.text }]}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={demoStories}
        renderItem={renderItem}
        horizontal
        showsHorizontalScrollIndicator={false}
        bounces={true}
        scrollEventThrottle={16}
        nestedScrollEnabled={true}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <TouchableOpacity style={styles.storyItem}>
            <View style={[styles.addStory, { backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1 }]}>
              <Text style={[styles.plus, { color: colors.accent }]}>+</Text>
            </View>
            <Text style={[styles.name, { color: colors.text }]}>Your Story</Text>
          </TouchableOpacity>
        }
      />
    </View>
  );
}

// ================= STYLES =================

const styles = StyleSheet.create({
  container: {
    paddingVertical: 4,
    paddingLeft: 10,
    backgroundColor: "#0f172a",
  },

  storyItem: {
    alignItems: "center",
    marginRight: 15,
  },

  storyRing: {
    padding: 3,
    borderRadius: 50,
    backgroundColor: "#38bdf8",
  },

  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },

  addStory: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#1e293b",
    justifyContent: "center",
    alignItems: "center",
  },

  plus: {
    color: "#38bdf8",
    fontSize: 28,
    fontWeight: "bold",
  },

  name: {
    color: "#fff",
    fontSize: 12,
    marginTop: 5,
  },
});