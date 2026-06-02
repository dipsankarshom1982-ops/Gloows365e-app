// PATH: context/FeatureFlagsContext.tsx
/**
 * Simple feature flags — reads from featureFlags/homeSection and featureFlags/aiGuru.
 * If docs don't exist, auto-creates them with everything ON.
 * Admin can then turn things off from FeatureControl page.
 */

import { useStudentProfile } from "@/context/StudentProfileContext";
import { db } from "@/lib/firebase";
import { doc, onSnapshot, setDoc } from "firebase/firestore";
import { createContext, useContext, useEffect, useState } from "react";

const ALL_HOME_FLAGS = {
  stories: true, aiguru: true, skillshorts: true, skillbattle: true,
  home_ads: true, vidya_star: true, seekho_preview: true,
  scholarship_ad: true, discover_preview: true, knowledge_hub: true,
  learning: true, feed_posts: true, feed_ads: true,
  referral: true, // ← NEW: referral card on home screen
};

const ALL_AI_FLAGS = {
  dashboard: true, vidyaguru: true, generate: true, my_lessons: true,
  revision_reels: true, practice_tests: true, ask_aiguru: true,
  discover: true, subscription: true,
};

type FeatureFlagsContextType = {
  homeSection: (key: string) => boolean;
  aiGuru:      (key: string) => boolean;
  isTester:    boolean;
};

const FeatureFlagsContext = createContext<FeatureFlagsContextType>({
  homeSection: () => true,
  aiGuru:      () => true,
  isTester:    false,
});

export const useFeatureFlags = () => useContext(FeatureFlagsContext);

export function FeatureFlagsProvider({ children }: { children: React.ReactNode }) {
  const { studentProfile } = useStudentProfile();
  const [homeFlags, setHomeFlags] = useState<Record<string, boolean>>(ALL_HOME_FLAGS);
  const [aiFlags,   setAiFlags]   = useState<Record<string, boolean>>(ALL_AI_FLAGS);

  const isTester = studentProfile?.role === "tester" || studentProfile?.role === "admin";

  useEffect(() => {
    // Home section flags
    const unsubHome = onSnapshot(
      doc(db, "featureFlags", "homeSection"),
      (snap) => {
        if (snap.exists()) {
          // Merge saved flags with defaults (missing keys = true)
          setHomeFlags({ ...ALL_HOME_FLAGS, ...snap.data() });
        } else {
          // Doc doesn't exist — create it with everything ON
          setDoc(doc(db, "featureFlags", "homeSection"), ALL_HOME_FLAGS).catch(() => {});
          setHomeFlags(ALL_HOME_FLAGS);
        }
      },
      () => setHomeFlags(ALL_HOME_FLAGS) // error = show everything
    );

    // AI Guru flags
    const unsubAi = onSnapshot(
      doc(db, "featureFlags", "aiGuru"),
      (snap) => {
        if (snap.exists()) {
          setAiFlags({ ...ALL_AI_FLAGS, ...snap.data() });
        } else {
          // Doc doesn't exist — create it with everything ON
          setDoc(doc(db, "featureFlags", "aiGuru"), ALL_AI_FLAGS).catch(() => {});
          setAiFlags(ALL_AI_FLAGS);
        }
      },
      () => setAiFlags(ALL_AI_FLAGS)
    );

    return () => { unsubHome(); unsubAi(); };
  }, []);

  return (
    <FeatureFlagsContext.Provider value={{
      homeSection: (key) => isTester ? true : (homeFlags[key] ?? true),
      aiGuru:      (key) => isTester ? true : (aiFlags[key]   ?? true),
      isTester,
    }}>
      {children}
    </FeatureFlagsContext.Provider>
  );
}
