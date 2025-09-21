import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { writeClient } from "@/sanity/lib/write-client";
import { client } from "@/sanity/lib/client";
import { STARTUP_WITH_LIKES_QUERY } from "@/sanity/lib/queries";

export async function POST(
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
    
    console.log("Like/unlike request for startup:", id);
    console.log("User ID:", session.id);

    // Get the startup with current likes
    const startup = await client.fetch(STARTUP_WITH_LIKES_QUERY, { id });
    
    console.log("Current startup likes:", startup?.likes);
    console.log("Current likes count:", startup?.likesCount);

    if (!startup) {
      return NextResponse.json(
        { error: "Startup not found" },
        { status: 404 }
      );
    }

    const currentLikes = startup.likes || [];
    const userLikeIndex = currentLikes.findIndex(
      (like: any) => like.user._ref === session.id
    );

    console.log("User like index:", userLikeIndex);
    console.log("Current likes array:", currentLikes);

    let updatedLikes;
    let newLikesCount;
    let isLiked;

    if (userLikeIndex >= 0) {
      // User already liked, so unlike
      updatedLikes = currentLikes.filter(
        (like: any) => like.user._ref !== session.id
      );
      newLikesCount = Math.max(0, (startup.likesCount || 0) - 1);
      isLiked = false;
      console.log("Removing like - new count:", newLikesCount);
    } else {
      // User hasn't liked, so add like
      updatedLikes = [
        ...currentLikes,
        {
          user: {
            _type: "reference",
            _ref: session.id,
          },
          likedAt: new Date().toISOString(),
        },
      ];
      newLikesCount = (startup.likesCount || 0) + 1;
      isLiked = true;
      console.log("Adding like - new count:", newLikesCount);
    }

    // Update the startup with new likes
    await writeClient
      .patch(id)
      .set({
        likes: updatedLikes,
        likesCount: newLikesCount,
      })
      .commit();

    console.log("Updated likes:", updatedLikes);
    console.log("Final likes count:", newLikesCount);
    console.log("User liked:", isLiked);

    return NextResponse.json(
      { 
        message: "Like updated successfully",
        isLiked: isLiked,
        likesCount: newLikesCount,
        likes: updatedLikes
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Like/unlike error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
