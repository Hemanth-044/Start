import "server-only";

import { client } from "@/sanity/lib/client";

// For now, we'll use the regular client for fetching
// Live queries can be implemented later if needed
export const sanityFetch = async ({ query, params }: { query: any; params?: any }) => {
  try {
    // Handle both string queries and defineQuery objects
    const queryString = typeof query === 'string' ? query : query.query;
    
    // Add some debugging
    console.log("Sanity fetch - Query:", queryString);
    console.log("Sanity fetch - Params:", params);
    
    const data = await client.fetch(queryString, params || {});
    
    console.log("Sanity fetch - Result count:", data?.length || 0);
    
    return { data: data || [] };
  } catch (error) {
    console.error("Sanity fetch error:", error);
    return { data: [] };
  }
};

export const SanityLive = null;
