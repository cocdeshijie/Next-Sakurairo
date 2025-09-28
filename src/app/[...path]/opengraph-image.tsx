import { config, pages } from "#site/content";
import { createOgImage, OG_IMAGE_CONTENT_TYPE, OG_IMAGE_SIZE } from "@/utils/og";

export const runtime = "edge";
export const size = OG_IMAGE_SIZE;
export const contentType = OG_IMAGE_CONTENT_TYPE;
export const alt = `${config.site_info.title} page preview`;

type Params = {
    path?: string[];
};

function joinPath(segments: string[]) {
    return segments.join("/");
}

function getPageByPath(segments: string[]) {
    const target = joinPath(segments);
    return pages.find(page => {
        const legacyOriginalPath = (page as Record<string, unknown>).originalPath;
        const legacy = typeof legacyOriginalPath === "string" ? legacyOriginalPath : undefined;
        return (
            page.path === target ||
            page.permalink === `/${target}` ||
            legacy === target ||
            legacy === `pages/${target}`
        );
    });
}

export default function PageOgImage({ params }: { params: Params }) {
    const segments = Array.isArray(params?.path) ? params.path : [];
    const page = getPageByPath(segments);
    const title = page?.title ?? config.site_info.title;

    return createOgImage({
        title,
        subtitle: page ? config.site_info.title : undefined,
    });
}
