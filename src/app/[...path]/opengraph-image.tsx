import { config, pages } from "#site/content";
import { createOgImage, ogImageContentType, ogImageSize } from "@/utils/og";

export const size = ogImageSize;
export const contentType = ogImageContentType;
export const alt = "Page open graph image";

type Params = { path: string[] };

type OgImageProps = {
    params: Promise<Params>;
};

type PageEntry = (typeof pages)[number];
type LegacyPageEntry = PageEntry & { originalPath?: string };

function getLegacyOriginalPath(page: PageEntry): string | undefined {
    const candidate = (page as LegacyPageEntry).originalPath;
    return typeof candidate === "string" ? candidate : undefined;
}

function joinPath(segments: string[]): string {
    return segments.join("/");
}

function getPageByPath(segments: string[]) {
    const target = joinPath(segments);
    return pages.find(page => {
        const legacyOriginalPath = getLegacyOriginalPath(page);
        return page.path === target ||
            page.permalink === `/${target}` ||
            legacyOriginalPath === target ||
            legacyOriginalPath === `pages/${target}`;
    });
}

export default async function OgImage({ params }: OgImageProps) {
    const resolvedParams = await params;
    const page = getPageByPath(resolvedParams.path);

    if (!page) {
        return createOgImage({
            title: config.site_info.title,
            align: "center",
        });
    }

    return createOgImage({
        title: page.title,
        subtitle: config.site_info.title,
        align: "start",
    });
}
