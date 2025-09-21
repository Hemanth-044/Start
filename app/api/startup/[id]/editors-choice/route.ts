import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { writeClient } from "@/sanity/lib/write-client";
import { client } from "@/sanity/lib/client";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    // Check if user is authenticated
    if (!session?.id) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    // For now, allow any authenticated user to toggle editor's choice
    // In production, you might want to add admin role checking
    // if (!session.isAdmin) {
    //   return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    // }

    // Fetch current startup data
    const startup = await client
      .withConfig({ useCdn: false })
      .fetch(`*[_type == "startup" && _id == $id][0]{
        _id,
        editorsChoice
      }`, { id });

    if (!startup) {
      return NextResponse.json({ error: "Startup not found" }, { status: 404 });
    }

    // Toggle editor's choice status
    const newEditorsChoice = !startup.editorsChoice;

    // Update the startup
    await writeClient
      .patch(id)
      .set({
        editorsChoice: newEditorsChoice
      })
      .commit();

    return NextResponse.json({
      message: `Startup ${newEditorsChoice ? 'marked as' : 'removed from'} editor's choice`,
      editorsChoice: newEditorsChoice
    });

  } catch (error) {
    console.error("Error toggling editor's choice:", error);
    return NextResponse.json(
      { error: "Failed to update editor's choice status" },
      { status: 500 }
    );
  }
}
