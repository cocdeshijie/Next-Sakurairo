"use client";

import { Posts } from "#site/content";
import PostCard from "@/components/ui/Posts/index";
import { atom, useAtom } from 'jotai';
import { atomFamily, useHydrateAtoms } from 'jotai/utils';
import { getPosts } from "@/app/actions/getPosts";
import { usePathname } from 'next/navigation';

// Type for PostList Props
type PostListProps = {
    initialPosts: Posts[];
    lastPage: boolean;
    tag?: string;
}

// Jotai atom family
const postAtomFamily = atomFamily(
    (path: string) => atom({
        offset: 2,
        posts: [] as Posts[],
        isLastPage: false,
    }),
    (a, b) => a === b
);

export default function PostList({ initialPosts, lastPage, tag }: PostListProps) {
    const path = usePathname();

    useHydrateAtoms([
        [postAtomFamily(path), { offset: 2, posts: initialPosts, isLastPage: lastPage }],
    ] as const);

    const [postState, setPostState] = useAtom(postAtomFamily(path));

    const loadMorePosts = async () => {
        const result = await getPosts(postState.offset, 2, tag);
        setPostState((prev) => ({
            ...prev,
            posts: [...prev.posts, ...result.posts],
            offset: prev.offset + 2,
            isLastPage: result.lastPage,
        }));
    };

    return (
        <div className={"space-y-6 md:space-y-8 mb-8 md:mb-12"}>
            {postState.posts.map((post, index) => (
                <PostCard key={index} post={post} index={index} />
            ))}
            {!postState.isLastPage && (
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
