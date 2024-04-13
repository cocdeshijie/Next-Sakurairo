import Image from 'next/image';

const HomeArticles = () => {
    return (
        <div className="bg-theme-50 dark:bg-theme-950 py-8">
            <div className="container mx-auto px-20">
                <div className="flex flex-col md:flex-row md:justify-between">
                    <div className="md:w-1/3 text-left dark:text-white mb-8 md:mb-0 md:mr-16 md:flex md:items-center">
                        <h2 className="text-3xl font-bold ">Placeholder Text</h2>
                    </div>
                    <div className="w-full md:w-2/3 space-y-4 md:max-w-xl">
                        {[...Array(4)].map((_, index) => (
                            <div
                                key={index}
                                className="relative md:h-36 rounded-lg shadow-lg overflow-hidden md:flex"
                            >
                                <Image
                                    src="https://cdn2.sublimerui.top/2023/04/02/6429715568f31.jpg"
                                    alt="Article Background"
                                    layout="fill"
                                    objectFit="cover"
                                    objectPosition="center"
                                    className="absolute inset-0 filter md:blur-2xl transform"
                                />
                                <div className="relative z-10 md:w-2/3">
                                    <div className="p-6 backdrop-filter backdrop-blur-sm md:backdrop-blur-lg h-48 md:h-64">
                                        <h3 className="text-xl font-bold text-white mb-2">Article Title</h3>
                                        <p className="text-gray-300 text-sm mb-4">April 13, 2024</p>
                                        <div className="flex space-x-2">
                                            <span className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs">Tag 1</span>
                                            <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs">Tag 2</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="relative z-10 md:w-1/3 hidden md:block clip-path-articleImage overflow-hidden">
                                    <Image
                                        src="https://cdn2.sublimerui.top/2023/04/02/6429715568f31.jpg"
                                        alt="Article Image"
                                        layout="fill"
                                        objectFit="cover"
                                        objectPosition="center"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomeArticles;