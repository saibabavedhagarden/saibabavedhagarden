import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    const allowedEmailsStr =
      process.env.ALLOWED_ADMIN_EMAILS ||
      "saibabavedhagarden@gmail.com,vigneshmuthu789@gmail.com";
    const allowedEmails = allowedEmailsStr
      .split(",")
      .map((e) => e.trim().toLowerCase());

    if (!email || !allowedEmails.includes(email.toLowerCase())) {
      return NextResponse.json(
        {
          error: `Access Denied: The Google account (${email || "Unknown"}) is not authorized as a Trust Admin.`,
        },
        { status: 403 }
      );
    }

    const response = NextResponse.json({ success: true, email });
    // Set secure HTTP-only session cookie valid for 7 days
    response.cookies.set({
      name: "admin_token",
      value: "authenticated_saibaba_admin",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { error: "Google authentication failed." },
      { status: 500 }
    );
  }
}
