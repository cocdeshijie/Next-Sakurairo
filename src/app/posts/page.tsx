import { getPosts } from "@/app/actions/getPosts";
import PostList from "@/components/ui/Posts/list";

export default async function PostsPage() {

    const result = await getPosts(0, 2)
    const initialPosts = result.posts;
    const lastPage = result.lastPage

    return (
        <div className={"bg-theme-50 dark:bg-theme-950 py-8 min-h-screen"}>
            {/* Top section */}
            <div className={"h-[30vh] flex items-center justify-center"}>
                <h1 className={"text-4xl font-bold text-center"}>All Posts</h1>
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