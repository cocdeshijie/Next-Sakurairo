import { defineCollection, defineConfig, s } from "velite";
import { execSync } from "node:child_process";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeSlug from "rehype-slug";
import { remarkCodeHike } from "codehike/mdx";

/** @type {import('codehike/mdx').CodeHikeConfig} */
const chConfig = {
    components: {
        code: "MDXCode",
        inlineCode: "MDXInlineCode"
    }
}

const config = defineCollection({
    name: "Config",
    pattern: "site/config.yml",
    single: true,
    schema: s.object({
        site_info: s.object({
            title: s.object({
                text_front: s.string(),
                text_middle: s.string(),
                text_end: s.string(),
                text_bottom: s.string().optional(),
            }),
            author: s.string(),
            profile_image: s.string(),
            theme_color: s.string(),
            theme_color_hue_shift: s.number(),
        }),
        posts_config: s.object({
            posts_per_page: s.number()
        }),
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
        ),
        home_working_on: s.array(s.string()),
        home_social: s.array(
            s.object({
                name: s.string(),
                src: s.string(),
                href: s.string()
            })
        ),
        footer: s.object({
            line_1: s.array(
                s.object({
                    text: s.string(),
                    href: s.string().optional()
                })
            ).optional(),
            line_2: s.string().optional(),
            line_3: s.string().optional(),
        }),
        giscus: s.object({
            repo: s.string(),
            repo_id: s.string(),
            category: s.string(),
            category_id: s.string(),
            mapping: s.string(),
            reactions_enabled: s.string(),
            emit_metadata: s.string(),
            input_position: s.string(),
            theme: s.string(),
            lang: s.string()
        }),
    })
})

const posts = defineCollection({
    name: "Posts",
    pattern: "posts/**/*.@(md|mdx)",
    schema: s
        .object({
            title: s.string(),
            path: s.path(),
            date: s.isodate(),
            cover: s.string(),
            tags: s.array(s.string()).default([]),
            metadata: s.metadata(),
            excerpt: s.excerpt(), // TODO: use AI
            content: s.mdx(),
            toc: s.toc(),
        })
        .transform(data => ({ ...data, permalink: `/${data.path}` }))
        .transform(data => ({
            ...data,
            edited: (() => {
                try {
                    const filePath = `./content/posts/${data.slug}.mdx`;
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

const pages = defineCollection({
    name: "Pages",
    pattern: "pages/**/*.@(md|mdx)",
    schema: s
        .object({
            title: s.string(),
            description: s.string().optional(),
            path: s.path(),
            cover: s.string().optional(),
            content: s.mdx()
        })
        .transform(data => {
            // If the path starts with "pages/", remove that prefix for the permalink
            // This preserves any subfolder structure after "pages/"
            const permalink = data.path.startsWith('pages/')
                ? `/${data.path.slice(6)}` // Remove "pages/" prefix
                : `/${data.path}`;

            return {
                ...data,
                permalink,
            };
        })
})

const tags = defineCollection({
    name: "Tags",
    pattern: "posts/**/*.@(md|mdx)",
    schema: s
        .object({
            tags: s.array(s.string()).default([])
        })
        .transform(data => data.tags),
});

export default defineConfig({
    root: "content",
    collections: {
        config,
        posts,
        pages,
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