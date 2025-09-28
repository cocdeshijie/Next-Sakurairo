import { config } from "#site/content";
import { createOgImage, ogImageContentType, ogImageSize } from "@/utils/og";
import { buildSiteTitle, getSiteSubtitle } from "@/utils/site";

export const size = ogImageSize;
export const contentType = ogImageContentType;
const logoTitleParts = config.header_logo;
const siteTitle = buildSiteTitle(logoTitleParts);
const homeSubtitle = getSiteSubtitle(logoTitleParts);
export const alt = `${siteTitle} open graph image`;

export default function OgImage() {
    return createOgImage({
        title: siteTitle,
        subtitle: homeSubtitle,
        align: "center",
    });
}
