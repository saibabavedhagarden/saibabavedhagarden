import crypto from "crypto";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get("x-razorpay-signature");

    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

    if (webhookSecret && signature) {
      const expectedSignature = crypto
        .createHmac("sha256", webhookSecret)
        .update(rawBody)
        .digest("hex");

      if (expectedSignature !== signature) {
        return NextResponse.json(
          { error: "Invalid webhook signature" },
          { status: 400 }
        );
      }
    }

    const payload = JSON.parse(rawBody);
    const event = payload.event;

    const supabaseUrl =
      process.env.NEXT_PUBLIC_SUPABASE_URL ||
      "https://otbqkqalstdmpllspxin.supabase.co";
    const supabaseKey =
      process.env.SUPABASE_SERVICE_ROLE_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
      "";

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({ status: "ok" });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    if (event === "refund.processed" || event === "refund.created") {
      const refundEntity = payload.payload?.refund?.entity;
      const paymentId = refundEntity?.payment_id;
      const refundAmount = refundEntity?.amount ? refundEntity.amount / 100 : 0;

      if (paymentId) {
        const { error } = await supabase
          .from("donations")
          .update({
            status: "refunded",
            refund_amount: refundAmount,
            refunded_at: new Date().toISOString(),
          })
          .eq("payment_id", paymentId);

        if (error) {
          console.error("Webhook update refund error:", error);
        } else {
          console.log(`Razorpay Webhook: Refund recorded for payment ${paymentId}`);
        }
      }
    }

    return NextResponse.json({ status: "ok" });
  } catch (error) {
    console.error("Razorpay webhook route error:", error);
    return NextResponse.json(
      { error: "Webhook processing error" },
      { status: 500 }
    );
  }
}
