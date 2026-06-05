// PATH: app/index.tsx

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

type Route =
  | "welcome"
  | "login"
  | "register"
  | "restart-onboarding"
  | "restart-home"
  | "student-home"
  | null;

// All known spellings of the restart profile type
const RESTART_TYPES = [
  "restartEducation",
  "restartEducation",
  "restart_education",
  "restart",
];

// Fields that only exist on restart education users
const RESTART_INDICATOR_FIELDS = [
  "lastClassPassed",
  "educationGapReason",
  "currentOccupation",
];

export default function Index() {
  const [route,   setRoute]   = useState<Route>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    let unsubAuth: (() => void) | undefined;

    const resolveRoute = async () => {
      const launched = await AsyncStorage.getItem("alreadyLaunched");
      if (!launched) {
        await AsyncStorage.setItem("alreadyLaunched", "true");
        if (isMounted) { setRoute("welcome"); setLoading(false); }
        return;
      }

      unsubAuth = onAuthStateChanged(auth, async (u) => {
        if (!isMounted) return;

        console.log("🔐 Auth:", u ? `uid=${u.uid}` : "logged out");

        if (!u) {
          if (isMounted) { setRoute("login"); setLoading(false); }
          return;
        }

        try {
          await new Promise((r) => setTimeout(r, 200));
          await readFirestoreAndRoute(u.uid, isMounted, setRoute, setLoading);
        } catch (e: any) {
          console.log("❌ Route error:", e?.message);
          if (isMounted) { setRoute("login"); setLoading(false); }
        }
      });
    };

    resolveRoute();

    return () => {
      isMounted = false;
      unsubAuth?.();
    };
  }, []);

  if (loading || route === null) {
    return (
      <View style={S.container}>
        <Text style={S.logo}>VIDYA</Text>
        <Text style={S.tagline}>Learn • Compete • Earn 🚀</Text>
        <ActivityIndicator size="large" color="#38bdf8" style={{ marginTop: 30 }} />
      </View>
    );
  }

  console.log("🚦 Final route:", route);

  if (route === "welcome")            return <Redirect href="/welcome" />;
  if (route === "login")              return <Redirect href="/login" />;
  if (route === "register")           return <Redirect href="/(auth)/register" />;
  if (route === "restart-onboarding") return <Redirect href="/restart-education/onboarding" />;
  if (route === "restart-home")       return <Redirect href="/restart-education/home" />;
  return                                     <Redirect href="/(drawer)/(tabs)/home" />;
}

// ─── Firestore routing logic ──────────────────────────────────────────────────

async function readFirestoreAndRoute(
  uid: string,
  isMounted: boolean,
  setRoute: (r: Route) => void,
  setLoading: (l: boolean) => void,
) {
  try {
    const userSnap = await getDoc(doc(db, "users", uid));
    console.log("📄 users/ exists:", userSnap.exists());

    if (userSnap.exists()) {
      const d           = userSnap.data();
      const profileType = d?.profileType as string | undefined;
      const onboarding  = d?.onboardingComplete as boolean | undefined;

      console.log("📄 users/ profileType:", profileType, "onboardingComplete:", onboarding);
      console.log("📄 users/ all keys:", Object.keys(d));

      // Check 1: explicit profileType field (any known spelling)
      if (profileType && RESTART_TYPES.includes(profileType)) {
        console.log("✅ Detected restart user via profileType field");
        if (!isMounted) return;
        setRoute(onboarding === true ? "restart-home" : "restart-onboarding");
        setLoading(false);
        return;
      }

      // Check 2: no profileType but has restart-specific fields
      // This handles users whose profileType write failed but other fields were written
      const hasRestartFields = RESTART_INDICATOR_FIELDS.some((f) => f in d);
      if (hasRestartFields) {
        console.log("✅ Detected restart user via indicator fields:", RESTART_INDICATOR_FIELDS.filter(f => f in d));
        if (!isMounted) return;
        setRoute(onboarding === true ? "restart-home" : "restart-onboarding");
        setLoading(false);
        return;
      }
    }

    // Check students/ doc — if it exists they are a student
    const studentSnap = await getDoc(doc(db, "students", uid));
    console.log("📄 students/ exists:", studentSnap.exists());

    if (studentSnap.exists()) {
      const onboarding = studentSnap.data()?.onboardingComplete ?? false;
      console.log("📄 students/ onboardingComplete:", onboarding);
      if (!isMounted) return;
      setRoute(onboarding ? "student-home" : "register");
      setLoading(false);
      return;
    }

    // Nothing found
    console.log("⚠️ No docs found → register");
    if (isMounted) { setRoute("register"); setLoading(false); }

  } catch (e: any) {
    console.log("❌ Firestore error:", e?.code, e?.message);
    if (isMounted) { setRoute("login"); setLoading(false); }
  }
}

const S = StyleSheet.create({
  container: {
    flex: 1, backgroundColor: "#0f172a",
    justifyContent: "center", alignItems: "center",
  },
  logo:    { fontSize: 42, fontWeight: "bold", color: "#38bdf8", letterSpacing: 4 },
  tagline: { color: "#94a3b8", marginTop: 10, fontSize: 14 },
});
