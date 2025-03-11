import HomeImage from "@/components/Layout/Home/HomeImage";
import HomeHero from "@/components/Layout/Home/HomeHero";
import HomePosts from "@/components/Layout/Home/HomePosts";

const Home = () => {
    return (
        <>
            <div className={"sticky top-0 z-[-1]"}>
                <HomeImage/>
            </div>
            <div className={"flex flex-col"}>
                <HomeHero/>
                <HomePosts/>
            </div>
        </>
    );
    }
;

export default Home;