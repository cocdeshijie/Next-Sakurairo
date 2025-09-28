import { config, posts } from "#site/content";
import { createOgImage, OG_IMAGE_CONTENT_TYPE, OG_IMAGE_SIZE } from "@/utils/og";

export const runtime = "edge";
export const size = OG_IMAGE_SIZE;
export const contentType = OG_IMAGE_CONTENT_TYPE;
export const alt = `${config.site_info.title} post preview`;

type Params = {
    path?: string[];
};

function normalise(path: string) {
    return path.replace(/^posts\//, "");
}

function getPostByPath(segments: string[]) {
    const target = segments.join("/");
    return posts.find(post => {
        const rawPath = (post as Record<string, unknown>).path;
        if (typeof rawPath !== "string") return false;
        return normalise(rawPath) === target;
    });
}

export default function PostOgImage({ params }: { params: Params }) {
    const segments = Array.isArray(params?.path) ? params.path : [];
    const post = getPostByPath(segments);
    const title = post?.title ?? config.site_info.title;

    return createOgImage({
        title,
        subtitle: post ? config.site_info.title : undefined,
    });
}
