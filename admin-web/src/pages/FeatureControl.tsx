// PATH: admin-web/src/pages/FeatureControl.tsx
// FIX: removed updatedAt from setDoc payload — it was polluting the flag docs
//      and could cause unexpected truthy values on the mobile side

import { doc, getDoc, setDoc } from "firebase/firestore";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import ToggleSwitch from "../components/ToggleSwitch";
import { db } from "../lib/firebase";

interface HomeSection {
  key: string;
  label: string;
  icon: string;
  description: string;
}

interface AiGuruFeature {
  key: string;
  label: string;
  icon: string;
  description: string;
  isPremium?: boolean;
}

const HOME_SECTIONS: HomeSection[] = [
  { key: "stories",           icon: "📖", label: "Stories",              description: "Horizontal story circles at the top" },
  { key: "aiguru",            icon: "🤖", label: "AI Guru Banner",        description: "AI Guru 'Start Chatting' promo card" },
  { key: "referral",          icon: "🎁", label: "Referral Card",         description: "Refer & Earn card with share button" },
  { key: "skillshorts",       icon: "🎬", label: "Skill Shorts & Battle", description: "Short reels + skill battle preview strip" },
  { key: "skillbattle",       icon: "⚔️", label: "Skill Battle Preview",  description: "Skill battle cards section" },
  { key: "home_ads",          icon: "📢", label: "Home Ads Carousel",     description: "Banner ads carousel" },
  { key: "vidya_star",        icon: "⭐", label: "VidyaStar Preview",     description: "Top students leaderboard preview" },
  { key: "seekho_preview",    icon: "📚", label: "Seekho Preview",        description: "Course / chapter preview strip" },
  { key: "scholarship_ad",    icon: "🎓", label: "Scholarship Ad",        description: "Scholarship banner ad card" },
  { key: "discover_preview",  icon: "🧭", label: "Discover Preview",      description: "AI Discover section preview" },
  { key: "knowledge_hub",     icon: "🧠", label: "Knowledge Hub",         description: "Knowledge videos section" },
  { key: "learning",          icon: "🎥", label: "Short Learning Reels",  description: "Learning reels injected between posts" },
  { key: "feed_posts",        icon: "📝", label: "Feed Posts",            description: "Student photo/video posts in feed" },
  { key: "feed_ads",          icon: "📣", label: "Feed Ads",              description: "Ads injected between feed posts" },
];

const AIGURU_FEATURES: AiGuruFeature[] = [
  { key: "dashboard",      icon: "🧠",  label: "AI Dashboard",        description: "Personal AI study dashboard" },
  { key: "vidyaguru",      icon: "🧑‍🏫", label: "VidyaGuru Chat",     description: "AI tutor voice/text chat" },
  { key: "generate",       icon: "✨",  label: "Generate Lesson",     description: "Create AI-generated lessons" },
  { key: "my_lessons",     icon: "📚",  label: "My Lessons",          description: "Saved and completed lessons" },
  { key: "revision_reels", icon: "🎬",  label: "Revision Reels",      description: "Video revision reels", isPremium: true },
  { key: "practice_tests", icon: "📝",  label: "Practice Tests",      description: "AI practice test generator", isPremium: true },
  { key: "ask_aiguru",     icon: "🤖",  label: "Ask AI Guru",         description: "Q&A chat with AI" },
  { key: "discover",       icon: "🧭",  label: "Discover AI",         description: "AI discovery and search" },
  { key: "subscription",   icon: "💎",  label: "Subscription / Plans",description: "Show premium upgrade option" },
];

const defaultHomeFlags = Object.fromEntries(HOME_SECTIONS.map((s) => [s.key, true]));
const defaultAiFlags   = Object.fromEntries(AIGURU_FEATURES.map((f) => [f.key, true]));

export default function FeatureControl() {
  const [homeFlags, setHomeFlags] = useState<Record<string, boolean>>(defaultHomeFlags);
  const [aiFlags,   setAiFlags]   = useState<Record<string, boolean>>(defaultAiFlags);
  const [loading,   setLoading]   = useState(true);
  const [saving,    setSaving]    = useState(false);
  const [saved,     setSaved]     = useState(false);

  useEffect(() => {
    Promise.all([
      getDoc(doc(db, "featureFlags", "homeSection")),
      getDoc(doc(db, "featureFlags", "aiGuru")),
    ]).then(([homeSnap, aiSnap]) => {
      if (homeSnap.exists()) {
        // Only keep boolean keys — strip any non-boolean fields like updatedAt
        const data = homeSnap.data();
        const clean = Object.fromEntries(
          Object.entries(data).filter(([, v]) => typeof v === "boolean")
        );
        setHomeFlags({ ...defaultHomeFlags, ...clean });
      }
      if (aiSnap.exists()) {
        const data = aiSnap.data();
        const clean = Object.fromEntries(
          Object.entries(data).filter(([, v]) => typeof v === "boolean")
        );
        setAiFlags({ ...defaultAiFlags, ...clean });
      }
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const save = async () => {
    setSaving(true); setSaved(false);
    try {
      // ✅ FIX: only write pure boolean flag keys — NO updatedAt timestamp
      // Adding non-boolean fields like updatedAt pollutes the doc and can cause
      // the mobile app to read a Timestamp as a truthy flag value
      await Promise.all([
        setDoc(doc(db, "featureFlags", "homeSection"), homeFlags),
        setDoc(doc(db, "featureFlags", "aiGuru"),      aiFlags),
      ]);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } finally {
      setSaving(false);
    }
  };

  const toggleHome = (key: string) =>
    setHomeFlags((prev) => ({ ...prev, [key]: !prev[key] }));

  const toggleAi = (key: string) =>
    setAiFlags((prev) => ({ ...prev, [key]: !prev[key] }));

  const homeEnabledCount = HOME_SECTIONS.filter((s) => homeFlags[s.key]).length;
  const aiEnabledCount   = AIGURU_FEATURES.filter((f) => aiFlags[f.key]).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32 text-slate-400">
        Loading feature flags…
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl">

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white">🎛️ Feature Control</h1>
          <p className="text-slate-400 text-sm mt-1">
            Toggle home page sections and AI Guru features on/off in real-time.
            Changes take effect immediately for all users.
          </p>
        </div>
        <button
          onClick={save}
          disabled={saving}
          className={`shrink-0 px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${
            saved
              ? "bg-green-600 text-white"
              : "bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white"
          }`}
        >
          {saving ? "Saving…" : saved ? "✓ Saved!" : "Save Changes"}
        </button>
      </div>

      {/* ── Home Page Sections ── */}
      <section>
        <div className="flex items-center gap-3 mb-4">
          <div>
            <h2 className="text-xl font-black text-white">🏠 Home Page Sections</h2>
            <p className="text-slate-500 text-xs mt-0.5">
              {homeEnabledCount} of {HOME_SECTIONS.length} sections enabled
            </p>
          </div>
          <div className="flex gap-2 ml-auto">
            <button
              onClick={() => setHomeFlags(Object.fromEntries(HOME_SECTIONS.map((s) => [s.key, true])))}
              className="text-xs px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors"
            >
              Enable All
            </button>
            <button
              onClick={() => setHomeFlags(Object.fromEntries(HOME_SECTIONS.map((s) => [s.key, false])))}
              className="text-xs px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors"
            >
              Disable All
            </button>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-3">
          {HOME_SECTIONS.map((section, i) => (
            <motion.div
              key={section.key}
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className={`rounded-xl border p-4 transition-all ${
                homeFlags[section.key]
                  ? "bg-slate-900 border-slate-700"
                  : "bg-slate-950 border-slate-800 opacity-60"
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{section.icon}</span>
                  <div>
                    <p className={`font-bold text-sm ${homeFlags[section.key] ? "text-white" : "text-slate-500"}`}>
                      {section.label}
                    </p>
                    <p className="text-slate-500 text-xs">{section.description}</p>
                  </div>
                </div>
                <ToggleSwitch
                  value={homeFlags[section.key]}
                  onChange={() => toggleHome(section.key)}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── AI Guru Features ── */}
      <section>
        <div className="flex items-center gap-3 mb-4">
          <div>
            <h2 className="text-xl font-black text-white">🤖 AI Guru Features</h2>
            <p className="text-slate-500 text-xs mt-0.5">
              {aiEnabledCount} of {AIGURU_FEATURES.length} features enabled
            </p>
          </div>
          <div className="flex gap-2 ml-auto">
            <button
              onClick={() => setAiFlags(Object.fromEntries(AIGURU_FEATURES.map((f) => [f.key, true])))}
              className="text-xs px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors"
            >
              Enable All
            </button>
            <button
              onClick={() => setAiFlags(Object.fromEntries(AIGURU_FEATURES.map((f) => [f.key, false])))}
              className="text-xs px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors"
            >
              Disable All
            </button>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-3">
          {AIGURU_FEATURES.map((feature, i) => (
            <motion.div
              key={feature.key}
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className={`rounded-xl border p-4 transition-all ${
                aiFlags[feature.key]
                  ? "bg-slate-900 border-slate-700"
                  : "bg-slate-950 border-slate-800 opacity-60"
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{feature.icon}</span>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className={`font-bold text-sm ${aiFlags[feature.key] ? "text-white" : "text-slate-500"}`}>
                        {feature.label}
                      </p>
                      {feature.isPremium && (
                        <span className="text-[10px] bg-amber-500/20 text-amber-400 font-bold px-1.5 py-0.5 rounded">
                          PREMIUM
                        </span>
                      )}
                    </div>
                    <p className="text-slate-500 text-xs">{feature.description}</p>
                  </div>
                </div>
                <ToggleSwitch
                  value={aiFlags[feature.key]}
                  onChange={() => toggleAi(feature.key)}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Bottom save bar */}
      <div className="sticky bottom-0 bg-slate-950/90 backdrop-blur border-t border-slate-800 -mx-8 px-8 py-4 flex items-center justify-between">
        <p className="text-slate-400 text-sm">
          {homeEnabledCount} home sections · {aiEnabledCount} AI features enabled
        </p>
        <button
          onClick={save}
          disabled={saving}
          className={`px-8 py-2.5 rounded-xl font-bold text-sm transition-all ${
            saved
              ? "bg-green-600 text-white"
              : "bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white"
          }`}
        >
          {saving ? "Saving…" : saved ? "✓ Saved!" : "Save Changes"}
        </button>
      </div>

    </div>
  );
}
