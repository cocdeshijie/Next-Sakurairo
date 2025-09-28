import { config } from "#site/content";
import { createOgImage, OG_IMAGE_CONTENT_TYPE, OG_IMAGE_SIZE } from "@/utils/og";

export const runtime = "edge";
export const size = OG_IMAGE_SIZE;
export const contentType = OG_IMAGE_CONTENT_TYPE;
export const alt = `${config.site_info.title} tags`;

export default function TagsOgImage() {
    return createOgImage({
        title: "All Tags",
        subtitle: config.site_info.title,
    });
}
