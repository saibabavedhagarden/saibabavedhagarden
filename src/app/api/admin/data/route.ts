import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("admin_token")?.value;

    if (token !== "authenticated_saibaba_admin") {
      return NextResponse.json(
        { error: "Unauthorized access" },
        { status: 401 }
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

    // Fetch all donations
    const { data: donations, error: donationsError } = await supabase
      .from("donations")
      .select("*")
      .order("created_at", { ascending: false });

    if (donationsError) {
      console.error("Fetch donations error:", donationsError);
    }

    // Fetch all contact submissions
    const { data: contacts, error: contactsError } = await supabase
      .from("contact_submissions")
      .select("*")
      .order("created_at", { ascending: false });

    if (contactsError) {
      console.error("Fetch contact submissions error:", contactsError);
    }

    const safeDonations = donations || [];
    const safeContacts = contacts || [];

    // Calculate Loyal Donors (Donors who donated more than once or >= 2 transactions)
    const donorMap: Record<
      string,
      {
        name: string;
        email: string;
        phone: string;
        count: number;
        totalAmount: number;
        categories: Set<string>;
        lastDonated: string;
      }
    > = {};

    safeDonations.forEach((d) => {
      const key = (d.email || d.mobile_number || d.full_name || "unknown").toLowerCase();
      const amt = Number(d.amount) || 0;
      const isRefunded = d.status === "refunded";
      const actualAmt = isRefunded ? 0 : amt;

      if (!donorMap[key]) {
        donorMap[key] = {
          name: d.full_name || "Anonymous",
          email: d.email || "",
          phone: d.mobile_number || "",
          count: 1,
          totalAmount: actualAmt,
          categories: new Set(d.seva_category ? [d.seva_category] : []),
          lastDonated: d.created_at,
        };
      } else {
        donorMap[key].count += 1;
        donorMap[key].totalAmount += actualAmt;
        if (d.seva_category) {
          donorMap[key].categories.add(d.seva_category);
        }
      }
    });

    const loyalDonors = Object.values(donorMap)
      .filter((donor) => donor.count >= 2 || donor.totalAmount >= 5000)
      .map((donor) => ({
        name: donor.name,
        email: donor.email,
        phone: donor.phone,
        count: donor.count,
        totalAmount: donor.totalAmount,
        categories: Array.from(donor.categories).join(", "),
        lastDonated: donor.lastDonated,
      }))
      .sort((a, b) => b.totalAmount - a.totalAmount);

    return NextResponse.json({
      donations: safeDonations,
      contacts: safeContacts,
      loyalDonors,
    });
  } catch (error) {
    console.error("Admin data route error:", error);
    return NextResponse.json(
      { error: "Failed to fetch admin data" },
      { status: 500 }
    );
  }
}
