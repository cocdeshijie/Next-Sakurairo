import { config } from "#site/content";
import { createOgImage, ogImageContentType, ogImageSize } from "@/utils/og";

export const size = ogImageSize;
export const contentType = ogImageContentType;
export const alt = `${config.site_info.title} open graph image`;

export default function OgImage() {
    return createOgImage({
        title: config.site_info.title,
        align: "center",
    });
}
