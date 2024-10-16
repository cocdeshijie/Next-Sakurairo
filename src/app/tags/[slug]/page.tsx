import { getPosts } from "@/app/actions/getPosts";
import PostList from "@/components/ui/Posts/list";
import Tag from "@/components/ui/Tags";
import { tags } from "#site/content";

interface TagProps {
    params: {
        slug: string
    }
}

export function generateStaticParams(): TagProps['params'][] {
    const uniqueTags = Array.from(new Set(tags)); // Remove duplicates
    console.log(uniqueTags)
    return uniqueTags.map(tag => ({
        slug: tag
    }));
}

export default async function TagPage({ params }: TagProps) {
    const tag = params.slug;
    const result = await getPosts(0, 2, tag)
    const initialPosts = result.posts;
    const lastPage = result.lastPage

    return (
        <div className={"bg-theme-50 dark:bg-theme-950 py-8 min-h-screen"}>
            {/* Top section */}
            <div className={"h-[30vh] flex items-center justify-center"}>
                <h1 className={"text-4xl font-bold text-center"}>
                    Posts with <Tag tag={decodeURIComponent(tag)} sizeLevel={6}/>
                </h1>
            </div>

            {/* Posts section */}
            <div className={"container mx-auto px-4 md:px-0 md:w-[50em]"}>
                <div className={"w-full"}>
                    <PostList initialPosts={initialPosts} lastPage={lastPage}/>
                </div>
            </div>
        </div>
    );
}