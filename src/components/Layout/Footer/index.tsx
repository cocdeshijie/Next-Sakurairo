const Footer = () => {
    return (
        <footer className={"bg-theme-300 dark:bg-theme-700 dark:text-white"}>
            <div className={"dark:backdrop-brightness-[40%] py-8"}>
                <div className={"container mx-auto px-4"}>
                    <div className={"md:flex md:justify-between md:items-center md:px-40"}>
                        <div>
                            <div className={"mb-4"}>
                                <span className={"text-lg"}>item1 | item2 | item3 | item4</span>
                            </div>
                            <div>
                                <h3 className={"text-xl font-bold"}>Footer Placeholder</h3>
                                <p className={"mt-2"}>Some additional text goes here.</p>
                            </div>
                        </div>
                        <div className={"mt-4 md:mt-0 md:flex md:items-center"}>
                            <p>&copy; {new Date().getFullYear()} cocdeshijie</p>
                        </div>
                    </div>
                </div>
            </div>

        </footer>
    );
};

export default Footer;