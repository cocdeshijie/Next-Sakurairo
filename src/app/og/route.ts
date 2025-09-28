import { config } from "#site/content";
import { createOgImage, type OgImageAlign } from "@/utils/og";
import { buildSiteTitle, getSiteSubtitle } from "@/utils/site";

export const runtime = "edge";

function resolveAlign(value: string | null): OgImageAlign {
    return value === "center" ? "center" : "start";
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const logoTitleParts = config.header_logo;
    const siteTitle = buildSiteTitle(logoTitleParts);
    const fallbackSubtitle = getSiteSubtitle(logoTitleParts);
    const title = searchParams.get("title")?.trim() || siteTitle;
    const subtitleRaw = searchParams.get("subtitle");
    const subtitleTrimmed = subtitleRaw?.trim();
    const subtitle = subtitleTrimmed ? subtitleTrimmed : fallbackSubtitle;
    const alignParam = searchParams.get("align");
    const align = alignParam ? resolveAlign(alignParam) : subtitle === fallbackSubtitle ? "center" : "start";

    return createOgImage({
        title,
        subtitle,
        align,
        assetBase: request.url,
    });
}
