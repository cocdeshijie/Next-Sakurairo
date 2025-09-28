import { config } from "#site/content";
import { createOgImage, type OgImageAlign } from "@/utils/og";

export const runtime = "edge";

function resolveAlign(value: string | null): OgImageAlign {
    return value === "center" ? "center" : "start";
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const title = searchParams.get("title")?.trim() || config.site_info.title;
    const subtitleRaw = searchParams.get("subtitle");
    const subtitleTrimmed = subtitleRaw?.trim();
    const subtitle = subtitleTrimmed ? subtitleTrimmed : undefined;
    const align = resolveAlign(searchParams.get("align"));

    return createOgImage({
        title,
        subtitle,
        align,
    });
}
