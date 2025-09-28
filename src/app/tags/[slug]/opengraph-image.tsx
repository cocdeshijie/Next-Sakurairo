import { config } from "#site/content";
import { createOgImage, ogImageContentType, ogImageSize } from "@/utils/og";

export const size = ogImageSize;
export const contentType = ogImageContentType;
export const alt = "Tag open graph image";

type Params = { slug: string };

type OgImageProps = {
    params: Promise<Params>;
};

export default async function OgImage({ params }: OgImageProps) {
    const resolvedParams = await params;
    const tag = decodeURIComponent(resolvedParams.slug);

    if (!tag) {
        return createOgImage({
            title: config.site_info.title,
            align: "center",
        });
    }

    return createOgImage({
        title: `Tag: ${tag}`,
        subtitle: config.site_info.title,
        align: "start",
    });
}
