import Razorpay from "razorpay";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const amount = Number(body.amount);
    const sevaCategory = body.sevaCategory || "General Donation";
    const name = body.name || "";
    const email = body.email || "";
    const phone = body.phone || "";

    if (!Number.isFinite(amount) || amount < 100) {
      return NextResponse.json(
        { error: "Minimum donation amount is ₹1 (100 paise)" },
        { status: 400 }
      );
    }

    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      return NextResponse.json(
        { error: "Payment configuration is missing" },
        { status: 500 }
      );
    }

    const razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });

    const order = await razorpay.orders.create({
      amount: Math.round(amount),
      currency: "INR",
      receipt: `donation_${Date.now()}`,
      notes: {
        "Donor Name": name,
        "Donor Email": email,
        "Donor Phone": phone,
        "Seva Category": sevaCategory,
        "Payment Purpose": "Donation",
      },
    });

    return NextResponse.json({
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
      key_id: keyId,
    });
  } catch (error) {
    const statusCode =
      error &&
      typeof error === "object" &&
      "statusCode" in error &&
      error.statusCode === 401
        ? 401
        : 500;

    const message =
      error instanceof Error ? error.message : "Failed to create payment order";

    return NextResponse.json({ error: message }, { status: statusCode });
  }
}
