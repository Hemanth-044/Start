import { NextRequest, NextResponse } from "next/server";
import { client } from "@/sanity/lib/client";
import { COMMENTS_BY_STARTUP_QUERY, REPLIES_BY_COMMENT_QUERY } from "@/sanity/lib/queries";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    console.log("Fetching comments for startup ID:", id);

    const comments = await client.fetch(COMMENTS_BY_STARTUP_QUERY, {
      startupId: id,
    });

    console.log("Fetched comments:", comments);

    // Fetch replies for each comment
    const commentsWithReplies = await Promise.all(
      comments.map(async (comment: any) => {
        const replies = await client.fetch(REPLIES_BY_COMMENT_QUERY, {
          commentId: comment._id,
        });
        return {
          ...comment,
          replies,
        };
      })
    );

    console.log("Comments with replies:", commentsWithReplies);

    return NextResponse.json(
      { comments: commentsWithReplies },
      { status: 200 }
    );
  } catch (error) {
    console.error("Fetch comments error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
