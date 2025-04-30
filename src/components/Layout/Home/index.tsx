import HomeImage from "@/components/Layout/Home/HomeImage";
import HomeHero  from "@/components/Layout/Home/HomeHero";
import HomePosts from "@/components/Layout/Home/HomePosts";

/**
 * Home page container
 * -------------------
 * • `HomeImage` is *fixed* and `-z-10`, so it never occupies layout
 *   space – all real content naturally renders “on top”.
 */
export default function Home() {
    return (
        <>
            <HomeImage />          {/* background, fixed, pointer-events-none */}

            <div className="flex flex-col">
                <HomeHero />
                <HomePosts />
            </div>
        </>
    );
}
