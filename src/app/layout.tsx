import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "../components/Layout/Header";
import { JotaiProvider } from "@/providers/jotai-provider";
import Footer from "../components/Layout/Footer";
import { ThemeProvider } from "@/providers/theme-provider";
import { ScrollProvider } from "@/providers/scroll-provider";
import { cn } from "@/utils/cn";
import { UtilityButtons } from "@/components/Layout/UtilityButtons";
import { config } from "#site/content";
import { getOgImageUrl, ogImageSize } from "@/utils/og";
import { buildSiteTitle, getSiteSubtitle } from "@/utils/site";

type RootLayoutProps = {
    children: React.ReactNode;
};

const inter = Inter({ subsets: ["latin"] });

// TODO: metadata
const logoTitleParts = config.header_logo;
const siteTitle = buildSiteTitle(logoTitleParts);
const siteDescription = `by ${config.site_info.author}`;
const homeSubtitle = getSiteSubtitle(logoTitleParts);
const defaultOgImage = getOgImageUrl({ title: siteTitle, subtitle: homeSubtitle, align: "center" });
const defaultOgAlt = `${siteTitle} open graph image`;
const profileImage = config.site_info.profile_image;

const metadataBase = (() => {
    const domain = config.site_info.domain?.trim();
    if (!domain) return undefined;

    try {
        const withProtocol = domain.startsWith("http://") || domain.startsWith("https://")
            ? domain
            : `https://${domain}`;
        return new URL(withProtocol);
    } catch (error) {
        console.warn("Invalid metadataBase domain configured:", domain, error);
        return undefined;
    }
})();

export const metadata: Metadata = {
    metadataBase,
    title: {
        default: siteTitle,
        template: `%s | ${siteTitle}`,
    },
    description: siteDescription,
    icons: {
        icon: profileImage,
        shortcut: profileImage,
        apple: profileImage,
    },
    openGraph: {
        title: siteTitle,
        description: siteDescription,
        type: "website",
        siteName: siteTitle,
        images: [
            {
                url: defaultOgImage,
                width: ogImageSize.width,
                height: ogImageSize.height,
                alt: defaultOgAlt,
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: siteTitle,
        description: siteDescription,
        images: [defaultOgImage],
    },
};

export const viewport: Viewport = {
    themeColor: config.site_info.theme_color,
};

export default function RootLayout({ children }: RootLayoutProps) {
    return (
        <html lang="en" style={{ colorScheme: 'dark' }} className={cn('dark')} suppressHydrationWarning>
        <body className={inter.className}>
        <JotaiProvider>
            <ThemeProvider>
                <ScrollProvider>
                    <Header />
                    {children}
                    <Footer />
                    <UtilityButtons />
                </ScrollProvider>
            </ThemeProvider>
        </JotaiProvider>
        </body>
        </html>
    );
}
