"use client"

import { ThemeToggle } from "@/components/theme-toggle"
import { AddMediaDialog } from "@/components/add-media-dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Settings, List, ListPlus } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { CreateListDialog } from "@/components/lists/create-list-dialog"

interface NavBarProps {
  onAddMedia: () => void | Promise<void>
  variant?: "default" | "discover"
  searchQuery?: string
  onSearchChange?: (query: string) => void
}

export function NavBar({ onAddMedia, variant = "default", searchQuery = "", onSearchChange }: NavBarProps) {
  const pathname = usePathname()
  const isDiscover = pathname === "/discover"
  const isList = pathname.startsWith("/list")
  const [showCreateListDialog, setShowCreateListDialog] = useState(false)

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 space-y-4 sm:space-y-0">
        <div className="flex items-center gap-4">
          <Link href="/">
            <h1 className="text-3xl sm:text-4xl font-bold">
              {isDiscover ? "Binger Discover" : isList ? "Binger Lists" : "Binger"}
            </h1>
          </Link>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <ThemeToggle />
          {variant === "discover" && (
            <div className="relative w-[300px]">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search movies and TV shows..."
                value={searchQuery}
                onChange={(e) => onSearchChange?.(e.target.value)}
                className="pl-10 w-full"
              />
            </div>
          )}
          {variant === "default" && (
            <>
              <Link href="/settings">
                <Button variant="outline" size="icon">
                  <Settings className="w-4 h-4" />
                </Button>
              </Link>

              <Link href="/list">
                <Button variant="outline" size="sm">
                  <List className="w-4 h-4 mr-2" />
                  Lists
                </Button>
              </Link>

              <Link href="/discover">
                <Button variant="outline" size="sm">
                  <Search className="w-4 h-4 mr-2" />
                  Discover
                </Button>
              </Link>

              {isList ? (
                <Button onClick={() => setShowCreateListDialog(true)}>
                  <ListPlus className="w-4 h-4 mr-2" />
                  Create List
                </Button>
              ) : (
                <AddMediaDialog onAdd={onAddMedia} />
              )}
            </>
          )}
        </div>
      </div>

      <CreateListDialog isOpen={showCreateListDialog} onClose={() => setShowCreateListDialog(false)} />
    </>
  )
}
