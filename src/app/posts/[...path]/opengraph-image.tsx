import { config, posts } from "#site/content";
import { createOgImage, ogImageContentType, ogImageSize } from "@/utils/og";

export const size = ogImageSize;
export const contentType = ogImageContentType;
export const alt = "Post open graph image";

type Params = { path: string[] };

type OgImageProps = {
    params: Promise<Params>;
};

function normalise(path: string) {
    return path.replace(/^posts\//, "");
}

function getPostByPath(segments: string[]) {
    const joined = segments.join("/");
    return posts.find(post => "path" in post && normalise((post as any).path) === joined);
}

export default async function OgImage({ params }: OgImageProps) {
    const resolvedParams = await params;
    const post = getPostByPath(resolvedParams.path);

    if (!post) {
        return createOgImage({
            title: config.site_info.title,
            align: "center",
        });
    }

    return createOgImage({
        title: post.title,
        subtitle: config.site_info.title,
        align: "start",
    });
}
