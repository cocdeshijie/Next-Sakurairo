export type SiteTitleParts = {
    text_front: string;
    text_middle?: string;
    text_end?: string;
    text_bottom?: string;
};

function normaliseSegment(value?: string): string | undefined {
    const trimmed = value?.trim();
    return trimmed ? trimmed : undefined;
}

export function buildSiteTitle(parts: SiteTitleParts): string {
    return [parts.text_front, parts.text_middle, parts.text_end]
        .map(normaliseSegment)
        .filter((segment): segment is string => Boolean(segment))
        .join(" ");
}

export function getSiteSubtitle(parts: SiteTitleParts): string | undefined {
    return normaliseSegment(parts.text_bottom);
}
