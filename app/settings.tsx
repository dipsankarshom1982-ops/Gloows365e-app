import Header from "@/components/header";
import { useTheme } from "@/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SettingsScreen() {
  const { isDarkMode, toggleTheme, colors } = useTheme();
  const router = useRouter();

  const settingOptions = [
    {
      id: "theme",
      title: "🌙 Dark Theme",
      description: isDarkMode ? "Turn off for Light mode" : "Turn on for Dark mode",
      icon: "moon",
      toggle: true,
      value: isDarkMode,
    },
    {
      id: "notifications",
      title: "🔔 Notifications",
      description: "Receive push notifications",
      icon: "notifications",
      toggle: true,
      value: true,
    },
    {
      id: "privacy",
      title: "🔒 Privacy",
      description: "Manage your privacy settings",
      icon: "lock-closed",
      toggle: false,
    },
    {
      id: "about",
      title: "ℹ️ About",
      description: "Learn more about VidyaAI",
      icon: "information-circle",
      toggle: false,
    },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Header hideMenu={true} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.headerText}>
          <Text style={[styles.title, { color: colors.accent }]}>⚙️ Settings</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Customize your experience
          </Text>
        </View>

        <View style={styles.settingsContainer}>
          {settingOptions.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={[styles.settingItem, { backgroundColor: colors.card, borderColor: colors.border }]}
            >
              <View style={styles.settingLeft}>
                <View style={styles.iconContainer}>
                  <Text style={styles.icon}>{option.title.split(" ")[0]}</Text>
                </View>
                <View style={styles.settingText}>
                  <Text style={[styles.settingTitle, { color: colors.text }]}>
                    {option.title}
                  </Text>
                  <Text style={[styles.settingDescription, { color: colors.textSecondary }]}>
                    {option.description}
                  </Text>
                </View>
              </View>

              {option.toggle && (
                <Switch
                  value={option.value}
                  onValueChange={option.id === "theme" ? toggleTheme : () => {}}
                  thumbColor={option.value ? colors.accent : colors.textSecondary}
                  trackColor={{ false: colors.border, true: `${colors.accent}40` }}
                />
              )}

              {!option.toggle && (
                <Ionicons name="chevron-forward" size={24} color={colors.textSecondary} />
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* THEME INDICATOR */}
        <View style={[styles.themeIndicator, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.indicatorText, { color: colors.text }]}>
            Current Theme: <Text style={{ fontWeight: "800", color: colors.accent }}>
              {isDarkMode ? "🌙 Dark" : "☀️ Light"}
            </Text>
          </Text>
        </View>

        {/* BACK BUTTON */}
        <TouchableOpacity 
          style={[styles.backButton, { backgroundColor: colors.accent }]}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={22} color="#fff" />
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  headerText: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },

  title: {
    fontSize: 28,
    fontWeight: "800",
    marginBottom: 4,
  },

  subtitle: {
    fontSize: 14,
    fontWeight: "500",
  },

  settingsContainer: {
    paddingHorizontal: 20,
    marginVertical: 20,
    gap: 12,
  },

  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1,
  },

  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  icon: {
    fontSize: 20,
  },

  settingText: {
    flex: 1,
  },

  settingTitle: {
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 2,
  },

  settingDescription: {
    fontSize: 12,
    fontWeight: "500",
  },

  themeIndicator: {
    marginHorizontal: 20,
    marginVertical: 20,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "center",
  },

  indicatorText: {
    fontSize: 14,
    fontWeight: "600",
  },

  backButton: {
    marginHorizontal: 20,
    marginVertical: 20,
    marginBottom: 40,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },

  backButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});
