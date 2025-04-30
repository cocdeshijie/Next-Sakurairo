/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '*',
            },
        ],
    },
    webpack: (config) => {
        config.resolve.alias ??= {};
        config.resolve.alias['#site'] = path.resolve(__dirname, 'src/site');
        return config;
    },
};

export default nextConfig;
