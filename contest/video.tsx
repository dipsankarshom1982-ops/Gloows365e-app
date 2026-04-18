import { ResizeMode, Video } from "expo-av";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useRef, useState } from "react";
import { ActivityIndicator, View } from "react-native";

export default function VideoScreen() {
  const { contestId } = useLocalSearchParams();
  const router = useRouter();

  const videoRef = useRef<Video>(null);
  const [loading, setLoading] = useState(true);

  // 🔥 Replace with dynamic fetch later
  const videoUrl = "https://your-video-url";

  return (
    <View style={{ flex: 1, backgroundColor: "#000" }}>
      
      {/* 🔥 LOADING */}
      {loading && (
        <ActivityIndicator
          size="large"
          color="#fff"
          style={{ position: "absolute", top: "50%", alignSelf: "center", zIndex: 10 }}
        />
      )}

      {/* 🎥 VIDEO */}
      <Video
        ref={videoRef}
        source={{ uri: videoUrl }}
        style={{ flex: 1 }}
        useNativeControls
        resizeMode={ResizeMode.CONTAIN}
        shouldPlay
        onLoadStart={() => setLoading(true)}
        onLoad={() => setLoading(false)}

        // 🔥 AUTO DETECT VIDEO END
        onPlaybackStatusUpdate={(status: any) => {
          if (status.didJustFinish) {
            router.replace({
              pathname: "../contest/quiz",
              params: { contestId },
            });
          }
        }}
      />
    </View>
  );
}