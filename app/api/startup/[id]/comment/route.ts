import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { writeClient } from "@/sanity/lib/write-client";

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
    const { content, parentCommentId } = await request.json();
    
    console.log("Creating comment for startup:", id);
    console.log("Content:", content);
    console.log("Parent comment ID:", parentCommentId);

    if (!content || content.trim().length === 0) {
      return NextResponse.json(
        { error: "Comment content is required" },
        { status: 400 }
      );
    }

    if (content.length > 500) {
      return NextResponse.json(
        { error: "Comment must be less than 500 characters" },
        { status: 400 }
      );
    }

    // Create the comment
    const commentData = {
      _type: "comment",
      content: content.trim(),
      author: {
        _type: "reference",
        _ref: session.id,
      },
      startup: {
        _type: "reference",
        _ref: id,
      },
      ...(parentCommentId && {
        parentComment: {
          _type: "reference",
          _ref: parentCommentId,
        },
      }),
      isApproved: true,
    };
    
    console.log("Creating comment with data:", commentData);
    
    const comment = await writeClient.create(commentData);
    
    console.log("Created comment:", comment);

    return NextResponse.json(
      { 
        message: "Comment added successfully",
        comment 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Add comment error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
