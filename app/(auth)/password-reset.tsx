import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { auth } from "@/lib/firebase";
import { sendPasswordResetEmail } from "firebase/auth";

export default function PasswordReset() {
  const navigation = useNavigation();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  // 📧 Validate email
  const isValidEmail = (email: string) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  // 🔐 Reset Password
  const handleReset = async () => {
    if (!email.trim()) {
      Alert.alert("Email required");
      return;
    }

    if (!isValidEmail(email)) {
      Alert.alert("Invalid email format");
      return;
    }

    setLoading(true);

    try {
      await sendPasswordResetEmail(auth, email);

      Alert.alert(
        "✅ Email Sent",
        "Password reset link has been sent to your email."
      );

      navigation.goBack();
    } catch (error: any) {
      let message = "Something went wrong";

      if (error.code === "auth/user-not-found") {
        message = "No account found with this email";
      }

      if (error.code === "auth/invalid-email") {
        message = "Invalid email address";
      }

      Alert.alert("Error", message);
    }

    setLoading(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        {/* HEADER */}
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>← Back</Text>
        </TouchableOpacity>

        {/* TITLE */}
        <View style={styles.headerBox}>
          <Text style={styles.title}>Forgot Password?</Text>
          <Text style={styles.subtitle}>
            Enter your email and we’ll send you a reset link 🔐
          </Text>
        </View>

        {/* INPUT CARD */}
        <View style={styles.card}>
          <Text style={styles.label}>Email Address</Text>

          <TextInput
            placeholder="Enter your email"
            placeholderTextColor="#888"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        {/* BUTTON */}
        <TouchableOpacity
          style={[
            styles.button,
            { opacity: email ? 1 : 0.5 },
          ]}
          onPress={handleReset}
          disabled={!email || loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Send Reset Link 🚀</Text>
          )}
        </TouchableOpacity>

        {/* FOOTER */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Remember your password?
          </Text>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.login}>Login</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ================= STYLES =================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f172a",
    padding: 20,
  },

  back: {
    color: "#38bdf8",
    fontSize: 16,
    marginBottom: 10,
  },

  headerBox: {
    marginTop: 30,
    marginBottom: 30,
  },

  title: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "bold",
  },

  subtitle: {
    color: "#94a3b8",
    marginTop: 10,
    fontSize: 14,
  },

  card: {
    backgroundColor: "#1e293b",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },

  label: {
    color: "#cbd5f5",
    marginBottom: 8,
    fontSize: 14,
  },

  input: {
    backgroundColor: "#0f172a",
    borderRadius: 12,
    padding: 14,
    color: "#fff",
    borderWidth: 1,
    borderColor: "#334155",
  },

  button: {
    marginTop: 30,
    backgroundColor: "#6366f1",
    padding: 16,
    borderRadius: 20,
    alignItems: "center",
    shadowColor: "#6366f1",
    shadowOpacity: 0.5,
    shadowRadius: 10,
  },

  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },

  footer: {
    marginTop: 40,
    flexDirection: "row",
    justifyContent: "center",
  },

  footerText: {
    color: "#94a3b8",
  },

  login: {
    color: "#38bdf8",
    marginLeft: 6,
    fontWeight: "bold",
  },
});