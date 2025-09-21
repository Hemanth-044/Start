import SearchForm from "@/components/SearchForm";
import StartupCard, { StartupCardType } from "@/components/StartupCard";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";

import { STARTUPS_QUERY } from "@/sanity/lib/queries";
import { sanityFetch, SanityLive } from "@/sanity/lib/live";

async function Home({
  searchParams,
}: {
  searchParams: Promise<{ query?: string }>;
}) {
  const query = (await searchParams).query;
  const session = await getServerSession(authOptions);

  // Clean up search query - trim whitespace
  const cleanQuery = query?.trim() || null;
  
  const params = { search: cleanQuery };
  const { data: posts } = await sanityFetch({ 
    query: STARTUPS_QUERY, 
    params 
  });

  // Debug logging
  console.log("Home page - Query:", cleanQuery, "Posts count:", posts?.length || 0);

  return (
    <>
      <section className="pink_container">
        <p className="tag">Pitch, Vote and Grow</p>

        <h1 className="heading">
          Pitch Your Startup, <br /> Connect With Entrepreneurs
        </h1>

        <p className="sub-heading !max-w-3xl">
          Submit Ideas, Vote on Pitches, and Get Noticed in Virtual Competitions
        </p>

        <SearchForm query={query} />
      </section>

      <section className="section_container">
        <p className="text-30-semibold">
          {query ? `Search results for "${query}"` : "All Startups"}
        </p>

        <ul className="mt-7 card_grid">
          {posts?.length > 0 ? (
            posts.map((post: StartupCardType, index: number) => (
              <StartupCard key={index} post={post} session={session} />
            ))
          ) : (
            <p className="no-result">No results found</p>
          )}
        </ul>
      </section>

      {SanityLive && <SanityLive />}
    </>
  );
}

export default Home;
