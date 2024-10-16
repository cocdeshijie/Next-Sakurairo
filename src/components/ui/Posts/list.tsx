"use client";

import { Posts } from "#site/content";
import PostCard from "@/components/ui/Posts/index";
import { atom, useAtom } from 'jotai';
import { getPosts } from "@/app/actions/getPosts";
import { useEffect } from "react";

type PostListProps = {
    initialPosts: Posts[];
    lastPage: boolean;
    tag?: string;
}

const NUMBER_OF_USERS_TO_FETCH = 2;

// Jotai atoms
const offsetAtom = atom(NUMBER_OF_USERS_TO_FETCH);
const postsAtom = atom<Posts[]>([]);
const isLastPageAtom = atom(false);

export default function PostList({ initialPosts, lastPage, tag }: PostListProps) {
    const [offset, setOffset] = useAtom(offsetAtom);
    const [posts, setPosts] = useAtom(postsAtom);
    const [isLastPage, setIsLastPage] = useAtom(isLastPageAtom);

    // Initialize state
    useEffect(() => {
        setPosts(initialPosts);
        setIsLastPage(lastPage);
    }, [initialPosts, lastPage, setPosts, setIsLastPage]);

    const loadMorePosts = async () => {
        const result = await getPosts(offset, NUMBER_OF_USERS_TO_FETCH, tag);
        setPosts(posts => [...posts, ...result.posts]);
        setOffset(offset + NUMBER_OF_USERS_TO_FETCH);
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
