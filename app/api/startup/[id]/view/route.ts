import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { writeClient } from "@/sanity/lib/write-client";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    // Fetch current startup data
    const startup = await writeClient
      .withConfig({ useCdn: false })
      .fetch(`*[_type == "startup" && _id == $id][0]{
        _id,
        uniqueViews,
        uniqueViewsCount,
        views
      }`, { id });

    if (!startup) {
      return NextResponse.json({ error: "Startup not found" }, { status: 404 });
    }

    // Always increment total views (for both authenticated and unauthenticated users)
    const newTotalViews = (startup.views || 0) + 1;

    // Update total views
    await writeClient
      .patch(id)
      .set({
        views: newTotalViews
      })
      .commit();

    // If user is authenticated, also track unique views
    if (session?.id) {
      // Check if user has already viewed this startup
      const hasViewed = startup.uniqueViews?.some(
        (view: any) => view.user._ref === session.id
      );

      if (!hasViewed) {
        // Add new unique view
        const newView = {
          user: {
            _type: "reference",
            _ref: session.id
          },
          viewedAt: new Date().toISOString()
        };

        const updatedUniqueViews = [...(startup.uniqueViews || []), newView];
        const newUniqueViewsCount = updatedUniqueViews.length;

        // Update the startup with new unique view
        await writeClient
          .patch(id)
          .set({
            uniqueViews: updatedUniqueViews,
            uniqueViewsCount: newUniqueViewsCount
          })
          .commit();

        return NextResponse.json({
          uniqueViewsCount: newUniqueViewsCount,
          totalViews: newTotalViews,
          isNewUniqueView: true
        });
      } else {
        // User has already viewed, return current counts
        return NextResponse.json({
          uniqueViewsCount: startup.uniqueViewsCount || 0,
          totalViews: newTotalViews,
          isNewUniqueView: false
        });
      }
    } else {
      // Unauthenticated user - only track total views
      return NextResponse.json({
        uniqueViewsCount: startup.uniqueViewsCount || 0,
        totalViews: newTotalViews,
        isNewUniqueView: false
      });
    }

  } catch (error) {
    console.error("Error tracking view:", error);
    return NextResponse.json(
      { error: "Failed to track view" },
      { status: 500 }
    );
  }
}
