import { getPosts } from "@/app/actions/getPosts";
import PostList from "@/components/ui/Posts/list";
import { config } from "#site/content";

const posts_per_page = config.posts_config.posts_per_page

export default async function PostsPage() {

    const result = await getPosts(0, posts_per_page)
    const initialPosts = result.posts;
    const lastPage = result.lastPage

    return (
        <div className={"bg-theme-50 dark:bg-theme-950 py-8 min-h-screen"}>

            <div className={"h-[30vh] flex items-center justify-center"}>
                <h1 className={"text-4xl font-bold text-center"}>All Posts</h1>
            </div>

            <div className={"container mx-auto px-4 md:px-0 md:w-[50em]"}>
                <div className={"w-full"}>
                    <PostList initialPosts={initialPosts} lastPage={lastPage}/>
                </div>
            </div>

        </div>
    );
}