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

    if (
      event === "refund.processed" ||
      event === "refund.created" ||
      event === "refund.speed_changed" ||
      event === "payment.refunded" ||
      event?.includes("refund")
    ) {
      const orderId = refundEntity?.order_id || paymentEntity?.order_id;
      const paymentId = refundEntity?.payment_id || paymentEntity?.id;
      const refundAmount = refundEntity?.amount
        ? refundEntity.amount / 100
        : paymentEntity?.amount_refunded
        ? paymentEntity.amount_refunded / 100
        : paymentEntity?.amount
        ? paymentEntity.amount / 100
        : 0;

      if (paymentId || orderId) {
        let query = supabase
          .from("donations")
          .update({
            status: "refunded",
            refund_amount: refundAmount,
            refunded_at: new Date().toISOString(),
          });

        if (paymentId && orderId) {
          query = query.or(`payment_id.eq.${paymentId},order_id.eq.${orderId}`);
        } else if (paymentId) {
          query = query.eq("payment_id", paymentId);
        } else if (orderId) {
          query = query.eq("order_id", orderId);
        }

        const { error, count } = await query;

        if (error) {
          console.error("Webhook update refund error:", error);
        } else {
          console.log(
            `Razorpay Webhook: Refund recorded for payment ${paymentId || orderId} (Amount: ₹${refundAmount}, Updated rows: ${count})`
          );
        }
      }
    } else if (event === "payment.captured" || event === "order.paid") {
      const paymentEntity = payload.payload?.payment?.entity;
      const paymentId = paymentEntity?.id;
      const orderId = paymentEntity?.order_id;
      const amount = paymentEntity?.amount ? paymentEntity.amount / 100 : 0;
      const notes = paymentEntity?.notes || {};

      const donorName =
        notes["Donor Name"] ||
        notes.donor_name ||
        notes.full_name ||
        "Valued Donor";

      const donorEmail =
        notes["Donor Email"] ||
        notes.donor_email ||
        notes.email ||
        paymentEntity?.email ||
        "";

      const donorPhone =
        notes["Donor Phone"] ||
        notes.donor_phone ||
        notes.phone ||
        paymentEntity?.contact ||
        "";

      const sevaCat =
        notes["Seva Category"] ||
        notes.seva_category ||
        "General Donation";

      if (paymentId) {
        // Check if donation already exists by payment_id or order_id
        let checkQuery = supabase.from("donations").select("id, full_name").limit(1);
        if (paymentId && orderId) {
          checkQuery = checkQuery.or(`payment_id.eq.${paymentId},order_id.eq.${orderId}`);
        } else {
          checkQuery = checkQuery.eq("payment_id", paymentId);
        }

        const { data: existing } = await checkQuery;

        if (!existing || existing.length === 0) {
          const { error: insErr } = await supabase.from("donations").insert([
            {
              full_name: donorName,
              email: donorEmail,
              mobile_number: donorPhone,
              amount,
              seva_category: sevaCat,
              payment_id: paymentId,
              order_id: orderId || "",
              status: "success",
            },
          ]);

          if (insErr) {
            if (!insErr.message?.includes("unique")) {
              console.error("Webhook payment capture insert error:", insErr);
            }
          } else {
            console.log(`Razorpay Webhook: Payment captured & logged for payment ${paymentId}`);
          }
        } else {
          // If existing record was logged with generic "Valued Donor", update it with notes data!
          if (existing[0]?.full_name === "Valued Donor" && donorName !== "Valued Donor") {
            await supabase
              .from("donations")
              .update({
                full_name: donorName,
                email: donorEmail,
                mobile_number: donorPhone,
                seva_category: sevaCat,
              })
              .eq("id", existing[0].id);
          }
          console.log(`Razorpay Webhook: Payment ${paymentId} already logged, skipping duplicate.`);
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
