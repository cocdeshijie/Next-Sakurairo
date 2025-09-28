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
import { type Config, config } from "#site/content";

type RootLayoutProps = {
    children: React.ReactNode;
};

const inter = Inter({ subsets: ["latin"] });

// TODO: metadata
const siteTitle = config.site_info.title;
const siteDescription = `by ${config.site_info.author}`;

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
    },
    twitter: {
        card: "summary_large_image",
        title: siteTitle,
        description: siteDescription,
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
