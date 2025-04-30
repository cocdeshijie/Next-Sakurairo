import fs   from "fs";
import path from "path";
import Head from "next/head";
import Image from "next/image";

export default function HomeImage() {
    /* ── locate and filter local images ─────────────────────────── */
    const heroDir = path.join(process.cwd(), "public", "static", "home-hero");
    const extRe   = /\.(?:avif|webp|png|jpe?g|gif)$/i;

    let localImages: string[] = [];
    try {
        localImages = fs.readdirSync(heroDir).filter(f => extRe.test(f));
    } catch {
        /* directory may not exist in some environments */
    }

    /* ── bail out if none found ─────────────────────────────────── */
    if (localImages.length === 0) return null;

    /* ── pick one at random ─────────────────────────────────────── */
    const src =
        `/static/home-hero/${localImages[Math.floor(Math.random() * localImages.length)]}`;

    /* ── render ─────────────────────────────────────────────────── */
    return (
        <>
            {/* Preload so the file starts downloading during HTML parse */}
            <Head>
                <link rel="preload" as="image" href={src} fetchPriority="high" />
            </Head>

            {/* Fixed wrapper keeps the background glued to the viewport */}
            <div className="fixed inset-0 -z-10 pointer-events-none">
                <Image
                    src={src}
                    alt="Home background"
                    fill
                    sizes="100vw"
                    priority
                    unoptimized            /* no on-the-fly optimisation → quicker */
                    className="object-cover"
                />
            </div>
        </>
    );
}
