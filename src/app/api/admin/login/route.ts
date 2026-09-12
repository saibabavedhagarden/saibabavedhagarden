import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { password } = await request.json();
    const adminPassword = process.env.ADMIN_PASSWORD || "SaibabaTrust@2026";

    if (!password || password !== adminPassword) {
      return NextResponse.json(
        { error: "Invalid password. Please check and try again." },
        { status: 401 }
      );
    }

    const response = NextResponse.json({ success: true });
    // Set secure HTTP-only session cookie valid for 7 days
    response.cookies.set({
      name: "admin_token",
      value: "authenticated_saibaba_admin",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { error: "Login failed. Please try again." },
      { status: 500 }
    );
  }
}
