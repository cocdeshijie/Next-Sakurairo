import type { Metadata } from "next";
import { getPosts } from "@/app/actions/getPosts";
import PostList from "@/components/ui/Posts/list";
import Tag from "@/components/ui/Tags";
import { config, tags } from "#site/content";
import { getOgImageUrl, ogImageSize } from "@/utils/og";
import { buildSiteTitle } from "@/utils/site";

interface TagProps {
    params: Promise<{
        slug: string
    }>
}

export function generateStaticParams(): { slug: string }[] {
    // Flatten the nested array first, then remove duplicates
    const flatTags = tags.flat();
    const uniqueTags = Array.from(new Set(flatTags));
    return uniqueTags.map((tag: string) => ({
        slug: tag
    }));
}

export async function generateMetadata({ params }: TagProps): Promise<Metadata> {
    const resolvedParams = await params;
    const tag = decodeURIComponent(resolvedParams.slug);
    const title = `Tag: ${tag}`;
    const siteTitle = buildSiteTitle(config.header_logo);
    const description = `Posts tagged with ${tag} on ${siteTitle}`;
    const ogImage = getOgImageUrl({
        title,
        subtitle: siteTitle,
    });
    const ogAlt = `${title} – ${siteTitle}`;

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            images: [
                {
                    url: ogImage,
                    width: ogImageSize.width,
                    height: ogImageSize.height,
                    alt: ogAlt,
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: [ogImage],
        },
    };
}

export default async function TagPage({ params }: TagProps) {
    const resolvedParams = await params;
    const tag = resolvedParams.slug;
    const result = await getPosts(0, config.posts_config.posts_per_page, tag)
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