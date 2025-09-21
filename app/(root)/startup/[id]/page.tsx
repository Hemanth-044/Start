import Link from "next/link";
import Image from "next/image";
import { Suspense } from "react";
import markdownit from "markdown-it";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";

import { formatDate } from "@/lib/utils";

import {
  STARTUP_BY_ID_QUERY,
  STARTUP_WITH_LIKES_QUERY,
  PLAYLIST_BY_SLUG_QUERY,
} from "@/sanity/lib/queries";
import { client } from "@/sanity/lib/client";

import UniqueView from "@/components/UniqueView";
import { Skeleton } from "@/components/ui/skeleton";
import StartupCard, { StartupCardType } from "@/components/StartupCard";
import StartupImage from "@/components/StartupImage";
import DeleteStartupButton from "@/components/DeleteStartupButton";
import CommentsSection from "@/components/CommentsSection";
import EditorsChoiceToggle from "@/components/EditorsChoiceToggle";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";

const md = markdownit();

async function Page({ params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id;
  const session = await getServerSession(authOptions);

  const [post, playlistResult] = await Promise.all([
    client.fetch(STARTUP_WITH_LIKES_QUERY, {
      id: id,
    }),
    client.fetch(PLAYLIST_BY_SLUG_QUERY, {
      slug: "editor-picks",
    }),
  ]);

  const editorPosts = playlistResult?.select || [];

  if (!post) return notFound();
  const parsedContent = md.render(post?.pitch || "");
  
  // Check if current user is the author
  const isAuthor = session?.id === post.author._id;
  

  return (
    <>
      <section className="pink_container !min-h-[230px]">
        <p className="tag">{formatDate(post._createdAt)}</p>

        <h1 className="heading">{post.title}</h1>
        <p className="sub-heading !max-w-5xl">{post.description}</p>
      </section>

      <section className="section_container">
        <StartupImage
          src={post.image}
          alt="startup image"
          width={800}
          height={400}
          className="w-full h-auto rounded-xl"
          fallbackText="No Image Available"
        />

        <div className="space-y-5 mt-10 max-w-4xl mx-auto">
          <div className="flex-between gap-5">
            <Link
              href={`/user/${post.author?._id}`}
              className="flex gap-2 items-center mb-3"
            >
              <Image
                src={post.author.image || "/nature.jpg"}
                alt="author avatar"
                width={64}
                height={64}
                className="rounded-full drop-shadow-lg"
              />

              <div>
                <p className="text-20-medium">{post.author.name}</p>
                <p className="text-16-medium !text-black-300">
                  @{post.author.username}
                </p>
              </div>
            </Link>

            <p className="category-tag">{post.category}</p>
          </div>

          {isAuthor && (
            <div className="flex justify-end gap-3 mt-4">
              <EditorsChoiceToggle
                startupId={post._id}
                initialEditorsChoice={post.editorsChoice || false}
              />
              
              <Button
                asChild
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <Link href={`/startup/${post._id}/edit`}>
                  <Edit className="h-4 w-4" />
                  Edit Startup
                </Link>
              </Button>
              
              <DeleteStartupButton 
                startupId={post._id} 
                startupTitle={post.title} 
              />
            </div>
          )}

          <h3 className="text-30-bold">Pitch Details</h3>
          {parsedContent ? (
            <article
              className="prose max-w-4xl font-work-sans break-all"
              dangerouslySetInnerHTML={{ __html: parsedContent }}
            />
          ) : (
            <p className="no-result">No details provided</p>
          )}

        </div>

        <hr className="divider" />

        {editorPosts?.length > 0 && (
          <div className="max-w-4xl mx-auto">
            <p className="text-30-semibold">Editor Picks</p>

            <ul className="mt-7 card_grid-sm">
              {editorPosts.map((post: StartupCardType, index: number) => (
                <StartupCard key={index} post={post} session={session} />
              ))}
            </ul>
          </div>
        )}
      </section>

      {/* Comments Section */}
      <section className="section_container">
        <div className="max-w-4xl mx-auto">
          <CommentsSection startupId={id} session={session} />
        </div>
      </section>

      <Suspense fallback={<Skeleton className="view_skeleton" />}>
        <UniqueView 
          startupId={id} 
          initialUniqueViewsCount={post.uniqueViewsCount || 0}
          initialTotalViews={post.views || 0}
        />
      </Suspense>
    </>
  );
}

export default Page;
