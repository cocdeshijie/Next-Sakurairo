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
export const metadata: Metadata = {
    title: `${config.site_info.title}`,
    description: `by ${config.site_info.author}`,
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
