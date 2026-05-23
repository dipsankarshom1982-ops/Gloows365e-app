import { useEffect, useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import {
  BOARDS, CLASSES, SUBJECTS, SUBJECT_ICONS,
  LANGUAGES, DIFFICULTIES, DIFFICULTY_DESC,
  LESSON_STYLES, LESSON_STYLE_DESC,
} from "@/lib/aiGuru/constants";

export default function SetupScreen() {
  const [board, setBoard]         = useState("");
  const [classLevel, setClass]    = useState("");
  const [subject, setSubject]     = useState("");
  const [chapter, setChapter]     = useState("");
  const [topic, setTopic]         = useState("");
  const [language, setLanguage]   = useState("English");
  const [difficulty, setDifficulty] = useState("Standard");
  const [lessonStyle, setStyle]   = useState("Simple Explanation");

  // Auto-fetch class and board from student profile
  useEffect(() => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;
    getDoc(doc(db, "students", uid)).then((snap) => {
      if (!snap.exists()) return;
      const data = snap.data();
      if (data.board) setBoard(data.board);
      if (data.class) setClass(String(data.class));
    }).catch(() => {});
  }, []);

  const canContinue = board && classLevel && subject && chapter.trim();

  const handleContinue = () => {
    if (!canContinue) {
      Alert.alert("Fill Required Fields", "Please select board, class, subject, and enter chapter name.");
      return;
    }
    router.push({
      pathname: "/ai-guru/content",
      params: { board, classLevel, subject, chapter: chapter.trim(), topic: topic.trim(), language, difficulty, lessonStyle },
    });
  };

  return (
    <LinearGradient colors={["#0a0a1a", "#0f172a"]} style={S.bg}>
      <SafeAreaView style={S.safeArea}>
        {/* Fixed header */}
        <View style={S.header}>
          <TouchableOpacity onPress={() => router.back()} style={S.backBtn}>
            <Ionicons name="chevron-back" size={22} color="#94a3b8" />
          </TouchableOpacity>
          <Text style={S.headerTitle}>Lesson Setup</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView contentContainerStyle={S.scroll} showsVerticalScrollIndicator={false}>
          {/* Board */}
          <Section label="📋 Board" required>
            <ChipRow items={BOARDS} selected={board} onSelect={setBoard} />
          </Section>

          {/* Class */}
          <Section label="🎓 Class" required>
            <ChipRow items={CLASSES} selected={classLevel} onSelect={setClass} labelSuffix="th" />
          </Section>

          {/* Subject */}
          <Section label="📚 Subject" required>
            <View style={S.subjectGrid}>
              {SUBJECTS.map((s) => (
                <TouchableOpacity
                  key={s}
                  style={[S.subjectCard, subject === s && S.subjectCardActive]}
                  onPress={() => setSubject(s)}
                  activeOpacity={0.8}
                >
                  <Text style={S.subjectEmoji}>{SUBJECT_ICONS[s] ?? "📚"}</Text>
                  <Text style={[S.subjectLabel, subject === s && S.subjectLabelActive]}>{s}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </Section>

          {/* Chapter */}
          <Section label="📖 Chapter Name" required>
            <TextInput
              style={S.textInput}
              placeholder="e.g. Photosynthesis, Quadratic Equations..."
              placeholderTextColor="#475569"
              value={chapter}
              onChangeText={setChapter}
            />
          </Section>

          {/* Topic (optional) */}
          <Section label="🔍 Specific Topic (optional)">
            <TextInput
              style={S.textInput}
              placeholder="e.g. Light reactions, Discriminant formula..."
              placeholderTextColor="#475569"
              value={topic}
              onChangeText={setTopic}
            />
          </Section>

          {/* Language */}
          <Section label="🌐 Language">
            <ChipRow items={LANGUAGES} selected={language} onSelect={setLanguage} />
          </Section>

          {/* Difficulty */}
          <Section label="⚡ Difficulty">
            {DIFFICULTIES.map((d) => (
              <TouchableOpacity
                key={d}
                style={[S.diffCard, difficulty === d && S.diffCardActive]}
                onPress={() => setDifficulty(d)}
                activeOpacity={0.8}
              >
                <Text style={[S.diffLabel, difficulty === d && { color: "#a5b4fc" }]}>{d}</Text>
                <Text style={S.diffDesc}>{DIFFICULTY_DESC[d]}</Text>
                {difficulty === d && <Ionicons name="checkmark-circle" size={18} color="#6366f1" />}
              </TouchableOpacity>
            ))}
          </Section>

          {/* Lesson Style */}
          <Section label="🎨 Lesson Style">
            {LESSON_STYLES.map((s) => {
              const info = LESSON_STYLE_DESC[s];
              return (
                <TouchableOpacity
                  key={s}
                  style={[S.styleCard, lessonStyle === s && S.styleCardActive]}
                  onPress={() => setStyle(s)}
                  activeOpacity={0.8}
                >
                  <Text style={S.styleEmoji}>{info.emoji}</Text>
                  <View style={S.styleText}>
                    <Text style={[S.styleLabel, lessonStyle === s && { color: "#a5b4fc" }]}>{s}</Text>
                    <Text style={S.styleDesc}>{info.desc}</Text>
                  </View>
                  {lessonStyle === s && <Ionicons name="checkmark-circle" size={18} color="#6366f1" />}
                </TouchableOpacity>
              );
            })}
          </Section>

          <View style={{ height: 100 }} />
        </ScrollView>

        {/* Continue button */}
        <View style={S.footer}>
          <TouchableOpacity
            style={[S.continueBtn, !canContinue && S.continueBtnDisabled]}
            onPress={handleContinue}
            activeOpacity={0.85}
          >
            <LinearGradient
              colors={canContinue ? ["#4f46e5", "#7c3aed"] : ["#1e293b", "#1e293b"]}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
              style={S.continueBtnGrad}
            >
              <Text style={[S.continueBtnText, !canContinue && { color: "#475569" }]}>
                Continue →
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

function Section({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <View style={S.section}>
      <Text style={S.sectionLabel}>
        {label}{required ? <Text style={S.required}> *</Text> : null}
      </Text>
      {children}
    </View>
  );
}

function ChipRow({ items, selected, onSelect, labelSuffix = "" }: {
  items: string[]; selected: string; onSelect: (v: string) => void; labelSuffix?: string;
}) {
  return (
    <View style={S.chipRow}>
      {items.map((item) => (
        <TouchableOpacity
          key={item}
          style={[S.chip, selected === item && S.chipActive]}
          onPress={() => onSelect(item)}
          activeOpacity={0.8}
        >
          <Text style={[S.chipText, selected === item && S.chipTextActive]}>
            {item}{labelSuffix}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const S = StyleSheet.create({
  bg:              { flex: 1 },
  safeArea:        { flex: 1 },
  header:          { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingTop: 8, paddingBottom: 12, paddingHorizontal: 16, backgroundColor: "rgba(10,10,26,0.95)" },
  backBtn:         { width: 40, height: 40, borderRadius: 12, backgroundColor: "rgba(255,255,255,0.08)", justifyContent: "center", alignItems: "center" },
  headerTitle:     { color: "#f1f5f9", fontSize: 18, fontWeight: "800" },
  scroll:          { paddingHorizontal: 16, paddingTop: 16 },
  section:         { marginBottom: 24, gap: 10 },
  sectionLabel:    { color: "#94a3b8", fontSize: 13, fontWeight: "800", letterSpacing: 0.3 },
  required:        { color: "#ef4444" },
  chipRow:         { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip:            { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10, backgroundColor: "#1e293b", borderWidth: 1, borderColor: "#334155" },
  chipActive:      { backgroundColor: "rgba(99,102,241,0.2)", borderColor: "#6366f1" },
  chipText:        { color: "#64748b", fontSize: 13, fontWeight: "600" },
  chipTextActive:  { color: "#a5b4fc" },
  subjectGrid:     { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  subjectCard:     { width: "22%", aspectRatio: 1, backgroundColor: "#1e293b", borderRadius: 14, justifyContent: "center", alignItems: "center", gap: 4, borderWidth: 1, borderColor: "#334155" },
  subjectCardActive:{ backgroundColor: "rgba(99,102,241,0.2)", borderColor: "#6366f1" },
  subjectEmoji:    { fontSize: 24 },
  subjectLabel:    { color: "#64748b", fontSize: 10, fontWeight: "700", textAlign: "center" },
  subjectLabelActive:{ color: "#a5b4fc" },
  textInput:       { backgroundColor: "#1e293b", borderRadius: 14, padding: 16, color: "#f1f5f9", fontSize: 15, borderWidth: 1, borderColor: "#334155" },
  diffCard:        { flexDirection: "row", alignItems: "center", backgroundColor: "#1e293b", borderRadius: 14, padding: 14, borderWidth: 1, borderColor: "#334155", gap: 10 },
  diffCardActive:  { borderColor: "#6366f1", backgroundColor: "rgba(99,102,241,0.08)" },
  diffLabel:       { color: "#94a3b8", fontSize: 14, fontWeight: "700", width: 100 },
  diffDesc:        { flex: 1, color: "#475569", fontSize: 12 },
  styleCard:       { flexDirection: "row", alignItems: "center", backgroundColor: "#1e293b", borderRadius: 14, padding: 14, borderWidth: 1, borderColor: "#334155", gap: 12 },
  styleCardActive: { borderColor: "#6366f1", backgroundColor: "rgba(99,102,241,0.08)" },
  styleEmoji:      { fontSize: 24, width: 36 },
  styleText:       { flex: 1, gap: 2 },
  styleLabel:      { color: "#94a3b8", fontSize: 14, fontWeight: "700" },
  styleDesc:       { color: "#475569", fontSize: 12 },
  footer:          { padding: 16, backgroundColor: "rgba(10,10,26,0.95)" },
  continueBtn:     { borderRadius: 16, overflow: "hidden" },
  continueBtnDisabled: { opacity: 0.7 },
  continueBtnGrad: { paddingVertical: 16, alignItems: "center" },
  continueBtnText: { color: "#fff", fontSize: 17, fontWeight: "900" },
});
