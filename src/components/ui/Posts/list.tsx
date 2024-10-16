"use client";

import { Posts } from "#site/content";
import PostCard from "@/components/ui/Posts/index";
import { useState } from 'react';
import { getPosts } from "@/app/actions/getPosts";

type PostListProps = {
    initialPosts: Posts[];
    lastPage: boolean;
    tag?: string;
}

const NUMBER_OF_USERS_TO_FETCH = 2;

export default function PostList({ initialPosts, lastPage, tag }: PostListProps) {
    const [offset, setOffset] = useState(NUMBER_OF_USERS_TO_FETCH);
    const [posts, setPosts] = useState<Posts[]>(initialPosts);
    const [isLastPage, setIsLastPage] = useState(lastPage);

    const loadMorePosts = async () => {
        const result = await getPosts(offset, NUMBER_OF_USERS_TO_FETCH, tag);
        setPosts(posts => [...posts, ...result.posts]);
        setOffset(offset => offset + NUMBER_OF_USERS_TO_FETCH);
        setIsLastPage(result.lastPage);
    }

    return (
        <div className={"space-y-6 md:space-y-8 mb-8 md:mb-12"}>
            {posts.map((post, index) => (
                <PostCard key={index} post={post} index={index}/>
            ))}
            {!isLastPage && (
                <div className={"text-center mt-8"}>
                    <button
                        onClick={loadMorePosts}
                        className={"bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"}
                    >
                        Load More
                    </button>
                </div>
            )}
        </div>
    );
}
