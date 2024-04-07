import type { Metadata } from "next"
import { Inter as FontSans } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils"
import { TheNavbar } from "@/components/the-navbar"

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

export const metadata: Metadata = {
  title: "Simple Notes With WYSIWYG",
  description: "Generated simple notes with WYSIWYG",
  generator: "Next.js",
  manifest: "/manifest.json",
  keywords: ["nextjs", "nextjs13", "next13", "pwa", "next-pwa"],
  themeColor: [{ media: "(prefers-color-scheme: dark)", color: "#fff" }],
  authors: [],
  viewport:
    "minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, viewport-fit=cover",
  icons: [
    { rel: "apple-touch-icon", url: "icons/icon-128x128.png" },
    { rel: "icon", url: "icons/icon-128x128.png" },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={cn("bg-background font-sans antialiased", fontSans.variable)}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <TheNavbar />
          <main className="p-4 sm:p-10">{children}</main>
        </ThemeProvider>
      </body>
    </html>
  )
}
