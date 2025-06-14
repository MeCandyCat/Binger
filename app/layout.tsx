import type { Metadata } from 'next'
import './globals.css'
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import ClientOnly from "@/components/client-only"

export const metadata: Metadata = {
  title: 'Binger',
  description: 'Personal Movie Tracker App',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <ClientOnly>
              {children}
              <Toaster />
            </ClientOnly>
          </ThemeProvider>
      </body>
    </html>
  )
}
