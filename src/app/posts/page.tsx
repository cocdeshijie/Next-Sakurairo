"use client";

import React from "react";
import useSWR from "swr";
import { atom, useAtom } from "jotai";
import PostCard from "@/components/Layout/Home/PostCard";

const fetcher = (url: string | URL | Request) => fetch(url).then(res => res.json());

// Define the Post type based on the API response
type Post = {
    title: string;
    slug: string;
    date: string;
    cover: string;
    tags: string[];
    metadata: string;
    excerpt: string;
    permalink: string;
    edited: boolean;
};

// Create atoms for page and posts
const pageAtom = atom(0);
const postsAtom = atom<Post[]>([]);

export default function PostsPage() {
    const [page, setPage] = useAtom(pageAtom);
    const [posts, setPosts] = useAtom(postsAtom);

    // TODO: keep loaded state when backing from another page
    const { data, error, isLoading } = useSWR(`/api/posts?page=${page}`, fetcher, {
        revalidateOnFocus: false,
        onSuccess: (data) => {
            if (Array.isArray(data.posts) && data.posts.length) {
                setPosts(prevPosts => [...prevPosts, ...data.posts]);
            }
        },
    });

    if (error) return <div>Error: {error.message}</div>;
    if (isLoading && page === 0) {
        return (
            <div className="bg-theme-50 dark:bg-theme-950 py-8 min-h-screen">
                {/* TODO: loading skeleton */}
            </div>
        );
    }

    return (
        <div className="bg-theme-50 dark:bg-theme-950 py-8 min-h-screen">
            {/* Top section */}
            <div className="h-[30vh] flex items-center justify-center">
                <h1 className="text-4xl font-bold text-center">All Posts</h1>
            </div>

            {/* Posts section */}
            <div className="container mx-auto px-4 md:px-0 md:w-[40em]">
                <div className="w-full">
                    <div className="space-y-4 md:space-y-6 mb-8 md:mb-12">
                        {posts.map((post, index) => (
                            <PostCard key={index} post={post} index={index} />
                        ))}
                    </div>
                </div>

                {/* Load More Button */}
                {!isLoading && data && !data.last_page && (
                    <div className="text-center mt-8">
                        <button
                            onClick={() => setPage(prevPage => prevPage + 1)}
                            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
                        >
                            Load More
                        </button>
                    </div>
                )}

                {/* Loading indicator */}
                {isLoading && page > 0 && <div className="text-center mt-8">Loading...</div>}
            </div>
        </div>
    );
}