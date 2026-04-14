import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useEffect, useRef } from "react";
import {
  Animated,
  Easing,
  StyleSheet,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { auth } from "@/lib/firebase";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { onAuthStateChanged } from "firebase/auth";

export default function SplashScreen() {
  const router = useRouter();

  // 🎬 Animations
  const scaleAnim = useRef(new Animated.Value(0.6)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // 🎬 Animation
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 1200,
        easing: Easing.out(Easing.exp),
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start();

    // 🔐 Main Logic
    const checkUser = async () => {
      const hasOpened = await AsyncStorage.getItem("hasOpened");

      onAuthStateChanged(auth, async (user) => {
        setTimeout(async () => {
          if (user) {
            // ✅ Logged in
            router.replace("/(drawer)/(tabs)/home");
          } else {
            if (!hasOpened) {
              // 🆕 First time user
              await AsyncStorage.setItem("hasOpened", "true");
              router.replace("/welcome");
            } else {
              // 🔁 Returning user (not logged)
              router.replace("/welcome"); // or "/login"
            }
          }
        }, 2000);
      });
    };

    checkUser();
  }, []);

  return (
    <LinearGradient
      colors={["#020617", "#0f172a", "#020617"]}
      style={styles.container}
    >
      <SafeAreaView style={styles.safe}>
        <View style={styles.center}>
          <Animated.Text
            style={[
              styles.logo,
              {
                transform: [{ scale: scaleAnim }],
                opacity: opacityAnim,
              },
            ]}
          >
            VIDYA
          </Animated.Text>

          <Animated.Text
            style={[styles.tagline, { opacity: opacityAnim }]}
          >
            Learn • Compete • Earn 🚀
          </Animated.Text>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

// ================= STYLES =================

const styles = StyleSheet.create({
  container: { flex: 1 },

  safe: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  center: {
    alignItems: "center",
  },

  logo: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#38bdf8",
    letterSpacing: 6,
  },

  tagline: {
    color: "#94a3b8",
    marginTop: 14,
    fontSize: 14,
  },
});