import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("admin_token")?.value;

    if (token !== "authenticated_saibaba_admin") {
      return NextResponse.json(
        { error: "Session expired or unauthorized. Please log in to admin portal again." },
        { status: 401 }
      );
    }

    const { id, payment_id, status, refund_amount } = await request.json();

    if (!id && !payment_id) {
      return NextResponse.json(
        { error: "Missing donation identifier (id or payment_id)." },
        { status: 400 }
      );
    }

    if (!status) {
      return NextResponse.json(
        { error: "Missing status field." },
        { status: 400 }
      );
    }

    const supabaseUrl =
      process.env.NEXT_PUBLIC_SUPABASE_URL ||
      "https://otbqkqalstdmpllspxin.supabase.co";
    const supabaseKey =
      process.env.SUPABASE_SERVICE_ROLE_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
      "";

    const supabase = createClient(supabaseUrl, supabaseKey);

    const updatePayload: Record<string, unknown> = { status };
    if (status === "refunded") {
      updatePayload.refund_amount = Number(refund_amount) || 0;
      updatePayload.refunded_at = new Date().toISOString();
    } else if (status === "success") {
      updatePayload.refund_amount = 0;
      updatePayload.refunded_at = null;
    }

    // Build query with id or payment_id
    let query = supabase.from("donations").update(updatePayload);
    if (id) {
      query = query.eq("id", id);
    } else if (payment_id) {
      query = query.eq("payment_id", payment_id);
    }

    let { error, data } = await query.select();

    // Fallback: If extra columns (refund_amount/refunded_at) don't exist in DB schema yet, update status alone
    if (error) {
      console.warn("Primary update failed, retrying status update alone:", error.message);
      let fallbackQuery = supabase.from("donations").update({ status });
      if (id) {
        fallbackQuery = fallbackQuery.eq("id", id);
      } else if (payment_id) {
        fallbackQuery = fallbackQuery.eq("payment_id", payment_id);
      }
      const fallbackResult = await fallbackQuery.select();
      error = fallbackResult.error;
      data = fallbackResult.data;
    }

    if (error) {
      console.error("Update donation status final error:", error);
      return NextResponse.json({ error: `Supabase Error: ${error.message}` }, { status: 500 });
    }

    return NextResponse.json({ success: true, updated: data });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Failed to update donation status";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

