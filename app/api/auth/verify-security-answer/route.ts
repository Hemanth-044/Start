import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { client } from "@/sanity/lib/client";
import { AUTHOR_BY_EMAIL_QUERY } from "@/sanity/lib/queries";

export async function POST(request: NextRequest) {
  try {
    const { email, securityAnswer } = await request.json();

    if (!email || !securityAnswer) {
      return NextResponse.json(
        { error: "Email and security answer are required" },
        { status: 400 }
      );
    }

    // Check if user exists
    const user = await client.fetch(AUTHOR_BY_EMAIL_QUERY, {
      email: email.toLowerCase(),
    });

    if (!user || user.authProvider !== "credentials") {
      return NextResponse.json(
        { error: "No account found with that email address." },
        { status: 404 }
      );
    }

    if (!user.securityAnswer) {
      return NextResponse.json(
        { error: "No security answer set for this account." },
        { status: 400 }
      );
    }

    // Verify security answer
    const isAnswerCorrect = await bcrypt.compare(
      securityAnswer.toLowerCase().trim(),
      user.securityAnswer
    );

    if (!isAnswerCorrect) {
      return NextResponse.json(
        { error: "Incorrect security answer. Please try again." },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "Security answer verified successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Verify security answer error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
