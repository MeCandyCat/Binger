import { Button } from "@/components/ui/button"
import { NavBar } from "@/components/nav-bar"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { ThemeProvider } from "@/components/theme-provider"

export default function NotFound() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <div className="min-h-screen bg-background">
        <div className="container py-10">
          <NavBar onAddMedia={async () => {}} />
          <div className="mb-4">
            <Button asChild variant="ghost" size="sm">
              <Link href="/discover">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Discover
              </Link>
            </Button>
          </div>

          <div className="flex flex-col items-center justify-center py-20 text-center">
            <h1 className="text-4xl font-bold mb-4">Media Not Found</h1>
            <p className="text-muted-foreground mb-8 max-w-md">
              The movie or TV show you're looking for doesn't exist or has been removed.
            </p>
            <Button asChild>
              <Link href="/discover">Explore Discover</Link>
            </Button>
          </div>
        </div>
      </div>
    </ThemeProvider>
  )
}
