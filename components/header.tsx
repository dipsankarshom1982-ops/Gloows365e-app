import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";

import { useTheme } from "@/context/ThemeContext";
import { auth, db } from "@/lib/firebase";
import VCoinsHeaderBadge from "@/components/VCoinsHeaderBadge";
import { Ionicons } from "@expo/vector-icons";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import { useRouter } from "expo-router";
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";

type Props = {
  title?: string;
  hideMenu?: boolean;
  hideTitle?: boolean;
};

export default function Header({
  title = "GLOOWS365E",
  hideMenu = false,
  hideTitle = false,
}: Props) {
  const { colors } = useTheme();
  const navigation = useNavigation<any>();
  const router = useRouter();

  const [profilePic, setProfilePic] = useState<string | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);

  // 📸 Fetch profile picture from database
  useEffect(() => {
    const fetchProfilePic = async () => {
      try {
        if (!auth.currentUser) return;
        const studentDoc = await getDoc(doc(db, "students", auth.currentUser.uid));
        if (studentDoc.exists() && studentDoc.data()?.profilePic) {
          setProfilePic(studentDoc.data().profilePic);
        }
      } catch (error) {
        console.log("Error fetching profile picture:", error);
      }
    };
    fetchProfilePic();
  }, []);

  // 🔔 Unread notifications listener
  useEffect(() => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;

    const q = query(
      collection(db, "notifications", uid, "items"),
      where("read", "==", false)
    );

    const unsub = onSnapshot(q, (snap) => {
      setUnreadCount(snap.size);
    });

    return unsub;
  }, []);

  const handleMenuPress = () => {
    // Walk up the navigator chain until we find the drawer (state.type === 'drawer')
    let nav: any = navigation;
    while (nav) {
      if (nav.getState?.()?.type === "drawer") {
        nav.dispatch(DrawerActions.openDrawer());
        return;
      }
      nav = nav.getParent?.();
    }
    // Fallback: dispatch from current navigator and let React Navigation bubble it
    navigation?.dispatch(DrawerActions.openDrawer());
  };

  const handleProfilePress = () => {
    router.push("/mypost");
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      
      {/* 🔥 HEADER */}
      <View style={styles.header}>

        {/* LEFT */}
        <View style={styles.leftSection}>
          {!hideMenu && (
            <TouchableOpacity onPress={handleMenuPress}>
              <Ionicons name="menu" size={26} color={colors.text} />
            </TouchableOpacity>
          )}

          {!hideTitle && (
            <Text style={[styles.brand, { color: colors.text }]}>
              {title.replace("AI", "")}
              <Text style={styles.gold}>AI</Text>
            </Text>
          )}
        </View>

        {/* RIGHT */}
        <View style={styles.right}>

          {/* COINS */}
          <VCoinsHeaderBadge uid={auth.currentUser?.uid ?? null} />

          {/* NOTIFICATION */}
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={() => router.push("/notifications")}
          >
            <Ionicons
              name="notifications-outline"
              size={22}
              color={colors.text}
            />
            {unreadCount > 0 && (
              <View style={styles.notifBadge}>
                <Text style={styles.notifBadgeText}>
                  {unreadCount > 9 ? "9+" : unreadCount}
                </Text>
              </View>
            )}
          </TouchableOpacity>

          {/* PROFILE */}
          <TouchableOpacity onPress={handleProfilePress}>
            <Image
              source={{
                uri:
                  profilePic ||
                  `https://i.pravatar.cc/100?u=${
                    auth.currentUser?.uid || "user"
                  }`,
              }}
              style={styles.avatar}
              defaultSource={{
                uri: `https://i.pravatar.cc/100?u=${
                  auth.currentUser?.uid || "user"
                }`,
              }}
            />
          </TouchableOpacity>

        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f8f9fa",

    // 🔥 HANDLE STATUS BAR PROPERLY (NO EXTRA GAP)
    paddingTop: 0,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    paddingHorizontal: 15,
    paddingVertical: 6,
  },

  leftSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  brand: {
    fontSize: 20,
    fontWeight: "900",
    color: "#000",
  },

  gold: {
    color: "#FFD700",
  },

  right: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  iconBtn: {
    padding: 5,
  },

  notifBadge: {
    position: "absolute",
    top: 0,
    right: 0,
    backgroundColor: "#EF4444",
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 3,
  },

  notifBadgeText: {
    color: "#fff",
    fontSize: 9,
    fontWeight: "800",
  },

  avatar: {
    width: 32,
    height: 32,
    borderRadius: 20,
  },
});