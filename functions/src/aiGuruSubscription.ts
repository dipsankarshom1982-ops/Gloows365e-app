import * as admin from "firebase-admin";
import * as functionsV1 from "firebase-functions/v1";
import * as crypto from "crypto";
import axios from "axios";

const db = admin.firestore();

// ── Phase 1: Create Razorpay order ────────────────────────────────────────────

interface CreateOrderPayload {
  planId: string;
  cycle: "monthly" | "annual";
  amountPaise: number;
}

// ── Phase 2: Verify payment + write subscription ──────────────────────────────

interface VerifyPaymentPayload {
  planId: string;
  cycle: "monthly" | "annual";
  razorpayPaymentId: string;
  razorpayOrderId: string;
  razorpaySignature: string;
}

type RequestPayload = CreateOrderPayload | VerifyPaymentPayload;

function isVerifyPayload(data: RequestPayload): data is VerifyPaymentPayload {
  return "razorpayPaymentId" in data && typeof data.razorpayPaymentId === "string";
}

export const aiGuruCreateSubscription = functionsV1
  .runWith({
    timeoutSeconds: 60,
    memory: "128MB",
    secrets: ["RAZORPAY_KEY_ID", "RAZORPAY_KEY_SECRET"],
  })
  .https.onCall(async (data: RequestPayload, context) => {
    if (!context.auth) {
      throw new functionsV1.https.HttpsError("unauthenticated", "Login required");
    }

    const uid = context.auth.uid;
    const keyId     = process.env["RAZORPAY_KEY_ID"]     ?? "";
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
        : 30  * 24 * 3600 * 1000;

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
      const response = await axios.post(
        "https://api.razorpay.com/v1/orders",
        {
          amount:   amountPaise,
          currency: "INR",
          receipt:  `aiguru_${uid}_${Date.now()}`,
        },
        {
          auth: { username: keyId, password: keySecret },
          timeout: 10_000,
        }
      );

      const razorpayOrderId: string = response.data.id;
      console.log(`✅ AI Guru Razorpay order created: ${razorpayOrderId} for uid=${uid}`);
      return { razorpayOrderId };
    } catch (err: any) {
      console.error("Razorpay order creation failed:", err?.response?.data ?? err?.message);
      throw new functionsV1.https.HttpsError("internal", "Failed to create payment order");
    }
  });
