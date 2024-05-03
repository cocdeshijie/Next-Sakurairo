import Link from 'next/link';
import { posts } from "#site/content";
import { cn } from "@/utils/cn";
import HomePostCard from "@/components/Layout/Home/HomePostCard";


const HomePosts = () => {
    const displayedPosts = posts.slice(0, 4);

    return (
        <div className={"bg-theme-50 dark:bg-theme-950 py-8"}>
            <div className={"container mx-auto px-4 md:px-10 lg:px-20"}>
                <div className={"flex flex-col md:flex-row md:justify-between"}>
                    <div className={cn(
                        "md:w-1/3 md:flex md:items-center mb-8 md:mb-0 md:mr-16",
                        "text-left dark:text-white"
                    )}>
                        <h2 className={"text-3xl font-bold"}>Recent Posts</h2>
                    </div>
                    <div className={"w-full md:w-2/3 md:max-w-xl min-h-[50vh]"}>
                        <div className={"space-y-4 md:space-y-6 mb-8 md:mb-12"}>
                            {displayedPosts.map((post, index) => (
                                <HomePostCard key={index} post={post} index={index} />
                            ))}
                        </div>
                        <div className={"text-center"}>
                            <Link href={"/posts"}
                                  className={"bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"}>
                                Read More Placeholder
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePosts;