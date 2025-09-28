import { config } from "#site/content";
import { createOgImage, ogImageContentType, ogImageSize } from "@/utils/og";
import { buildSiteTitle, getSiteSubtitle } from "@/utils/site";

export const size = ogImageSize;
export const contentType = ogImageContentType;
const logoTitleParts = config.header_logo;
const siteTitle = buildSiteTitle(logoTitleParts);
const homeSubtitle = getSiteSubtitle(logoTitleParts);
export const alt = `${siteTitle} open graph image`;

const envBase = (() => {
    const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
    if (explicit) {
        return explicit;
    }

    const vercel = process.env.VERCEL_URL?.trim();
    if (vercel) {
        const hasProtocol = /^https?:\/\//i.test(vercel);
        return hasProtocol ? vercel : `https://${vercel}`;
    }

    return undefined;
})();

export default function OgImage() {
    return createOgImage({
        title: siteTitle,
        subtitle: homeSubtitle,
        align: "center",
        assetBase: envBase,
    });
}
