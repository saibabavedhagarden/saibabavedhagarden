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
        { error: "Unauthorized access" },
        { status: 401 }
      );
    }

    const { id, status, refund_amount } = await request.json();

    if (!id || !status) {
      return NextResponse.json(
        { error: "Missing required fields" },
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
    }

    const { error } = await supabase
      .from("donations")
      .update(updatePayload)
      .eq("id", id);

    if (error) {
      console.error("Update donation status error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update donation status" },
      { status: 500 }
    );
  }
}
