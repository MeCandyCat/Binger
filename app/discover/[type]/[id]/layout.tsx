import type React from "react"
import { ThemeProvider } from "@/components/theme-provider"
import ErrorBoundary from "@/components/error-boundary"

export default function MediaDetailLayout({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
        <div className="min-h-screen bg-background">
          <div className="container py-10">{children}</div>
        </div>
      </ThemeProvider>
    </ErrorBoundary>
  )
}
