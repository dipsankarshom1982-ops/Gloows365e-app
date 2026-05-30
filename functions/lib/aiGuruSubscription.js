"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.aiGuruCreateSubscription = void 0;
const admin = require("firebase-admin");
const functionsV1 = require("firebase-functions/v1");
const crypto = require("crypto");
const axios_1 = require("axios");
const db = admin.firestore();
function isVerifyPayload(data) {
    return "razorpayPaymentId" in data && typeof data.razorpayPaymentId === "string";
}
exports.aiGuruCreateSubscription = functionsV1
    .runWith({
    timeoutSeconds: 60,
    memory: "128MB",
    secrets: ["RAZORPAY_KEY_ID", "RAZORPAY_KEY_SECRET"],
})
    .https.onCall(async (data, context) => {
    if (!context.auth) {
        throw new functionsV1.https.HttpsError("unauthenticated", "Login required");
    }
    const uid = context.auth.uid;
    const keyId = process.env["RAZORPAY_KEY_ID"] ?? "";
    const keySecret = process.env["RAZORPAY_KEY_SECRET"] ?? "";
    // ── Phase 2: Verify payment and write subscription ────────────────────────
    if (isVerifyPayload(data)) {
        const { planId, cycle, razorpayPaymentId, razorpayOrderId, razorpaySignature } = data;
        const expectedSig = crypto
            .createHmac("sha256", keySecret)
            .update(`${razorpayOrderId}|${razorpayPaymentId}`)
            .digest("hex");
        if (expectedSig !== razorpaySignature) {
            throw new functionsV1.https.HttpsError("permission-denied", "Payment verification failed");
        }
        const durationMs = cycle === "annual"
            ? 365 * 24 * 3600 * 1000
            : 30 * 24 * 3600 * 1000;
        await db.doc(`subscriptions/${uid}`).set({
            planId,
            cycle,
            status: "active",
            endDate: admin.firestore.Timestamp.fromMillis(Date.now() + durationMs),
            razorpayPaymentId,
            razorpayOrderId,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
        console.log(`✅ AI Guru subscription created: uid=${uid} plan=${planId} cycle=${cycle}`);
        return { success: true, planId, cycle };
    }
    // ── Phase 1: Create Razorpay order ────────────────────────────────────────
    const { amountPaise } = data;
    if (!keyId || !keySecret) {
        throw new functionsV1.https.HttpsError("failed-precondition", "Razorpay not configured");
    }
    try {
        const response = await axios_1.default.post("https://api.razorpay.com/v1/orders", {
            amount: amountPaise,
            currency: "INR",
            receipt: `aiguru_${uid}_${Date.now()}`,
        }, {
            auth: { username: keyId, password: keySecret },
            timeout: 10000,
        });
        const razorpayOrderId = response.data.id;
        console.log(`✅ AI Guru Razorpay order created: ${razorpayOrderId} for uid=${uid}`);
        return { razorpayOrderId };
    }
    catch (err) {
        console.error("Razorpay order creation failed:", err?.response?.data ?? err?.message);
        throw new functionsV1.https.HttpsError("internal", "Failed to create payment order");
    }
});
//# sourceMappingURL=aiGuruSubscription.js.map