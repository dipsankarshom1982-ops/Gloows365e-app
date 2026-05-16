import { ResizeMode, Video } from "expo-av";
import { Text, TouchableOpacity, View } from "react-native";
import { Story } from "../lib/story";

interface Props {
  story: Story;
  onAction: (story: Story) => void;
}

export default function SmartStory({ story, onAction }: Props) {
  return (
    <View style={{ flex: 1, backgroundColor: "#000" }}>
      
      <Video
        source={{ uri: story.media.videoUrl }}
        style={{ flex: 1 }}
        resizeMode={ResizeMode.COVER} // ✅ FIXED
        shouldPlay
        isLooping
      />

      <View style={{ position: "absolute", bottom: 20, left: 20, right: 20 }}>
        <Text style={{ color: "#fff", fontSize: 18 }}>
          {story.title}
        </Text>

        <TouchableOpacity
          onPress={() => onAction(story)}
          style={{
            backgroundColor: "#FFD700",
            padding: 12,
            borderRadius: 10,
            marginTop: 10
          }}
        >
          <Text style={{ textAlign: "center" }}>
            {story.cta.text}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}