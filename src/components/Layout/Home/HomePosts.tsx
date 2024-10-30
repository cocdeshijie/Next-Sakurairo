import { posts, type Posts } from "#site/content";
import { cn } from "@/utils/cn";
import HomePostCard from "@/components/Layout/Home/HomePostCard";
import { LinkButton } from "@/components/ui/Buttons";


const HomePosts = () => {
    const latestPosts: Posts = posts
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 4); // Get the latest 4 posts

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
                        <div className={"flex flex-col"}>
                            {latestPosts.map((post: Posts, index: number) => (
                                <HomePostCard key={index} post={post} index={index} />
                            ))}
                        </div>
                        <div className={"text-center"}>
                            <LinkButton href={"/posts"}>
                                Read More
                            </LinkButton>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePosts;