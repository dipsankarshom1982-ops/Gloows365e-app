// All 22 constitutionally recognised Indian languages + English
// Strings not yet translated fall back to English via i18next fallbackLng

export type TranslationSet = {
  // ── Navigation (Drawer) ──────────────────────────────────
  home: string;
  leaderboard: string;
  wallet: string;
  settings: string;
  dashboard: string;
  aiGuru: string;
  skillBoard: string;
  logout: string;
  // ── Settings ─────────────────────────────────────────────
  profileSettings: string;
  language: string;
  changeLanguage: string;
  darkTheme: string;
  notifications: string;
  privacy: string;
  about: string;
  customizeExperience: string;
  // ── Common actions ────────────────────────────────────────
  save: string;
  cancel: string;
  edit: string;
  back: string;
  delete: string;
  loading: string;
  editProfile: string;
  saveChanges: string;
  verify: string;
  confirm: string;
  send: string;
  // ── Language screen ───────────────────────────────────────
  languageTitle: string;
  languageSubtitle: string;
  searchLanguage: string;
  scheduleNote: string;
  // ── Profile ───────────────────────────────────────────────
  basicInfo: string;
  academicDetails: string;
  location: string;
  interests: string;
  fullName: string;
  phoneNumber: string;
  dateOfBirth: string;
  age: string;
  school: string;
  preferredLanguage: string;
  pincode: string;
  class: string;
  board: string;
  // ── LearnFun screen ───────────────────────────────────────
  learnFunLoading: string;
  profileNotFound: string;
  profileSetupPrompt: string;
  dailyStreak: string;
  view: string;
  todaysMission: string;
  daily: string;
  noMissionToday: string;
  skillWorlds: string;
  bossBattle: string;
  yourGames: string;
  gamesLoading: string;
  yourBadges: string;
  viewAll: string;
  comingSoon: string;
  play: string;
  // ── Seekho screen ─────────────────────────────────────────
  searchVideos: string;
  featured: string;
  noVideosFound: string;
  clearFilters: string;
  allVideos: string;
  videosComingSoon: string;
  // ── SkillBattle screen ────────────────────────────────────
  loadingBattles: string;
  noActiveBattles: string;
  checkBackSoon: string;
  refresh: string;
  computingRanks: string;
  retry: string;
  notRankedYet: string;
  uploadReelPrompt: string;
  viewFullSkillboard: string;
  battleEnded: string;
  notEligible: string;
  uploadReel: string;
  // ── VidyaStar / Shikshastar screen ───────────────────────
  loginRequired: string;
  live: string;
  completed: string;
  prizePool: string;
  endingSoon: string;
  viewResult: string;
  joinNow: string;
  participate: string;
  reserveSpot: string;
  startsSoon: string;
  all: string;
  upcoming: string;
  // ── Home screen ────────────────────────────────────────────
  aiGuruSubtitle: string;
  askAnything: string;
  instantAnswers: string;
  studyHelp: string;
  startChatting: string;
  // ── AI Guru ────────────────────────────────────────────────
  premiumFeature: string;
  premiumUnlockMsg: string;
  maybeLater: string;
  upgrade: string;
  aiClassroom: string;
  freeLessonsLeft: string;
  unlimitedAccess: string;
  lessonSetup: string;
  continueBtn: string;
  fillRequiredFields: string;
  fillRequiredFieldsDesc: string;
  // ── VidyaGuru ──────────────────────────────────────────────
  vidyaGuruAI: string;
  personalAiTeacher: string;
  readyToHelp: string;
  thinking: string;
  speaking: string;
  listening: string;
  paywallTitle: string;
  paywallBody: string;
  upgradeToPremium: string;
  // ── Seekho ─────────────────────────────────────────────────
  seekhoSignIn: string;
  curriculumAligned: string;
  subjects: string;
  continueLearning: string;
  resumeLearning: string;
  revisionDue: string;
  revisionReady: string;
  unlockCurriculum: string;
  // ── Create Reels ───────────────────────────────────────────
  pendingReview: string;
  inReview: string;
  approved: string;
  rejected: string;
  limitReached: string;
  limitReachedDesc: string;
  // ── Home feed sections ────────────────────────────────────────
  seekhoPreviewTitle?: string;
  seekhoPreviewSub?: string;
  explore?: string;
  vidyaStarPreviewTitle?: string;
  vidyaStarPreviewSub?: string;
  couldNotLoadContests?: string;
  contestsComingSoon?: string;
  viewResults?: string;
  participateNow?: string;
  skillBattlePreviewTitle?: string;
  skillBattlePreviewSub?: string;
  couldNotLoadBattles?: string;
  battlesComingSoon?: string;
  poweredBy?: string;
  joinedCount?: string;
  knowledgeHubTitle?: string;
  knowledgeHubSub?: string;
  watchMore?: string;
  couldNotLoadVideos?: string;
  moreVideosSoon?: string;
  noVideosInCat?: string;
  shortLearningTitle?: string;
  noLearningVideos?: string;
  skillBattleShortsTitle?: string;
  noSkillBattleVideos?: string;
  battleBadge?: string;
  shikshaStarPreviewTitle?: string;
  shikshaStarPreviewSub?: string;
  viewStars?: string;
  couldNotLoadStars?: string;
  shikshaStarEmpty?: string;
  becomeShikshaStar?: string;
  discoverPreviewTitle?: string;
  discoverPreviewSub?: string;
  discoverTitle?: string;
  discoverSubtitle?: string;
  discoverCta?: string;
};

type Translations = Record<string, TranslationSet>;

const translations: Translations = {
  // ─────────────────────────── English ──────────────────────────────
  en: {
    home: "Home", leaderboard: "Leaderboard", wallet: "Wallet",
    settings: "Settings", dashboard: "Dashboard", aiGuru: "AI Guru",
    skillBoard: "Skill Board", logout: "Logout",
    profileSettings: "Profile Settings", language: "Language",
    changeLanguage: "Change app & content language",
    darkTheme: "Dark Theme", notifications: "Notifications",
    privacy: "Privacy", about: "About",
    customizeExperience: "Customize your experience",
    save: "Save", cancel: "Cancel", edit: "Edit", back: "Back",
    delete: "Delete", loading: "Loading...", editProfile: "Edit Profile",
    saveChanges: "Save Changes", verify: "Verify", confirm: "Confirm", send: "Send",
    languageTitle: "Language", languageSubtitle: "All 22 constitutionally recognised Indian languages",
    searchLanguage: "Search language...", scheduleNote: "These are the 22 languages listed in the 8th Schedule of the Constitution of India.",
    basicInfo: "Basic Information", academicDetails: "Academic Details",
    location: "Location", interests: "Interests", fullName: "Full Name",
    phoneNumber: "Phone Number", dateOfBirth: "Date of Birth", age: "Age",
    school: "School / Institution", preferredLanguage: "Preferred Language",
    pincode: "Pincode", class: "Class / Grade", board: "Board",
    learnFunLoading: "Loading your LearnFun world...",
    profileNotFound: "Profile not found",
    profileSetupPrompt: "Please complete your profile setup to start playing!",
    dailyStreak: "Daily Streak", view: "View", todaysMission: "Today's Mission",
    daily: "Daily", noMissionToday: "No mission for today yet. Check back soon!",
    skillWorlds: "Skill Worlds", bossBattle: "Boss Battle",
    yourGames: "Your Games", gamesLoading: "Games loading... or try again later!",
    yourBadges: "Your Badges", viewAll: "View All", comingSoon: "Coming Soon", play: "Play",
    searchVideos: "Search videos, subjects, teachers...",
    featured: "Featured", noVideosFound: "No Videos Found",
    clearFilters: "Clear Filters", allVideos: "All Videos",
    videosComingSoon: "Videos coming soon!",
    loadingBattles: "Loading battles...", noActiveBattles: "No Active Battles",
    checkBackSoon: "Check back soon for new skill battles!",
    refresh: "Refresh", computingRanks: "Computing your ranks...",
    retry: "Retry", notRankedYet: "You're not ranked yet",
    uploadReelPrompt: "Upload a reel to enter the battle!",
    viewFullSkillboard: "View Full Skillboard",
    battleEnded: "Battle Ended", notEligible: "Not Eligible", uploadReel: "Upload Reel",
    loginRequired: "Login Required", live: "Live", completed: "Completed",
    prizePool: "Prize Pool", endingSoon: "Ending Soon", viewResult: "View Result",
    joinNow: "Join Now", participate: "Participate", reserveSpot: "Reserve Spot",
    startsSoon: "Starts Soon", all: "All", upcoming: "Upcoming",
    aiGuruSubtitle: "Your personal learning assistant", askAnything: "Ask Anything", instantAnswers: "Instant Answers", studyHelp: "Study Help", startChatting: "Start Chatting →",
    premiumFeature: "Premium Feature", premiumUnlockMsg: "Upgrade to AI Guru Premium to unlock this feature.", maybeLater: "Maybe Later", upgrade: "Upgrade",
    aiClassroom: "Your personal AI classroom\npowered by Gemini", freeLessonsLeft: "free lessons left today", unlimitedAccess: "Unlimited Premium Access Active",
    lessonSetup: "Lesson Setup", continueBtn: "Continue →", fillRequiredFields: "Fill Required Fields", fillRequiredFieldsDesc: "Please select a subject and enter chapter name.",
    vidyaGuruAI: "VidyaGuru AI", personalAiTeacher: "Your personal AI teacher", readyToHelp: "Ready to help!", thinking: "Thinking...", speaking: "Speaking...", listening: "Listening...",
    paywallTitle: "Continue with VidyaGuru?", paywallBody: "You've used your free question for today. Upgrade to Premium for unlimited conversations!", upgradeToPremium: "Upgrade to Premium",
    seekhoSignIn: "Sign in to access Seekho", curriculumAligned: "Curriculum-aligned learning", subjects: "Subjects", continueLearning: "Continue Learning", resumeLearning: "Resume where you left off",
    revisionDue: "Revision Due!", revisionReady: "concepts ready for review", unlockCurriculum: "Unlock Full Curriculum",
    pendingReview: "Pending Review", inReview: "In Review", approved: "Approved", rejected: "Rejected", limitReached: "Limit Reached", limitReachedDesc: "You've reached the upload limit for this battle.",
    seekhoPreviewTitle: "📖 Seekho", seekhoPreviewSub: "Learn subjects, skills and creative activities", explore: "Explore →",
    vidyaStarPreviewTitle: "🌟 VidyaStar Contest", vidyaStarPreviewSub: "Showcase your talent and win prizes",
    couldNotLoadContests: "Could not load contests.", contestsComingSoon: "Exciting contests coming soon!", viewResults: "View Results →", participateNow: "Participate Now →",
    skillBattlePreviewTitle: "⚔️ SkillBattle Challenge", skillBattlePreviewSub: "Compete, rank higher, and win exciting prizes",
    couldNotLoadBattles: "Could not load battles.", battlesComingSoon: "New battles coming soon!", poweredBy: "Powered by {{name}}", joinedCount: "{{count}} joined",
    knowledgeHubTitle: "🌐 Knowledge Hub", knowledgeHubSub: "Videos for learning, growth and daily life", watchMore: "Watch More →",
    couldNotLoadVideos: "Could not load videos.", moreVideosSoon: "More videos coming soon!", noVideosInCat: "No \"{{cat}}\" videos yet.",
    shortLearningTitle: "Short Learning", noLearningVideos: "No learning videos yet",
    skillBattleShortsTitle: "🔥 Skill Battle Shorts", noSkillBattleVideos: "No skill battle videos yet", battleBadge: "⚡ Battle",
    shikshaStarPreviewTitle: "⭐ ShikshaStar", shikshaStarPreviewSub: "Celebrating talented students of Vidya", viewStars: "View Stars →",
    couldNotLoadStars: "Could not load stars.", shikshaStarEmpty: "Your talent can be featured here soon!", becomeShikshaStar: "Become a ShikshaStar",
    discoverPreviewTitle: "🧭 Discover AI", discoverPreviewSub: "AI-powered career, college & scholarship discovery",
    discoverTitle: "Vidya Discover AI", discoverSubtitle: "Find your perfect career, college & scholarships", discoverCta: "Explore Your Future →",
  },

  // ─────────────────────────── Hindi ────────────────────────────────
  hi: {
    home: "होम", leaderboard: "लीडरबोर्ड", wallet: "वॉलेट",
    settings: "सेटिंग्स", dashboard: "डैशबोर्ड", aiGuru: "AI गुरु",
    skillBoard: "स्किल बोर्ड", logout: "लॉगआउट",
    profileSettings: "प्रोफ़ाइल सेटिंग्स", language: "भाषा",
    changeLanguage: "ऐप और सामग्री की भाषा बदलें",
    darkTheme: "डार्क थीम", notifications: "सूचनाएं",
    privacy: "गोपनीयता", about: "परिचय",
    customizeExperience: "अपना अनुभव अनुकूलित करें",
    save: "सहेजें", cancel: "रद्द करें", edit: "संपादित करें", back: "वापस",
    delete: "हटाएं", loading: "लोड हो रहा है...", editProfile: "प्रोफ़ाइल संपादित करें",
    saveChanges: "बदलाव सहेजें", verify: "सत्यापित करें", confirm: "पुष्टि करें", send: "भेजें",
    languageTitle: "भाषा", languageSubtitle: "भारतीय संविधान की 8वीं अनुसूची की सभी 22 भाषाएँ",
    searchLanguage: "भाषा खोजें...", scheduleNote: "ये भारत के संविधान की 8वीं अनुसूची में सूचीबद्ध 22 भाषाएँ हैं।",
    basicInfo: "मूल जानकारी", academicDetails: "शैक्षणिक विवरण",
    location: "स्थान", interests: "रुचियाँ", fullName: "पूरा नाम",
    phoneNumber: "फ़ोन नंबर", dateOfBirth: "जन्म तिथि", age: "आयु",
    school: "स्कूल / संस्थान", preferredLanguage: "पसंदीदा भाषा",
    pincode: "पिनकोड", class: "कक्षा / ग्रेड", board: "बोर्ड",
    learnFunLoading: "LearnFun दुनिया लोड हो रही है...",
    profileNotFound: "प्रोफ़ाइल नहीं मिली",
    profileSetupPrompt: "खेलना शुरू करने के लिए अपनी प्रोफ़ाइल पूरी करें!",
    dailyStreak: "दैनिक स्ट्रीक", view: "देखें", todaysMission: "आज का मिशन",
    daily: "दैनिक", noMissionToday: "आज कोई मिशन नहीं। जल्द वापस आएं!",
    skillWorlds: "कौशल दुनिया", bossBattle: "बॉस बैटल",
    yourGames: "आपके खेल", gamesLoading: "खेल लोड हो रहे हैं...",
    yourBadges: "आपके बैज", viewAll: "सभी देखें", comingSoon: "जल्द आ रहा है", play: "खेलें",
    searchVideos: "वीडियो, विषय, शिक्षक खोजें...",
    featured: "विशेष", noVideosFound: "कोई वीडियो नहीं मिला",
    clearFilters: "फ़िल्टर साफ़ करें", allVideos: "सभी वीडियो",
    videosComingSoon: "वीडियो जल्द आएंगे!",
    loadingBattles: "बैटल लोड हो रहे हैं...", noActiveBattles: "कोई सक्रिय बैटल नहीं",
    checkBackSoon: "नई स्किल बैटल के लिए जल्द वापस आएं!",
    refresh: "ताज़ा करें", computingRanks: "रैंक गणना हो रही है...",
    retry: "पुनः प्रयास", notRankedYet: "आप अभी रैंक में नहीं हैं",
    uploadReelPrompt: "बैटल में शामिल होने के लिए रील अपलोड करें!",
    viewFullSkillboard: "पूरा स्किलबोर्ड देखें",
    battleEnded: "बैटल समाप्त", notEligible: "पात्र नहीं", uploadReel: "रील अपलोड करें",
    loginRequired: "लॉगिन आवश्यक है", live: "लाइव", completed: "पूर्ण",
    prizePool: "पुरस्कार राशि", endingSoon: "जल्द समाप्त होगा", viewResult: "परिणाम देखें",
    joinNow: "अभी जुड़ें", participate: "भाग लें", reserveSpot: "सीट बुक करें",
    startsSoon: "जल्द शुरू होगा", all: "सभी", upcoming: "आगामी",
    aiGuruSubtitle: "आपका व्यक्तिगत शिक्षण सहायक", askAnything: "कुछ भी पूछें", instantAnswers: "तत्काल उत्तर", studyHelp: "पढ़ाई में मदद", startChatting: "बात शुरू करें →",
    premiumFeature: "प्रीमियम फीचर", premiumUnlockMsg: "इस फीचर को अनलॉक करने के लिए AI Guru Premium अपग्रेड करें।", maybeLater: "बाद में", upgrade: "अपग्रेड करें",
    aiClassroom: "आपकी व्यक्तिगत AI क्लासरूम\nGemini द्वारा संचालित", freeLessonsLeft: "आज के मुफ़्त पाठ शेष", unlimitedAccess: "असीमित प्रीमियम एक्सेस सक्रिय",
    lessonSetup: "पाठ सेटअप", continueBtn: "जारी रखें →", fillRequiredFields: "आवश्यक फ़ील्ड भरें", fillRequiredFieldsDesc: "कृपया विषय चुनें और अध्याय का नाम दर्ज करें।",
    vidyaGuruAI: "विद्यागुरु AI", personalAiTeacher: "आपके व्यक्तिगत AI शिक्षक", readyToHelp: "मदद के लिए तैयार!", thinking: "सोच रहा हूँ...", speaking: "बोल रहा हूँ...", listening: "सुन रहा हूँ...",
    paywallTitle: "विद्यागुरु के साथ जारी रखें?", paywallBody: "आज का मुफ़्त प्रश्न समाप्त। असीमित बातचीत के लिए प्रीमियम अपग्रेड करें!", upgradeToPremium: "प्रीमियम में अपग्रेड करें",
    seekhoSignIn: "Seekho एक्सेस करने के लिए लॉगिन करें", curriculumAligned: "पाठ्यक्रम-आधारित शिक्षण", subjects: "विषय", continueLearning: "सीखना जारी रखें", resumeLearning: "जहाँ छोड़ा था वहाँ से शुरू करें",
    revisionDue: "रिवीजन करें!", revisionReady: "अवधारणाएं समीक्षा के लिए तैयार", unlockCurriculum: "पूरा पाठ्यक्रम अनलॉक करें",
    pendingReview: "समीक्षा प्रतीक्षित", inReview: "जांच में", approved: "स्वीकृत", rejected: "अस्वीकृत", limitReached: "सीमा पहुंच गई", limitReachedDesc: "आपने इस बैटल की अपलोड सीमा पार कर ली है।",
    seekhoPreviewTitle: "📖 सीखो", seekhoPreviewSub: "विषय, कौशल और रचनात्मक गतिविधियाँ सीखें", explore: "एक्सप्लोर करें →",
    vidyaStarPreviewTitle: "🌟 विद्यास्टार प्रतियोगिता", vidyaStarPreviewSub: "अपनी प्रतिभा दिखाएं और पुरस्कार जीतें",
    couldNotLoadContests: "प्रतियोगिताएं लोड नहीं हो सकीं।", contestsComingSoon: "रोमांचक प्रतियोगिताएं जल्द आ रही हैं!", viewResults: "परिणाम देखें →", participateNow: "अभी भाग लें →",
    skillBattlePreviewTitle: "⚔️ स्किलबैटल चैलेंज", skillBattlePreviewSub: "प्रतिस्पर्धा करें, रैंक बढ़ाएं और पुरस्कार जीतें",
    couldNotLoadBattles: "बैटल लोड नहीं हो सके।", battlesComingSoon: "नई बैटल जल्द आ रही हैं!", poweredBy: "{{name}} द्वारा संचालित", joinedCount: "{{count}} शामिल हुए",
    knowledgeHubTitle: "🌐 नॉलेज हब", knowledgeHubSub: "सीखने, विकास और दैनिक जीवन के लिए वीडियो", watchMore: "और देखें →",
    couldNotLoadVideos: "वीडियो लोड नहीं हो सके।", moreVideosSoon: "और वीडियो जल्द आएंगे!", noVideosInCat: "\"{{cat}}\" में अभी कोई वीडियो नहीं।",
    shortLearningTitle: "शॉर्ट लर्निंग", noLearningVideos: "अभी कोई लर्निंग वीडियो नहीं",
    skillBattleShortsTitle: "🔥 स्किल बैटल शॉर्ट्स", noSkillBattleVideos: "अभी कोई स्किल बैटल वीडियो नहीं", battleBadge: "⚡ बैटल",
    shikshaStarPreviewTitle: "⭐ शिक्षास्टार", shikshaStarPreviewSub: "विद्या के प्रतिभाशाली छात्रों का जश्न", viewStars: "स्टार देखें →",
    couldNotLoadStars: "स्टार लोड नहीं हो सके।", shikshaStarEmpty: "आपकी प्रतिभा यहाँ जल्द दिखाई जा सकती है!", becomeShikshaStar: "शिक्षास्टार बनें",
    discoverPreviewTitle: "🧭 डिस्कवर AI", discoverPreviewSub: "AI-संचालित करियर, कॉलेज और छात्रवृत्ति खोज",
    discoverTitle: "विद्या डिस्कवर AI", discoverSubtitle: "अपना सही करियर, कॉलेज और छात्रवृत्ति खोजें", discoverCta: "अपना भविष्य एक्सप्लोर करें →",
  },

  // ─────────────────────────── Bengali ──────────────────────────────
  bn: {
    home: "হোম", leaderboard: "লিডারবোর্ড", wallet: "ওয়ালেট",
    settings: "সেটিংস", dashboard: "ড্যাশবোর্ড", aiGuru: "AI গুরু",
    skillBoard: "স্কিল বোর্ড", logout: "লগআউট",
    profileSettings: "প্রোফাইল সেটিংস", language: "ভাষা",
    changeLanguage: "অ্যাপ ও কন্টেন্টের ভাষা পরিবর্তন করুন",
    darkTheme: "ডার্ক থিম", notifications: "বিজ্ঞপ্তি",
    privacy: "গোপনীয়তা", about: "সম্পর্কে",
    customizeExperience: "আপনার অভিজ্ঞতা কাস্টমাইজ করুন",
    save: "সংরক্ষণ করুন", cancel: "বাতিল", edit: "সম্পাদনা করুন", back: "ফিরে যান",
    delete: "মুছুন", loading: "লোড হচ্ছে...", editProfile: "প্রোফাইল সম্পাদনা করুন",
    saveChanges: "পরিবর্তন সংরক্ষণ করুন", verify: "যাচাই করুন", confirm: "নিশ্চিত করুন", send: "পাঠান",
    languageTitle: "ভাষা", languageSubtitle: "ভারতীয় সংবিধানের ৮ম তফসিলের সকল ২২টি ভাষা",
    searchLanguage: "ভাষা অনুসন্ধান করুন...", scheduleNote: "এগুলি ভারতের সংবিধানের ৮ম তফসিলে তালিকাভুক্ত ২২টি ভাষা।",
    basicInfo: "মূল তথ্য", academicDetails: "একাডেমিক বিবরণ",
    location: "অবস্থান", interests: "আগ্রহ", fullName: "পূর্ণ নাম",
    phoneNumber: "ফোন নম্বর", dateOfBirth: "জন্ম তারিখ", age: "বয়স",
    school: "স্কুল / প্রতিষ্ঠান", preferredLanguage: "পছন্দের ভাষা",
    pincode: "পিনকোড", class: "শ্রেণী / গ্রেড", board: "বোর্ড",
    learnFunLoading: "আপনার LearnFun জগৎ লোড হচ্ছে...",
    profileNotFound: "প্রোফাইল পাওয়া যায়নি",
    profileSetupPrompt: "খেলা শুরু করতে আপনার প্রোফাইল সম্পূর্ণ করুন!",
    dailyStreak: "দৈনিক স্ট্রিক", view: "দেখুন", todaysMission: "আজকের মিশন",
    daily: "দৈনিক", noMissionToday: "আজকে কোনো মিশন নেই। শীঘ্রই ফিরে আসুন!",
    skillWorlds: "দক্ষতার জগৎ", bossBattle: "বস ব্যাটেল",
    yourGames: "আপনার গেমস", gamesLoading: "গেমস লোড হচ্ছে...",
    yourBadges: "আপনার ব্যাজ", viewAll: "সব দেখুন", comingSoon: "শীঘ্রই আসছে", play: "খেলুন",
    searchVideos: "ভিডিও, বিষয়, শিক্ষক খুঁজুন...",
    featured: "বিশেষ", noVideosFound: "কোনো ভিডিও পাওয়া যায়নি",
    clearFilters: "ফিল্টার সাফ করুন", allVideos: "সব ভিডিও",
    videosComingSoon: "ভিডিও শীঘ্রই আসছে!",
    loadingBattles: "ব্যাটেল লোড হচ্ছে...", noActiveBattles: "কোনো সক্রিয় ব্যাটেল নেই",
    checkBackSoon: "নতুন স্কিল ব্যাটেলের জন্য শীঘ্রই ফিরে আসুন!",
    refresh: "রিফ্রেশ", computingRanks: "আপনার র‌্যাঙ্ক গণনা হচ্ছে...",
    retry: "পুনরায় চেষ্টা", notRankedYet: "আপনি এখনো র‌্যাংকড নন",
    uploadReelPrompt: "ব্যাটেলে অংশ নিতে রিল আপলোড করুন!",
    viewFullSkillboard: "পূর্ণ স্কিলবোর্ড দেখুন",
    battleEnded: "ব্যাটেল শেষ", notEligible: "যোগ্য নয়", uploadReel: "রিল আপলোড করুন",
    loginRequired: "লগইন প্রয়োজন", live: "লাইভ", completed: "সম্পন্ন",
    prizePool: "পুরস্কার পুল", endingSoon: "শীঘ্রই শেষ হবে", viewResult: "ফলাফল দেখুন",
    joinNow: "এখনই যোগ দিন", participate: "অংশগ্রহণ করুন", reserveSpot: "জায়গা বুক করুন",
    startsSoon: "শীঘ্রই শুরু হবে", all: "সব", upcoming: "আসন্ন",
    aiGuruSubtitle: "আপনার ব্যক্তিগত শিক্ষা সহায়ক", askAnything: "যেকোনো কিছু জিজ্ঞেস করুন", instantAnswers: "তাৎক্ষণিক উত্তর", studyHelp: "পড়াশুনায় সাহায্য", startChatting: "চ্যাট শুরু করুন →",
    premiumFeature: "প্রিমিয়াম ফিচার", premiumUnlockMsg: "এই ফিচার আনলক করতে AI Guru Premium আপগ্রেড করুন।", maybeLater: "পরে", upgrade: "আপগ্রেড",
    aiClassroom: "আপনার ব্যক্তিগত AI ক্লাসরুম\nGemini দ্বারা চালিত", freeLessonsLeft: "আজকের বিনামূল্যে পাঠ বাকি", unlimitedAccess: "সীমাহীন প্রিমিয়াম অ্যাক্সেস সক্রিয়",
    lessonSetup: "পাঠ সেটআপ", continueBtn: "চালিয়ে যান →", fillRequiredFields: "প্রয়োজনীয় তথ্য পূরণ করুন", fillRequiredFieldsDesc: "অনুগ্রহ করে বিষয় নির্বাচন করুন এবং অধ্যায়ের নাম লিখুন।",
    vidyaGuruAI: "বিদ্যাগুরু AI", personalAiTeacher: "আপনার ব্যক্তিগত AI শিক্ষক", readyToHelp: "সাহায্যের জন্য প্রস্তুত!", thinking: "ভাবছি...", speaking: "বলছি...", listening: "শুনছি...",
    paywallTitle: "বিদ্যাগুরুর সাথে চালিয়ে যান?", paywallBody: "আজকের বিনামূল্যে প্রশ্ন শেষ। সীমাহীন কথোপকথনের জন্য প্রিমিয়াম আপগ্রেড করুন!", upgradeToPremium: "প্রিমিয়ামে আপগ্রেড করুন",
    seekhoSignIn: "Seekho অ্যাক্সেস করতে লগইন করুন", curriculumAligned: "পাঠ্যক্রম-ভিত্তিক শিক্ষা", subjects: "বিষয়সমূহ", continueLearning: "শেখা চালিয়ে যান", resumeLearning: "যেখানে ছেড়েছিলেন সেখান থেকে শুরু করুন",
    revisionDue: "রিভিশন করুন!", revisionReady: "ধারণাসমূহ পুনরালোচনার জন্য প্রস্তুত", unlockCurriculum: "সম্পূর্ণ পাঠ্যক্রম আনলক করুন",
    pendingReview: "পর্যালোচনা বাকি", inReview: "পর্যালোচনায়", approved: "অনুমোদিত", rejected: "প্রত্যাখ্যাত", limitReached: "সীমা পৌঁছেছে", limitReachedDesc: "আপনি এই ব্যাটেলের আপলোড সীমায় পৌঁছে গেছেন।",
    seekhoPreviewTitle: "📖 শেখো", seekhoPreviewSub: "বিষয়, দক্ষতা ও সৃজনশীল কার্যক্রম শিখুন", explore: "এক্সপ্লোর করুন →",
    vidyaStarPreviewTitle: "🌟 বিদ্যাস্টার প্রতিযোগিতা", vidyaStarPreviewSub: "আপনার প্রতিভা দেখান এবং পুরস্কার জিতুন",
    couldNotLoadContests: "প্রতিযোগিতা লোড করা যায়নি।", contestsComingSoon: "রোমাঞ্চকর প্রতিযোগিতা শীঘ্রই আসছে!", viewResults: "ফলাফল দেখুন →", participateNow: "এখনই অংশগ্রহণ করুন →",
    skillBattlePreviewTitle: "⚔️ স্কিলব্যাটেল চ্যালেঞ্জ", skillBattlePreviewSub: "প্রতিযোগিতা করুন, র‌্যাংক বাড়ান এবং পুরস্কার জিতুন",
    couldNotLoadBattles: "ব্যাটেল লোড করা যায়নি।", battlesComingSoon: "নতুন ব্যাটেল শীঘ্রই আসছে!", poweredBy: "{{name}} দ্বারা চালিত", joinedCount: "{{count}} জন যোগ দিয়েছেন",
    knowledgeHubTitle: "🌐 নলেজ হাব", knowledgeHubSub: "শেখার, বিকাশের ও দৈনন্দিন জীবনের ভিডিও", watchMore: "আরও দেখুন →",
    couldNotLoadVideos: "ভিডিও লোড করা যায়নি।", moreVideosSoon: "আরও ভিডিও শীঘ্রই আসছে!", noVideosInCat: "\"{{cat}}\" এর কোনো ভিডিও নেই এখনো।",
    shortLearningTitle: "শর্ট লার্নিং", noLearningVideos: "এখনো কোনো লার্নিং ভিডিও নেই",
    skillBattleShortsTitle: "🔥 স্কিল ব্যাটেল শর্টস", noSkillBattleVideos: "এখনো কোনো স্কিল ব্যাটেল ভিডিও নেই", battleBadge: "⚡ ব্যাটেল",
    shikshaStarPreviewTitle: "⭐ শিক্ষাস্টার", shikshaStarPreviewSub: "বিদ্যার প্রতিভাবান শিক্ষার্থীদের উদযাপন", viewStars: "স্টার দেখুন →",
    couldNotLoadStars: "স্টার লোড করা যায়নি।", shikshaStarEmpty: "আপনার প্রতিভা এখানে শীঘ্রই প্রদর্শিত হতে পারে!", becomeShikshaStar: "শিক্ষাস্টার হন",
    discoverPreviewTitle: "🧭 ডিসকভার AI", discoverPreviewSub: "AI-চালিত ক্যারিয়ার, কলেজ ও বৃত্তি আবিষ্কার",
    discoverTitle: "বিদ্যা ডিসকভার AI", discoverSubtitle: "আপনার সেরা ক্যারিয়ার, কলেজ ও বৃত্তি খুঁজুন", discoverCta: "আপনার ভবিষ্যৎ এক্সপ্লোর করুন →",
  },

  // ─────────────────────────── Tamil ────────────────────────────────
  ta: {
    home: "முகப்பு", leaderboard: "லீடர்போர்ட்", wallet: "வாலட்",
    settings: "அமைப்புகள்", dashboard: "டாஷ்போர்ட்", aiGuru: "AI குரு",
    skillBoard: "திறன் பலகை", logout: "வெளியேறு",
    profileSettings: "சுயவிவர அமைப்புகள்", language: "மொழி",
    changeLanguage: "பயன்பாடு மற்றும் உள்ளடக்க மொழியை மாற்றுக",
    darkTheme: "இருண்ட தீம்", notifications: "அறிவிப்புகள்",
    privacy: "தனியுரிமை", about: "பற்றி",
    customizeExperience: "உங்கள் அனுபவத்தை தனிப்பயனாக்குங்கள்",
    save: "சேமி", cancel: "ரத்து செய்", edit: "திருத்து", back: "திரும்பு",
    delete: "நீக்கு", loading: "ஏற்றுகிறது...", editProfile: "சுயவிவரம் திருத்து",
    saveChanges: "மாற்றங்களை சேமி", verify: "சரிபார்", confirm: "உறுதிப்படுத்து", send: "அனுப்பு",
    languageTitle: "மொழி", languageSubtitle: "இந்திய அரசியலமைப்பின் 8ஆம் அட்டவணையின் அனைத்து 22 மொழிகளும்",
    searchLanguage: "மொழி தேடு...", scheduleNote: "இவை இந்தியா அரசியலமைப்பின் 8ஆம் அட்டவணையில் பட்டியலிடப்பட்ட 22 மொழிகள்.",
    basicInfo: "அடிப்படை தகவல்", academicDetails: "கல்வி விவரங்கள்",
    location: "இடம்", interests: "ஆர்வங்கள்", fullName: "முழு பெயர்",
    phoneNumber: "தொலைபேசி எண்", dateOfBirth: "பிறந்த தேதி", age: "வயது",
    school: "பள்ளி / நிறுவனம்", preferredLanguage: "விருப்பமான மொழி",
    pincode: "பின்கோட்", class: "வகுப்பு / தரம்", board: "வாரியம்",
    learnFunLoading: "உங்கள் LearnFun உலகம் ஏற்றப்படுகிறது...",
    profileNotFound: "சுயவிவரம் கிடைக்கவில்லை",
    profileSetupPrompt: "விளையாடத் தொடங்க உங்கள் சுயவிவரத்தை முடிக்கவும்!",
    dailyStreak: "தினசரி தொடர்", view: "பார்", todaysMission: "இன்றைய பணி",
    daily: "தினசரி", noMissionToday: "இன்று பணி இல்லை. சீக்கிரம் திரும்பி வாருங்கள்!",
    skillWorlds: "திறன் உலகங்கள்", bossBattle: "பாஸ் போர்",
    yourGames: "உங்கள் விளையாட்டுகள்", gamesLoading: "விளையாட்டுகள் ஏற்றப்படுகின்றன...",
    yourBadges: "உங்கள் பதக்கங்கள்", viewAll: "அனைத்தும் பார்", comingSoon: "விரைவில் வருகிறது", play: "விளையாடு",
    searchVideos: "வீடியோ, பாடம், ஆசிரியர் தேடு...",
    featured: "சிறப்பு", noVideosFound: "வீடியோக்கள் இல்லை",
    clearFilters: "வடிகட்டிகளை அழி", allVideos: "அனைத்து வீடியோக்கள்",
    videosComingSoon: "வீடியோக்கள் விரைவில்!",
    loadingBattles: "போர்கள் ஏற்றப்படுகின்றன...", noActiveBattles: "செயலில் போர்கள் இல்லை",
    checkBackSoon: "புதிய திறன் போர்களுக்கு விரைவில் திரும்பவும்!",
    refresh: "புதுப்பி", computingRanks: "உங்கள் தரவரிசை கணக்கிடப்படுகிறது...",
    retry: "மீண்டும் முயற்சி", notRankedYet: "நீங்கள் இன்னும் தரவரிசையில் இல்லீர்கள்",
    uploadReelPrompt: "போரில் பங்கேற்க ரீல் பதிவேற்றவும்!",
    viewFullSkillboard: "முழு திறன் பலகையை பார்",
    battleEnded: "போர் முடிந்தது", notEligible: "தகுதியில்லை", uploadReel: "ரீல் பதிவேற்று",
    loginRequired: "உள்நுழைவு தேவை", live: "நேரடி", completed: "முடிந்தது",
    prizePool: "பரிசு தொகை", endingSoon: "விரைவில் முடியும்", viewResult: "முடிவை பார்",
    joinNow: "இப்போது சேர்", participate: "பங்கேற்கவும்", reserveSpot: "இடம் முதல்",
    startsSoon: "விரைவில் தொடங்கும்", all: "அனைத்தும்", upcoming: "வரவிருக்கும்",
    aiGuruSubtitle: "உங்கள் தனிப்பட்ட கற்றல் உதவியாளர்", askAnything: "எதையும் கேளுங்கள்", instantAnswers: "உடனடி பதில்கள்", studyHelp: "படிப்பு உதவி", startChatting: "பேசத் தொடங்கு →",
    premiumFeature: "பிரீமியம் அம்சம்", premiumUnlockMsg: "இந்த அம்சத்தை திறக்க AI Guru Premium க்கு மேம்படுத்துங்கள்.", maybeLater: "பிறகு பார்க்கலாம்", upgrade: "மேம்படுத்து",
    aiClassroom: "உங்கள் தனிப்பட்ட AI வகுப்பறை\nGemini ஆல் இயக்கப்படுகிறது", freeLessonsLeft: "இன்று இலவச பாடங்கள் மீதம்", unlimitedAccess: "வரம்பற்ற பிரீமியம் அணுகல் செயலில்",
    lessonSetup: "பாட அமைப்பு", continueBtn: "தொடரவும் →", fillRequiredFields: "தேவையான தகவல்களை நிரப்பவும்", fillRequiredFieldsDesc: "பாடத்தை தேர்வு செய்து அத்தியாயம் பெயர் உள்ளிடவும்.",
    vidyaGuruAI: "VidyaGuru AI", personalAiTeacher: "உங்கள் தனிப்பட்ட AI ஆசிரியர்", readyToHelp: "உதவ தயாராக இருக்கிறேன்!", thinking: "யோசிக்கிறேன்...", speaking: "பேசுகிறேன்...", listening: "கேட்கிறேன்...",
    paywallTitle: "VidyaGuru உடன் தொடரவும்?", paywallBody: "இன்றைய இலவச கேள்வி முடிந்தது. வரம்பற்ற உரையாடலுக்கு பிரீமியம் மேம்படுத்துங்கள்!", upgradeToPremium: "பிரீமியத்திற்கு மேம்படுத்து",
    seekhoSignIn: "Seekho அணுக உள்நுழையவும்", curriculumAligned: "பாடத்திட்டம் சார்ந்த கற்றல்", subjects: "பாடங்கள்", continueLearning: "கற்றலை தொடரவும்", resumeLearning: "நிறுத்திய இடத்திலிருந்து தொடர்",
    revisionDue: "மீட்டுரைவு தேவை!", revisionReady: "கருத்துகள் மதிப்பாய்விற்கு தயார்", unlockCurriculum: "முழு பாடத்திட்டத்தை திறக்கவும்",
    pendingReview: "மதிப்பாய்வு நிலுவையில்", inReview: "மதிப்பாய்வில்", approved: "அனுமதிக்கப்பட்டது", rejected: "நிராகரிக்கப்பட்டது", limitReached: "வரம்பை அடைந்தது", limitReachedDesc: "இந்த போரில் உங்கள் பதிவேற்ற வரம்பை அடைந்தீர்கள்.",
    seekhoPreviewTitle: "📖 சீக்கோ", seekhoPreviewSub: "பாடங்கள், திறன்கள் மற்றும் படைப்பு செயல்கள் கற்கவும்", explore: "ஆராய்க →",
    vidyaStarPreviewTitle: "🌟 விதியாஸ்டார் போட்டி", vidyaStarPreviewSub: "உங்கள் திறமையை காட்டுங்கள் பரிசு வெல்லுங்கள்",
    couldNotLoadContests: "போட்டிகளை ஏற்ற முடியவில்லை.", contestsComingSoon: "உற்சாகமான போட்டிகள் விரைவில்!", viewResults: "முடிவுகளை பார் →", participateNow: "இப்போது பங்கேற்கவும் →",
    skillBattlePreviewTitle: "⚔️ திறன் சவால்", skillBattlePreviewSub: "போட்டியிடுங்கள், தரவரிசை அதிகரிக்கவும், பரிசுகள் வெல்லுங்கள்",
    couldNotLoadBattles: "போர்களை ஏற்ற முடியவில்லை.", battlesComingSoon: "புதிய போர்கள் விரைவில்!", poweredBy: "{{name}} மூலம்", joinedCount: "{{count}} சேர்ந்தனர்",
    knowledgeHubTitle: "🌐 அறிவு மையம்", knowledgeHubSub: "கற்றல், வளர்ச்சி மற்றும் அன்றாட வாழ்க்கைக்கான வீடியோக்கள்", watchMore: "மேலும் பார் →",
    couldNotLoadVideos: "வீடியோக்களை ஏற்ற முடியவில்லை.", moreVideosSoon: "மேலும் வீடியோக்கள் விரைவில்!", noVideosInCat: "\"{{cat}}\" வீடியோக்கள் இல்லை இன்னும்.",
    shortLearningTitle: "குறுகிய கற்றல்", noLearningVideos: "இன்னும் கற்றல் வீடியோக்கள் இல்லை",
    skillBattleShortsTitle: "🔥 திறன் போர் ஷார்ட்ஸ்", noSkillBattleVideos: "இன்னும் திறன் போர் வீடியோக்கள் இல்லை", battleBadge: "⚡ போர்",
    shikshaStarPreviewTitle: "⭐ சிக்ஷாஸ்டார்", shikshaStarPreviewSub: "விதியாவின் திறமையான மாணவர்களை கொண்டாடுகிறோம்", viewStars: "நட்சத்திரங்களை பார் →",
    couldNotLoadStars: "நட்சத்திரங்களை ஏற்ற முடியவில்லை.", shikshaStarEmpty: "உங்கள் திறமை விரைவில் இங்கே சேர்க்கப்படலாம்!", becomeShikshaStar: "சிக்ஷாஸ்டார் ஆகுங்கள்",
    discoverPreviewTitle: "🧭 டிஸ்கவர் AI", discoverPreviewSub: "AI-ஆல் இயக்கப்படும் தொழில், கல்லூரி மற்றும் உதவித்தொகை கண்டுபிடிப்பு",
    discoverTitle: "விதியா டிஸ்கவர் AI", discoverSubtitle: "உங்கள் சிறந்த தொழில், கல்லூரி மற்றும் உதவித்தொகை கண்டுபிடிக்கவும்", discoverCta: "உங்கள் எதிர்காலத்தை ஆராயுங்கள் →",
  },

  // ─────────────────────────── Telugu ───────────────────────────────
  te: {
    home: "హోమ్", leaderboard: "లీడర్‌బోర్డ్", wallet: "వాలెట్",
    settings: "సెట్టింగులు", dashboard: "డాష్‌బోర్డ్", aiGuru: "AI గురు",
    skillBoard: "స్కిల్ బోర్డ్", logout: "లాగ్అవుట్",
    profileSettings: "ప్రొఫైల్ సెట్టింగులు", language: "భాష",
    changeLanguage: "యాప్ మరియు కంటెంట్ భాషను మార్చండి",
    darkTheme: "డార్క్ థీమ్", notifications: "నోటిఫికేషన్లు",
    privacy: "గోప్యత", about: "గురించి",
    customizeExperience: "మీ అనుభవాన్ని అనుకూలీకరించండి",
    save: "సేవ్ చేయండి", cancel: "రద్దు చేయండి", edit: "సవరించండి", back: "వెనుకకు",
    delete: "తొలగించు", loading: "లోడ్ అవుతోంది...", editProfile: "ప్రొఫైల్ సవరించండి",
    saveChanges: "మార్పులు సేవ్ చేయండి", verify: "ధృవీకరించండి", confirm: "నిర్ధారించండి", send: "పంపండి",
    languageTitle: "భాష", languageSubtitle: "భారత రాజ్యాంగం 8వ షెడ్యూల్‌లోని అన్ని 22 భాషలు",
    searchLanguage: "భాష వెతకండి...", scheduleNote: "ఇవి భారత రాజ్యాంగం యొక్క 8వ షెడ్యూల్‌లో జాబితా చేయబడిన 22 భాషలు.",
    basicInfo: "ప్రాథమిక సమాచారం", academicDetails: "విద్యా వివరాలు",
    location: "స్థానం", interests: "ఆసక్తులు", fullName: "పూర్తి పేరు",
    phoneNumber: "ఫోన్ నంబర్", dateOfBirth: "పుట్టిన తేదీ", age: "వయసు",
    school: "పాఠశాల / సంస్థ", preferredLanguage: "ఇష్టమైన భాష",
    pincode: "పిన్‌కోడ్", class: "తరగతి / గ్రేడ్", board: "బోర్డ్",
    learnFunLoading: "మీ LearnFun ప్రపంచం లోడ్ అవుతోంది...",
    profileNotFound: "ప్రొఫైల్ కనుగొనబడలేదు",
    profileSetupPrompt: "ఆడటం ప్రారంభించడానికి మీ ప్రొఫైల్ పూర్తి చేయండి!",
    dailyStreak: "రోజువారీ స్ట్రీక్", view: "చూడండి", todaysMission: "నేటి మిషన్",
    daily: "రోజువారీ", noMissionToday: "నేడు మిషన్ లేదు. త్వరలో తిరిగి రండి!",
    skillWorlds: "నైపుణ్య ప్రపంచాలు", bossBattle: "బాస్ బ్యాటిల్",
    yourGames: "మీ గేమ్‌లు", gamesLoading: "గేమ్‌లు లోడ్ అవుతున్నాయి...",
    yourBadges: "మీ బ్యాడ్జ్‌లు", viewAll: "అన్నీ చూడండి", comingSoon: "త్వరలో వస్తోంది", play: "ఆడండి",
    searchVideos: "వీడియోలు, విషయాలు, ఉపాధ్యాయులను వెతకండి...",
    featured: "విశేష", noVideosFound: "వీడియోలు కనుగొనబడలేదు",
    clearFilters: "ఫిల్టర్‌లు క్లియర్ చేయండి", allVideos: "అన్ని వీడియోలు",
    videosComingSoon: "వీడియోలు త్వరలో!",
    loadingBattles: "బ్యాటిల్‌లు లోడ్ అవుతున్నాయి...", noActiveBattles: "చురుకైన బ్యాటిల్‌లు లేవు",
    checkBackSoon: "కొత్త స్కిల్ బ్యాటిల్‌ల కోసం త్వరలో తిరిగి రండి!",
    refresh: "రిఫ్రెష్", computingRanks: "మీ ర్యాంకులు లెక్కిస్తున్నారు...",
    retry: "మళ్లీ ప్రయత్నించండి", notRankedYet: "మీరు ఇంకా ర్యాంక్ పొందలేదు",
    uploadReelPrompt: "బ్యాటిల్‌లో చేరడానికి రీల్ అప్‌లోడ్ చేయండి!",
    viewFullSkillboard: "పూర్తి స్కిల్‌బోర్డ్ చూడండి",
    battleEnded: "బ్యాటిల్ ముగిసింది", notEligible: "అర్హత లేదు", uploadReel: "రీల్ అప్‌లోడ్ చేయండి",
    loginRequired: "లాగిన్ అవసరం", live: "లైవ్", completed: "పూర్తయింది",
    prizePool: "బహుమతి నిధి", endingSoon: "త్వరలో ముగుస్తుంది", viewResult: "ఫలితం చూడండి",
    joinNow: "ఇప్పుడే చేరండి", participate: "పాల్గొనండి", reserveSpot: "సీటు బుక్ చేయండి",
    startsSoon: "త్వరలో ప్రారంభమవుతుంది", all: "అన్నీ", upcoming: "రాబోయే",
    aiGuruSubtitle: "మీ వ్యక్తిగత అభ్యాస సహాయకుడు", askAnything: "ఏదైనా అడగండి", instantAnswers: "తక్షణ సమాధానాలు", studyHelp: "చదువులో సహాయం", startChatting: "చాటింగ్ ప్రారంభించండి →",
    premiumFeature: "ప్రీమియం ఫీచర్", premiumUnlockMsg: "ఈ ఫీచర్ అన్‌లాక్ చేయడానికి AI Guru Premium కి అప్‌గ్రేడ్ చేయండి.", maybeLater: "తర్వాత", upgrade: "అప్‌గ్రేడ్",
    aiClassroom: "మీ వ్యక్తిగత AI తరగతిగది\nGemini ద్వారా నడుపబడింది", freeLessonsLeft: "ఈరోజు ఉచిత పాఠాలు మిగిలాయి", unlimitedAccess: "అపరిమిత ప్రీమియం యాక్సెస్ సక్రియంగా ఉంది",
    lessonSetup: "పాఠం సెటప్", continueBtn: "కొనసాగించండి →", fillRequiredFields: "అవసరమైన ఫీల్డ్‌లు పూరించండి", fillRequiredFieldsDesc: "దయచేసి సబ్జెక్ట్ ఎంచుకుని అధ్యాయం పేరు నమోదు చేయండి.",
    vidyaGuruAI: "VidyaGuru AI", personalAiTeacher: "మీ వ్యక్తిగత AI ఉపాధ్యాయుడు", readyToHelp: "సహాయానికి సిద్ధంగా ఉన్నాను!", thinking: "ఆలోచిస్తున్నాను...", speaking: "మాట్లాడుతున్నాను...", listening: "వింటున్నాను...",
    paywallTitle: "VidyaGuru తో కొనసాగించాలా?", paywallBody: "ఈరోజు ఉచిత ప్రశ్న ఉపయోగించారు. అపరిమిత సంభాషణల కోసం ప్రీమియం కి అప్‌గ్రేడ్ చేయండి!", upgradeToPremium: "ప్రీమియం కి అప్‌గ్రేడ్ చేయండి",
    seekhoSignIn: "Seekho యాక్సెస్ చేయడానికి లాగిన్ అవ్వండి", curriculumAligned: "పాఠ్యప్రణాళిక-ఆధారిత అభ్యాసం", subjects: "విషయాలు", continueLearning: "నేర్చుకోవడం కొనసాగించండి", resumeLearning: "మీరు ఆగిన చోట నుండి కొనసాగించండి",
    revisionDue: "సమీక్ష అవసరం!", revisionReady: "భావనలు సమీక్షకు సిద్ధంగా ఉన్నాయి", unlockCurriculum: "పూర్తి పాఠ్యప్రణాళికను అన్‌లాక్ చేయండి",
    pendingReview: "సమీక్ష నిలబడ్డది", inReview: "సమీక్షలో", approved: "ఆమోదించబడింది", rejected: "తిరస్కరించబడింది", limitReached: "పరిమితి చేరుకుంది", limitReachedDesc: "ఈ బ్యాటిల్ కోసం అప్‌లోడ్ పరిమితిని చేరుకున్నారు.",
    seekhoPreviewTitle: "📖 సీఖో", seekhoPreviewSub: "సబ్జెక్ట్‌లు, నైపుణ్యాలు మరియు సృజనాత్మక కార్యకలాపాలు నేర్చుకోండి", explore: "అన్వేషించండి →",
    vidyaStarPreviewTitle: "🌟 విద్యాస్టార్ పోటీ", vidyaStarPreviewSub: "మీ ప్రతిభ చూపించి బహుమతులు గెలుచుకోండి",
    couldNotLoadContests: "పోటీలు లోడ్ కాలేదు.", contestsComingSoon: "ఉత్తేజకరమైన పోటీలు త్వరలో!", viewResults: "ఫలితాలు చూడండి →", participateNow: "ఇప్పుడే పాల్గొనండి →",
    skillBattlePreviewTitle: "⚔️ స్కిల్‌బ్యాటిల్ చాలెంజ్", skillBattlePreviewSub: "పోటీపడండి, ర్యాంక్ పెంచుకోండి మరియు బహుమతులు గెలుచుకోండి",
    couldNotLoadBattles: "బ్యాటిల్‌లు లోడ్ కాలేదు.", battlesComingSoon: "కొత్త బ్యాటిల్‌లు త్వరలో!", poweredBy: "{{name}} ద్వారా", joinedCount: "{{count}} మంది చేరారు",
    knowledgeHubTitle: "🌐 నాలెడ్జ్ హబ్", knowledgeHubSub: "నేర్చుకోవడానికి, వికాసానికి మరియు రోజువారీ జీవితానికి వీడియోలు", watchMore: "మరిన్ని చూడండి →",
    couldNotLoadVideos: "వీడియోలు లోడ్ కాలేదు.", moreVideosSoon: "మరిన్ని వీడియోలు త్వరలో!", noVideosInCat: "\"{{cat}}\" వీడియోలు ఇంకా లేవు.",
    shortLearningTitle: "షార్ట్ లర్నింగ్", noLearningVideos: "ఇంకా నేర్చుకునే వీడియోలు లేవు",
    skillBattleShortsTitle: "🔥 స్కిల్ బ్యాటిల్ షార్ట్స్", noSkillBattleVideos: "ఇంకా స్కిల్ బ్యాటిల్ వీడియోలు లేవు", battleBadge: "⚡ బ్యాటిల్",
    shikshaStarPreviewTitle: "⭐ శిక్షాస్టార్", shikshaStarPreviewSub: "విద్యా ప్రతిభావంతులైన విద్యార్థులను వేడుక చేసుకుంటున్నాం", viewStars: "స్టార్‌లను చూడండి →",
    couldNotLoadStars: "స్టార్‌లు లోడ్ కాలేదు.", shikshaStarEmpty: "మీ ప్రతిభ త్వరలో ఇక్కడ ప్రదర్శించబడవచ్చు!", becomeShikshaStar: "శిక్షాస్టార్ అవ్వండి",
    discoverPreviewTitle: "🧭 డిస్కవర్ AI", discoverPreviewSub: "AI-ఆధారిత కెరీర్, కళాశాల & స్కాలర్‌షిప్ ఆవిష్కరణ",
    discoverTitle: "విద్యా డిస్కవర్ AI", discoverSubtitle: "మీ సరైన కెరీర్, కళాశాల & స్కాలర్‌షిప్ కనుగొనండి", discoverCta: "మీ భవిష్యత్తును అన్వేషించండి →",
  },

  // ─────────────────────────── Kannada ──────────────────────────────
  kn: {
    home: "ಮನೆ", leaderboard: "ಲೀಡರ್‌ಬೋರ್ಡ್", wallet: "ವ್ಯಾಲೆಟ್",
    settings: "ಸೆಟ್ಟಿಂಗ್‌ಗಳು", dashboard: "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್", aiGuru: "AI ಗುರು",
    skillBoard: "ಕೌಶಲ ಬೋರ್ಡ್", logout: "ಲಾಗ್‌ಔಟ್",
    profileSettings: "ಪ್ರೊಫೈಲ್ ಸೆಟ್ಟಿಂಗ್‌ಗಳು", language: "ಭಾಷೆ",
    changeLanguage: "ಅಪ್ಲಿಕೇಶನ್ ಮತ್ತು ವಿಷಯದ ಭಾಷೆ ಬದಲಾಯಿಸಿ",
    darkTheme: "ಡಾರ್ಕ್ ಥೀಮ್", notifications: "ಅಧಿಸೂಚನೆಗಳು",
    privacy: "ಗೌಪ್ಯತೆ", about: "ಕುರಿತು",
    customizeExperience: "ನಿಮ್ಮ ಅನುಭವವನ್ನು ಕಸ್ಟಮೈಸ್ ಮಾಡಿ",
    save: "ಉಳಿಸಿ", cancel: "ರದ್ದು ಮಾಡಿ", edit: "ಸಂಪಾದಿಸಿ", back: "ಹಿಂತಿರುಗಿ",
    delete: "ಅಳಿಸಿ", loading: "ಲೋಡ್ ಆಗುತ್ತಿದೆ...", editProfile: "ಪ್ರೊಫೈಲ್ ಸಂಪಾದಿಸಿ",
    saveChanges: "ಬದಲಾವಣೆಗಳನ್ನು ಉಳಿಸಿ", verify: "ಪರಿಶೀಲಿಸಿ", confirm: "ದೃಢೀಕರಿಸಿ", send: "ಕಳುಹಿಸಿ",
    languageTitle: "ಭಾಷೆ", languageSubtitle: "ಭಾರತದ ಸಂವಿಧಾನದ 8ನೇ ಶೆಡ್ಯೂಲ್‌ನ ಎಲ್ಲಾ 22 ಭಾಷೆಗಳು",
    searchLanguage: "ಭಾಷೆ ಹುಡುಕಿ...", scheduleNote: "ಇವು ಭಾರತದ ಸಂವಿಧಾನದ 8ನೇ ಶೆಡ್ಯೂಲ್‌ನಲ್ಲಿ ಪಟ್ಟಿ ಮಾಡಲಾದ 22 ಭಾಷೆಗಳಾಗಿವೆ.",
    basicInfo: "ಮೂಲ ಮಾಹಿತಿ", academicDetails: "ಶೈಕ್ಷಣಿಕ ವಿವರಗಳು",
    location: "ಸ್ಥಳ", interests: "ಆಸಕ್ತಿಗಳು", fullName: "ಪೂರ್ಣ ಹೆಸರು",
    phoneNumber: "ಫೋನ್ ನಂಬರ್", dateOfBirth: "ಹುಟ್ಟಿದ ದಿನಾಂಕ", age: "ವಯಸ್ಸು",
    school: "ಶಾಲೆ / ಸಂಸ್ಥೆ", preferredLanguage: "ಆದ್ಯತೆಯ ಭಾಷೆ",
    pincode: "ಪಿನ್‌ಕೋಡ್", class: "ತರಗತಿ / ಗ್ರೇಡ್", board: "ಬೋರ್ಡ್",
    learnFunLoading: "ನಿಮ್ಮ LearnFun ಪ್ರಪಂಚ ಲೋಡ್ ಆಗುತ್ತಿದೆ...",
    profileNotFound: "ಪ್ರೊಫೈಲ್ ಕಂಡುಬಂದಿಲ್ಲ",
    profileSetupPrompt: "ಆಡಲು ಪ್ರಾರಂಭಿಸಲು ನಿಮ್ಮ ಪ್ರೊಫೈಲ್ ಪೂರ್ಣಗೊಳಿಸಿ!",
    dailyStreak: "ದೈನಂದಿನ ಸ್ಟ್ರೀಕ್", view: "ನೋಡಿ", todaysMission: "ಇಂದಿನ ಮಿಷನ್",
    daily: "ದೈನಂದಿನ", noMissionToday: "ಇಂದು ಮಿಷನ್ ಇಲ್ಲ. ಶೀಘ್ರದಲ್ಲೇ ಮರಳಿ ಬನ್ನಿ!",
    skillWorlds: "ಕೌಶಲ ಪ್ರಪಂಚಗಳು", bossBattle: "ಬಾಸ್ ಯುದ್ಧ",
    yourGames: "ನಿಮ್ಮ ಆಟಗಳು", gamesLoading: "ಆಟಗಳು ಲೋಡ್ ಆಗುತ್ತಿವೆ...",
    yourBadges: "ನಿಮ್ಮ ಬ್ಯಾಡ್ಜ್‌ಗಳು", viewAll: "ಎಲ್ಲವನ್ನೂ ನೋಡಿ", comingSoon: "ಶೀಘ್ರದಲ್ಲೇ ಬರಲಿದೆ", play: "ಆಡಿ",
    searchVideos: "ವೀಡಿಯೋ, ವಿಷಯ, ಶಿಕ್ಷಕರನ್ನು ಹುಡುಕಿ...",
    featured: "ವಿಶೇಷ", noVideosFound: "ಯಾವುದೇ ವೀಡಿಯೋ ಕಂಡುಬಂದಿಲ್ಲ",
    clearFilters: "ಫಿಲ್ಟರ್‌ಗಳನ್ನು ಅಳಿಸಿ", allVideos: "ಎಲ್ಲಾ ವೀಡಿಯೋಗಳು",
    videosComingSoon: "ವೀಡಿಯೋಗಳು ಶೀಘ್ರದಲ್ಲೇ!",
    loadingBattles: "ಯುದ್ಧಗಳು ಲೋಡ್ ಆಗುತ್ತಿವೆ...", noActiveBattles: "ಯಾವುದೇ ಸಕ್ರಿಯ ಯುದ್ಧಗಳಿಲ್ಲ",
    checkBackSoon: "ಹೊಸ ಕೌಶಲ ಯುದ್ಧಗಳಿಗಾಗಿ ಶೀಘ್ರದಲ್ಲೇ ಮರಳಿ ಬನ್ನಿ!",
    refresh: "ರಿಫ್ರೆಶ್", computingRanks: "ನಿಮ್ಮ ಶ್ರೇಣಿಗಳನ್ನು ಲೆಕ್ಕಿಸಲಾಗುತ್ತಿದೆ...",
    retry: "ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ", notRankedYet: "ನೀವು ಇನ್ನೂ ಶ್ರೇಣಿ ಪಡೆದಿಲ್ಲ",
    uploadReelPrompt: "ಯುದ್ಧದಲ್ಲಿ ಭಾಗಿಯಾಗಲು ರೀಲ್ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ!",
    viewFullSkillboard: "ಪೂರ್ಣ ಸ್ಕಿಲ್‌ಬೋರ್ಡ್ ನೋಡಿ",
    battleEnded: "ಯುದ್ಧ ಮುಗಿದಿದೆ", notEligible: "ಅರ್ಹತೆ ಇಲ್ಲ", uploadReel: "ರೀಲ್ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ",
    loginRequired: "ಲಾಗಿನ್ ಅಗತ್ಯ", live: "ಲೈವ್", completed: "ಪೂರ್ಣಗೊಂಡಿದೆ",
    prizePool: "ಬಹುಮಾನ ನಿಧಿ", endingSoon: "ಶೀಘ್ರದಲ್ಲೇ ಮುಗಿಯಲಿದೆ", viewResult: "ಫಲಿತಾಂಶ ನೋಡಿ",
    joinNow: "ಈಗ ಸೇರಿ", participate: "ಭಾಗವಹಿಸಿ", reserveSpot: "ಸ್ಥಾನ ಕಾಯ್ದಿರಿಸಿ",
    startsSoon: "ಶೀಘ್ರದಲ್ಲೇ ಪ್ರಾರಂಭವಾಗುತ್ತದೆ", all: "ಎಲ್ಲಾ", upcoming: "ಮುಂಬರುವ",
    aiGuruSubtitle: "ನಿಮ್ಮ ವೈಯಕ್ತಿಕ ಕಲಿಕೆ ಸಹಾಯಕ", askAnything: "ಯಾವುದನ್ನಾದರೂ ಕೇಳಿ", instantAnswers: "ತಕ್ಷಣದ ಉತ್ತರಗಳು", studyHelp: "ಅಧ್ಯಯನ ಸಹಾಯ", startChatting: "ಚಾಟ್ ಪ್ರಾರಂಭಿಸಿ →",
    premiumFeature: "ಪ್ರೀಮಿಯಂ ವೈಶಿಷ್ಟ್ಯ", premiumUnlockMsg: "ಈ ವೈಶಿಷ್ಟ್ಯ ಅನ್‌ಲಾಕ್ ಮಾಡಲು AI Guru Premium ಗೆ ಅಪ್‌ಗ್ರೇಡ್ ಮಾಡಿ.", maybeLater: "ನಂತರ", upgrade: "ಅಪ್‌ಗ್ರೇಡ್",
    aiClassroom: "ನಿಮ್ಮ ವೈಯಕ್ತಿಕ AI ತರಗತಿ\nGemini ಮೂಲಕ ನಡೆಸಲ್ಪಡುತ್ತಿದೆ", freeLessonsLeft: "ಇಂದು ಉಚಿತ ಪಾಠಗಳು ಉಳಿದಿವೆ", unlimitedAccess: "ಅಮಿತ ಪ್ರೀಮಿಯಂ ಪ್ರವೇಶ ಸಕ್ರಿಯ",
    lessonSetup: "ಪಾಠ ಸೆಟಪ್", continueBtn: "ಮುಂದುವರಿಸಿ →", fillRequiredFields: "ಅಗತ್ಯ ಮಾಹಿತಿ ತುಂಬಿ", fillRequiredFieldsDesc: "ದಯವಿಟ್ಟು ವಿಷಯ ಆಯ್ಕೆ ಮಾಡಿ ಮತ್ತು ಅಧ್ಯಾಯ ಹೆಸರು ನಮೂದಿಸಿ.",
    vidyaGuruAI: "VidyaGuru AI", personalAiTeacher: "ನಿಮ್ಮ ವೈಯಕ್ತಿಕ AI ಶಿಕ್ಷಕ", readyToHelp: "ಸಹಾಯ ಮಾಡಲು ಸಿದ್ಧ!", thinking: "ಯೋಚಿಸುತ್ತಿದ್ದೇನೆ...", speaking: "ಮಾತನಾಡುತ್ತಿದ್ದೇನೆ...", listening: "ಕೇಳುತ್ತಿದ್ದೇನೆ...",
    paywallTitle: "VidyaGuru ಜೊತೆ ಮುಂದುವರಿಯಬೇಕೆ?", paywallBody: "ಇಂದಿನ ಉಚಿತ ಪ್ರಶ್ನೆ ಬಳಸಿದ್ದೀರಿ. ಅಮಿತ ಸಂಭಾಷಣೆಗೆ ಪ್ರೀಮಿಯಂ ಅಪ್‌ಗ್ರೇಡ್ ಮಾಡಿ!", upgradeToPremium: "ಪ್ರೀಮಿಯಂ ಗೆ ಅಪ್‌ಗ್ರೇಡ್ ಮಾಡಿ",
    seekhoSignIn: "Seekho ಪ್ರವೇಶಿಸಲು ಲಾಗಿನ್ ಮಾಡಿ", curriculumAligned: "ಪಠ್ಯಕ್ರಮ-ಆಧಾರಿತ ಕಲಿಕೆ", subjects: "ವಿಷಯಗಳು", continueLearning: "ಕಲಿಕೆ ಮುಂದುವರಿಸಿ", resumeLearning: "ನಿಲ್ಲಿಸಿದ ಕಡೆಯಿಂದ ಪ್ರಾರಂಭಿಸಿ",
    revisionDue: "ಪುನರಾವರ್ತನೆ ಬೇಕು!", revisionReady: "ಪರಿಕಲ್ಪನೆಗಳು ಮರು ಪರಿಶೀಲನೆಗೆ ಸಿದ್ಧ", unlockCurriculum: "ಸಂಪೂರ್ಣ ಪಠ್ಯಕ್ರಮ ಅನ್‌ಲಾಕ್ ಮಾಡಿ",
    pendingReview: "ಪರಿಶೀಲನೆ ಬಾಕಿ", inReview: "ಪರಿಶೀಲನೆಯಲ್ಲಿ", approved: "ಅನುಮೋದಿಸಲಾಗಿದೆ", rejected: "ತಿರಸ್ಕರಿಸಲಾಗಿದೆ", limitReached: "ಮಿತಿ ತಲುಪಿದೆ", limitReachedDesc: "ಈ ಬ್ಯಾಟಲ್‌ಗೆ ಅಪ್‌ಲೋಡ್ ಮಿತಿ ತಲುಪಿದ್ದೀರಿ.",
    seekhoPreviewTitle: "📖 ಸೀಖೋ", seekhoPreviewSub: "ವಿಷಯಗಳು, ಕೌಶಲ್ಯ ಮತ್ತು ಸೃಜನಶೀಲ ಚಟುವಟಿಕೆಗಳನ್ನು ಕಲಿಯಿರಿ", explore: "ಅನ್ವೇಷಿಸಿ →",
    vidyaStarPreviewTitle: "🌟 ವಿದ್ಯಾಸ್ಟಾರ್ ಸ್ಪರ್ಧೆ", vidyaStarPreviewSub: "ನಿಮ್ಮ ಪ್ರತಿಭೆ ತೋರಿಸಿ ಬಹುಮಾನ ಗೆಲ್ಲಿ",
    couldNotLoadContests: "ಸ್ಪರ್ಧೆಗಳನ್ನು ಲೋಡ್ ಮಾಡಲಾಗಲಿಲ್ಲ.", contestsComingSoon: "ರೋಮಾಂಚಕ ಸ್ಪರ್ಧೆಗಳು ಶೀಘ್ರದಲ್ಲೇ!", viewResults: "ಫಲಿತಾಂಶ ನೋಡಿ →", participateNow: "ಈಗ ಭಾಗವಹಿಸಿ →",
    skillBattlePreviewTitle: "⚔️ ಸ್ಕಿಲ್‌ಬ್ಯಾಟಲ್ ಚಾಲೆಂಜ್", skillBattlePreviewSub: "ಸ್ಪರ್ಧಿಸಿ, ಶ್ರೇಣಿ ಹೆಚ್ಚಿಸಿ ಮತ್ತು ಬಹುಮಾನ ಗೆಲ್ಲಿ",
    couldNotLoadBattles: "ಬ್ಯಾಟಲ್‌ಗಳನ್ನು ಲೋಡ್ ಮಾಡಲಾಗಲಿಲ್ಲ.", battlesComingSoon: "ಹೊಸ ಬ್ಯಾಟಲ್‌ಗಳು ಶೀಘ್ರದಲ್ಲೇ!", poweredBy: "{{name}} ಮೂಲಕ", joinedCount: "{{count}} ಸೇರಿದ್ದಾರೆ",
    knowledgeHubTitle: "🌐 ನಾಲೆಡ್ಜ್ ಹಬ್", knowledgeHubSub: "ಕಲಿಕೆ, ಬೆಳವಣಿಗೆ ಮತ್ತು ದೈನಂದಿನ ಜೀವನಕ್ಕೆ ವೀಡಿಯೋಗಳು", watchMore: "ಇನ್ನಷ್ಟು ನೋಡಿ →",
    couldNotLoadVideos: "ವೀಡಿಯೋಗಳನ್ನು ಲೋಡ್ ಮಾಡಲಾಗಲಿಲ್ಲ.", moreVideosSoon: "ಇನ್ನಷ್ಟು ವೀಡಿಯೋಗಳು ಶೀಘ್ರದಲ್ಲೇ!", noVideosInCat: "\"{{cat}}\" ವೀಡಿಯೋಗಳು ಇನ್ನೂ ಇಲ್ಲ.",
    shortLearningTitle: "ಶಾರ್ಟ್ ಲರ್ನಿಂಗ್", noLearningVideos: "ಇನ್ನೂ ಯಾವುದೇ ಕಲಿಕೆ ವೀಡಿಯೋಗಳಿಲ್ಲ",
    skillBattleShortsTitle: "🔥 ಸ್ಕಿಲ್ ಬ್ಯಾಟಲ್ ಶಾರ್ಟ್ಸ್", noSkillBattleVideos: "ಇನ್ನೂ ಯಾವುದೇ ಸ್ಕಿಲ್ ಬ್ಯಾಟಲ್ ವೀಡಿಯೋಗಳಿಲ್ಲ", battleBadge: "⚡ ಬ್ಯಾಟಲ್",
    shikshaStarPreviewTitle: "⭐ ಶಿಕ್ಷಾಸ್ಟಾರ್", shikshaStarPreviewSub: "ವಿದ್ಯಾದ ಪ್ರತಿಭಾಶಾಲಿ ವಿದ್ಯಾರ್ಥಿಗಳನ್ನು ಆಚರಿಸುತ್ತಿದ್ದೇವೆ", viewStars: "ಸ್ಟಾರ್‌ಗಳ ನೋಡಿ →",
    couldNotLoadStars: "ಸ್ಟಾರ್‌ಗಳನ್ನು ಲೋಡ್ ಮಾಡಲಾಗಲಿಲ್ಲ.", shikshaStarEmpty: "ನಿಮ್ಮ ಪ್ರತಿಭೆ ಶೀಘ್ರದಲ್ಲೇ ಇಲ್ಲಿ ತೋರಿಸಬಹುದು!", becomeShikshaStar: "ಶಿಕ್ಷಾಸ್ಟಾರ್ ಆಗಿ",
    discoverPreviewTitle: "🧭 ಡಿಸ್ಕವರ್ AI", discoverPreviewSub: "AI-ಚಾಲಿತ ವೃತ್ತಿ, ಕಾಲೇಜು & ವಿದ್ಯಾರ್ಥಿವೇತನ ಸಂಶೋಧನೆ",
    discoverTitle: "ವಿದ್ಯಾ ಡಿಸ್ಕವರ್ AI", discoverSubtitle: "ನಿಮ್ಮ ಸರಿಯಾದ ವೃತ್ತಿ, ಕಾಲೇಜು & ವಿದ್ಯಾರ್ಥಿವೇತನ ಹುಡುಕಿ", discoverCta: "ನಿಮ್ಮ ಭವಿಷ್ಯ ಅನ್ವೇಷಿಸಿ →",
  },

  // ─────────────────────────── Malayalam ────────────────────────────
  ml: {
    home: "ഹോം", leaderboard: "ലീഡർബോർഡ്", wallet: "വാലറ്റ്",
    settings: "ക്രമീകരണങ്ങൾ", dashboard: "ഡാഷ്‌ബോർഡ്", aiGuru: "AI ഗുരു",
    skillBoard: "സ്കിൽ ബോർഡ്", logout: "ലോഗ്ഔട്ട്",
    profileSettings: "പ്രൊഫൈൽ ക്രമീകരണങ്ങൾ", language: "ഭാഷ",
    changeLanguage: "ആപ്പ് & ഉള്ളടക്ക ഭാഷ മാറ്റുക",
    darkTheme: "ഡാർക്ക് തീം", notifications: "അറിയിപ്പുകൾ",
    privacy: "സ്വകാര്യത", about: "കുറിച്ച്",
    customizeExperience: "നിങ്ങളുടെ അനുഭവം ഇഷ്ടാനുസൃതമാക്കുക",
    save: "സേവ് ചെയ്യുക", cancel: "റദ്ദാക്കുക", edit: "എഡിറ്റ് ചെയ്യുക", back: "തിരിച്ചു പോകുക",
    delete: "ഇല്ലാതാക്കുക", loading: "ലോഡ് ചെയ്യുന്നു...", editProfile: "പ്രൊഫൈൽ എഡിറ്റ് ചെയ്യുക",
    saveChanges: "മാറ്റങ്ങൾ സേവ് ചെയ്യുക", verify: "സ്ഥിരീകരിക്കുക", confirm: "ഉറപ്പിക്കുക", send: "അയക്കുക",
    languageTitle: "ഭാഷ", languageSubtitle: "ഭാരത ഭരണഘടനയുടെ 8-ാം ഷെഡ്യൂളിലെ 22 ഭാഷകൾ",
    searchLanguage: "ഭാഷ തിരയുക...", scheduleNote: "ഇവ ഭാരതത്തിന്റെ ഭരണഘടനയുടെ 8-ാം ഷെഡ്യൂളിൽ പട്ടികപ്പെടുത്തിയ 22 ഭാഷകളാണ്.",
    basicInfo: "അടിസ്ഥാന വിവരങ്ങൾ", academicDetails: "അക്കാദമിക് വിശദാംശങ്ങൾ",
    location: "സ്ഥലം", interests: "താൽപ്പര്യങ്ങൾ", fullName: "പൂർണ്ണ നാമം",
    phoneNumber: "ഫോൺ നമ്പർ", dateOfBirth: "ജനനതീയതി", age: "പ്രായം",
    school: "സ്കൂൾ / സ്ഥാപനം", preferredLanguage: "ഇഷ്ടഭാഷ",
    pincode: "പിൻകോഡ്", class: "ക്ലാസ് / ഗ്രേഡ്", board: "ബോർഡ്",
    learnFunLoading: "നിങ്ങളുടെ LearnFun ലോകം ലോഡ് ആകുന്നു...",
    profileNotFound: "പ്രൊഫൈൽ കണ്ടെത്തിയില്ല",
    profileSetupPrompt: "കളിക്കാൻ തുടങ്ങാൻ നിങ്ങളുടെ പ്രൊഫൈൽ പൂർത്തിയാക്കുക!",
    dailyStreak: "ദൈനംദിന സ്ട്രീക്", view: "കാണുക", todaysMission: "ഇന്നത്തെ ദൗത്യം",
    daily: "ദൈനംദിന", noMissionToday: "ഇന്ന് ദൗത്യമില്ല. ഉടൻ തിരിച്ചുവരൂ!",
    skillWorlds: "കഴിവ് ലോകങ്ങൾ", bossBattle: "ബോസ് യുദ്ധം",
    yourGames: "നിങ്ങളുടെ ഗെയിമുകൾ", gamesLoading: "ഗെയിമുകൾ ലോഡ് ആകുന്നു...",
    yourBadges: "നിങ്ങളുടെ ബാഡ്ജുകൾ", viewAll: "എല്ലാം കാണുക", comingSoon: "ഉടൻ വരുന്നു", play: "കളിക്കുക",
    searchVideos: "വീഡിയോ, വിഷയം, അധ്യാപകൻ തിരയുക...",
    featured: "പ്രത്യേകം", noVideosFound: "വീഡിയോകൾ കണ്ടെത്തിയില്ല",
    clearFilters: "ഫിൽട്ടറുകൾ മായ്ക്കുക", allVideos: "എല്ലാ വീഡിയോകളും",
    videosComingSoon: "വീഡിയോകൾ ഉടൻ!",
    loadingBattles: "യുദ്ധങ്ങൾ ലോഡ് ആകുന്നു...", noActiveBattles: "സജീവ യുദ്ധങ്ങൾ ഇല്ല",
    checkBackSoon: "പുതിയ സ്കിൽ യുദ്ധങ്ങൾക്കായി ഉടൻ തിരിച്ചുവരൂ!",
    refresh: "പുതുക്കുക", computingRanks: "നിങ്ങളുടെ റാങ്കുകൾ കണക്കാക്കുന്നു...",
    retry: "വീണ്ടും ശ്രമിക്കുക", notRankedYet: "നിങ്ങൾ ഇതുവരെ റാങ്ക് ചെയ്തിട്ടില്ല",
    uploadReelPrompt: "യുദ്ധത്തിൽ ചേരാൻ റീൽ അപ്‌ലോഡ് ചെയ്യുക!",
    viewFullSkillboard: "പൂർണ്ണ സ്കിൽ‌ബോർഡ് കാണുക",
    battleEnded: "യുദ്ധം അവസാനിച്ചു", notEligible: "യോഗ്യതയില്ല", uploadReel: "റീൽ അപ്‌ലോഡ് ചെയ്യുക",
    loginRequired: "ലോഗിൻ ആവശ്യം", live: "തൽസമയം", completed: "പൂർത്തിയായി",
    prizePool: "സമ്മാനക്കലവറ", endingSoon: "ഉടൻ അവസാനിക്കും", viewResult: "ഫലം കാണുക",
    joinNow: "ഇപ്പോൾ ചേരുക", participate: "പങ്കെടുക്കുക", reserveSpot: "സ്ഥലം ബുക്ക് ചെയ്യുക",
    startsSoon: "ഉടൻ ആരംഭിക്കും", all: "എല്ലാം", upcoming: "വരാനിരിക്കുന്നത്",
    aiGuruSubtitle: "നിങ്ങളുടെ വ്യക്തിഗത പഠന സഹായി", askAnything: "എന്തും ചോദിക്കൂ", instantAnswers: "തൽക്ഷണ ഉത്തരങ്ങൾ", studyHelp: "പഠന സഹായം", startChatting: "ചാറ്റ് ആരംഭിക്കൂ →",
    premiumFeature: "പ്രീമിയം ഫീച്ചർ", premiumUnlockMsg: "ഈ ഫീച്ചർ അൺലോക്ക് ചെയ്യാൻ AI Guru Premium ലേക്ക് അപ്‌ഗ്രേഡ് ചെയ്യൂ.", maybeLater: "പിന്നീട്", upgrade: "അപ്‌ഗ്രേഡ്",
    aiClassroom: "നിങ്ങളുടെ വ്യക്തിഗത AI ക്ലാസ്‌റൂം\nGemini ഉപയോഗിച്ച് പ്രവർത്തിക്കുന്നു", freeLessonsLeft: "ഇന്ന് ഉള്ള സൗജന്യ പാഠങ്ങൾ ബാക്കി", unlimitedAccess: "പരിധിയില്ലാത്ത പ്രീമിയം ആക്‌സസ് സജീവം",
    lessonSetup: "പാഠ സജ്ജീകരണം", continueBtn: "തുടരുക →", fillRequiredFields: "ആവശ്യമായ ഫീൽഡുകൾ പൂരിപ്പിക്കൂ", fillRequiredFieldsDesc: "ദയവായി വിഷയം തിരഞ്ഞെടുക്കുക, അദ്ധ്യായ നാമം നൽകുക.",
    vidyaGuruAI: "VidyaGuru AI", personalAiTeacher: "നിങ്ങളുടെ വ്യക്തിഗത AI അദ്ധ്യാപകൻ", readyToHelp: "സഹായിക്കാൻ തയ്യാർ!", thinking: "ആലോചിക്കുന്നു...", speaking: "സംസാരിക്കുന്നു...", listening: "ശ്രദ്ധിക്കുന്നു...",
    paywallTitle: "VidyaGuru ഉപയോഗിച്ച് തുടരണോ?", paywallBody: "ഇന്നത്തെ സൗജന്യ ചോദ്യം ഉപയോഗിച്ചു. പരിധിയില്ലാത്ത സംഭാഷണത്തിന് പ്രീമിയം അപ്‌ഗ്രേഡ് ചെയ്യൂ!", upgradeToPremium: "പ്രീമിയത്തിലേക്ക് അപ്‌ഗ്രേഡ് ചെയ്യൂ",
    seekhoSignIn: "Seekho ആക്‌സസ് ചെയ്യാൻ ലോഗിൻ ചെയ്യൂ", curriculumAligned: "പാഠ്യക്രമ-അടിസ്ഥാനിത പഠനം", subjects: "വിഷയങ്ങൾ", continueLearning: "പഠിക്കൽ തുടരൂ", resumeLearning: "നിർത്തിയ ഇടത്ത് നിന്ന് തുടരുക",
    revisionDue: "റിവിഷൻ വേണം!", revisionReady: "ആശയങ്ങൾ അവലോകനത്തിന് തയ്യാർ", unlockCurriculum: "പൂർണ്ണ പാഠ്യക്രമം അൺലോക്ക് ചെയ്യൂ",
    pendingReview: "അവലോകനം ബാക്കി", inReview: "അവലോകനത്തിൽ", approved: "അംഗീകരിച്ചു", rejected: "നിരസിച്ചു", limitReached: "പരിധി എത്തി", limitReachedDesc: "ഈ ബാറ്റിലിനായുള്ള അപ്‌ലോഡ് പരിധി കഴിഞ്ഞു.",
  },

  // ─────────────────────────── Marathi ──────────────────────────────
  mr: {
    home: "मुख्यपृष्ठ", leaderboard: "लीडरबोर्ड", wallet: "पाकीट",
    settings: "सेटिंग्ज", dashboard: "डॅशबोर्ड", aiGuru: "AI गुरू",
    skillBoard: "कौशल्य बोर्ड", logout: "लॉगआउट",
    profileSettings: "प्रोफाईल सेटिंग्ज", language: "भाषा",
    changeLanguage: "अॅप आणि सामग्रीची भाषा बदला",
    darkTheme: "डार्क थीम", notifications: "सूचना",
    privacy: "गोपनीयता", about: "माहिती",
    customizeExperience: "तुमचा अनुभव सानुकूलित करा",
    save: "जतन करा", cancel: "रद्द करा", edit: "संपादित करा", back: "मागे जा",
    delete: "हटवा", loading: "लोड होत आहे...", editProfile: "प्रोफाईल संपादित करा",
    saveChanges: "बदल जतन करा", verify: "सत्यापित करा", confirm: "पुष्टी करा", send: "पाठवा",
    languageTitle: "भाषा", languageSubtitle: "भारतीय संविधानाच्या 8व्या अनुसूचीतील सर्व 22 भाषा",
    searchLanguage: "भाषा शोधा...", scheduleNote: "या भारताच्या संविधानाच्या 8व्या अनुसूचीत सूचीबद्ध 22 भाषा आहेत.",
    basicInfo: "मूलभूत माहिती", academicDetails: "शैक्षणिक तपशील",
    location: "स्थान", interests: "आवडी", fullName: "पूर्ण नाव",
    phoneNumber: "फोन नंबर", dateOfBirth: "जन्मतारीख", age: "वय",
    school: "शाळा / संस्था", preferredLanguage: "पसंतीची भाषा",
    pincode: "पिनकोड", class: "वर्ग / श्रेणी", board: "मंडळ",
    learnFunLoading: "तुमचे LearnFun जग लोड होत आहे...",
    profileNotFound: "प्रोफाइल आढळले नाही",
    profileSetupPrompt: "खेळणे सुरू करण्यासाठी तुमचे प्रोफाइल पूर्ण करा!",
    dailyStreak: "दैनिक स्ट्रीक", view: "पहा", todaysMission: "आजचे मिशन",
    daily: "दैनिक", noMissionToday: "आज मिशन नाही. लवकरच परत या!",
    skillWorlds: "कौशल्य जगत", bossBattle: "बॉस बॅटल",
    yourGames: "तुमचे गेम्स", gamesLoading: "गेम्स लोड होत आहेत...",
    yourBadges: "तुमचे बॅज", viewAll: "सर्व पहा", comingSoon: "लवकरच येत आहे", play: "खेळा",
    searchVideos: "व्हिडिओ, विषय, शिक्षक शोधा...",
    featured: "विशेष", noVideosFound: "कोणते व्हिडिओ सापडले नाहीत",
    clearFilters: "फिल्टर साफ करा", allVideos: "सर्व व्हिडिओ",
    videosComingSoon: "व्हिडिओ लवकरच!",
    loadingBattles: "बॅटल्स लोड होत आहेत...", noActiveBattles: "कोणतेही सक्रिय बॅटल नाहीत",
    checkBackSoon: "नवीन कौशल्य बॅटलसाठी लवकरच परत या!",
    refresh: "रिफ्रेश करा", computingRanks: "तुमचे रँक मोजले जात आहेत...",
    retry: "पुन्हा प्रयत्न करा", notRankedYet: "तुम्ही अजून रँक केले नाहीत",
    uploadReelPrompt: "बॅटलमध्ये सहभागी होण्यासाठी रील अपलोड करा!",
    viewFullSkillboard: "संपूर्ण स्किलबोर्ड पहा",
    battleEnded: "बॅटल संपली", notEligible: "पात्र नाही", uploadReel: "रील अपलोड करा",
    loginRequired: "लॉगिन आवश्यक", live: "लाइव्ह", completed: "पूर्ण",
    prizePool: "पारितोषिक निधी", endingSoon: "लवकरच संपेल", viewResult: "निकाल पहा",
    joinNow: "आत्ता सामील व्हा", participate: "भाग घ्या", reserveSpot: "जागा राखून ठेवा",
    startsSoon: "लवकरच सुरू होईल", all: "सर्व", upcoming: "येणारे",
    aiGuruSubtitle: "तुमचा वैयक्तिक शिक्षण सहाय्यक", askAnything: "काहीही विचारा", instantAnswers: "तत्काळ उत्तरे", studyHelp: "अभ्यासात मदत", startChatting: "चॅट सुरू करा →",
    premiumFeature: "प्रीमियम वैशिष्ट्य", premiumUnlockMsg: "हे वैशिष्ट्य अनलॉक करण्यासाठी AI Guru Premium अपग्रेड करा.", maybeLater: "नंतर", upgrade: "अपग्रेड करा",
    aiClassroom: "तुमचा वैयक्तिक AI वर्गखोली\nGemini द्वारे चालवले", freeLessonsLeft: "आजचे मोफत धडे बाकी", unlimitedAccess: "असीमित प्रीमियम ऍक्सेस सक्रिय",
    lessonSetup: "धडा सेटअप", continueBtn: "पुढे जा →", fillRequiredFields: "आवश्यक माहिती भरा", fillRequiredFieldsDesc: "कृपया विषय निवडा आणि अध्यायाचे नाव टाका.",
    vidyaGuruAI: "VidyaGuru AI", personalAiTeacher: "तुमचे वैयक्तिक AI शिक्षक", readyToHelp: "मदत करण्यासाठी तयार!", thinking: "विचार करतोय...", speaking: "बोलतोय...", listening: "ऐकतोय...",
    paywallTitle: "VidyaGuru सोबत चालू ठेवायचे?", paywallBody: "आजचा मोफत प्रश्न वापरला. असीमित संभाषणासाठी प्रीमियम अपग्रेड करा!", upgradeToPremium: "प्रीमियमवर अपग्रेड करा",
    seekhoSignIn: "Seekho ऍक्सेस करण्यासाठी लॉगिन करा", curriculumAligned: "अभ्यासक्रम-आधारित शिक्षण", subjects: "विषय", continueLearning: "शिकणे चालू ठेवा", resumeLearning: "सोडलेल्या ठिकाणाहून सुरू करा",
    revisionDue: "उजळणी करा!", revisionReady: "संकल्पना पुनरावलोकनासाठी तयार", unlockCurriculum: "पूर्ण अभ्यासक्रम अनलॉक करा",
    pendingReview: "पुनरावलोकन प्रतीक्षेत", inReview: "पुनरावलोकनात", approved: "मंजूर", rejected: "नाकारले", limitReached: "मर्यादा पोहोचली", limitReachedDesc: "तुम्ही या बॅटलची अपलोड मर्यादा गाठली आहे.",
  },

  // ─────────────────────────── Gujarati ─────────────────────────────
  gu: {
    home: "હોમ", leaderboard: "લીડરબોર્ડ", wallet: "વૉલેટ",
    settings: "સેટિંગ્સ", dashboard: "ડૅશબોર્ડ", aiGuru: "AI ગુરુ",
    skillBoard: "કૌશલ્ય બોર્ડ", logout: "લૉગઆઉટ",
    profileSettings: "પ્રોફાઇલ સેટિંગ્સ", language: "ભાષા",
    changeLanguage: "એપ અને સામગ્રીની ભાષા બદલો",
    darkTheme: "ડાર્ક થીમ", notifications: "સૂચનાઓ",
    privacy: "ગોપનીયતા", about: "વિશે",
    customizeExperience: "તમારો અનુભવ કસ્ટમાઇઝ કરો",
    save: "સાચવો", cancel: "રદ કરો", edit: "સંપાદિત કરો", back: "પાછળ",
    delete: "કાઢી નાખો", loading: "લોડ થઈ રહ્યું છે...", editProfile: "પ્રોફાઇલ સંપાદિત કરો",
    saveChanges: "ફેરફારો સાચવો", verify: "ચકાસો", confirm: "પુષ્ટિ કરો", send: "મોકલો",
    languageTitle: "ભાષા", languageSubtitle: "ભારતીય બંધારણની 8મી અનુસૂચિની તમામ 22 ભાષાઓ",
    searchLanguage: "ભાષા શોધો...", scheduleNote: "આ ભારતના બંધારણની 8મી અનુસૂચિમાં સૂચિબદ્ધ 22 ભાષાઓ છે.",
    basicInfo: "મૂળ માહિતી", academicDetails: "શૈક્ષણિક વિગતો",
    location: "સ્થાન", interests: "રુચિઓ", fullName: "પૂર્ણ નામ",
    phoneNumber: "ફોન નંબર", dateOfBirth: "જન્મ તારીખ", age: "ઉંમર",
    school: "શાળા / સંસ્થા", preferredLanguage: "પ્રિય ભાષા",
    pincode: "પિનકોડ", class: "વર્ગ / ગ્રેડ", board: "બોર્ડ",
    learnFunLoading: "તમારી LearnFun દુનિયા લોડ થઈ રહી છે...",
    profileNotFound: "પ્રોફાઇલ મળ્યું નહીં",
    profileSetupPrompt: "રમવું શરૂ કરવા માટે તમારી પ્રોફાઇલ પૂર્ણ કરો!",
    dailyStreak: "દૈનિક સ્ટ્રીક", view: "જુઓ", todaysMission: "આજનું મિશન",
    daily: "દૈનિક", noMissionToday: "આજે કોઈ મિશન નથી. ટૂંક સમયમાં પાછા આવો!",
    skillWorlds: "કૌશલ્ય દુનિયા", bossBattle: "બૉસ બૅટલ",
    yourGames: "તમારી રમતો", gamesLoading: "રમતો લોડ થઈ રહી છે...",
    yourBadges: "તમારા બૅજ", viewAll: "બધું જુઓ", comingSoon: "ટૂંક સમયમાં આવે છે", play: "રમો",
    searchVideos: "વિડિઓ, વિષય, શિક્ષક શોધો...",
    featured: "વિશેષ", noVideosFound: "કોઈ વિડિઓ મળ્યા નહીં",
    clearFilters: "ફિલ્ટર સાફ કરો", allVideos: "બધા વિડિઓ",
    videosComingSoon: "વિડિઓ ટૂંક સમયમાં!",
    loadingBattles: "બૅટલ લોડ થઈ રહ્યા છે...", noActiveBattles: "કોઈ સક્રિય બૅટલ નથી",
    checkBackSoon: "નવી સ્કિલ બૅટલ માટે ટૂંક સમયમાં પાછા આવો!",
    refresh: "રિફ્રૅશ", computingRanks: "તમારી રેન્ક ગણવામાં આવી રહી છે...",
    retry: "ફરી પ્રયાસ", notRankedYet: "તમે હજી રેન્ક્ડ નથી",
    uploadReelPrompt: "બૅટલમાં ભાગ લેવા રીલ અપલોડ કરો!",
    viewFullSkillboard: "સંપૂર્ણ સ્કિલ બોર્ડ જુઓ",
    battleEnded: "બૅટલ સમાપ્ત", notEligible: "પાત્ર નથી", uploadReel: "રીલ અપલોડ કરો",
    loginRequired: "લૉગિન જરૂરી", live: "લાઇવ", completed: "પૂર્ણ",
    prizePool: "ઇનામ ભંડોળ", endingSoon: "ટૂંક સમયમાં સમાપ્ત", viewResult: "પરિણામ જુઓ",
    joinNow: "હવે જોડાઓ", participate: "ભાગ લો", reserveSpot: "સ્થાન અનામત કરો",
    startsSoon: "ટૂંક સમયમાં શરૂ", all: "બધા", upcoming: "આગામી",
    aiGuruSubtitle: "તમારો વ્યક્તિગત શિક્ષણ સહાયક", askAnything: "ગમે તે પૂછો", instantAnswers: "તત્કાળ જવાબો", studyHelp: "અભ્યાસ સહાય", startChatting: "ચેટ શરૂ કરો →",
    premiumFeature: "પ્રીમિયમ સુવિધા", premiumUnlockMsg: "આ સુવિધા અનલૉક કરવા AI Guru Premium અપગ્રેડ કરો.", maybeLater: "પછી", upgrade: "અપગ્રેડ",
    aiClassroom: "તમારો વ્યક્તિગત AI ક્લાસ\nGemini દ્વારા સંચાલિત", freeLessonsLeft: "આજના મફત પાઠ બાકી", unlimitedAccess: "અમર્યાદિત પ્રીમિયમ ઍક્સેસ સક્રિય",
    lessonSetup: "પાઠ સેટઅપ", continueBtn: "ચાલુ રાખો →", fillRequiredFields: "જરૂરી માહિતી ભરો", fillRequiredFieldsDesc: "કૃપા કરીને વિષય પસંદ કરો અને અધ્યાયનું નામ દાખલ કરો.",
    vidyaGuruAI: "VidyaGuru AI", personalAiTeacher: "તમારા વ્યક્તિગત AI શિક્ષક", readyToHelp: "મદદ માટે તૈયાર!", thinking: "વિચારી રહ્યો છું...", speaking: "બોલી રહ્યો છું...", listening: "સાંભળી રહ્યો છું...",
    paywallTitle: "VidyaGuru સાથે ચાલુ રાખો?", paywallBody: "આજનો મફત પ્રશ્ન વાપર્યો. અમર્યાદિત વાર્તાલાપ માટે પ્રીમિયમ અપગ્રેડ કરો!", upgradeToPremium: "પ્રીમિયમ પર અપગ્રેડ કરો",
    seekhoSignIn: "Seekho ઍક્સેસ કરવા લૉગિન કરો", curriculumAligned: "અભ્યાસક્રમ-આધારિત શિક્ષણ", subjects: "વિષયો", continueLearning: "શીખવાનું ચાલુ રાખો", resumeLearning: "છોડ્યા ત્યાંથી ચાલુ કરો",
    revisionDue: "પુનઃ અભ્યાસ કરો!", revisionReady: "ખ્યાલો સમીક્ષા માટે તૈયાર", unlockCurriculum: "સંપૂર્ણ અભ્યાસક્રમ અનલૉક કરો",
    pendingReview: "સમીક્ષા બાકી", inReview: "સમીક્ષામાં", approved: "મંજૂર", rejected: "નામંજૂર", limitReached: "મર્યાદા પહોંચી", limitReachedDesc: "તમે આ બૅટલ માટે અપલોડ મર્યાદા પૂરી કરી દીધી.",
  },

  // ─────────────────────────── Punjabi ──────────────────────────────
  pa: {
    home: "ਘਰ", leaderboard: "ਲੀਡਰਬੋਰਡ", wallet: "ਵਾਲਿਟ",
    settings: "ਸੈਟਿੰਗਾਂ", dashboard: "ਡੈਸ਼ਬੋਰਡ", aiGuru: "AI ਗੁਰੂ",
    skillBoard: "ਕੌਸ਼ਲ ਬੋਰਡ", logout: "ਲੌਗਆਉਟ",
    profileSettings: "ਪ੍ਰੋਫਾਈਲ ਸੈਟਿੰਗਾਂ", language: "ਭਾਸ਼ਾ",
    changeLanguage: "ਐਪ ਅਤੇ ਸਮੱਗਰੀ ਦੀ ਭਾਸ਼ਾ ਬਦਲੋ",
    darkTheme: "ਡਾਰਕ ਥੀਮ", notifications: "ਸੂਚਨਾਵਾਂ",
    privacy: "ਗੋਪਨੀਯਤਾ", about: "ਬਾਰੇ",
    customizeExperience: "ਆਪਣਾ ਅਨੁਭਵ ਅਨੁਕੂਲਿਤ ਕਰੋ",
    save: "ਸੁਰੱਖਿਅਤ ਕਰੋ", cancel: "ਰੱਦ ਕਰੋ", edit: "ਸੋਧੋ", back: "ਵਾਪਸ",
    delete: "ਮਿਟਾਓ", loading: "ਲੋਡ ਹੋ ਰਿਹਾ ਹੈ...", editProfile: "ਪ੍ਰੋਫਾਈਲ ਸੋਧੋ",
    saveChanges: "ਬਦਲਾਅ ਸੁਰੱਖਿਅਤ ਕਰੋ", verify: "ਤਸਦੀਕ ਕਰੋ", confirm: "ਪੁਸ਼ਟੀ ਕਰੋ", send: "ਭੇਜੋ",
    languageTitle: "ਭਾਸ਼ਾ", languageSubtitle: "ਭਾਰਤੀ ਸੰਵਿਧਾਨ ਦੀ 8ਵੀਂ ਅਨੁਸੂਚੀ ਦੀਆਂ ਸਾਰੀਆਂ 22 ਭਾਸ਼ਾਵਾਂ",
    searchLanguage: "ਭਾਸ਼ਾ ਖੋਜੋ...", scheduleNote: "ਇਹ ਭਾਰਤ ਦੇ ਸੰਵਿਧਾਨ ਦੀ 8ਵੀਂ ਅਨੁਸੂਚੀ ਵਿੱਚ ਸੂਚੀਬੱਧ 22 ਭਾਸ਼ਾਵਾਂ ਹਨ।",
    basicInfo: "ਮੂਲ ਜਾਣਕਾਰੀ", academicDetails: "ਅਕਾਦਮਿਕ ਵੇਰਵੇ",
    location: "ਸਥਾਨ", interests: "ਰੁਚੀਆਂ", fullName: "ਪੂਰਾ ਨਾਮ",
    phoneNumber: "ਫ਼ੋਨ ਨੰਬਰ", dateOfBirth: "ਜਨਮ ਤਾਰੀਖ", age: "ਉਮਰ",
    school: "ਸਕੂਲ / ਸੰਸਥਾ", preferredLanguage: "ਪਸੰਦੀਦਾ ਭਾਸ਼ਾ",
    pincode: "ਪਿਨਕੋਡ", class: "ਕਲਾਸ / ਗ੍ਰੇਡ", board: "ਬੋਰਡ",
    learnFunLoading: "ਤੁਹਾਡੀ LearnFun ਦੁਨੀਆ ਲੋਡ ਹੋ ਰਹੀ ਹੈ...",
    profileNotFound: "ਪ੍ਰੋਫਾਈਲ ਨਹੀਂ ਮਿਲਿਆ",
    profileSetupPrompt: "ਖੇਡਣਾ ਸ਼ੁਰੂ ਕਰਨ ਲਈ ਆਪਣੀ ਪ੍ਰੋਫਾਈਲ ਪੂਰੀ ਕਰੋ!",
    dailyStreak: "ਰੋਜ਼ਾਨਾ ਸਟ੍ਰੀਕ", view: "ਦੇਖੋ", todaysMission: "ਅੱਜ ਦਾ ਮਿਸ਼ਨ",
    daily: "ਰੋਜ਼ਾਨਾ", noMissionToday: "ਅੱਜ ਕੋਈ ਮਿਸ਼ਨ ਨਹੀਂ। ਜਲਦੀ ਵਾਪਸ ਆਓ!",
    skillWorlds: "ਕੌਸ਼ਲ ਦੁਨੀਆ", bossBattle: "ਬੌਸ ਬੈਟਲ",
    yourGames: "ਤੁਹਾਡੀਆਂ ਖੇਡਾਂ", gamesLoading: "ਖੇਡਾਂ ਲੋਡ ਹੋ ਰਹੀਆਂ ਹਨ...",
    yourBadges: "ਤੁਹਾਡੇ ਬੈਜ", viewAll: "ਸਾਰੇ ਦੇਖੋ", comingSoon: "ਜਲਦੀ ਆਉਣ ਵਾਲਾ", play: "ਖੇਡੋ",
    searchVideos: "ਵੀਡੀਓ, ਵਿਸ਼ੇ, ਅਧਿਆਪਕ ਖੋਜੋ...",
    featured: "ਵਿਸ਼ੇਸ਼", noVideosFound: "ਕੋਈ ਵੀਡੀਓ ਨਹੀਂ ਮਿਲੇ",
    clearFilters: "ਫਿਲਟਰ ਸਾਫ਼ ਕਰੋ", allVideos: "ਸਾਰੇ ਵੀਡੀਓ",
    videosComingSoon: "ਵੀਡੀਓ ਜਲਦੀ ਆਉਣਗੇ!",
    loadingBattles: "ਬੈਟਲ ਲੋਡ ਹੋ ਰਹੇ ਹਨ...", noActiveBattles: "ਕੋਈ ਸਰਗਰਮ ਬੈਟਲ ਨਹੀਂ",
    checkBackSoon: "ਨਵੇਂ ਸਕਿੱਲ ਬੈਟਲਾਂ ਲਈ ਜਲਦੀ ਵਾਪਸ ਆਓ!",
    refresh: "ਤਾਜ਼ਾ ਕਰੋ", computingRanks: "ਤੁਹਾਡੀ ਰੈਂਕਿੰਗ ਗਿਣੀ ਜਾ ਰਹੀ ਹੈ...",
    retry: "ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼", notRankedYet: "ਤੁਸੀਂ ਹਾਲੇ ਰੈਂਕ ਨਹੀਂ ਕੀਤੇ",
    uploadReelPrompt: "ਬੈਟਲ ਵਿੱਚ ਸ਼ਾਮਲ ਹੋਣ ਲਈ ਰੀਲ ਅਪਲੋਡ ਕਰੋ!",
    viewFullSkillboard: "ਪੂਰਾ ਸਕਿੱਲਬੋਰਡ ਦੇਖੋ",
    battleEnded: "ਬੈਟਲ ਸਮਾਪਤ", notEligible: "ਯੋਗ ਨਹੀਂ", uploadReel: "ਰੀਲ ਅਪਲੋਡ ਕਰੋ",
    loginRequired: "ਲੌਗਿਨ ਜ਼ਰੂਰੀ ਹੈ", live: "ਲਾਈਵ", completed: "ਪੂਰਾ",
    prizePool: "ਇਨਾਮ ਫੰਡ", endingSoon: "ਜਲਦੀ ਖਤਮ", viewResult: "ਨਤੀਜਾ ਦੇਖੋ",
    joinNow: "ਹੁਣੇ ਸ਼ਾਮਲ ਹੋਵੋ", participate: "ਭਾਗ ਲਵੋ", reserveSpot: "ਜਗ੍ਹਾ ਰਾਖਵੀਂ ਕਰੋ",
    startsSoon: "ਜਲਦੀ ਸ਼ੁਰੂ", all: "ਸਾਰੇ", upcoming: "ਆਉਣ ਵਾਲੇ",
    aiGuruSubtitle: "ਤੁਹਾਡਾ ਨਿੱਜੀ ਸਿੱਖਣ ਸਹਾਇਕ", askAnything: "ਕੁਝ ਵੀ ਪੁੱਛੋ", instantAnswers: "ਤੁਰੰਤ ਜਵਾਬ", studyHelp: "ਪੜ੍ਹਾਈ ਵਿੱਚ ਮਦਦ", startChatting: "ਗੱਲਬਾਤ ਸ਼ੁਰੂ ਕਰੋ →",
    premiumFeature: "ਪ੍ਰੀਮਿਅਮ ਸੁਵਿਧਾ", premiumUnlockMsg: "ਇਹ ਸੁਵਿਧਾ ਅਨਲਾਕ ਕਰਨ ਲਈ AI Guru Premium ਅਪਗ੍ਰੇਡ ਕਰੋ।", maybeLater: "ਬਾਅਦ ਵਿੱਚ", upgrade: "ਅਪਗ੍ਰੇਡ",
    aiClassroom: "ਤੁਹਾਡੀ ਨਿੱਜੀ AI ਕਲਾਸਰੂਮ\nGemini ਦੁਆਰਾ ਸੰਚਾਲਿਤ", freeLessonsLeft: "ਅੱਜ ਮੁਫ਼ਤ ਪਾਠ ਬਾਕੀ", unlimitedAccess: "ਅਸੀਮਿਤ ਪ੍ਰੀਮਿਅਮ ਐਕਸੈੱਸ ਸਕਿਰਿਅ",
    lessonSetup: "ਪਾਠ ਸੈੱਟਅੱਪ", continueBtn: "ਜਾਰੀ ਰੱਖੋ →", fillRequiredFields: "ਲੋੜੀਂਦੀ ਜਾਣਕਾਰੀ ਭਰੋ", fillRequiredFieldsDesc: "ਕਿਰਪਾ ਕਰਕੇ ਵਿਸ਼ਾ ਚੁਣੋ ਅਤੇ ਅਧਿਆਏ ਦਾ ਨਾਮ ਦਾਖਲ ਕਰੋ।",
    vidyaGuruAI: "VidyaGuru AI", personalAiTeacher: "ਤੁਹਾਡੇ ਨਿੱਜੀ AI ਅਧਿਆਪਕ", readyToHelp: "ਮਦਦ ਲਈ ਤਿਆਰ!", thinking: "ਸੋਚ ਰਿਹਾ ਹਾਂ...", speaking: "ਬੋਲ ਰਿਹਾ ਹਾਂ...", listening: "ਸੁਣ ਰਿਹਾ ਹਾਂ...",
    paywallTitle: "VidyaGuru ਨਾਲ ਜਾਰੀ ਰੱਖਣਾ ਹੈ?", paywallBody: "ਅੱਜ ਦਾ ਮੁਫ਼ਤ ਸਵਾਲ ਵਰਤਿਆ। ਅਸੀਮਿਤ ਗੱਲਬਾਤ ਲਈ ਪ੍ਰੀਮਿਅਮ ਅਪਗ੍ਰੇਡ ਕਰੋ!", upgradeToPremium: "ਪ੍ਰੀਮਿਅਮ ਤੇ ਅਪਗ੍ਰੇਡ ਕਰੋ",
    seekhoSignIn: "Seekho ਐਕਸੈੱਸ ਕਰਨ ਲਈ ਲੌਗਇਨ ਕਰੋ", curriculumAligned: "ਪਾਠਕ੍ਰਮ-ਆਧਾਰਿਤ ਸਿੱਖਿਆ", subjects: "ਵਿਸ਼ੇ", continueLearning: "ਸਿੱਖਣਾ ਜਾਰੀ ਰੱਖੋ", resumeLearning: "ਜਿੱਥੇ ਛੱਡਿਆ ਸੀ ਉੱਥੋਂ ਸ਼ੁਰੂ ਕਰੋ",
    revisionDue: "ਦੁਹਰਾਓ!", revisionReady: "ਸੰਕਲਪ ਸਮੀਖਿਆ ਲਈ ਤਿਆਰ", unlockCurriculum: "ਪੂਰਾ ਪਾਠਕ੍ਰਮ ਅਨਲਾਕ ਕਰੋ",
    pendingReview: "ਸਮੀਖਿਆ ਬਾਕੀ", inReview: "ਸਮੀਖਿਆ ਵਿੱਚ", approved: "ਮਨਜ਼ੂਰ", rejected: "ਰੱਦ", limitReached: "ਸੀਮਾ ਪਹੁੰਚ ਗਈ", limitReachedDesc: "ਤੁਸੀਂ ਇਸ ਬੈਟਲ ਦੀ ਅਪਲੋਡ ਸੀਮਾ ਤੇ ਪਹੁੰਚ ਗਏ ਹੋ।",
  },

  // ─────────────────────────── Odia ─────────────────────────────────
  or: {
    home: "ହୋମ", leaderboard: "ଲିଡ଼ରବୋର୍ଡ", wallet: "ୱାଲେଟ",
    settings: "ସେଟିଂ", dashboard: "ଡ୍ୟାଶ୍‌ବୋର୍ଡ", aiGuru: "AI ଗୁରୁ",
    skillBoard: "ଦକ୍ଷତା ବୋର୍ଡ", logout: "ଲଗ୍‌ଆଉଟ",
    profileSettings: "ପ୍ରୋଫାଇଲ ସେଟିଂ", language: "ଭାଷା",
    changeLanguage: "ଆପ ଏବଂ ବିଷୟ ଭାଷା ପରିବର୍ତ୍ତନ କରନ୍ତୁ",
    darkTheme: "ଡାର୍କ ଥିମ", notifications: "ବିଜ୍ଞପ୍ତି",
    privacy: "ଗୋପନୀୟତା", about: "ବିଷୟରେ",
    customizeExperience: "ଆପଣଙ୍କ ଅଭିଜ୍ଞତା କଷ୍ଟୋମାଇଜ କରନ୍ତୁ",
    save: "ସଞ୍ଚୟ କରନ୍ତୁ", cancel: "ବାତିଲ", edit: "ସମ୍ପାଦନା", back: "ଫେରନ୍ତୁ",
    delete: "ଡିଲିଟ", loading: "ଲୋଡ ହେଉଛି...", editProfile: "ପ୍ରୋଫାଇଲ ସମ୍ପାଦନ",
    saveChanges: "ପରିବର୍ତ୍ତନ ସଞ୍ଚୟ କରନ୍ତୁ", verify: "ଯାଞ୍ଚ କରନ୍ତୁ", confirm: "ନିଶ୍ଚିତ କରନ୍ତୁ", send: "ପଠାନ୍ତୁ",
    languageTitle: "ଭାଷା", languageSubtitle: "ଭାରତୀୟ ସମ୍ବିଧାନ 8ମ ଅନୁଚ୍ଛେଦ 22 ଭାଷା",
    searchLanguage: "ଭାଷା ଖୋଜନ୍ତୁ...", scheduleNote: "ଏଗୁଡ଼ିକ ଭାରତ ସମ୍ବିଧାନ 8ମ ଅନୁଚ୍ଛେଦ 22 ଭାଷା।",
    basicInfo: "ମୂଳ ସୂଚନା", academicDetails: "ଶୈକ୍ଷଣିକ ବିବରଣ",
    location: "ଅବସ୍ଥାନ", interests: "ଆଗ୍ରହ", fullName: "ପୂର୍ଣ ନାମ",
    phoneNumber: "ଫୋନ ନମ୍ବର", dateOfBirth: "ଜନ୍ମ ତାରିଖ", age: "ବୟସ",
    school: "ବିଦ୍ୟାଳୟ / ଅନୁଷ୍ଠାନ", preferredLanguage: "ପସନ୍ଦର ଭାଷା",
    pincode: "ପିନ୍‌କୋଡ", class: "ଶ୍ରେଣୀ / ଗ୍ରେଡ", board: "ବୋର୍ଡ",
    learnFunLoading: "ଆପଣଙ୍କ LearnFun ଦୁନିଆ ଲୋଡ ହେଉଛି...",
    profileNotFound: "ପ୍ରୋଫାଇଲ ମିଳିଲା ନାହିଁ",
    profileSetupPrompt: "ଖେଳ ଆରମ୍ଭ କରିବା ପାଇଁ ଆପଣଙ୍କ ପ୍ରୋଫାଇଲ ସମ୍ପୂର୍ଣ କରନ୍ତୁ!",
    dailyStreak: "ଦୈନିକ ସ୍ଟ୍ରୀକ", view: "ଦେଖନ୍ତୁ", todaysMission: "ଆଜିର ମିଶନ",
    daily: "ଦୈନିକ", noMissionToday: "ଆଜି କୌଣସି ମିଶନ ନାହିଁ। ଶୀଘ୍ର ଫେରନ୍ତୁ!",
    skillWorlds: "ଦକ୍ଷତା ଦୁନିଆ", bossBattle: "ବସ ଯୁଦ୍ଧ",
    yourGames: "ଆପଣଙ୍କ ଖେଳ", gamesLoading: "ଖେଳ ଲୋଡ ହେଉଛି...",
    yourBadges: "ଆପଣଙ୍କ ବ୍ୟାଜ", viewAll: "ସବୁ ଦେଖନ୍ତୁ", comingSoon: "ଶୀଘ୍ର ଆସୁଛି", play: "ଖେଳ",
    searchVideos: "ଭିଡ଼ିଓ, ବିଷୟ, ଶିକ୍ଷକ ଖୋଜନ୍ତୁ...",
    featured: "ବିଶେଷ", noVideosFound: "କୌଣସି ଭିଡ଼ିଓ ମିଳିଲା ନାହିଁ",
    clearFilters: "ଫିଲ୍ଟର ସଫା କରନ୍ତୁ", allVideos: "ସବୁ ଭିଡ଼ିଓ",
    videosComingSoon: "ଭିଡ଼ିଓ ଶୀଘ୍ର ଆସୁଛି!",
    loadingBattles: "ଯୁଦ୍ଧ ଲୋଡ ହେଉଛି...", noActiveBattles: "କୌଣସି ସକ୍ରିୟ ଯୁଦ୍ଧ ନାହିଁ",
    checkBackSoon: "ନୂଆ ଦକ୍ଷତା ଯୁଦ୍ଧ ପାଇଁ ଶୀଘ୍ର ଫେରନ୍ତୁ!",
    refresh: "ରିଫ୍ରେଶ", computingRanks: "ଆପଣଙ୍କ ରୌ‌ଁ‍କ ଗଣନା ହେଉଛି...",
    retry: "ପୁଣି ଚେଷ୍ଟା", notRankedYet: "ଆପଣ ଏପର୍ଯ୍ୟନ୍ତ ରୌ‌ଁ‍କ ପାଇ ନାହାଁନ୍ତି",
    uploadReelPrompt: "ଯୁଦ୍ଧରେ ଭାଗ ନେବା ପାଇଁ ରୀଲ ଅପଲୋଡ କରନ୍ତୁ!",
    viewFullSkillboard: "ସମ୍ପୂର୍ଣ ସ୍କିଲ୍‌ବୋର୍ଡ ଦେଖନ୍ତୁ",
    battleEnded: "ଯୁଦ୍ଧ ସମାପ୍ତ", notEligible: "ଯୋଗ୍ୟ ନୁହଁ", uploadReel: "ରୀଲ ଅପଲୋଡ",
    loginRequired: "ଲଗଇନ ଆବଶ୍ୟକ", live: "ଲାଇଭ", completed: "ସମ୍ପୂର୍ଣ",
    prizePool: "ପୁରସ୍କାର ନିଧି", endingSoon: "ଶୀଘ୍ର ଶେଷ", viewResult: "ଫଳ ଦେଖନ୍ତୁ",
    joinNow: "ଏବେ ଯୋଗ ଦିଅନ୍ତୁ", participate: "ଭାଗ ନିଅନ୍ତୁ", reserveSpot: "ସ୍ଥାନ ସଂରକ୍ଷଣ",
    startsSoon: "ଶୀଘ୍ର ଆରମ୍ଭ", all: "ସବୁ", upcoming: "ଆସୁଥିବା",
    aiGuruSubtitle: "ଆପଣଙ୍କ ବ୍ୟକ୍ତିଗତ ଶିକ୍ଷଣ ସହାୟକ", askAnything: "ଯାହା ଇଚ୍ଛା ପଚାର", instantAnswers: "ତୁରନ୍ତ ଉତ୍ତର", studyHelp: "ପଢ଼ାରେ ସାହାଯ୍ୟ", startChatting: "ଚ୍ୟାଟ ଆରମ୍ଭ କରନ୍ତୁ →",
    premiumFeature: "ପ୍ରିମିଅମ ବୈଶିଷ୍ଟ୍ୟ", premiumUnlockMsg: "ଏହି ବୈଶିଷ୍ଟ୍ୟ ଅନ୍‌ଲକ ପାଇଁ AI Guru Premium ଅପଗ୍ରେଡ କରନ୍ତୁ।", maybeLater: "ପରେ", upgrade: "ଅପଗ୍ରେଡ",
    aiClassroom: "ଆପଣଙ୍କ ବ୍ୟକ୍ତିଗତ AI ଶ୍ରେଣୀ\nGemini ଦ୍ୱାରା ପରିଚାଳିତ", freeLessonsLeft: "ଆଜି ମୁଫ୍ ପାଠ ବାକି", unlimitedAccess: "ଅସୀମ ପ୍ରିମିଅମ ପ୍ରବେଶ ସକ୍ରିୟ",
    lessonSetup: "ପାଠ ସେଟଅପ", continueBtn: "ଜାରି ରଖନ୍ତୁ →", fillRequiredFields: "ଆବଶ୍ୟକ ତଥ୍ୟ ପୂରଣ କରନ୍ତୁ", fillRequiredFieldsDesc: "ଦୟାକରି ବିଷୟ ଚୟନ କରନ୍ତୁ ଓ ଅଧ୍ୟାୟ ନାମ ଦିଅନ୍ତୁ।",
    vidyaGuruAI: "VidyaGuru AI", personalAiTeacher: "ଆପଣଙ୍କ ବ୍ୟକ୍ତିଗତ AI ଶିକ୍ଷକ", readyToHelp: "ସାହାଯ୍ୟ ପାଇଁ ପ୍ରସ୍ତୁତ!", thinking: "ଚିନ୍ତା କରୁଛି...", speaking: "କଥା କହୁଛି...", listening: "ଶୁଣୁଛି...",
    paywallTitle: "VidyaGuru ସହ ଜାରି ରଖନ୍ତୁ?", paywallBody: "ଆଜିର ମୁଫ ପ୍ରଶ୍ନ ଶେଷ। ଅସୀମ ବାର୍ତ୍ତା ପାଇଁ ପ୍ରିମିଅମ ଅପଗ୍ରେଡ କରନ୍ତୁ!", upgradeToPremium: "ପ୍ରିମିଅମକୁ ଅପଗ୍ରେଡ",
    seekhoSignIn: "Seekho ପ୍ରବେଶ ପାଇଁ ଲଗଇନ", curriculumAligned: "ପାଠ୍ୟକ୍ରମ-ଆଧାରିତ ଶିକ୍ଷଣ", subjects: "ବିଷୟ", continueLearning: "ଶିଖିବା ଜାରି ରଖନ୍ତୁ", resumeLearning: "ଯେଉଁ ଠାରେ ଛାଡ଼ିଥିଲେ ସେଠୁ ଆରମ୍ଭ",
    revisionDue: "ପୁନଃ ଅଧ୍ୟୟନ କରନ୍ତୁ!", revisionReady: "ଧାରଣା ସମୀକ୍ଷା ପାଇଁ ପ୍ରସ୍ତୁତ", unlockCurriculum: "ସମ୍ପୂର୍ଣ ପାଠ୍ୟକ୍ରମ ଅନ୍‌ଲକ",
    pendingReview: "ସମୀକ୍ଷା ଅପେକ୍ଷା", inReview: "ସମୀକ୍ଷାଧୀନ", approved: "ଅନୁମୋଦିତ", rejected: "ପ୍ରତ୍ୟାଖ୍ୟାନ", limitReached: "ସୀମା ସ୍ପର୍ଶ", limitReachedDesc: "ଆପଣ ଏହି ଯୁଦ୍ଧ ପାଇଁ ଅପଲୋଡ ସୀମା ଛୁଇଁ ଗଲେ।",
  },

  // ─────────────────────────── Urdu ─────────────────────────────────
  ur: {
    home: "ہوم", leaderboard: "لیڈربورڈ", wallet: "والیٹ",
    settings: "ترتیبات", dashboard: "ڈیش بورڈ", aiGuru: "AI گرو",
    skillBoard: "مہارت بورڈ", logout: "لاگ آؤٹ",
    profileSettings: "پروفائل ترتیبات", language: "زبان",
    changeLanguage: "ایپ اور مواد کی زبان تبدیل کریں",
    darkTheme: "ڈارک تھیم", notifications: "اطلاعات",
    privacy: "رازداری", about: "کے بارے میں",
    customizeExperience: "اپنا تجربہ حسب ضرورت بنائیں",
    save: "محفوظ کریں", cancel: "منسوخ کریں", edit: "ترمیم کریں", back: "واپس",
    delete: "حذف کریں", loading: "لوڈ ہو رہا ہے...", editProfile: "پروفائل ترمیم کریں",
    saveChanges: "تبدیلیاں محفوظ کریں", verify: "تصدیق کریں", confirm: "تائید کریں", send: "بھیجیں",
    languageTitle: "زبان", languageSubtitle: "بھارتی آئین کے 8ویں شیڈول کی تمام 22 زبانیں",
    searchLanguage: "زبان تلاش کریں...", scheduleNote: "یہ ہندوستان کے آئین کے 8ویں شیڈول میں درج 22 زبانیں ہیں۔",
    basicInfo: "بنیادی معلومات", academicDetails: "تعلیمی تفصیلات",
    location: "مقام", interests: "دلچسپیاں", fullName: "پورا نام",
    phoneNumber: "فون نمبر", dateOfBirth: "تاریخ پیدائش", age: "عمر",
    school: "اسکول / ادارہ", preferredLanguage: "ترجیحی زبان",
    pincode: "پن کوڈ", class: "جماعت / گریڈ", board: "بورڈ",
    learnFunLoading: "آپ کی LearnFun دنیا لوڈ ہو رہی ہے...",
    profileNotFound: "پروفائل نہیں ملا",
    profileSetupPrompt: "کھیلنا شروع کرنے کے لیے اپنا پروفائل مکمل کریں!",
    dailyStreak: "روزانہ سٹریک", view: "دیکھیں", todaysMission: "آج کا مشن",
    daily: "روزانہ", noMissionToday: "آج کوئی مشن نہیں۔ جلد واپس آئیں!",
    skillWorlds: "مہارت کی دنیا", bossBattle: "بوس بیٹل",
    yourGames: "آپ کے کھیل", gamesLoading: "کھیل لوڈ ہو رہے ہیں...",
    yourBadges: "آپ کے بیجز", viewAll: "سب دیکھیں", comingSoon: "جلد آ رہا ہے", play: "کھیلیں",
    searchVideos: "ویڈیو، موضوع، استاد تلاش کریں...",
    featured: "خاص", noVideosFound: "کوئی ویڈیو نہیں ملا",
    clearFilters: "فلٹر صاف کریں", allVideos: "تمام ویڈیو",
    videosComingSoon: "ویڈیو جلد آئیں گے!",
    loadingBattles: "لڑائیاں لوڈ ہو رہی ہیں...", noActiveBattles: "کوئی فعال لڑائی نہیں",
    checkBackSoon: "نئی سکل بیٹل کے لیے جلد واپس آئیں!",
    refresh: "تازہ کریں", computingRanks: "آپ کی رینک شمار ہو رہی ہے...",
    retry: "دوبارہ کوشش", notRankedYet: "آپ ابھی رینک میں نہیں ہیں",
    uploadReelPrompt: "لڑائی میں شامل ہونے کے لیے ریل اپلوڈ کریں!",
    viewFullSkillboard: "پورا اسکل بورڈ دیکھیں",
    battleEnded: "لڑائی ختم", notEligible: "اہل نہیں", uploadReel: "ریل اپلوڈ کریں",
    loginRequired: "لاگ ان ضروری ہے", live: "لائیو", completed: "مکمل",
    prizePool: "انعامی رقم", endingSoon: "جلد ختم ہوگی", viewResult: "نتیجہ دیکھیں",
    joinNow: "ابھی شامل ہوں", participate: "حصہ لیں", reserveSpot: "جگہ محفوظ کریں",
    startsSoon: "جلد شروع", all: "تمام", upcoming: "آنے والے",
    aiGuruSubtitle: "آپ کا ذاتی سیکھنے کا معاون", askAnything: "کچھ بھی پوچھیں", instantAnswers: "فوری جوابات", studyHelp: "تعلیمی مدد", startChatting: "چیٹ شروع کریں →",
    premiumFeature: "پریمیئم فیچر", premiumUnlockMsg: "یہ فیچر کھولنے کے لیے AI Guru Premium اپگریڈ کریں۔", maybeLater: "بعد میں", upgrade: "اپگریڈ",
    aiClassroom: "آپ کی ذاتی AI کلاس روم\nGemini کے ذریعے چلائی جاتی ہے", freeLessonsLeft: "آج کے مفت اسباق باقی", unlimitedAccess: "لامحدود پریمیئم رسائی فعال",
    lessonSetup: "سبق کا اعداد و شمار", continueBtn: "جاری رکھیں →", fillRequiredFields: "ضروری فیلڈز بھریں", fillRequiredFieldsDesc: "براہ کرم موضوع منتخب کریں اور باب کا نام درج کریں۔",
    vidyaGuruAI: "VidyaGuru AI", personalAiTeacher: "آپ کا ذاتی AI استاد", readyToHelp: "مدد کے لیے تیار!", thinking: "سوچ رہا ہوں...", speaking: "بول رہا ہوں...", listening: "سن رہا ہوں...",
    paywallTitle: "VidyaGuru کے ساتھ جاری رکھیں؟", paywallBody: "آج کا مفت سوال استعمال ہو گیا۔ لامحدود گفتگو کے لیے پریمیئم اپگریڈ کریں!", upgradeToPremium: "پریمیئم پر اپگریڈ کریں",
    seekhoSignIn: "Seekho تک رسائی کے لیے لاگ ان کریں", curriculumAligned: "نصاب پر مبنی تعلیم", subjects: "مضامین", continueLearning: "سیکھنا جاری رکھیں", resumeLearning: "جہاں چھوڑا تھا وہاں سے شروع کریں",
    revisionDue: "مراجعت کریں!", revisionReady: "تصورات مراجعت کے لیے تیار", unlockCurriculum: "مکمل نصاب کھولیں",
    pendingReview: "جائزہ باقی", inReview: "جائزے میں", approved: "منظور", rejected: "مسترد", limitReached: "حد تک پہنچ گئے", limitReachedDesc: "آپ اس مقابلے کی اپلوڈ حد تک پہنچ گئے ہیں۔",
  },

  // ─────────────────────────── Assamese ────────────────────────────
  as: {
    home: "হোম", leaderboard: "লিডাৰবৰ্ড", wallet: "ৱালেট",
    settings: "ছেটিংছ", dashboard: "ডেচবৰ্ড", aiGuru: "AI গুৰু",
    skillBoard: "দক্ষতা বৰ্ড", logout: "লগআউট",
    profileSettings: "প্ৰ'ফাইল ছেটিংছ", language: "ভাষা",
    changeLanguage: "এপ আৰু সমলৰ ভাষা সলনি কৰক",
    darkTheme: "ডাৰ্ক থিম", notifications: "জাননী",
    privacy: "গোপনীয়তা", about: "বিষয়ে",
    customizeExperience: "আপোনাৰ অভিজ্ঞতা কাস্টমাইজ কৰক",
    save: "সংৰক্ষণ কৰক", cancel: "বাতিল", edit: "সম্পাদনা", back: "উভতি যাওক",
    delete: "মচি পেলাওক", loading: "লোড হৈ আছে...", editProfile: "প্ৰ'ফাইল সম্পাদনা কৰক",
    saveChanges: "পৰিৱৰ্তন সংৰক্ষণ কৰক", verify: "প্ৰমাণিত কৰক", confirm: "নিশ্চিত কৰক", send: "পঠাওক",
    languageTitle: "ভাষা", languageSubtitle: "ভাৰতীয় সংবিধানৰ অষ্টম অনুসূচিৰ সকলো ২২টা ভাষা",
    searchLanguage: "ভাষা বিচাৰক...", scheduleNote: "এইবোৰ ভাৰতৰ সংবিধানৰ অষ্টম অনুসূচিত তালিকাভুক্ত ২২টা ভাষা।",
    basicInfo: "মূল তথ্য", academicDetails: "শৈক্ষণিক বিৱৰণ",
    location: "স্থান", interests: "আগ্ৰহ", fullName: "সম্পূৰ্ণ নাম",
    phoneNumber: "ফোন নম্বৰ", dateOfBirth: "জন্ম তাৰিখ", age: "বয়স",
    school: "বিদ্যালয় / প্ৰতিষ্ঠান", preferredLanguage: "পছন্দৰ ভাষা",
    pincode: "পিনক'ড", class: "শ্ৰেণী / গ্ৰেড", board: "ব'ৰ্ড",
    learnFunLoading: "আপোনাৰ LearnFun জগত লোড হৈ আছে...",
    profileNotFound: "প্ৰ'ফাইল পোৱা নগ'ল",
    profileSetupPrompt: "খেলিবলৈ আৰম্ভ কৰিবলৈ আপোনাৰ প্ৰ'ফাইল সম্পূৰ্ণ কৰক!",
    dailyStreak: "দৈনিক ষ্ট্ৰীক", view: "চাওক", todaysMission: "আজিৰ মিছন",
    daily: "দৈনিক", noMissionToday: "আজি কোনো মিছন নাই। সোনকালে উভতি আহক!",
    skillWorlds: "দক্ষতাৰ জগত", bossBattle: "বছ বেটেল",
    yourGames: "আপোনাৰ খেল", gamesLoading: "খেলসমূহ লোড হৈ আছে...",
    yourBadges: "আপোনাৰ বেজ", viewAll: "সকলো চাওক", comingSoon: "সোনকালে আহিব", play: "খেলক",
    searchVideos: "ভিডিঅ', বিষয়, শিক্ষক বিচাৰক...",
    featured: "বিশেষ", noVideosFound: "কোনো ভিডিঅ' পোৱা নগ'ল",
    clearFilters: "ফিল্টাৰ পৰিষ্কাৰ কৰক", allVideos: "সকলো ভিডিঅ'",
    videosComingSoon: "ভিডিঅ' সোনকালে আহিব!",
    loadingBattles: "বেটেলসমূহ লোড হৈ আছে...", noActiveBattles: "কোনো সক্ৰিয় বেটেল নাই",
    checkBackSoon: "নতুন দক্ষতা বেটেলৰ বাবে সোনকালে উভতি আহক!",
    refresh: "ৰিফ্ৰেছ", computingRanks: "আপোনাৰ ৰেংক গণনা হৈ আছে...",
    retry: "পুনৰ চেষ্টা", notRankedYet: "আপুনি এতিয়ালৈ ৰেংক পোৱা নাই",
    uploadReelPrompt: "বেটেলত অংশ লবলৈ ৰিল আপলোড কৰক!",
    viewFullSkillboard: "সম্পূৰ্ণ স্কিলবৰ্ড চাওক",
    battleEnded: "বেটেল সমাপ্ত", notEligible: "যোগ্য নহয়", uploadReel: "ৰিল আপলোড কৰক",
    loginRequired: "লগইন আৱশ্যক", live: "লাইভ", completed: "সম্পূৰ্ণ",
    prizePool: "পুৰস্কাৰ নিধি", endingSoon: "সোনকালে শেষ হ'ব", viewResult: "ফলাফল চাওক",
    joinNow: "এতিয়াই যোগ দিয়ক", participate: "অংশ লওক", reserveSpot: "ঠাই সংৰক্ষণ",
    startsSoon: "সোনকালে আৰম্ভ হ'ব", all: "সকলো", upcoming: "আহিবলগীয়া",
    aiGuruSubtitle: "আপোনাৰ ব্যক্তিগত শিক্ষণ সহায়ক", askAnything: "যিকোনো কথা সুধিব", instantAnswers: "তৎক্ষণাৎ উত্তৰ", studyHelp: "পঢ়াত সহায়", startChatting: "চেট আৰম্ভ কৰক →",
    premiumFeature: "প্ৰিমিয়াম ফিচাৰ", premiumUnlockMsg: "এই ফিচাৰটো আনলক কৰিবলৈ AI Guru Premium আপগ্ৰেড কৰক।", maybeLater: "পিছত", upgrade: "আপগ্ৰেড",
    aiClassroom: "আপোনাৰ ব্যক্তিগত AI ক্লাছৰুম\nGemini দ্বাৰা পৰিচালিত", freeLessonsLeft: "আজি বিনামূলীয়া পাঠ বাকী", unlimitedAccess: "অসীমিত প্ৰিমিয়াম এক্সেছ সক্ৰিয়",
    lessonSetup: "পাঠ ছেটআপ", continueBtn: "অব্যাহত ৰাখক →", fillRequiredFields: "প্ৰয়োজনীয় তথ্য পূৰণ কৰক", fillRequiredFieldsDesc: "অনুগ্ৰহ কৰি বিষয় বাছক আৰু অধ্যায়ৰ নাম দিয়ক।",
    vidyaGuruAI: "বিদ্যাগুৰু AI", personalAiTeacher: "আপোনাৰ ব্যক্তিগত AI শিক্ষক", readyToHelp: "সহায় কৰিবলৈ সাজু!", thinking: "ভাবি আছো...", speaking: "কৈ আছো...", listening: "শুনি আছো...",
    paywallTitle: "বিদ্যাগুৰুৰ সৈতে অব্যাহত ৰাখিবনে?", paywallBody: "আজিৰ বিনামূলীয়া প্ৰশ্ন শেষ। অসীমিত কথোপকথনৰ বাবে প্ৰিমিয়াম আপগ্ৰেড কৰক!", upgradeToPremium: "প্ৰিমিয়ামলৈ আপগ্ৰেড কৰক",
    seekhoSignIn: "Seekho এক্সেছ কৰিবলৈ লগইন কৰক", curriculumAligned: "পাঠ্যক্ৰম-আধাৰিত শিক্ষণ", subjects: "বিষয়সমূহ", continueLearning: "শিকাটো অব্যাহত ৰাখক", resumeLearning: "য'ত এৰিছিল তাৰপৰা আৰম্ভ কৰক",
    revisionDue: "পুনৰালোচনা কৰক!", revisionReady: "ধাৰণাসমূহ পুনৰালোচনাৰ বাবে সাজু", unlockCurriculum: "সম্পূৰ্ণ পাঠ্যক্ৰম আনলক কৰক",
    pendingReview: "পৰ্যালোচনা বাকী", inReview: "পৰ্যালোচনাত", approved: "অনুমোদিত", rejected: "প্ৰত্যাখ্যাত", limitReached: "সীমা পাইছে", limitReachedDesc: "আপুনি এই বেটেলৰ আপলোড সীমাত পাইছে।",
  },

  // ─────────────────────────── Manipuri ─────────────────────────────
  mni: {
    home: "হোম", leaderboard: "লিডারবোর্ড", wallet: "ওয়ালেট",
    settings: "সেটিং", dashboard: "ড্যাশবোর্ড", aiGuru: "AI গুরু",
    skillBoard: "স্কিল বোর্ড", logout: "লগআউট",
    profileSettings: "প্রোফাইল সেটিং", language: "মাতৃভাষা",
    changeLanguage: "অ্যাপ ও বিষয়বস্তুর ভাষা পরিবর্তন করুন",
    darkTheme: "ডার্ক থিম", notifications: "বিজ্ঞপ্তি",
    privacy: "গোপনীয়তা", about: "পরিচয়",
    customizeExperience: "নিজস্ব অভিজ্ঞতা সাজান",
    save: "লৌশিনবিউ", cancel: "থম্বিউ", edit: "হেন্না থম্বিউ", back: "ওইনবিউ",
    delete: "পানবিউ", loading: "লোড হচ্ছে...", editProfile: "প্রোফাইল এডিট করুন",
    saveChanges: "চেঞ্জ সেভ করুন", verify: "ভেরিফাই করুন", confirm: "কনফার্ম করুন", send: "পাঠান",
    languageTitle: "মাতৃভাষা", languageSubtitle: "ভারতীয় সংবিধানের ৮ম তফসিলের ২২টি ভাষা",
    searchLanguage: "ভাষা খুঁজুন...", scheduleNote: "এগুলো ভারতের সংবিধানের ৮ম তফসিলে তালিকাভুক্ত ২২টি ভাষা।",
    basicInfo: "মূল তথ্য", academicDetails: "পড়াশুনার তথ্য",
    location: "জায়গা", interests: "আগ্রহ", fullName: "পুরো নাম",
    phoneNumber: "ফোন নম্বর", dateOfBirth: "জন্মতারিখ", age: "বয়স",
    school: "স্কুল / প্রতিষ্ঠান", preferredLanguage: "পছন্দের ভাষা",
    pincode: "পিনকোড", class: "ক্লাস / গ্রেড", board: "বোর্ড",
    learnFunLoading: "তোমার LearnFun দুনিয়া লোড হচ্ছে...",
    profileNotFound: "প্রোফাইল পাওয়া যায়নি",
    profileSetupPrompt: "খেলা শুরু করতে প্রোফাইল সম্পূর্ণ করুন!",
    dailyStreak: "প্রতিদিনের স্ট্রিক", view: "দেখুন", todaysMission: "আজকের মিশন",
    daily: "প্রতিদিন", noMissionToday: "আজ মিশন নেই। শীঘ্রই ফিরুন!",
    skillWorlds: "দক্ষতার জগৎ", bossBattle: "বস ব্যাটেল",
    yourGames: "তোমার গেমস", gamesLoading: "গেমস লোড হচ্ছে...",
    yourBadges: "তোমার ব্যাজ", viewAll: "সব দেখুন", comingSoon: "শীঘ্রই আসছে", play: "খেলুন",
    searchVideos: "ভিডিও, বিষয়, শিক্ষক খুঁজুন...",
    featured: "বিশেষ", noVideosFound: "কোনো ভিডিও পাওয়া যায়নি",
    clearFilters: "ফিল্টার পরিষ্কার করুন", allVideos: "সব ভিডিও",
    videosComingSoon: "ভিডিও শীঘ্রই!",
    loadingBattles: "ব্যাটেল লোড হচ্ছে...", noActiveBattles: "কোনো সক্রিয় ব্যাটেল নেই",
    checkBackSoon: "নতুন স্কিল ব্যাটেলের জন্য শীঘ্রই ফিরুন!",
    refresh: "রিফ্রেশ", computingRanks: "র‌্যাঙ্ক গণনা হচ্ছে...",
    retry: "আবার চেষ্টা", notRankedYet: "এখনো র‌্যাংকড নও",
    uploadReelPrompt: "ব্যাটেলে অংশ নিতে রিল আপলোড করো!",
    viewFullSkillboard: "পুরো স্কিলবোর্ড দেখুন",
    battleEnded: "ব্যাটেল শেষ", notEligible: "যোগ্য নয়", uploadReel: "রিল আপলোড করুন",
    loginRequired: "লগইন দরকার", live: "লাইভ", completed: "সম্পন্ন",
    prizePool: "পুরস্কার তহবিল", endingSoon: "শীঘ্রই শেষ", viewResult: "ফলাফল দেখুন",
    joinNow: "এখনই যোগ দিন", participate: "অংশগ্রহণ করুন", reserveSpot: "জায়গা বুক করুন",
    startsSoon: "শীঘ্রই শুরু", all: "সব", upcoming: "আসন্ন",
    aiGuruSubtitle: "তোমার ব্যক্তিগত শিক্ষণ সহায়ক", askAnything: "যা ইচ্ছা জিজ্ঞেস করো", instantAnswers: "তাৎক্ষণিক উত্তর", studyHelp: "পড়ায় সাহায্য", startChatting: "চ্যাট শুরু করো →",
    premiumFeature: "প্রিমিয়াম ফিচার", premiumUnlockMsg: "এই ফিচার আনলক করতে AI Guru Premium আপগ্রেড করো।", maybeLater: "পরে", upgrade: "আপগ্রেড",
    aiClassroom: "তোমার ব্যক্তিগত AI ক্লাসরুম\nGemini দ্বারা পরিচালিত", freeLessonsLeft: "আজকের বিনামূল্যে পাঠ বাকি", unlimitedAccess: "সীমাহীন প্রিমিয়াম অ্যাক্সেস সক্রিয়",
    lessonSetup: "পাঠ সেটআপ", continueBtn: "চালিয়ে যাও →", fillRequiredFields: "প্রয়োজনীয় তথ্য পূরণ করো", fillRequiredFieldsDesc: "অনুগ্রহ করে বিষয় বেছে নাও এবং অধ্যায়ের নাম লেখো।",
    vidyaGuruAI: "বিদ্যাগুরু AI", personalAiTeacher: "তোমার ব্যক্তিগত AI শিক্ষক", readyToHelp: "সাহায্যের জন্য প্রস্তুত!", thinking: "ভাবছি...", speaking: "বলছি...", listening: "শুনছি...",
    paywallTitle: "বিদ্যাগুরুর সাথে চালিয়ে যাবে?", paywallBody: "আজকের বিনামূল্যে প্রশ্ন শেষ। সীমাহীন কথোপকথনের জন্য প্রিমিয়াম আপগ্রেড করো!", upgradeToPremium: "প্রিমিয়ামে আপগ্রেড করো",
    seekhoSignIn: "Seekho অ্যাক্সেস করতে লগইন করো", curriculumAligned: "পাঠ্যক্রম-ভিত্তিক শিক্ষা", subjects: "বিষয়সমূহ", continueLearning: "শেখা চালিয়ে যাও", resumeLearning: "যেখানে ছেড়েছিলে সেখান থেকে শুরু করো",
    revisionDue: "রিভিশন করো!", revisionReady: "ধারণাগুলো পুনরালোচনার জন্য প্রস্তুত", unlockCurriculum: "সম্পূর্ণ পাঠ্যক্রম আনলক করো",
    pendingReview: "পর্যালোচনা বাকি", inReview: "পর্যালোচনায়", approved: "অনুমোদিত", rejected: "প্রত্যাখ্যাত", limitReached: "সীমা পৌঁছেছে", limitReachedDesc: "তুমি এই ব্যাটেলের আপলোড সীমায় পৌঁছে গেছ।",
  },

  // ─── Remaining 9 languages fall back to English ───────────────────
  // Bodo (brx), Dogri (doi), Kashmiri (ks), Konkani (gom),
  // Maithili (mai), Nepali (ne), Sanskrit (sa), Santali (sat), Sindhi (sd)
};

export default translations;

// Language name → i18next language code map
export const LANGUAGE_CODE_MAP: Record<string, string> = {
  English:   "en",
  Assamese:  "as",  Bengali:  "bn",  Bodo:    "brx", Dogri:    "doi",
  Gujarati:  "gu",  Hindi:    "hi",  Kannada: "kn",  Kashmiri: "ks",
  Konkani:   "gom", Maithili: "mai", Malayalam:"ml", Manipuri: "mni",
  Marathi:   "mr",  Nepali:   "ne",  Odia:    "or",  Punjabi:  "pa",
  Sanskrit:  "sa",  Santali:  "sat", Sindhi:  "sd",  Tamil:    "ta",
  Telugu:    "te",  Urdu:     "ur",
};
