"use client";

/*
 *  GiscusComments
 *  --------------
 *  Lightweight wrapper around the Giscus script, fed by values
 *  from `content/site/config.yml`.  Used automatically in every
 *  blog post and optionally inside MDX pages via <Comment/>.
 */

import Script from "next/script";
import { config } from "#site/content";

export default function GiscusComments() {
    const g = config.giscus;

    return (
        <div className="mt-12 md:mx-8">
            <div className="giscus" />

            {/* eslint-disable-next-line @next/next/no-sync-scripts */}
            <Script
                src={"https://giscus.app/client.js"}
                data-repo={g.repo}
                data-repo-id={g.repo_id}
                data-category={g.category}
                data-category-id={g.category_id}
                data-mapping={g.mapping}
                data-reactions-enabled={String(g.reactions_enabled)}
                data-emit-metadata={String(g.emit_metadata)}
                data-input-position={g.input_position}
                data-theme={g.theme}
                data-lang={g.lang}
                data-loading="lazy"
                crossOrigin="anonymous"
                async
            />
        </div>
    );
}