import { tags } from "#site/content";
import Tag from "@/components/ui/Tags";

// Fisher-Yates Shuffle Function
const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
};

// Function to determine size level based on tag frequency, normalized between 3 and 6
const getSizeLevel = (count: number, minCount: number, maxCount: number): number => {
    if (minCount === maxCount) return 4; // If all counts are the same, assign a medium size level

    // Normalize count to a value between 3 and 6
    const normalizedSize = 3 + ((count - minCount) / (maxCount - minCount)) * (6 - 3);
    return Math.round(normalizedSize);
};

export default function TagsPage() {
    // Count tag frequencies
    const tagFrequencies = tags.reduce<Record<string, number>>((acc, tag) => {
        acc[tag] = (acc[tag] || 0) + 1;
        return acc;
    }, {});

    // Convert the frequencies to an array of tags with frequency
    const uniqueTags = Object.entries(tagFrequencies).map(([tag, count]) => ({
        tag,
        count,
    }));

    // Find the minimum and maximum counts
    const counts = uniqueTags.map(({ count }) => count);
    const minCount = Math.min(...counts);
    const maxCount = Math.max(...counts);

    // Shuffle the tags to randomize their order
    const shuffledTags = shuffleArray(uniqueTags);

    return (
        <div className="bg-theme-50 dark:bg-theme-950 py-8 min-h-screen">
            {/* Top section */}
            <div className="h-[30vh] flex items-center justify-center">
                <h1 className="text-4xl font-bold text-center">All Tags</h1>
            </div>

            {/* Tags section */}
            <div className="container mx-auto px-16 md:w-[50em]">
                <div className="w-full">
                    <div className="flex flex-wrap gap-4 justify-center items-center">
                        {shuffledTags.map(({ tag, count }) => (
                            <Tag
                                tag={tag}
                                key={tag}
                                sizeLevel={getSizeLevel(count, minCount, maxCount)}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
