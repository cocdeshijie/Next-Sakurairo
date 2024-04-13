import HomeImage from "@/components/Layout/Home/HomeImage";
import HomeHero from "@/components/Layout/Home/HomeHero";
import HomeArticles from "@/components/Layout/Home/HomeArticles";

const Home = () => {
    return (
        <>
            <div className={"sticky top-0 z-[-1]"}>
                <HomeImage/>
            </div>
            <div className={"flex flex-col"}>
                <HomeHero/>
                {/*TEMPORARY LINE*/}
                <div className={"border border-amber-400"}/>
                <HomeArticles/>
            </div>
        </>
    );
    }
;

export default Home;