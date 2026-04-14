import { auth, db } from "@/lib/firebase";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

import { createUserWithEmailAndPassword, deleteUser } from "firebase/auth";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";

export default function Signup() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const validate = (normalizedEmail: string) => {
    if (!email.trim() || !password.trim() || !confirmPassword.trim()) {
      return "All fields are required";
    }
    if (!/\S+@\S+\.\S+/.test(normalizedEmail)) {
      return "Invalid email format";
    }
    if (password.length < 6) {
      return "Password must be at least 6 characters";
    }
    if (password !== confirmPassword) {
      return "Passwords do not match";
    }
    return null;
  };

  const handleSignup = async () => {
    const normalizedEmail = email.trim().toLowerCase();
    const err = validate(normalizedEmail);
    if (err) {
      setError(err);
      return;
    }

    let createdUser: any = null;

    try {
      setLoading(true);
      setError("");

      const userCred = await createUserWithEmailAndPassword(
        auth,
        normalizedEmail,
        password
      );

      const user = userCred.user;
      createdUser = user;

      // 🔥 Create base student document with incomplete onboarding
      await setDoc(doc(db, "students", user.uid), {
        email: user.email,
        role: "student",
        onboardingComplete: false,
        createdAt: serverTimestamp(),
      });

      await setDoc(doc(db, "users", user.uid), {
        role: "student",
        roles: ["student"],
        coins: 200,
        createdAt: serverTimestamp(),
      }, { merge: true });

      // 👉 Go to registration (profile setup)
      router.replace("/(auth)/register");

      // ❌ Do NOT go to home directly

    } catch (err: any) {
      if (createdUser) {
        try {
          await deleteUser(createdUser);
        } catch {
          // Best effort cleanup: auth user may persist if deletion fails.
        }
        setError("Could not complete signup. Please try again.");
        return;
      }

      if (err.code === "auth/email-already-in-use") {
        setError("Email already registered");
      } else if (err.code === "auth/invalid-email") {
        setError("Invalid email");
      } else if (err.code === "auth/weak-password") {
        setError("Weak password");
      } else {
        setError("Signup failed. Try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={["#020617", "#1E1B4B", "#312E81"]}
      style={{ flex: 1 }}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            contentContainerStyle={styles.container}
            keyboardShouldPersistTaps="handled"
          >
            <Text style={styles.logo}>🎓</Text>

            <Text style={styles.title}>
              Vidya<Text style={styles.gold}>AI</Text>
            </Text>

            <Text style={styles.subtitle}>
              Create your account & start learning 🚀
            </Text>

            <View style={styles.card}>
              {/* EMAIL */}
              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#aaa"
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  if (error) setError("");
                }}
                keyboardType="email-address"
                autoCapitalize="none"
              />

              {/* PASSWORD */}
              <View style={styles.passwordBox}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder="Password"
                  placeholderTextColor="#aaa"
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={(text) => {
                    setPassword(text);
                    if (error) setError("");
                  }}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Ionicons
                    name={showPassword ? "eye-off" : "eye"}
                    size={20}
                    color="#888"
                  />
                </TouchableOpacity>
              </View>

              {/* CONFIRM PASSWORD */}
              <TextInput
                style={styles.input}
                placeholder="Confirm Password"
                placeholderTextColor="#aaa"
                secureTextEntry={!showPassword}
                value={confirmPassword}
                onChangeText={(text) => {
                  setConfirmPassword(text);
                  if (error) setError("");
                }}
              />

              {/* ERROR */}
              {error ? <Text style={styles.error}>{error}</Text> : null}

              {/* BUTTON */}
              <TouchableOpacity
                style={[styles.button, loading && { opacity: 0.7 }]}
                onPress={handleSignup}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>
                    Create Account →
                  </Text>
                )}
              </TouchableOpacity>
            </View>

            <TouchableOpacity onPress={() => router.push("/login")}>
              <Text style={styles.footer}>
                Already have an account?{" "}
                <Text style={styles.link}>Login</Text>
              </Text>
            </TouchableOpacity>

          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
  },
  logo: {
    fontSize: 50,
    textAlign: "center",
  },
  title: {
    fontSize: 34,
    fontWeight: "900",
    color: "#fff",
    textAlign: "center",
  },
  gold: {
    color: "#FFD700",
  },
  subtitle: {
    fontSize: 14,
    color: "#c7d2fe",
    textAlign: "center",
    marginBottom: 30,
  },
  card: {
    backgroundColor: "rgba(255,255,255,0.06)",
    padding: 20,
    borderRadius: 20,
  },
  input: {
    backgroundColor: "rgba(255,255,255,0.08)",
    padding: 14,
    borderRadius: 12,
    marginBottom: 15,
    color: "#fff",
  },
  passwordBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 12,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  passwordInput: {
    flex: 1,
    padding: 14,
    color: "#fff",
  },
  error: {
    color: "#F87171",
    marginBottom: 10,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#6366F1",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  footer: {
    color: "#c7d2fe",
    textAlign: "center",
    marginTop: 20,
  },
  link: {
    color: "#A78BFA",
    fontWeight: "600",
  },
});