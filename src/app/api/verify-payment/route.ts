import crypto from "crypto";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { sendDonationNotificationEmail } from "@/lib/email";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      donor_name,
      donor_email,
      donor_phone,
      amount,
      seva_category,
    } = body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { error: "Missing payment verification fields" },
        { status: 400 }
      );
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keySecret) {
      return NextResponse.json(
        { error: "Payment configuration is missing" },
        { status: 500 }
      );
    }

    const generatedSignature = crypto
      .createHmac("sha256", keySecret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return NextResponse.json(
        { error: "Invalid payment signature" },
        { status: 400 }
      );
    }

    // Server-side Supabase insertion for successful payment ONLY
    const supabaseUrl =
      process.env.NEXT_PUBLIC_SUPABASE_URL ||
      "https://otbqkqalstdmpllspxin.supabase.co";
    const supabaseKey =
      process.env.SUPABASE_SERVICE_ROLE_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
      "";

    if (supabaseUrl && supabaseKey) {
      const supabase = createClient(supabaseUrl, supabaseKey);
      try {
        const { error: supaError } = await supabase.from("donations").insert([
          {
            full_name: donor_name || "Anonymous",
            email: donor_email || "",
            mobile_number: donor_phone || "",
            amount: Number(amount) || 0,
            seva_category: seva_category || "General",
            payment_id: razorpay_payment_id,
            order_id: razorpay_order_id,
            status: "success",
          },
        ]);
        if (supaError) {
          console.error("Supabase insert error on payment verification:", supaError);
        } else {
          console.log("Successfully logged payment in Supabase donations table.");
        }
      } catch (err) {
        console.error("Supabase payment log error:", err);
      }
    }

    // Send email notification to trust & donor
    try {
      await sendDonationNotificationEmail({
        donorName: donor_name || "Valued Donor",
        donorEmail: donor_email || "",
        donorPhone: donor_phone || "",
        amount: Number(amount) || 0,
        sevaCategory: seva_category || "General Donation",
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id,
      });
    } catch (emailErr) {
      console.error("Email notification trigger error:", emailErr);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Payment verification route error:", error);
    return NextResponse.json(
      { error: "Payment verification failed" },
      { status: 500 }
    );
  }
}
