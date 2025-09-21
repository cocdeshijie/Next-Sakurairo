"use server";

import { posts } from '#site/content';

export async function getPosts(
    offset: number,
    limit: number,
    tagsQuery?: string
) {
    let filteredPosts = posts; // Remove the type annotation

    // Filter posts based on a single tag if provided
    if (tagsQuery) {
        filteredPosts = posts.filter((post) => post.tags.includes(decodeURIComponent(tagsQuery)));
    }

    // Sort the filtered posts by date in descending order
    filteredPosts.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    // Calculate start and end indices for pagination
    const startIndex = offset;
    const endIndex = offset + limit;

    // Get the posts for the current offset and limit
    const paginatedPosts = filteredPosts.slice(startIndex, endIndex);

    // Determine if this is the last page
    const lastPage = endIndex >= filteredPosts.length;

    return {
        posts: paginatedPosts,
        lastPage: lastPage,
    };
}