import type { Metadata } from "next"
import localFont from "next/font/local"
import NextTopLoader from "nextjs-toploader"
import { NuqsAdapter } from "nuqs/adapters/next/app"

import { site } from "@/config/site"
import { Toaster } from "@/components/ui/sonner"
import AuthProvider from "@/components/providers/auth-provider"
import { ReactQueryProvider } from "@/components/providers/react-query-provider"
import { ThemeProvider } from "@/components/providers/theme-provider"

import "./globals.css"

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
})
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
})

export const metadata: Metadata = {
  title: {
    template: `%s | ${site.title}`,
    default: site.title, // a default is required when creating a template
  },
  description: site.description,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="bg-background text-foreground h-full">
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-background text-foreground h-full font-sans antialiased`}
      >
        <NextTopLoader color="#016FEE" />
        <AuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem={true}
            disableTransitionOnChange
          >
            <NuqsAdapter>
              <ReactQueryProvider>
                {children}
                <Toaster richColors position="top-center" />
              </ReactQueryProvider>
            </NuqsAdapter>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
