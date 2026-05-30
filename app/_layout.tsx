import { ThemeProvider, useTheme } from "@/context/ThemeContext";
import { LanguageProvider } from "@/context/LanguageContext";
import { StudentProfileProvider } from "@/context/StudentProfileContext";
import { AppConfigProvider } from "@/context/AppConfigContext";
import { Stack } from "expo-router";
import { useFonts } from "expo-font";
import { StatusBar } from "react-native";
import { Ionicons, MaterialIcons, MaterialCommunityIcons, FontAwesome, AntDesign, Feather } from "@expo/vector-icons";
import { useEffect } from "react";
import * as SplashScreen from "expo-splash-screen";

SplashScreen.preventAutoHideAsync();

function ThemeStatusBar() {
  const { isDarkMode } = useTheme();
  return (
    <StatusBar
      barStyle={isDarkMode ? "light-content" : "dark-content"}
      backgroundColor="transparent"
      translucent
    />
  );
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    ...Ionicons.font,
    ...MaterialIcons.font,
    ...MaterialCommunityIcons.font,
    ...FontAwesome.font,
    ...AntDesign.font,
    ...Feather.font,
  });

  useEffect(() => {
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <ThemeProvider>
      <ThemeStatusBar />
      <LanguageProvider>
        <AppConfigProvider>
          <StudentProfileProvider>
            <Stack screenOptions={{ headerShown: false }} />
          </StudentProfileProvider>
        </AppConfigProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
