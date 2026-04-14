import { auth, db } from "@/lib/firebase";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Redirect } from "expo-router";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    View,
} from "react-native";

export default function Index() {
  const [isFirstLaunch, setIsFirstLaunch] = useState<boolean | null>(null);
  const [user, setUser] = useState<any>(null);
  const [onboardingComplete, setOnboardingComplete] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const init = async () => {
      // 🔍 Check first launch
      const value = await AsyncStorage.getItem("alreadyLaunched");

      if (isMounted) {
        if (value === null) {
          await AsyncStorage.setItem("alreadyLaunched", "true");
          setIsFirstLaunch(true);
        } else {
          setIsFirstLaunch(false);
        }
      }
    };

    init();

    // 🔐 Auth listener
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      if (isMounted) {
        setUser(u);
        
        // 🔍 Check if onboarding is complete
        if (u) {
          try {
            // Small delay to ensure auth token is ready
            await new Promise(resolve => setTimeout(resolve, 100));
            
            const studentDoc = await getDoc(doc(db, "students", u.uid));
            if (studentDoc.exists()) {
              setOnboardingComplete(studentDoc.data()?.onboardingComplete ?? false);
            } else {
              // No student doc found - onboarding incomplete
              setOnboardingComplete(false);
            }
          } catch (error: any) {
            console.log("Error checking onboarding:", error.code, error.message);
            // On permission error or any error, assume onboarding incomplete
            // User will be directed to registration page
            setOnboardingComplete(false);
          }
        } else {
          setOnboardingComplete(null);
        }
        
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  // ⏳ Premium loading screen
  if (loading || isFirstLaunch === null || (user && onboardingComplete === null)) {
    return (
      <View style={styles.container}>
        <Text style={styles.logo}>VIDYA</Text>
        <Text style={styles.tagline}>Learn • Compete • Earn 🚀</Text>

        <ActivityIndicator
          size="large"
          color="#38bdf8"
          style={{ marginTop: 30 }}
        />
      </View>
    );
  }

  // 🆕 First time → Welcome
  if (isFirstLaunch) {
    return <Redirect href="/welcome" />;
  }

  // ❌ Not logged in → Login
  if (!user) {
    return <Redirect href="/login" />;
  }

  // ⚠️ Logged in but registration incomplete → Register
  if (user && !onboardingComplete) {
    return <Redirect href="/(auth)/register" />;
  }

  // ✅ Logged in and registration complete → Home
  return <Redirect href="/(drawer)/(tabs)/home" />;
}

// ================= STYLES =================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f172a",
    justifyContent: "center",
    alignItems: "center",
  },

  logo: {
    fontSize: 42,
    fontWeight: "bold",
    color: "#38bdf8",
    letterSpacing: 4,
  },

  tagline: {
    color: "#94a3b8",
    marginTop: 10,
    fontSize: 14,
  },
});