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

    const { id, payment_id, status, refund_amount, seva_category, remarks } = await request.json();

    if (!id && !payment_id) {
      return NextResponse.json(
        { error: "Missing donation identifier (id or payment_id)." },
        { status: 400 }
      );
    }

    if (!status && !seva_category && remarks === undefined) {
      return NextResponse.json(
        { error: "Missing update fields (status, seva_category, or remarks)." },
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

    const updatePayload: Record<string, unknown> = {};

    if (status) {
      updatePayload.status = status;
      if (status === "refunded") {
        updatePayload.refund_amount = Number(refund_amount) || 0;
        updatePayload.refunded_at = new Date().toISOString();
      } else if (status === "success") {
        updatePayload.refund_amount = 0;
        updatePayload.refunded_at = null;
      }
    }

    if (seva_category) {
      updatePayload.seva_category = seva_category;
    }

    if (remarks !== undefined) {
      updatePayload.remarks = remarks;
    }

    // Build query prioritizing specific database row id over payment_id
    let query = supabase.from("donations").update(updatePayload);
    if (id) {
      query = query.eq("id", id);
    } else if (payment_id) {
      query = query.eq("payment_id", payment_id);
    }

    let { error, data } = await query.select();

    // Fallback 1: If 'remarks' column does not exist yet in DB schema, retry without 'remarks'
    let remarksSavedToDb = true;
    if (error && error.message && error.message.includes("remarks")) {
      console.warn("Remarks column does not exist in DB yet, updating remaining fields:", error.message);
      remarksSavedToDb = false;
      const fallbackPayload = { ...updatePayload };
      delete fallbackPayload.remarks;

      if (Object.keys(fallbackPayload).length > 0) {
        let fallbackQuery = supabase.from("donations").update(fallbackPayload);
        if (id) {
          fallbackQuery = fallbackQuery.eq("id", id);
        } else if (payment_id) {
          fallbackQuery = fallbackQuery.eq("payment_id", payment_id);
        }
        const fallbackResult = await fallbackQuery.select();
        error = fallbackResult.error;
        data = fallbackResult.data;
      } else {
        // Only remarks was passed and column doesn't exist
        error = null;
        data = [];
      }
    }

    // Fallback 2: If refund_amount or other extra columns don't exist in DB schema yet
    if (error && (error.message.includes("refund_amount") || error.message.includes("refunded_at"))) {
      console.warn("Extra refund columns failed, retrying minimal update:", error.message);
      const minimalPayload: Record<string, unknown> = {};
      if (status) minimalPayload.status = status;
      if (seva_category) minimalPayload.seva_category = seva_category;

      let minimalQuery = supabase.from("donations").update(minimalPayload);
      if (id) {
        minimalQuery = minimalQuery.eq("id", id);
      } else if (payment_id) {
        minimalQuery = minimalQuery.eq("payment_id", payment_id);
      }
      const minimalResult = await minimalQuery.select();
      error = minimalResult.error;
      data = minimalResult.data;
    }

    if (error) {
      console.error("Update donation final error:", error);
      return NextResponse.json({ error: `Supabase Error: ${error.message}` }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      updated: data,
      remarksSavedToDb,
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Failed to update donation status";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

