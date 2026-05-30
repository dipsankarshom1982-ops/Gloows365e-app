import { useRef, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import { useStudentProfile } from "@/context/StudentProfileContext";
import { useTheme } from "@/context/ThemeContext";
import { useAppTranslation } from "@/context/LanguageContext";
import { askAiGuruQuestion } from "@/services/askAiGuruApi";

const FREE_DAILY_ASK = 5;

const SUBJECT_CHIPS = [
  { label: "Math 🔢",      sample: "What is Pythagoras theorem?" },
  { label: "Science 🔬",   sample: "What is photosynthesis?" },
  { label: "English 📖",   sample: "What is active and passive voice?" },
  { label: "History 📜",   sample: "What caused the French Revolution?" },
  { label: "Physics ⚡",   sample: "What is Newton's second law of motion?" },
  { label: "Chemistry 🧪", sample: "What is a chemical reaction?" },
  { label: "Computer 💻",  sample: "What is RAM and ROM?" },
];

type ResultState = "idle" | "loading" | "found" | "limit" | "error";

export default function AskAiGuruScreen() {
  const insets = useSafeAreaInsets();
  const { studentProfile } = useStudentProfile();
  const { colors, isDarkMode } = useTheme();
  const { t } = useAppTranslation();

  const firstName    = studentProfile?.name?.split(" ")[0] ?? "there";
  const studentClass = String(studentProfile?.class ?? "10");
  const board        = studentProfile?.board ?? "CBSE";

  const surfaceBg = isDarkMode ? "#1e293b" : colors.card;
  const borderCol = isDarkMode ? "#334155" : colors.border;
  const textMain  = isDarkMode ? "#f1f5f9" : colors.text;
  const textSec   = isDarkMode ? "#94a3b8" : colors.textSecondary;
  const textDim   = isDarkMode ? "#64748b" : colors.textSecondary;
  const backBtnBg = isDarkMode ? "rgba(255,255,255,0.08)" : colors.card;

  const [query,     setQuery]     = useState("");
  const [result,    setResult]    = useState<ResultState>("idle");
  const [answer,    setAnswer]    = useState("");
  const [askedQ,    setAskedQ]    = useState("");
  const [errMsg,    setErrMsg]    = useState("");
  const [remaining, setRemaining] = useState(FREE_DAILY_ASK);
  const inputRef = useRef<TextInput>(null);

  // Time-based greeting using translations
  const hour = new Date().getHours();
  const greeting =
    hour >= 5  && hour < 12 ? t("goodMorning")    :
    hour >= 12 && hour < 17 ? t("goodAfternoon")  :
    hour >= 17 && hour < 21 ? t("goodEvening")    :
    t("helloGreet");

  async function handleAsk() {
    const trimmed = query.trim();
    if (!trimmed || result === "loading") return;

    setAskedQ(trimmed);
    setQuery("");
    setResult("loading");
    setAnswer("");
    setErrMsg("");

    try {
      const data = await askAiGuruQuestion({ question: trimmed, classLevel: studentClass, board });
      setAnswer(data.answer);
      setResult("found");
      setRemaining((r) => Math.max(0, r - 1));
    } catch (err: any) {
      if (err?.code === "LIMIT_REACHED") {
        setResult("limit");
        setRemaining(0);
      } else {
        setErrMsg(err?.message ?? t("somethingWentWrong"));
        setResult("error");
      }
    }
  }

  function reset() {
    setQuery("");
    setResult("idle");
    setAnswer("");
    setAskedQ("");
    setErrMsg("");
    setTimeout(() => inputRef.current?.focus(), 100);
  }

  const canSend = query.trim().length > 0 && result !== "loading";

  const quotaLabel =
    remaining === 1
      ? t("freeQuestionsRemaining", { count: remaining }) ?? `${remaining} free question remaining today · Resets at midnight IST`
      : t("freeQuestionsRemainingPlural", { count: remaining }) ?? `${remaining} free questions remaining today · Resets at midnight IST`;

  return (
    <KeyboardAvoidingView
      style={[S.root, { backgroundColor: isDarkMode ? "#0a0a1a" : colors.background }]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={0}
    >
      {isDarkMode && (
        <LinearGradient colors={["#0a0a1a", "#0f172a"]} style={StyleSheet.absoluteFillObject} />
      )}

      {/* ── Header ── */}
      <Animated.View entering={FadeIn.duration(350)} style={[S.header, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity onPress={() => router.back()} style={[S.backBtn, { backgroundColor: backBtnBg }]}>
          <Ionicons name="chevron-back" size={22} color={textSec} />
        </TouchableOpacity>

        <Text style={[S.headerTitle, { color: textMain }]}>{t("askAiGuruTitle") ?? "Ask AI Guru"}</Text>

        <View style={[S.quotaBadge, { backgroundColor: surfaceBg, borderColor: remaining > 0 ? borderCol : "rgba(239,68,68,0.4)" }]}>
          <View style={[S.quotaDot, { backgroundColor: remaining > 0 ? "#10b981" : "#ef4444" }]} />
          <Text style={[S.quotaText, { color: remaining > 0 ? "#10b981" : "#ef4444" }]}>
            {remaining}/{FREE_DAILY_ASK} {t("leftLabel") ?? "left"}
          </Text>
        </View>
      </Animated.View>

      {/* ── Main content ── */}
      <ScrollView
        style={S.scroll}
        contentContainerStyle={S.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >

        {/* IDLE: greeting + subject chips */}
        {result === "idle" && (
          <Animated.View entering={FadeInDown.duration(400).delay(100)} style={S.greetingBlock}>
            <Text style={[S.greetingLabel, { color: textSec }]}>{greeting},</Text>
            <Text style={[S.greetingName, { color: textMain }]}>{firstName} 👋</Text>
            <Text style={[S.greetingSub, { color: textDim }]}>
              {t("whatToLearnToday") ?? "What would you like to know today?"}
            </Text>

            {/* Subject chips */}
            <Text style={[S.chipsSectionLabel, { color: textDim }]}>
              {t("browseBySubject") ?? "Browse by subject"}
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={S.chipsRow}
            >
              {SUBJECT_CHIPS.map((chip) => (
                <TouchableOpacity
                  key={chip.label}
                  style={[S.chip, { backgroundColor: surfaceBg, borderColor: borderCol }]}
                  activeOpacity={0.75}
                  onPress={() => setQuery(chip.sample)}
                >
                  <Text style={[S.chipText, { color: textSec }]}>{chip.label}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Daily quota note */}
            <View style={[S.quotaNote, { backgroundColor: surfaceBg, borderColor: borderCol }]}>
              <Ionicons name="sparkles-outline" size={15} color="#6366f1" />
              <Text style={[S.quotaNoteText, { color: textDim }]}>{quotaLabel}</Text>
            </View>
          </Animated.View>
        )}

        {/* LOADING */}
        {result === "loading" && (
          <Animated.View entering={FadeIn.duration(300)} style={S.centerBlock}>
            <LinearGradient colors={["#312e81", "#4f46e5"]} style={S.thinkingOrb}>
              <ActivityIndicator color="#fff" size="large" />
            </LinearGradient>
            <Text style={[S.thinkingTitle, { color: textMain }]}>
              {t("thinkingLabel") ?? "Thinking..."}
            </Text>
            <Text style={[S.thinkingQ, { color: textDim }]} numberOfLines={2}>
              "{askedQ}"
            </Text>
          </Animated.View>
        )}

        {/* ANSWER */}
        {result === "found" && (
          <Animated.View entering={FadeInDown.duration(400)} style={S.answerBlock}>
            {/* User question bubble */}
            <View style={S.userRow}>
              <View style={[S.userBubble, { backgroundColor: isDarkMode ? "#312e81" : "#ede9fe" }]}>
                <Text style={[S.userBubbleText, { color: isDarkMode ? "#e0e7ff" : "#4338ca" }]}>
                  {askedQ}
                </Text>
              </View>
            </View>

            {/* AI answer card */}
            <View style={[S.answerCard, { backgroundColor: surfaceBg, borderColor: borderCol }]}>
              <View style={S.answerCardHeader}>
                <LinearGradient colors={["#4f46e5", "#7c3aed"]} style={S.aiAvatar}>
                  <Text style={S.aiAvatarText}>AI</Text>
                </LinearGradient>
                <Text style={[S.aiLabel, { color: textSec }]}>{t("askAiGuruTitle") ?? "AI Guru"}</Text>
              </View>

              <Text style={[S.answerText, { color: textMain }]}>{answer}</Text>

              <View style={[S.divider, { backgroundColor: borderCol }]} />
              <Text style={[S.upsellLabel, { color: textDim }]}>
                {t("wantToGoDeeper") ?? "Want to go deeper?"}
              </Text>
              <View style={S.upsellRow}>
                <TouchableOpacity
                  style={[S.upsellBtn, { backgroundColor: isDarkMode ? "rgba(99,102,241,0.15)" : "#ede9fe", borderColor: "#6366f1" }]}
                  onPress={() => router.push("/ai-guru/setup")}
                  activeOpacity={0.8}
                >
                  <Text style={S.upsellBtnText}>{t("generateLessonAction") ?? "✨ Generate Lesson"}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[S.upsellBtn, { backgroundColor: isDarkMode ? "rgba(99,102,241,0.15)" : "#ede9fe", borderColor: "#6366f1" }]}
                  onPress={() => router.push("/ai-guru/vidyaguru")}
                  activeOpacity={0.8}
                >
                  <Text style={S.upsellBtnText}>{t("chatWithAIAction") ?? "🤖 Chat with AI"}</Text>
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity onPress={reset} style={S.resetRow}>
              <Ionicons name="refresh-outline" size={15} color="#6366f1" />
              <Text style={S.resetText}>{t("askAnotherQuestion") ?? "Ask another question"}</Text>
            </TouchableOpacity>
          </Animated.View>
        )}

        {/* LIMIT REACHED */}
        {result === "limit" && (
          <Animated.View entering={FadeIn.duration(300)} style={S.centerBlock}>
            <Text style={S.limitEmoji}>⏰</Text>
            <Text style={[S.limitTitle, { color: textMain }]}>
              {t("dailyLimitTitle") ?? "Daily limit reached"}
            </Text>
            <Text style={[S.limitBody, { color: textSec }]}>
              {t("dailyLimitMessage", { count: FREE_DAILY_ASK }) ??
                `You've used all ${FREE_DAILY_ASK} free questions for today. Upgrade to Premium for unlimited questions.`}
            </Text>
            <TouchableOpacity
              style={S.limitPrimaryWrap}
              activeOpacity={0.85}
              onPress={() => router.push("/ai-guru/subscription" as any)}
            >
              <LinearGradient colors={["#312e81", "#4f46e5"]} style={S.limitPrimaryBtn}>
                <Text style={S.limitPrimaryText}>✨ Upgrade to Premium</Text>
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity
              style={[S.limitSecondaryBtn, { borderColor: borderCol }]}
              activeOpacity={0.85}
              onPress={() => router.push("/ai-guru/vidyaguru")}
            >
              <Text style={[S.limitSecondaryText, { color: textSec }]}>
                {t("chatWithVidyaGuruAction") ?? "🤖 Chat with VidyaGuru instead"}
              </Text>
            </TouchableOpacity>
          </Animated.View>
        )}

        {/* ERROR */}
        {result === "error" && (
          <Animated.View entering={FadeIn.duration(300)} style={S.centerBlock}>
            <Ionicons name="warning-outline" size={42} color="#f59e0b" />
            <Text style={[S.limitTitle, { color: textMain }]}>
              {t("somethingWentWrong") ?? "Something went wrong"}
            </Text>
            <Text style={[S.limitBody, { color: textSec }]}>{errMsg}</Text>
            <TouchableOpacity
              style={[S.retryBtn, { borderColor: borderCol }]}
              onPress={reset}
              activeOpacity={0.8}
            >
              <Text style={[S.retryText, { color: colors.accent }]}>
                {t("tryAgainLabel") ?? "Try again"}
              </Text>
            </TouchableOpacity>
          </Animated.View>
        )}

        <View style={{ height: 16 }} />
      </ScrollView>

      {/* ── Fixed bottom input bar ── */}
      <View style={[S.inputBar, {
        backgroundColor: isDarkMode ? "rgba(10,10,26,0.98)" : colors.background,
        borderTopColor: borderCol,
        paddingBottom: insets.bottom + 8,
      }]}>
        <View style={[S.inputWrap, { backgroundColor: surfaceBg, borderColor: borderCol }]}>
          <TextInput
            ref={inputRef}
            style={[S.input, { color: textMain }]}
            placeholder={
              result === "found"
                ? t("askFollowUpPlaceholder") ?? "Ask a follow-up question..."
                : t("askSyllabusPlaceholder") ?? "Ask anything about your syllabus..."
            }
            placeholderTextColor={textDim}
            value={query}
            onChangeText={setQuery}
            multiline
            maxLength={200}
            returnKeyType="send"
            blurOnSubmit
            onSubmitEditing={handleAsk}
          />
          <TouchableOpacity
            style={[S.sendBtn, !canSend && S.sendBtnDisabled]}
            onPress={handleAsk}
            disabled={!canSend}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={canSend ? ["#4f46e5", "#6366f1"] : [surfaceBg, surfaceBg]}
              style={S.sendBtnInner}
            >
              <Ionicons name="arrow-up" size={18} color={canSend ? "#fff" : textDim} />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const S = StyleSheet.create({
  root: { flex: 1 },

  header:     { flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingBottom: 12, gap: 10 },
  backBtn:    { width: 40, height: 40, borderRadius: 12, justifyContent: "center", alignItems: "center" },
  headerTitle:{ flex: 1, fontSize: 18, fontWeight: "900" },
  quotaBadge: { flexDirection: "row", alignItems: "center", gap: 5, borderRadius: 20, borderWidth: 1, paddingHorizontal: 10, paddingVertical: 5 },
  quotaDot:   { width: 7, height: 7, borderRadius: 4 },
  quotaText:  { fontSize: 11, fontWeight: "800" },

  scroll:        { flex: 1 },
  scrollContent: { paddingHorizontal: 16, paddingTop: 8, flexGrow: 1 },

  greetingBlock:    { paddingTop: 24 },
  greetingLabel:    { fontSize: 18, fontWeight: "500", marginBottom: 2 },
  greetingName:     { fontSize: 36, fontWeight: "900", letterSpacing: -0.5, marginBottom: 8 },
  greetingSub:      { fontSize: 15, lineHeight: 22, marginBottom: 32 },
  chipsSectionLabel:{ fontSize: 11, fontWeight: "700", letterSpacing: 0.5, textTransform: "uppercase", marginBottom: 10 },
  chipsRow:         { gap: 8, paddingBottom: 28 },
  chip:             { borderRadius: 20, borderWidth: 1, paddingHorizontal: 16, paddingVertical: 9 },
  chipText:         { fontSize: 13, fontWeight: "600" },
  quotaNote:        { flexDirection: "row", alignItems: "center", gap: 8, borderRadius: 14, borderWidth: 1, padding: 12 },
  quotaNoteText:    { flex: 1, fontSize: 12, lineHeight: 18 },

  centerBlock:   { flex: 1, alignItems: "center", justifyContent: "center", paddingVertical: 64, gap: 16 },
  thinkingOrb:   { width: 72, height: 72, borderRadius: 36, justifyContent: "center", alignItems: "center", marginBottom: 4 },
  thinkingTitle: { fontSize: 22, fontWeight: "800" },
  thinkingQ:     { fontSize: 13, textAlign: "center", lineHeight: 20, maxWidth: 280, fontStyle: "italic" },

  answerBlock:   { paddingTop: 8, gap: 14 },
  userRow:       { alignItems: "flex-end" },
  userBubble:    { maxWidth: "80%", borderRadius: 20, borderBottomRightRadius: 4, paddingHorizontal: 16, paddingVertical: 12 },
  userBubbleText:{ fontSize: 14, lineHeight: 20, fontWeight: "500" },

  answerCard:       { borderRadius: 20, borderWidth: 1, padding: 18, gap: 14 },
  answerCardHeader: { flexDirection: "row", alignItems: "center", gap: 10 },
  aiAvatar:         { width: 34, height: 34, borderRadius: 17, justifyContent: "center", alignItems: "center" },
  aiAvatarText:     { color: "#fff", fontSize: 11, fontWeight: "900" },
  aiLabel:          { fontSize: 13, fontWeight: "700" },
  answerText:       { fontSize: 15, lineHeight: 26 },
  divider:          { height: 1 },
  upsellLabel:      { fontSize: 12, fontWeight: "600" },
  upsellRow:        { gap: 8 },
  upsellBtn:        { borderRadius: 12, borderWidth: 1, paddingVertical: 11, alignItems: "center" },
  upsellBtnText:    { color: "#818cf8", fontSize: 13, fontWeight: "700" },

  resetRow:  { flexDirection: "row", alignItems: "center", gap: 6, alignSelf: "center", paddingVertical: 6 },
  resetText: { color: "#6366f1", fontSize: 14, fontWeight: "600" },

  limitEmoji:       { fontSize: 52 },
  limitTitle:       { fontSize: 19, fontWeight: "800", textAlign: "center", maxWidth: 280 },
  limitBody:        { fontSize: 13, textAlign: "center", lineHeight: 20, maxWidth: 280 },
  limitPrimaryWrap: { width: "100%", borderRadius: 16, overflow: "hidden" },
  limitPrimaryBtn:  { paddingVertical: 15, alignItems: "center" },
  limitPrimaryText: { color: "#fff", fontSize: 15, fontWeight: "800" },
  limitSecondaryBtn:{ width: "100%", borderRadius: 16, borderWidth: 1, paddingVertical: 14, alignItems: "center" },
  limitSecondaryText:{ fontSize: 14, fontWeight: "600" },

  retryBtn:  { borderRadius: 12, borderWidth: 1, paddingHorizontal: 28, paddingVertical: 12 },
  retryText: { fontSize: 14, fontWeight: "700" },

  inputBar:    { paddingHorizontal: 16, paddingTop: 10, borderTopWidth: StyleSheet.hairlineWidth },
  inputWrap:   { flexDirection: "row", alignItems: "flex-end", borderRadius: 26, borderWidth: 1, paddingLeft: 16, paddingRight: 6, paddingVertical: 6, gap: 8 },
  input:       { flex: 1, fontSize: 15, lineHeight: 22, maxHeight: 120, paddingVertical: 6 },
  sendBtn:     { borderRadius: 20, overflow: "hidden" },
  sendBtnDisabled: { opacity: 0.45 },
  sendBtnInner:{ width: 40, height: 40, justifyContent: "center", alignItems: "center" },
});
