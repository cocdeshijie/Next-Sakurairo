import Image from 'next/image';
import Link from 'next/link';
import { posts } from "#site/content";

const HomePosts = () => {
    const displayedPosts = posts.slice(0, 4);

    return (
        <div className="bg-theme-50 dark:bg-theme-950 py-8">
            <div className="container mx-auto px-4 md:px-20">
                <div className="flex flex-col md:flex-row md:justify-between">
                    <div className="md:w-1/3 text-left dark:text-white mb-8 md:mb-0 md:mr-16 md:flex md:items-center">
                        <h2 className="text-3xl font-bold">Recent Posts</h2>
                    </div>
                    <div className="w-full md:w-2/3 md:max-w-xl">
                        <div className="min-h-[50vh] space-y-4 md:space-y-6 mb-8 md:mb-16">
                            {displayedPosts.map((post, index) => (
                                <div
                                    key={index}
                                    className="relative md:h-36 rounded-lg shadow-lg overflow-hidden md:flex"
                                >
                                    <div className="absolute inset-0 z-0 overflow-hidden">
                                        <Image
                                            src={post.cover}
                                            alt={post.title}
                                            layout="fill"
                                            objectFit="cover"
                                            objectPosition="center"
                                            className="filter blur-sm md:blur-lg transform dark:brightness-75"
                                        />
                                    </div>
                                    <div className="relative z-10 md:w-2/3">
                                        <div className="p-6 h-48 md:h-64">
                                            <h3 className="text-xl font-bold text-white mb-2">{post.title}</h3>
                                            <p className="text-gray-300 text-sm mb-4">{new Date(post.date).toLocaleDateString()}</p>
                                            <div className="flex space-x-2">
                                                {Array.isArray(post.tags) && post.tags.map((tag: string, tagIndex: number) => (
                                                    <span key={tagIndex} className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs">{tag}</span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="relative z-0 md:w-1/3 clip-path-articleImage hidden md:block overflow-hidden">
                                        <Image
                                            src={post.cover}
                                            alt={post.title}
                                            layout="fill"
                                            objectFit="cover"
                                            objectPosition="center"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="text-center">
                            <Link href="/posts"
                                  className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded">
                                Read More
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePosts;