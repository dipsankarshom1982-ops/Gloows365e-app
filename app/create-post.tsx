import { useTheme } from "@/context/ThemeContext";
import { useNavigation } from "@react-navigation/native";
import * as FileSystem from "expo-file-system/legacy";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useVideoPlayer, VideoView } from "expo-video";
import * as VideoThumbnails from "expo-video-thumbnails";
import { useEffect, useRef, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Animated,
    Image,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { auth, db, storage } from "@/lib/firebase";
import {
    addDoc,
    collection,
    doc,
    getDoc,
    getDocs,
    query,
    serverTimestamp,
    where,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable, UploadTaskSnapshot } from "firebase/storage";

// 🔥 Check Post Limits
const checkPostLimits = async (isSkillBattle: boolean) => {
  const now = new Date();

  // 📅 28 days ago
  const last28Days = new Date();
  last28Days.setDate(now.getDate() - 28);

  // 📅 Today start
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  // 🔥 SkillBattle check
  if (isSkillBattle) {
    const q = query(
      collection(db, "posts"),
      where("isSkillBattle", "==", true),
      where("createdAt", ">", last28Days)
    );

    const snap = await getDocs(q);
    
    // Filter by userId in code
    const userPosts = snap.docs.filter(doc => doc.data().userId === auth.currentUser?.uid);

    if (userPosts.length >= 4) {
      Alert.alert("Limit Reached", "Max 4 SkillBattle posts in 28 days");
      return false;
    }
  }

  // 🔥 Daily limit for Others posts
  if (!isSkillBattle) {
    const q = query(
      collection(db, "posts"),
      where("userId", "==", auth.currentUser?.uid),
      where("isSkillBattle", "==", false),
      where("createdAt", ">", todayStart)
    );

    const snap = await getDocs(q);

    if (snap.size >= 3) {
      Alert.alert("Limit Reached", "Only 3 posts allowed per day for Others");
      return false;
    }
  }

  return true;
};

// 🎥 COMPRESS VIDEO
const compressVideo = async (videoUri: string): Promise<string> => {
  try {
    // Get file info
    const fileInfo = await FileSystem.getInfoAsync(videoUri);

    // Check if file exists
    if (!fileInfo.exists) {
      console.log("❌ File not found");
      return videoUri;
    }

    const fileSizeMB = (fileInfo.size || 0) / (1024 * 1024);

    console.log(`📹 Original video size: ${fileSizeMB.toFixed(2)} MB`);

    // If already small, return original
    if (fileSizeMB < 5) {
      console.log("✅ Video size OK, no compression needed");
      return videoUri;
    }

    // ⚠️ Video is too large
    Alert.alert(
      "⚠️ Large Video",
      `Video is ${fileSizeMB.toFixed(2)}MB. Compression recommended but proceeding with upload.\n\nNote: Upload may take longer.`
    );

    return videoUri;
  } catch (error) {
    console.log("Compression error:", error);
    // If compression fails, return original and proceed
    return videoUri;
  }
};

export default function CreatePost() {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const router = useRouter();
  const params = useLocalSearchParams();

  const isFromChallenge = !!params.challengeId;

  const [step, setStep] = useState(1);
  const [postType, setPostType] = useState("reel");
  const [skillBattleChoice, setSkillBattleChoice] = useState<null | "yes" | "no">(null);

  const [video, setVideo] = useState<any>(null);
  const [image, setImage] = useState<any>(null);
  const [thumbnail, setThumbnail] = useState<string | null>(null);

  const [student, setStudent] = useState<any>(null);

  const [title, setTitle] = useState((params.title as string) || "");
  const [skillBattleTitle, setSkillBattleTitle] = useState((params.challengeName as string) || "");
  const [description, setDescription] = useState((params.caption as string) || "");
  const [category, setCategory] = useState((params.category as string) || "");
  const [feeling, setFeeling] = useState("");
  const [showLocation, setShowLocation] = useState(false);
  const [location, setLocation] = useState("");
  const [district, setDistrict] = useState("");
  const [state, setState] = useState("");
  const [locationFetching, setLocationFetching] = useState(false);
  const [profilePicError, setProfilePicError] = useState(false);

  const [accepted, setAccepted] = useState(false);
  const [parentConsent, setParentConsent] = useState(false);

  const [loading, setLoading] = useState(false);
  const [compressing, setCompressing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const progressAnim = useRef(new Animated.Value(0)).current;

  const categories = [
    "Dance",
    "Singing",
    "Coding",
    "Art",
    "Education",
    "Sports",
    "Motivation",
    "Other",
  ];

  const feelings = ["😊 Happy", "🔥 Energetic", "😎 Confident"];

  // 🎯 Fetch student
  useEffect(() => {
    const fetchStudent = async () => {
      if (!auth.currentUser) return;

      try {
        const snap = await getDoc(
          doc(db, "students", auth.currentUser.uid)
        );

        if (snap.exists()) {
          setStudent(snap.data());
          setProfilePicError(false);
        }
      } catch (error) {
        console.log("Error fetching student:", error);
        setProfilePicError(true);
      }
    };

    fetchStudent();
  }, []);

  // 📍 Auto-fetch district and state when location toggle is on
  useEffect(() => {
    if (showLocation && !district && !state) {
      fetchLocationData();
    }
  }, [showLocation]);

  useEffect(() => {
    if (!isFromChallenge) {
      return;
    }

    if (!skillBattleTitle && params.challengeName) {
      setSkillBattleTitle(params.challengeName as string);
    }

    if (!description && params.caption) {
      setDescription(params.caption as string);
    }

    if (!category && params.category) {
      setCategory(params.category as string);
    }
  }, [category, description, isFromChallenge, params.caption, params.category, params.challengeName, skillBattleTitle]);

  // 📍 Fetch district and state from coordinates
  const fetchLocationData = async () => {
    try {
      setLocationFetching(true);
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== "granted") {
        Alert.alert("Permission Denied", "Location permission is required");
        setLocationFetching(false);
        return;
      }

      const userLocation = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = userLocation.coords;

      // Reverse geocode to get address
      const reverseGeocode = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      if (reverseGeocode.length > 0) {
        const address = reverseGeocode[0];
        const districtName = address.district || address.city || "";
        const stateName = address.region || "";
        
        setLocation(`${districtName}, ${stateName}`);
        setDistrict(districtName);
        setState(stateName);
      }
    } catch (error) {
      console.log("Location error:", error);
      Alert.alert("Location Error", "Could not fetch your location");
    } finally {
      setLocationFetching(false);
    }
  };

  // 🎥 Thumbnail
  const generateThumbnail = async (uri: string) => {
    const { uri: thumb } = await VideoThumbnails.getThumbnailAsync(uri, {
      time: 1000,
    });
    setThumbnail(thumb);
  };

  // 📁 Pick Media
  const pickMedia = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes:
        postType === "reel" || postType === "video"
          ? ["videos"]
          : ["images"],
      quality: 0.6,
    });

    if (!result.canceled) {
      const file = result.assets[0];

      if (postType === "reel" || postType === "video") {
        setVideo(file);
        generateThumbnail(file.uri);
      } else {
        setImage(file);
      }
    }
  };

  const player = useVideoPlayer(video?.uri || null);

  const isSkillBattlePost = isFromChallenge || (postType === "reel" && skillBattleChoice === "yes");

  // 🚀 Upload
  const uploadPost = async () => {
    if (!auth.currentUser) {
      Alert.alert("Login required");
      return;
    }

    const age = student?.age || 0;

    if (isSkillBattlePost) {
      if (age < 13) {
        Alert.alert("You must be 13+ to post");
        return;
      }
      if (!accepted || !parentConsent) {
        Alert.alert("Accept terms & consent");
        return;
      }
      if (!skillBattleTitle || !description || !category || !feeling) {
        Alert.alert("All fields required for Skill Battle");
        return;
      }
    }

    if (!description.trim()) {
      Alert.alert("Add caption/description");
      return;
    }

    if ((postType === "reel" || postType === "video") && !video) {
      Alert.alert("Select video");
      return;
    }

    if (postType === "photo" && !image) {
      Alert.alert("Select image");
      return;
    }

    const finalTitle = isSkillBattlePost
      ? skillBattleTitle
      : postType === "reel" && skillBattleChoice === "no"
        ? "Learning Reels"
        : title;

    let allowed = false;
    try {
      allowed = await checkPostLimits(isSkillBattlePost);
    } catch (error: any) {
      console.log("Post limit check failed:", error);
      Alert.alert(
        "Permission error",
        error?.code
          ? `${error.code}: ${error.message}`
          : "Unable to verify posting limits. Please try again."
      );
      return;
    }

    if (!allowed) return;

    setLoading(true);
    setUploadProgress(0);
    Animated.timing(progressAnim, {
      toValue: 0,
      duration: 0,
      useNativeDriver: false,
    }).start();

    try {
      let mediaUrl = "";

      // 🎥 Upload Video - For both reel and video types
      if (postType === "reel" || postType === "video") {
        setCompressing(true);
        
        // 🎬 Compress video first
        const compressedVideoUri = await compressVideo(video.uri);
        
        setCompressing(false);

        const res = await fetch(compressedVideoUri);
        const blob = await res.blob();

        const fileRef = ref(
          storage,
          `videos/${auth.currentUser.uid}_${Date.now()}.mp4`
        );

        const uploadTask = uploadBytesResumable(fileRef, blob, {
          contentType: video?.mimeType || "video/mp4",
        });
        
        await new Promise<void>((resolve, reject) => {
          uploadTask.on(
            "state_changed",
            (snapshot: UploadTaskSnapshot) => {
              const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              setUploadProgress(progress);
              Animated.timing(progressAnim, {
                toValue: progress,
                duration: 300,
                useNativeDriver: false,
              }).start();
            },
            (error) => reject(error),
            () => {
              resolve();
              return () => {};
            }
          );
        });
        
        mediaUrl = await getDownloadURL(fileRef);
      }

      // 📸 Upload Image
      if (postType === "photo") {
        const res = await fetch(image.uri);
        const blob = await res.blob();

        const fileRef = ref(
          storage,
          `images/${auth.currentUser.uid}_${Date.now()}.jpg`
        );

        const uploadTask = uploadBytesResumable(fileRef, blob, {
          contentType: image?.mimeType || "image/jpeg",
        });
        
        await new Promise<void>((resolve, reject) => {
          uploadTask.on(
            "state_changed",
            (snapshot: UploadTaskSnapshot) => {
              const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              setUploadProgress(progress);
              Animated.timing(progressAnim, {
                toValue: progress,
                duration: 300,
                useNativeDriver: false,
              }).start();
            },
            (error) => reject(error),
            () => {
              resolve();
              return () => {};
            }
          );
        });
        
        mediaUrl = await getDownloadURL(fileRef);
      }

      await addDoc(collection(db, "posts"), {
        userId: auth.currentUser.uid,
        name: student?.name || "",
        school: student?.school || "",
        class: student?.class || "",
        profilePic: student?.profilePic || "",
        postType,
        title: finalTitle,
        description,
        ...(isSkillBattlePost && { category }),
        ...(showLocation && { location, district, state }),
        ...(isSkillBattlePost && { feeling }),
        isSkillBattle: isSkillBattlePost,
        ...(isSkillBattlePost && { month: new Date().toISOString().slice(0, 7) }),
        challengeId: params.challengeId || null,
        mediaUrl,
        thumbnail: thumbnail || "",
        likes: 0,
        comments: 0,
        views: 0,
        createdAt: serverTimestamp(),
      });

      Alert.alert("✅ Posted Successfully!");

      if (postType === "reel") {
        router.replace("/reels");
      } else {
        router.replace("/(drawer)/(tabs)/home");
      }
    } catch (e: any) {
      console.log("Upload failed details:", e);
      Alert.alert(
        "Upload failed",
        e?.code ? `${e.code}: ${e.message}` : e?.message || "Unknown error"
      );
    }

    setLoading(false);
  };

  const canProceed =
    (postType === "reel" && !!video) ||
    (postType === "video" && !!video) ||
    (postType === "photo" && !!image);

  // ---- Shared render helpers ----
  const renderLocationSection = () => (
    <>
      <View style={[styles.row, { marginTop: 15 }]}>
        <Text style={[styles.label, { color: colors.text, flex: 1 }]}>📍 Add Location (Optional)</Text>
        <Switch
          value={showLocation}
          onValueChange={setShowLocation}
          trackColor={{ false: colors.border, true: `${colors.accent}40` }}
          thumbColor={showLocation ? colors.accent : colors.textSecondary}
        />
      </View>
      {showLocation && (
        <>
          {locationFetching && (
            <View style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1, justifyContent: "center", alignItems: "center", minHeight: 50 }]}>
              <ActivityIndicator color={colors.accent} />
            </View>
          )}
          <TextInput
            placeholder="Location (auto-fetched or enter manually)"
            placeholderTextColor={colors.textSecondary}
            value={location}
            onChangeText={setLocation}
            style={[styles.input, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border, borderWidth: 1 }]}
            editable={!locationFetching}
          />
          {district ? (
            <View style={[styles.infoBox, { backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1 }]}>
              <Text style={[styles.infoText, { color: colors.text }]}>📍 District: <Text style={{ fontWeight: "bold", color: colors.accent }}>{district}</Text></Text>
              <Text style={[styles.infoText, { color: colors.text }]}>🗺️ State: <Text style={{ fontWeight: "bold", color: colors.accent }}>{state}</Text></Text>
            </View>
          ) : null}
        </>
      )}
    </>
  );

  const renderCategoryAndFeelings = () => (
    <>
      <Text style={[styles.label, { color: colors.text }]}>🎭 Category</Text>
      <View style={[styles.dropdown, { backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1 }]}>
        {categories.map((c) => (
          <TouchableOpacity key={c} onPress={() => setCategory(c)}>
            <Text style={[styles.option, { color: colors.textSecondary }, category === c && { color: colors.accent, fontWeight: "bold" }]}>{c}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <Text style={[styles.label, { color: colors.text }]}>😊 How are you feeling?</Text>
      <View style={styles.feelings}>
        {feelings.map((f) => (
          <TouchableOpacity
            key={f}
            style={[styles.feelingBtn, { backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1 }, feeling === f && { backgroundColor: colors.accent, borderColor: colors.accent }]}
            onPress={() => setFeeling(f)}
          >
            <Text style={[styles.feelingText, { color: feeling === f ? "#fff" : colors.text }]}>{f}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </>
  );

  const renderTermsAndConsent = () => (
    <>
      <View style={[styles.row, { marginTop: 15 }]}>
        <Text style={[styles.label, { color: colors.text, flex: 1 }]}>Accept Terms</Text>
        <Switch
          value={accepted}
          onValueChange={setAccepted}
          trackColor={{ false: colors.border, true: `${colors.accent}40` }}
          thumbColor={accepted ? colors.accent : colors.textSecondary}
        />
      </View>
      <View style={[styles.row, { marginTop: 15 }]}>
        <Text style={[styles.label, { color: colors.text, flex: 1 }]}>Parent Consent</Text>
        <Switch
          value={parentConsent}
          onValueChange={setParentConsent}
          trackColor={{ false: colors.border, true: `${colors.accent}40` }}
          thumbColor={parentConsent ? colors.accent : colors.textSecondary}
        />
      </View>
    </>
  );

  const renderProgressAndPostBtn = () => (
    <>
      {loading && (
        <View style={[styles.progressContainer, { backgroundColor: colors.card }]}>
          <View style={styles.progressInfo}>
            <Text style={[styles.progressLabel, { color: colors.text }]}>
              {compressing ? "🎬 Compressing..." : `📤 Uploading... ${Math.round(uploadProgress)}%`}
            </Text>
          </View>
          <Animated.View
            style={[styles.progressBar, { backgroundColor: colors.accent, width: progressAnim.interpolate({ inputRange: [0, 100], outputRange: ["0%", "100%"] }) }]}
          />
        </View>
      )}
      <TouchableOpacity style={[styles.btn, loading && { opacity: 0.7 }]} onPress={uploadPost} disabled={loading}>
        {loading ? (
          <View>
            <ActivityIndicator color="#fff" />
            <Text style={{ color: "#fff", marginTop: 8, textAlign: "center", fontSize: 12 }}>
              {compressing ? "🎬 Compressing..." : "📤 Uploading..."}
            </Text>
          </View>
        ) : (
          <Text style={{ color: "#fff" }}>Post 🚀</Text>
        )}
      </TouchableOpacity>
    </>
  );

  // ================= STEP 1 =================
  if (step === 1) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>Create Post</Text>
          <TouchableOpacity disabled={!canProceed} onPress={() => setStep(2)}>
            <Text style={[styles.next, { opacity: canProceed ? 1 : 0.3, color: colors.accent }]}>
              Next →
            </Text>
          </TouchableOpacity>
        </View>

        {/* 🎖️ CHALLENGE MODE BANNER */}
        {isFromChallenge && (
          <View style={[styles.challengeBanner, { borderLeftColor: colors.accent, backgroundColor: `${colors.accent}15` }]}>
            <Text style={[styles.challengeTitle, { color: colors.accent }]}>🎖️ Challenge Mode</Text>
            <Text style={[styles.challengeSubtitle, { color: colors.textSecondary }]}>
              {params.challengeName || "Skill Challenge"}
            </Text>
          </View>
        )}

        {/* PROFILE */}
        <View style={[styles.profileCard, { backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1, padding: 12, borderRadius: 12 }]}>
          {!profilePicError && student?.profilePic ? (
            <Image
              source={{ uri: student.profilePic }}
              style={[styles.avatar, { borderColor: colors.accent, borderWidth: 2 }]}
              onError={() => setProfilePicError(true)}
            />
          ) : (
            <Image
              source={{ uri: `https://i.pravatar.cc/150?u=${auth.currentUser?.uid || auth.currentUser?.email || "user"}&name=${student?.name || "Student"}` }}
              style={[styles.avatar, { borderColor: colors.accent, borderWidth: 2 }]}
            />
          )}
          <View style={{ flex: 1 }}>
            <Text style={[styles.name, { color: colors.text }]}>{student?.name || "Student"}</Text>
            <Text style={[styles.sub, { color: colors.textSecondary }]}>
              {student?.school || "School"} | Class {student?.class || "N/A"}
            </Text>
          </View>
        </View>

        {/* POST TYPE CHIPS - reel, photo, video only */}
        <View style={styles.typeRow}>
          {["reel", "photo", "video"].map((t) => (
            <TouchableOpacity
              key={t}
              style={[
                styles.typeBtn,
                { backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1 },
                postType === t && { backgroundColor: colors.accent, borderColor: colors.accent },
              ]}
              onPress={() => {
                setPostType(t);
                setSkillBattleChoice(null);
                setVideo(null);
                setImage(null);
                setThumbnail(null);
              }}
            >
              <Text style={{ color: postType === t ? "#fff" : colors.text }}>
                {t === "reel" ? "🎬 Reel" : t === "photo" ? "📸 Photo" : "🎥 Video"}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* UPLOAD BOX */}
        <TouchableOpacity
          style={[styles.uploadBox, { backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1 }]}
          onPress={pickMedia}
        >
          {video ? (
            <VideoView player={player} style={{ width: "100%", height: 200 }} />
          ) : image ? (
            <Image source={{ uri: image.uri }} style={{ width: "100%", height: 200, resizeMode: "cover" }} />
          ) : (
            <View style={{ alignItems: "center", gap: 8 }}>
              <Text style={{ color: colors.textSecondary, fontSize: 36 }}>
                {postType === "photo" ? "📸" : "🎬"}
              </Text>
              <Text style={{ color: colors.textSecondary }}>
                Tap to upload {postType === "photo" ? "a photo" : "a video"}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  // ================= STEP 2 =================
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView>
        <TouchableOpacity onPress={() => { setStep(1); setSkillBattleChoice(null); }}>
          <Text style={[styles.back, { color: colors.accent }]}>← Back</Text>
        </TouchableOpacity>

        {/* CHALLENGE BANNER */}
        {isFromChallenge && (
          <View style={[styles.challengeBanner, { borderLeftColor: colors.accent, backgroundColor: `${colors.accent}15` }]}>
            <Text style={[styles.challengeTitle, { color: colors.accent }]}>🎖️ Challenge Mode</Text>
            <Text style={[styles.challengeSubtitle, { color: colors.textSecondary }]}>
              {params.challengeName || "Skill Challenge"}
            </Text>
          </View>
        )}

        {/* ===== REEL: Skill Battle prompt ===== */}
        {postType === "reel" && !isFromChallenge && skillBattleChoice === null && (
          <View style={[styles.promptBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.promptTitle, { color: colors.text }]}>
              🎯 Do you want to participate in Skill Battle contest?
            </Text>
            <Text style={[styles.promptSub, { color: colors.textSecondary }]}>
              Skill Battle entries compete monthly for prizes.{"\n"}Learning Reels are shared with the community.
            </Text>
            <TouchableOpacity
              style={[styles.promptBtnYes, { backgroundColor: colors.accent }]}
              onPress={() => setSkillBattleChoice("yes")}
            >
              <Text style={styles.promptBtnText}>🔥 Yes, Join Skill Battle</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.promptBtnNo, { borderColor: colors.border, borderWidth: 1 }]}
              onPress={() => setSkillBattleChoice("no")}
            >
              <Text style={[styles.promptBtnText, { color: colors.text }]}>📚 No, Post as Learning Reel</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ===== SKILL BATTLE FORM (reel+yes OR from challenge) ===== */}
        {(skillBattleChoice === "yes" || isFromChallenge) && (
          <>
            <Text style={[styles.label, { color: colors.text }]}>🎖️ Select Title</Text>
            <View style={[styles.dropdown, { backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1 }]}>
              {Array.from(new Set([
                (params.challengeName as string) || "",
                "Shikshakool Skill Battle",
                "Amul Skill Battle",
                "Others Battle",
                "Monthly Challenge",
              ].filter(Boolean))).map((t) => (
                <TouchableOpacity key={t} onPress={() => setSkillBattleTitle(t)}>
                  <Text style={[styles.option, { color: colors.textSecondary }, skillBattleTitle === t && { color: colors.accent, fontWeight: "bold" }]}>
                    {t}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={[styles.label, { color: colors.text }]}>📝 Select Caption</Text>
            <View style={[styles.dropdown, { backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1 }]}>
              {["Skill Battle", "My Talent My Pride", "Watch My Skill"].map((c) => (
                <TouchableOpacity key={c} onPress={() => setDescription(c)}>
                  <Text style={[styles.option, { color: colors.textSecondary }, description === c && { color: colors.accent, fontWeight: "bold" }]}>
                    {c}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {renderLocationSection()}
            {renderCategoryAndFeelings()}
            {renderTermsAndConsent()}
            {renderProgressAndPostBtn()}
          </>
        )}

        {/* ===== LEARNING REEL FORM (reel+no) ===== */}
        {postType === "reel" && !isFromChallenge && skillBattleChoice === "no" && (
          <>
            <View style={[styles.infoBox, { backgroundColor: `${colors.accent}15`, borderColor: colors.accent, borderWidth: 1 }]}>
              <Text style={[styles.infoText, { color: colors.accent }]}>📚 Title: Learning Reels</Text>
            </View>

            <TextInput
              placeholder="Write a caption..."
              placeholderTextColor={colors.textSecondary}
              value={description}
              onChangeText={setDescription}
              style={[styles.input, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border, borderWidth: 1 }]}
              multiline
            />

            {renderLocationSection()}
            {renderCategoryAndFeelings()}
            {renderTermsAndConsent()}
            {renderProgressAndPostBtn()}
          </>
        )}

        {/* ===== PHOTO / VIDEO FORM ===== */}
        {(postType === "photo" || postType === "video") && !isFromChallenge && (
          <>
            <TextInput
              placeholder="Title"
              placeholderTextColor={colors.textSecondary}
              value={title}
              onChangeText={setTitle}
              style={[styles.input, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border, borderWidth: 1 }]}
            />
            <TextInput
              placeholder="Description"
              placeholderTextColor={colors.textSecondary}
              value={description}
              onChangeText={setDescription}
              style={[styles.input, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border, borderWidth: 1 }]}
              multiline
            />
            {renderProgressAndPostBtn()}
          </>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}

// ================= STYLES =================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f172a",
    padding: 16,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  title: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
  },

  next: {
    color: "#38bdf8",
    fontWeight: "bold",
  },

  back: {
    color: "#38bdf8",
    marginBottom: 10,
  },

  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 15,
    gap: 12,
  },

  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 10,
  },

  name: {
    color: "#fff",
    fontWeight: "bold",
  },

  sub: {
    color: "#aaa",
  },

  typeRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 10,
  },

  typeBtn: {
    padding: 10,
    backgroundColor: "#1e293b",
    borderRadius: 10,
  },

  activeType: {
    backgroundColor: "#38bdf8",
  },

  uploadBox: {
    height: 200,
    borderRadius: 15,
    backgroundColor: "#1e293b",
    justifyContent: "center",
    alignItems: "center",
  },

  input: {
    backgroundColor: "#1e293b",
    color: "#fff",
    padding: 12,
    borderRadius: 10,
    marginTop: 10,
  },

  categoryWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 10,
  },

  catBtn: {
    backgroundColor: "#1e293b",
    padding: 8,
    margin: 5,
    borderRadius: 10,
  },

  activeCat: {
    backgroundColor: "#38bdf8",
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
  },

  btn: {
    backgroundColor: "#6366f1",
    padding: 15,
    borderRadius: 15,
    alignItems: "center",
    marginTop: 20,
  },

  challengeBanner: {
    backgroundColor: "rgba(255, 215, 0, 0.1)",
    borderLeftWidth: 4,
    borderLeftColor: "#FFD700",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "rgba(255, 215, 0, 0.3)",
  },

  challengeTitle: {
    color: "#FFD700",
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 4,
  },

  challengeSubtitle: {
    color: "#FFF",
    fontSize: 13,
    fontWeight: "600",
  },

  label: {
    color: "#c7d2fe",
    fontSize: 13,
    fontWeight: "600",
    marginTop: 15,
    marginBottom: 8,
  },

  feelings: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 15,
  },

  feelingBtn: {
    backgroundColor: "#1e293b",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#334155",
  },

  activeFeelingBtn: {
    backgroundColor: "#0ea5e9",
    borderColor: "#0ea5e9",
  },

  feelingText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },

  modeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },

  modeBtn: {
    padding: 12,
    backgroundColor: "#1e293b",
    borderRadius: 12,
    width: "48%",
    alignItems: "center",
  },

  activeMode: {
    backgroundColor: "#38bdf8",
  },

  modeText: {
    color: "#fff",
  },

  lockedText: {
    color: "#38bdf8",
    fontSize: 16,
    marginBottom: 10,
  },

  dropdown: {
    backgroundColor: "#1e293b",
    borderRadius: 10,
    padding: 10,
    marginTop: 10,
  },

  option: {
    color: "#fff",
    paddingVertical: 6,
  },

  progressContainer: {
    marginTop: 15,
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#334155",
  },

  progressInfo: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },

  progressLabel: {
    fontSize: 12,
    fontWeight: "600",
  },

  progressBar: {
    height: 6,
    backgroundColor: "#38bdf8",
    borderRadius: 3,
  },

  infoBox: {
    backgroundColor: "#1e293b",
    borderColor: "#334155",
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    marginTop: 10,
  },

  infoText: {
    color: "#c7d2fe",
    fontSize: 13,
    fontWeight: "600",
    marginVertical: 4,
  },

  promptBox: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 22,
    marginVertical: 10,
    gap: 14,
  },

  promptTitle: {
    fontSize: 17,
    fontWeight: "800",
    textAlign: "center",
    lineHeight: 24,
  },

  promptSub: {
    fontSize: 13,
    textAlign: "center",
    lineHeight: 20,
  },

  promptBtnYes: {
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
  },

  promptBtnNo: {
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    backgroundColor: "transparent",
  },

  promptBtnText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 14,
  },
});