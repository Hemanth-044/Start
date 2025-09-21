import { NextRequest, NextResponse } from "next/server";
import { client } from "@/sanity/lib/client";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    const name = searchParams.get('name');

    if (!email && !name) {
      return NextResponse.json({ error: "Email or name required" }, { status: 400 });
    }

    let query;
    let params;

    if (email) {
      query = `*[_type == "author" && email == $email][0]{
        _id,
        name,
        email,
        username,
        image
      }`;
      params = { email };
    } else {
      query = `*[_type == "author" && name == $name][0]{
        _id,
        name,
        email,
        username,
        image
      }`;
      params = { name };
    }

    const user = await client.fetch(query, params);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user });

  } catch (error) {
    console.error("Error finding user:", error);
    return NextResponse.json(
      { error: "Failed to find user" },
      { status: 500 }
    );
  }
}
