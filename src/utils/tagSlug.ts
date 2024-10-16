export function tagSlug(tag: string) {
    return tag.replace(/\s+/g, '-');
}

export function deSlugTag(slug: string) {
    return slug.replace(/-/g, ' ');
}

