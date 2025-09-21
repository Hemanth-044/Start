import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { writeClient } from "@/sanity/lib/write-client";
import { client } from "@/sanity/lib/client";
import { AUTHOR_BY_EMAIL_QUERY } from "@/sanity/lib/queries";

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, securityQuestion, securityAnswer } = await request.json();

    // Validation
    if (!name || !email || !password || !securityQuestion || !securityAnswer) {
      return NextResponse.json(
        { error: "Name, email, password, security question, and security answer are required" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters long" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await client.fetch(AUTHOR_BY_EMAIL_QUERY, {
      email: email.toLowerCase(),
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      );
    }

    // Hash password and security answer
    const hashedPassword = await bcrypt.hash(password, 12);
    const hashedSecurityAnswer = await bcrypt.hash(securityAnswer.toLowerCase().trim(), 12);

    // Create user in Sanity
    const user = await writeClient.create({
      _type: "author",
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      authProvider: "credentials",
      username: email.split("@")[0], // Use email prefix as username
      securityQuestion,
      securityAnswer: hashedSecurityAnswer,
    });

    return NextResponse.json(
      { message: "User created successfully", userId: user._id },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
