"use client"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X, ArrowRight } from "lucide-react"
import type { List } from "@/types/list"
import { useRouter } from "next/navigation"
import { useSwipeable } from "react-swipeable"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ListPoster } from "./list-poster"

interface ListSheetProps {
  list: List | null
  onClose: () => void
}

export function ListSheet({ list, onClose }: ListSheetProps) {
  const router = useRouter()

  const swipeHandlers = useSwipeable({
    onSwipedRight: onClose,
    trackMouse: true,
  })

  if (!list) return null

  const handleViewList = () => {
    router.push(`/list/${list.id}`)
    onClose()
  }

  // Get up to 3 items to display (changed from 4)
  const displayItems = list.items.slice(0, 3)
  const remainingCount = Math.max(0, list.items.length - 3)
  const showExactItem = remainingCount === 1
  const fourthItem = showExactItem && list.items.length > 3 ? list.items[3] : null

  return (
    <Sheet open={!!list} onOpenChange={onClose}>
      <SheetContent className="p-0 w-full sm:max-w-xl" {...swipeHandlers}>
        {/* Fixed position buttons for close */}
        <div className="absolute top-4 right-4 z-50">
          <Button
            variant="outline"
            size="icon"
            className="bg-background/20 backdrop-blur-sm hover:bg-background/40 border-0"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="h-[calc(100vh-2rem)] overflow-y-auto">
          {/* Hero Section */}
          <div className="relative">
            <div className="aspect-video w-full">
              {list.poster && !list.poster.includes("placeholder.svg") ? (
                <img src={list.poster || "/placeholder.svg"} alt={list.name} className="object-cover w-full h-full" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ListPoster
                    title={list.name}
                    color={list.color}
                    itemCount={list.items.length}
                    aspectRatio="landscape"
                    className="w-full h-full"
                  />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <h2 className="text-2xl font-semibold text-white mb-1">{list.name}</h2>
              {list.description && <p className="text-sm text-white/80 mb-2">{list.description}</p>}
              <Badge variant="secondary">
                {list.items.length} item{list.items.length !== 1 ? "s" : ""}
              </Badge>
            </div>
          </div>

          {/* Content Section */}
          <div className="p-6 space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Items in this list</h3>

              <ScrollArea className="h-[200px]">
                <div className="flex gap-3 overflow-x-auto pb-4">
                  {displayItems.map((item) => (
                    <div
                      key={item.id}
                      className="relative rounded-lg overflow-hidden flex-shrink-0"
                      style={{ width: "120px" }}
                    >
                      <img
                        src={`https://image.tmdb.org/t/p/w500${item.posterPath}`}
                        alt={item.title}
                        className="aspect-[2/3] object-cover w-full"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 hover:opacity-100 transition-opacity">
                        <div className="absolute bottom-0 left-0 right-0 p-2">
                          <h4 className="text-sm font-medium text-white truncate">{item.title}</h4>
                          <p className="text-xs text-white/70 capitalize">{item.type}</p>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Show 4th item directly if there's exactly 1 more */}
                  {showExactItem && fourthItem && (
                    <div
                      key={fourthItem.id}
                      className="relative rounded-lg overflow-hidden flex-shrink-0"
                      style={{ width: "120px" }}
                    >
                      <img
                        src={`https://image.tmdb.org/t/p/w500${fourthItem.posterPath}`}
                        alt={fourthItem.title}
                        className="aspect-[2/3] object-cover w-full"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 hover:opacity-100 transition-opacity">
                        <div className="absolute bottom-0 left-0 right-0 p-2">
                          <h4 className="text-sm font-medium text-white truncate">{fourthItem.title}</h4>
                          <p className="text-xs text-white/70 capitalize">{fourthItem.type}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Show count for remaining items if more than 1 */}
                  {remainingCount > 1 && (
                    <div
                      className="aspect-[2/3] flex items-center justify-center bg-secondary/50 rounded-lg border border-dashed border-secondary flex-shrink-0"
                      style={{ width: "120px" }}
                    >
                      <div className="text-center p-4">
                        <p className="text-lg font-semibold">+{remainingCount}</p>
                        <p className="text-sm text-muted-foreground">more items</p>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>

            <Button onClick={handleViewList} className="w-full">
              View Full List
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
