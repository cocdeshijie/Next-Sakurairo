import HomeImage from "@/components/Home/HomeImage";
import HomeHero from "@/components/Home/HomeHero";

const Home = () => {
    return (
        <>
            <div className={"sticky top-0 z-[-1]"}>
                <HomeImage/>
            </div>
            <div className={"flex flex-col"}>
                <HomeHero/>
                {/*TODO: place below content in another component*/}
                <div className={"min-h-screen bg-theme-50 flex items-center justify-center"}>
                    <div className={"text-center text-white"}>
                        <h2 className={"text-3xl font-bold"}>Second Page Content</h2>
                        <p className={"mt-4"}>This is the content of the second page.</p>
                    </div>
                </div>
            </div>
        </>
    );
    }
;

export default Home;