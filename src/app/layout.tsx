import type { Metadata } from "next";
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

type RootLayoutProps = {
    children: React.ReactNode;
};

const inter = Inter({ subsets: ["latin"] });

// TODO: metadata
const siteTitle = config.site_info.title;
const siteDescription = `by ${config.site_info.author}`;
const defaultOgImage = getOgImageUrl({ title: siteTitle, align: "center" });
const defaultOgAlt = `${siteTitle} open graph image`;

export const metadata: Metadata = {
    title: {
        default: siteTitle,
        template: `%s | ${siteTitle}`,
    },
    description: siteDescription,
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
