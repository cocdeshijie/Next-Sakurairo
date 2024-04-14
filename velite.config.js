import { defineConfig, s } from "velite";

export default defineConfig({
    root: "content",
    collections: {
        posts: {
            name: "Posts",
            pattern: 'posts/**/*.@(md|mdx)',
            schema: s
                .object({
                    title: s.string().max(99), // Zod primitive type
                    // slug: s.slug('posts'), // validate format, unique in posts collection
                    slug: s.path(), // auto generate slug from file path
                    date: s.isodate(), // input Date-like string, output ISO Date string.
                    cover: s.string(), // input image relative path, output image object with blurImage.
                    tags: s.array(s.string()).default([]),
                    metadata: s.metadata(), // extract markdown reading-time, word-count, etc.
                    excerpt: s.excerpt(), // excerpt of markdown content
                    content: s.markdown() // transform markdown to html
                })
                // more additional fields (computed fields)
                .transform(data => ({ ...data, permalink: `/blog/${data.slug}` }))
        }
    }
})