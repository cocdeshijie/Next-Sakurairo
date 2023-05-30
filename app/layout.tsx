import "./globals.css";
import { Roboto_Mono } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollProgress from "@/components/ScrollProgress";
import ToTop from "@/components/ToTop";
import { ThemeProvider } from "@/components/ThemeProvider"
import { TailwindIndicator } from "@/components/TailwindIndicator";

const inter = Roboto_Mono({ subsets: ['latin'] })

export const metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}
            style={{backgroundImage: 'url("https://www.loliapi.com/acg/pc/")',
                backgroundSize: 'cover',
                backgroundAttachment: 'fixed'}}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className={"min-h-screen flex flex-col"}>
              <ScrollProgress />
              <ToTop />
              <Header />
              {children}
              <Footer />
              <TailwindIndicator />
          </div>
      </ThemeProvider>

      </body>
    </html>
  )
}
