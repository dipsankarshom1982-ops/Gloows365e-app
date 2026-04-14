import { useTheme } from "@/context/ThemeContext";
import { auth, db } from "@/lib/firebase";
import { smartAI } from "@/lib/smartAI";

import {
    addDoc,
    collection,
    doc,
    getDoc,
    serverTimestamp,
} from "firebase/firestore";

import { useCallback, useEffect, useRef, useState } from "react";

import {
    FlatList,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AIGuruScreen() {
  const { colors } = useTheme();
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [quickMenuOpen, setQuickMenuOpen] = useState(false);

  const [studentName, setStudentName] = useState("Student");
  const [weakSubjects, setWeakSubjects] = useState<string[]>([]);

  const flatListRef = useRef<FlatList>(null);
  const user = auth.currentUser;
  const router = useRouter();

  // 🔥 PREVENT RESET ISSUE
  const initialized = useRef(false);

  // 👤 FETCH STUDENT
  useEffect(() => {
    if (!user || initialized.current) return;

    initialized.current = true;

    const fetchStudent = async () => {
      const snap = await getDoc(doc(db, "students", user.uid));

      if (snap.exists()) {
        const data = snap.data();
        setStudentName(data.name || "Student");
        setWeakSubjects(data.weakSubjects || []);
      }
    };

    fetchStudent();
  }, [user]);

  useFocusEffect(
    useCallback(() => {
      // Keep AI Guru as an ephemeral session. Full history lives on History page.
      setMessages([]);
      setInput("");
      setQuickMenuOpen(false);

      return () => {
        setMessages([]);
        setInput("");
        setQuickMenuOpen(false);
      };
    }, [])
  );

  useEffect(() => {
    if (messages.length === 0) return;

    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages.length]);

  // 🚀 SEND MESSAGE
  const handleSend = async () => {
    if (!user || !input.trim()) return;

    const userMessage = input;
    setInput("");
    setLoading(false);

    setMessages((prev) => [
      ...prev,
      {
        id: `local-user-${Date.now()}`,
        role: "user",
        text: userMessage,
      },
    ]);

    await addDoc(collection(db, "aiChats", user.uid, "messages"), {
      role: "user",
      text: userMessage,
      createdAt: serverTimestamp(),
    });

    const aiReply = smartAI(userMessage, {
      name: studentName,
      weakSubjects,
    });

    setMessages((prev) => [
      ...prev,
      {
        id: `local-ai-${Date.now()}`,
        role: "ai",
        text: aiReply,
      },
    ]);

    await addDoc(collection(db, "aiChats", user.uid, "messages"), {
      role: "ai",
      text: aiReply,
      createdAt: serverTimestamp(),
    });
  };

  // 🔖 BOOKMARK
  const handleBookmark = async (item: any) => {
    if (!user) return;

    await addDoc(collection(db, "bookmarks", user.uid, "saved"), {
      text: item.text,
      role: item.role,
      createdAt: serverTimestamp(),
    });
  };

  const renderItem = ({ item }: any) => (
    <View
      style={[
        styles.message,
        item.role === "user" ? { alignSelf: "flex-end", backgroundColor: colors.accent } : { alignSelf: "flex-start", backgroundColor: colors.card },
      ]}
    >
      <Text style={[styles.text, { color: item.role === "user" ? "#fff" : colors.text }]}>{item.text}</Text>

      {item.role === "ai" && (
        <TouchableOpacity
          style={styles.bookmarkBtn}
          onPress={() => handleBookmark(item)}
        >
          <Ionicons name="bookmark-outline" size={18} color={colors.accent} />
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      {/* 🔥 TOP BAR */}
      <View style={[styles.topBar, { borderBottomColor: colors.border, borderBottomWidth: 1 }]}>
        <TouchableOpacity style={styles.topBarSide} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color={colors.text} />
        </TouchableOpacity>

        <Text style={[styles.title, { color: colors.text }]}>AI Guru 🤖</Text>

        <View style={styles.topBarSide}>
          <TouchableOpacity onPress={() => setQuickMenuOpen((prev) => !prev)}>
            <Ionicons name="ellipsis-vertical" size={20} color={colors.text} />
          </TouchableOpacity>

          {quickMenuOpen && (
            <View style={[styles.quickMenu, { backgroundColor: colors.card, borderColor: colors.border }]}> 
              <TouchableOpacity
                style={styles.quickMenuItem}
                onPress={() => {
                  setQuickMenuOpen(false);
                  router.push("/history");
                }}
              >
                <Ionicons name="time-outline" size={16} color={colors.text} />
                <Text style={[styles.quickMenuText, { color: colors.text }]}>Chat History</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.quickMenuItem}
                onPress={() => {
                  setQuickMenuOpen(false);
                  router.push("/bookmarks");
                }}
              >
                <Ionicons name="bookmark-outline" size={16} color={colors.text} />
                <Text style={[styles.quickMenuText, { color: colors.text }]}>Bookmarks</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>

      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          {!loading && messages.length === 0 ? (
            <View style={styles.centerBox}>
              <Text style={[styles.welcome, { color: colors.text }]}>
                Hi {studentName} 👋
              </Text>
              <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                Your personal AI tutor 🚀
              </Text>

              <View style={[styles.centerInputBox, { backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1 }]}>
                <TextInput
                  style={[styles.centerInput, { color: colors.text }]}
                  placeholder="Ask anything..."
                  placeholderTextColor={colors.textSecondary}
                  value={input}
                  onChangeText={setInput}
                />

                <TouchableOpacity onPress={handleSend}>
                  <Ionicons name="send" size={20} color={colors.accent} />
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <>
              <FlatList
                ref={flatListRef}
                data={messages}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
              />

              <View style={[styles.inputBox, { backgroundColor: colors.background, borderTopColor: colors.border, borderTopWidth: 1 }]}>
                <TextInput
                  style={[styles.input, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border, borderWidth: 1 }]}
                  placeholder="Ask anything..."
                  placeholderTextColor={colors.textSecondary}
                  value={input}
                  onChangeText={setInput}
                />

                <TouchableOpacity
                  style={[styles.sendBtn, { backgroundColor: colors.accent }]}
                  onPress={handleSend}
                >
                  <Ionicons name="send" size={18} color="#fff" />
                </TouchableOpacity>
              </View>
            </>
          )}
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#020617" },

  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
  },

  topBarSide: {
    width: 28,
    alignItems: "center",
    justifyContent: "center",
  },

  title: { color: "#fff", fontSize: 18, fontWeight: "bold" },

  quickMenu: {
    position: "absolute",
    top: 30,
    right: 0,
    minWidth: 150,
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 6,
    zIndex: 20,
  },

  quickMenuItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },

  quickMenuText: {
    fontSize: 14,
    fontWeight: "600",
  },

  message: {
    padding: 12,
    borderRadius: 14,
    margin: 6,
    maxWidth: "80%",
  },

  userMsg: { alignSelf: "flex-end", backgroundColor: "#6366F1" },
  aiMsg: { alignSelf: "flex-start", backgroundColor: "#1E293B" },

  text: { 
    color: "#fff",
    fontSize: 14,
    lineHeight: 20,
  },

  inputBox: { flexDirection: "row", padding: 10 },

  input: {
    flex: 1,
    backgroundColor: "#1E293B",
    borderRadius: 25,
    paddingHorizontal: 15,
    color: "#fff",
  },

  sendBtn: {
    marginLeft: 10,
    backgroundColor: "#6366F1",
    padding: 12,
    borderRadius: 20,
  },

  centerBox: { flex: 1, justifyContent: "center", alignItems: "center" },

  centerInputBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1E293B",
    borderRadius: 25,
    paddingHorizontal: 15,
    marginTop: 20,
    width: "85%",
  },

  centerInput: { 
    flex: 1, 
    color: "#fff",
    paddingVertical: 12,
    fontSize: 14,
  },

  bookmarkBtn: { position: "absolute", right: 5, bottom: 5 },

  welcome: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
  },

  subtitle: {
    color: "#cbd5e1",
    marginTop: 6,
    textAlign: "center",
    fontSize: 16,
  },
});