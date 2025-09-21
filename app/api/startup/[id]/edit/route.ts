import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { writeClient } from "@/sanity/lib/write-client";
import { client } from "@/sanity/lib/client";
import { STARTUP_BY_ID_QUERY } from "@/sanity/lib/queries";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json();
    const { title, description, category, image, pitch } = body;

    // Get the startup to check ownership
    const startup = await client.fetch(STARTUP_BY_ID_QUERY, { id });

    if (!startup) {
      return NextResponse.json(
        { error: "Startup not found" },
        { status: 404 }
      );
    }

    // Check if the current user is the author of the startup
    if (startup.author._id !== session.id) {
      return NextResponse.json(
        { error: "You can only edit your own startups" },
        { status: 403 }
      );
    }

    // Update the startup
    const updatedStartup = await writeClient
      .patch(id)
      .set({
        title,
        description,
        category,
        image,
        pitch,
      })
      .commit();

    return NextResponse.json(
      { 
        message: "Startup updated successfully",
        startup: updatedStartup 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Edit startup error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
