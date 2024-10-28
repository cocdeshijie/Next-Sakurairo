"use client";

import { Posts } from "#site/content";
import PostCard from "@/components/ui/Posts/index";
import { atom, useAtom } from 'jotai';
import { atomFamily, useHydrateAtoms } from 'jotai/utils';
import { getPosts } from "@/app/actions/getPosts";
import { usePathname } from 'next/navigation';
import { Button } from "@/components/ui/Buttons";
import { config } from "#site/content";

const posts_per_page = config.posts_config.posts_per_page

type PostListProps = {
    initialPosts: Posts[];
    lastPage: boolean;
    tag?: string;
}

const postAtomFamily = atomFamily(
    () => atom({
        offset: posts_per_page,
        posts: [] as Posts[],
        isLastPage: false,
    }),
    (a, b) => a === b
);

export default function PostList({ initialPosts, lastPage, tag }: PostListProps) {
    const path = usePathname();

    useHydrateAtoms([
        [postAtomFamily(path), { offset: posts_per_page, posts: initialPosts, isLastPage: lastPage }],
    ] as const);

    const [postState, setPostState] = useAtom(postAtomFamily(path));

    const loadMorePosts = async () => {
        const result = await getPosts(postState.offset, posts_per_page, tag);
        setPostState((prev) => ({
            ...prev,
            posts: [...prev.posts, ...result.posts],
            offset: prev.offset + posts_per_page,
            isLastPage: result.lastPage,
        }));
    };

    return (
        <div className="flex flex-col">
            {postState.posts.map((post, index) => (
                <PostCard key={index} post={post} index={index}/>
            ))}
            {!postState.isLastPage && (
                <div className="text-center">
                    <Button
                        onClick={loadMorePosts}
                        className="mt-8"
                    >
                        Read More
                    </Button>
                </div>
            )}
        </div>
    );
}