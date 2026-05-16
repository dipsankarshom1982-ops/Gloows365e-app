"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateSkillboard = void 0;
const admin = __importStar(require("firebase-admin"));
const firestore_1 = require("firebase-functions/v2/firestore");
admin.initializeApp();
const db = admin.firestore();
// ─── Trigger: on any post write ────────────────────────────
exports.updateSkillboard = (0, firestore_1.onDocumentWritten)("posts/{postId}", async (event) => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
    const change = event.data;
    if (!change)
        return null;
    // Skip deletes
    if (!change.after.exists)
        return null;
    const after = change.after.data();
    // Only process reels
    if (!after || after.postType !== "reel")
        return null;
    const userId = after.userId;
    const month = after.month;
    if (!userId || !month)
        return null;
    console.log(`🔥 Updating skillboard for ${userId} - ${month}`);
    // ── Aggregate all reels for this user this month ──────
    const postsSnap = await db
        .collection("posts")
        .where("userId", "==", userId)
        .where("month", "==", month)
        .where("postType", "==", "reel")
        .get();
    let totalLikes = 0;
    let totalViews = 0;
    let totalWatchtime = 0;
    let totalShares = 0;
    let totalComments = 0;
    postsSnap.forEach((postDoc) => {
        var _a, _b, _c, _d, _e;
        const p = postDoc.data();
        totalLikes += (_a = p.likes) !== null && _a !== void 0 ? _a : 0;
        totalViews += (_b = p.views) !== null && _b !== void 0 ? _b : 0;
        totalWatchtime += (_c = p.watchTime) !== null && _c !== void 0 ? _c : 0;
        totalShares += (_d = p.shares) !== null && _d !== void 0 ? _d : 0;
        totalComments += (_e = p.comments) !== null && _e !== void 0 ? _e : 0;
    });
    // ── Calculate score ───────────────────────────────────
    const totalScore = totalLikes * 5 +
        totalComments * 3 +
        totalShares * 4 +
        totalViews * 1 +
        totalWatchtime * 2;
    // ── Write to skillboard/{userId}_{month} ──────────────
    const skillboardId = `${userId}_${month}`;
    const skillboardRef = db.collection("skillboard").doc(skillboardId);
    const skillboardData = {
        userId,
        name: (_a = after.name) !== null && _a !== void 0 ? _a : "",
        profilePic: (_b = after.profilePic) !== null && _b !== void 0 ? _b : "",
        school: (_c = after.school) !== null && _c !== void 0 ? _c : "",
        class: after.class !== undefined ? String(after.class) : "",
        location: {
            city: (_e = (_d = after.location) === null || _d === void 0 ? void 0 : _d.city) !== null && _e !== void 0 ? _e : "",
            district: (_g = (_f = after.location) === null || _f === void 0 ? void 0 : _f.district) !== null && _g !== void 0 ? _g : "",
            state: (_j = (_h = after.location) === null || _h === void 0 ? void 0 : _h.state) !== null && _j !== void 0 ? _j : "",
        },
        month,
        totalLikes,
        totalViews,
        totalWatchtime,
        totalShares,
        totalComments,
        totalScore,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };
    await skillboardRef.set(skillboardData, { merge: true });
    // ── Recalculate ranks for this month ──────────────────
    await recalculateRanks(month);
    return null;
});
// ─── Rank recalculation ────────────────────────────────────
async function recalculateRanks(month) {
    console.log(`📊 Recalculating ranks for ${month}`);
    const snap = await db
        .collection("skillboard")
        .where("month", "==", month)
        .orderBy("totalScore", "desc")
        .limit(100)
        .get();
    if (snap.empty)
        return;
    const batch = db.batch();
    snap.docs.forEach((doc, index) => {
        batch.update(doc.ref, { rank: index + 1 });
    });
    await batch.commit();
    console.log(`✅ Rank update completed for ${month}`);
}
//# sourceMappingURL=index.js.map