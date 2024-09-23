import { defineCollection, defineConfig, s } from "velite";
import { execSync } from "node:child_process";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeSlug from "rehype-slug";
import { remarkCodeHike } from "codehike/mdx"

/** @type {import('codehike/mdx').CodeHikeConfig} */
const chConfig = {
    components: { code: "MDXCode" },
    syntaxHighlighting: {
      theme: "github-dark-dimmed"
    }
}

const config = defineCollection({
    name: "Config",
    pattern: "site/config.yml",
    single: true,
    schema: s.object({
        header_logo: s.object({
            text_front: s.string(),
            text_middle: s.string(),
            text_end: s.string(),
            text_bottom: s.string(),
        }),
        header_navigation: s.array(
            s.object({
                title: s.string(),
                href: s.string(),
                children: s.array(
                    s.object({
                        title: s.string(),
                        href: s.string()
                    })
                ).optional()
            })
        )
    })
})

const posts = defineCollection({
    name: "Posts",
    pattern: "posts/**/*.@(md|mdx)",
    schema: s
        .object({
            title: s.string(),
            slug: s.slug("posts"),
            date: s.isodate(),
            cover: s.string(),
            tags: s.array(s.string()).default([]),
            metadata: s.metadata(),
            excerpt: s.excerpt(), // TODO: use AI
            content: s.mdx(),
            toc: s.toc()
        })
        .transform(data => ({ ...data, permalink: `/posts/${data.slug}` }))
        .transform(data => ({
            ...data,
            edited: (() => {
                try {
                    const filePath = `./content/${data.slug}.mdx`;
                    const dateStr = execSync(`git log -1 --format="%ad" -- ${filePath}`, {
                        encoding: 'utf-8'
                    });
                    return new Date(dateStr).toISOString();
                } catch (e) {
                    return new Date(data.date).toISOString();
                }
            })()
        }))
})

const tags = defineCollection({
    name: "Tags",
    pattern: "posts/**/*.@(md|mdx)",
    schema: s
        .object({
            tags: s.array(s.string()).default([])
        })
        .transform(data => data.tags),
    transform: (data) => {
        const allTags = data.flat();
        const uniqueTags = [...new Set(allTags)];
        return uniqueTags.map(tag => ({ name: tag, slug: tag.toLowerCase().replace(/[^a-z0-9]+/g, "-") }));
    }
})

export default defineConfig({
    root: "content",
    collections: {
        config,
        posts,
        tags
    },
    mdx: {
        rehypePlugins: [
            rehypeSlug,
            rehypeAutolinkHeadings
        ],
        remarkPlugins: [
            [
                remarkCodeHike, chConfig
            ],
        ],
    },
})