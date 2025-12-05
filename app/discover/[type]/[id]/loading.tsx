import { Skeleton } from "@/components/ui/skeleton"
import { NavBar } from "@/components/nav-bar"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { ThemeProvider } from "@/components/theme-provider"

export default function Loading() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <div className="min-h-screen bg-background">
        <div className="container py-10">
          <NavBar />
          <div className="mb-4">
            <Button asChild variant="ghost" size="sm">
              <Link href="/discover">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Discover
              </Link>
            </Button>
          </div>

          <div className="space-y-8">
            {/* Hero Section Skeleton */}
            <div className="relative overflow-hidden rounded-xl">
              <Skeleton className="aspect-[21/9] w-full" />
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 flex flex-col md:flex-row items-end gap-6">
                <Skeleton className="w-32 md:w-48 aspect-[2/3] rounded-lg hidden md:block" />
                <div className="flex-1 space-y-4">
                  <Skeleton className="h-10 w-3/4" />
                  <div className="flex flex-wrap gap-2">
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-6 w-20" />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-6 w-16" />
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons Skeleton */}
            <div className="flex flex-wrap gap-3">
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-10 w-32" />
            </div>

            {/* Tabs Skeleton */}
            <div className="space-y-6">
              <div className="flex gap-2">
                <Skeleton className="h-10 w-24" />
                <Skeleton className="h-10 w-24" />
                <Skeleton className="h-10 w-24" />
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-6">
                  <div className="space-y-4">
                    <Skeleton className="h-8 w-32" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                </div>
                <div>
                  <Skeleton className="h-[300px] w-full rounded-lg" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ThemeProvider>
  )
}
