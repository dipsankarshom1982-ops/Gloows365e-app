import "dotenv/config";

export default {
  expo: {
    name:        "vidya",
    slug:        "vidya",
    version:     "1.0.0",
    orientation: "portrait",
    icon:        "./assets/images/icon.png",
    scheme:      "vidya",
    userInterfaceStyle: "automatic",
    newArchEnabled:     true,

    ios: {
      supportsTablet: true,
    },

    android: {
      adaptiveIcon: {
        backgroundColor:  "#E6F4FE",
        foregroundImage:  "./assets/images/android-icon-foreground.png",
        backgroundImage:  "./assets/images/android-icon-background.png",
        monochromeImage:  "./assets/images/android-icon-monochrome.png",
      },
      edgeToEdgeEnabled:             true,
      predictiveBackGestureEnabled:  false,
      package:                       "com.anonymous.vidya",
    },

    web: {
      output:  "static",
      favicon: "./assets/images/favicon.png",
    },

    plugins: [
      "expo-router",
      [
        "expo-notifications",
        {
          icon: "./assets/images/icon.png",
          color: "#6366F1",
          androidMode: "default",
        },
      ],
      [
        "expo-splash-screen",
        {
          image:           "./assets/images/splash-icon.png",
          imageWidth:      200,
          resizeMode:      "contain",
          backgroundColor: "#ffffff",
          dark: {
            backgroundColor: "#000000",
          },
        },
      ],
      "expo-video",
      "@react-native-community/datetimepicker",
      "react-native-compressor",
    ],

    experiments: {
      typedRoutes:     true,
      reactCompiler:   true,
    },

    // ── Environment variables ─────────────────────────────────
    // EXPO_PUBLIC_ vars are automatically injected into process.env
    // by the Metro bundler when using app.config.js + dotenv/config.
    // No extra code needed — process.env.EXPO_PUBLIC_CF_CUSTOMER_CODE
    // will just work after this migration.
    extra: {
      cfCustomerCode: process.env.EXPO_PUBLIC_CF_CUSTOMER_CODE ?? "",
      cfWorkerUrl:    process.env.EXPO_PUBLIC_CF_WORKER_URL    ?? "",
    },
  },
};