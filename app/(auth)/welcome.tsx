import { BlurView } from "expo-blur";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

export default function WelcomeScreen() {
  const router = useRouter();
  const [selectedLang, setSelectedLang] = useState("English");

  const float = useSharedValue(0);

  useEffect(() => {
    float.value = withRepeat(
      withSequence(
        withTiming(-12, { duration: 2000 }),
        withTiming(0, { duration: 2000 })
      ),
      -1,
      true
    );
  }, []);

  const floatStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: float.value }],
  }));

  const handleGetStarted = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push("/login");
  };

  const languages = ["English", "हिंदी", "বাংলা", "தமிழ்", "తెలుగు"];

  return (
    <LinearGradient
      colors={["#1E1B4B", "#4F46E5", "#7C3AED"]}
      style={styles.container}
    >
      <StatusBar barStyle="light-content" />

      {/* Glow Effects */}
      <View style={styles.glow1} />
      <View style={styles.glow2} />

      {/* Floating Logo */}
      <Animated.View style={floatStyle}>
        <BlurView intensity={80} tint="light" style={styles.logoCard}>
          <Text style={styles.logoIcon}>🎓</Text>
        </BlurView>
      </Animated.View>

      {/* Title */}
      <Text style={styles.title}>
        Vidya<Text style={styles.gold}>AI</Text>
      </Text>

      {/* 🔥 Student Hook */}
      <Text style={styles.subtitle}>
        Learn smarter. Grow faster.{"\n"}
        Your personal AI teacher is ready 🚀
      </Text>

      {/* 🌍 Language Selection */}
      <View style={styles.languageContainer}>
        {languages.map((lang, i) => (
          <TouchableOpacity
            key={i}
            style={[
              styles.langBtn,
              selectedLang === lang && styles.activeLang,
            ]}
            onPress={() => setSelectedLang(lang)}
          >
            <Text
              style={[
                styles.langText,
                selectedLang === lang && { color: "#312E81" },
              ]}
            >
              {lang}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* 🚀 CTA */}
      <TouchableOpacity style={styles.button} onPress={handleGetStarted}>
        <LinearGradient
          colors={["#ffffff", "#E0E7FF"]}
          style={styles.buttonInner}
        >
          <Text style={styles.buttonText}>Start Learning →</Text>
        </LinearGradient>
      </TouchableOpacity>

      {/* 💡 Micro trust line */}
      <Text style={styles.footer}>
        Join thousands of students learning daily
      </Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },

  glow1: {
    position: "absolute",
    top: 60,
    left: -50,
    width: 200,
    height: 200,
    borderRadius: 200,
    backgroundColor: "#818CF8",
    opacity: 0.2,
  },

  glow2: {
    position: "absolute",
    bottom: 80,
    right: -40,
    width: 180,
    height: 180,
    borderRadius: 200,
    backgroundColor: "#C084FC",
    opacity: 0.2,
  },

  logoCard: {
    width: 120,
    height: 120,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
    marginBottom: 20,
    overflow: "hidden",
  },

  logoIcon: {
    fontSize: 42,
  },

  title: {
    fontSize: 42,
    fontWeight: "bold",
    color: "#fff",
  },

  gold: {
    color: "#FFD700",
  },

  subtitle: {
    textAlign: "center",
    color: "#E0E7FF",
    marginTop: 10,
    marginBottom: 25,
    fontSize: 15,
    lineHeight: 22,
  },

  languageContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginBottom: 30,
  },

  langBtn: {
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.4)",
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 25,
    margin: 5,
    backgroundColor: "rgba(255,255,255,0.08)",
  },

  activeLang: {
    backgroundColor: "#fff",
    borderColor: "#fff",
  },

  langText: {
    color: "#fff",
    fontSize: 12,
  },

  button: {
    borderRadius: 30,
    overflow: "hidden",
  },

  buttonInner: {
    paddingVertical: 16,
    paddingHorizontal: 60,
    borderRadius: 30,
  },

  buttonText: {
    color: "#312E81",
    fontWeight: "bold",
    fontSize: 16,
  },

  footer: {
    marginTop: 20,
    color: "#C7D2FE",
    fontSize: 12,
  },
});