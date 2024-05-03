import { posts } from "#site/content";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;

    // Get the page number (default to 0)
    const pageQuery = parseInt(searchParams.get("page") || "0", 10);

    // Get the number of posts per page (default to 10)
    const postsPerPage = parseInt(searchParams.get("postsPerPage") || "10", 2);

    // Get the tags to filter by
    const tagsQuery = searchParams.getAll("tag");

    // Filter posts based on tags if provided
    let filteredPosts = posts;
    if (tagsQuery.length > 0) {
        filteredPosts = posts.filter(post =>
            tagsQuery.every(tag => post.tags.includes(tag))
        );
    }

    // Sort the filtered posts by date in descending order (newest first)
    filteredPosts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    // Calculate start and end indices for pagination
    const startIndex = pageQuery * postsPerPage;
    const endIndex = startIndex + postsPerPage;

    // Get the posts for the current page and map them to include only necessary fields
    const paginatedPosts = filteredPosts.slice(startIndex, endIndex).map(post => ({
        title: post.title,
        slug: post.slug,
        date: post.date,
        cover: post.cover,
        tags: post.tags,
        metadata: post.metadata,
        excerpt: post.excerpt,
        permalink: post.permalink,
        edited: post.edited,
    }));

    // Determine if this is the last page
    const lastPage = endIndex >= filteredPosts.length;

    const data = {
        "posts": paginatedPosts,
        "last_page": lastPage
    };

    return Response.json(data);
}