import { NextRequest, NextResponse } from "next/server";
import { client } from "@/sanity/lib/client";
import { AUTHOR_BY_EMAIL_QUERY } from "@/sanity/lib/queries";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    // Check if user exists
    const user = await client.fetch(AUTHOR_BY_EMAIL_QUERY, {
      email: email.toLowerCase(),
    });

    if (!user || user.authProvider !== "credentials") {
      // Don't reveal if user exists or not for security
      return NextResponse.json(
        { error: "No account found with that email address." },
        { status: 404 }
      );
    }

    if (!user.securityQuestion) {
      return NextResponse.json(
        { error: "No security question set for this account. Please contact support." },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { 
        message: "Security question found. Please answer to continue.",
        securityQuestion: user.securityQuestion
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
