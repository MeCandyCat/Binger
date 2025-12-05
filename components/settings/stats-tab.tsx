"use client"

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { TabsContent } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { useSettings } from "@/hooks/use-settings"
import { toast } from "@/components/ui/use-toast"
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"
import { GripVertical, Clock, Film, Tv, Star, Heart, Bookmark, TrendingUp, Tag, Activity } from "lucide-react"
import type { StatsPreferences, StatsConfig } from "@/types"

const STAT_ICONS = {
  totalWatchTime: Clock,
  tvShows: Tv,
  movies: Film,
  totalMedia: Film,
  averageRating: Star,
  favorites: Heart,
  wishlist: Bookmark,
  completionRate: TrendingUp,
  topGenre: Tag,
  recentActivity: Activity,
}

const STAT_LABELS = {
  totalWatchTime: "Total Watch Time",
  tvShows: "TV Shows",
  movies: "Movies",
  totalMedia: "Total Media",
  averageRating: "Average Rating",
  favorites: "Favorites",
  wishlist: "Wishlist",
  completionRate: "Completion Rate",
  topGenre: "Top Genre",
  recentActivity: "Recent Activity",
}

const STAT_DESCRIPTIONS = {
  totalWatchTime: "Display total time spent watching content",
  tvShows: "Show count of TV shows in your library",
  movies: "Show count of movies in your library",
  totalMedia: "Display combined count of all media",
  averageRating: "Show average rating across all your media",
  favorites: "Display count of favorited items",
  wishlist: "Show count of items in your wishlist",
  completionRate: "Show percentage of completed streaming shows",
  topGenre: "Display your most watched genre",
  recentActivity: "Show recent additions to your library",
}

export function StatsTab() {
  const { settings, updateSettings } = useSettings()
  const { statsPreferences } = settings

  const updateStatsPreferences = (updates: Partial<StatsPreferences>) => {
    const newPreferences = { ...statsPreferences, ...updates }
    updateSettings({ ...settings, statsPreferences: newPreferences })
    toast({
      title: "Stats preferences updated",
      description: "Your stats display has been customized",
    })
  }

  const toggleStat = (statKey: keyof StatsPreferences["stats"], enabled: boolean) => {
    updateStatsPreferences({
      stats: {
        ...statsPreferences.stats,
        [statKey]: { ...statsPreferences.stats[statKey], enabled },
      },
    })
  }

  const handleDragEnd = (result: any) => {
    if (!result.destination) return

    const items = Object.entries(statsPreferences.stats)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    const newStats: Record<string, StatsConfig> = {}
    items.forEach(([key, value], index) => {
      newStats[key] = { ...value, order: index }
    })

    updateStatsPreferences({ stats: newStats as StatsPreferences["stats"] })
  }

  const resetToDefaults = () => {
    const defaultStats = {
      totalWatchTime: { enabled: true, order: 0 },
      tvShows: { enabled: true, order: 1 },
      movies: { enabled: true, order: 2 },
      totalMedia: { enabled: false, order: 3 },
      averageRating: { enabled: false, order: 4 },
      favorites: { enabled: false, order: 5 },
      wishlist: { enabled: false, order: 6 },
      completionRate: { enabled: false, order: 7 },
      topGenre: { enabled: false, order: 8 },
      recentActivity: { enabled: false, order: 9 },
    }

    updateStatsPreferences({
      layout: "grid",
      compactView: false,
      showIcons: true,
      timeFormat: "days",
      colorTheme: "default",
      stats: defaultStats,
    })
  }

  const enabledCount = Object.values(statsPreferences.stats).filter((stat) => stat.enabled).length
  const sortedStats = Object.entries(statsPreferences.stats).sort(([, a], [, b]) => a.order - b.order)

  return (
    <TabsContent value="stats" className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Stats Customization</h2>
          <p className="text-sm text-muted-foreground">
            Customize your stats bar display and choose what information to show
          </p>
        </div>
        <Badge variant="secondary">{enabledCount} enabled</Badge>
      </div>

      {/* Layout & Display Options */}
      <Card>
        <CardHeader>
          <CardTitle>Display Options</CardTitle>
          <CardDescription>Customize how your stats are displayed</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Layout Style</Label>
              <Select
                value={statsPreferences.layout}
                onValueChange={(value: "grid" | "horizontal") => updateStatsPreferences({ layout: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="grid">Grid Layout</SelectItem>
                  <SelectItem value="horizontal">Horizontal Layout</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Time Format</Label>
              <Select
                value={statsPreferences.timeFormat}
                onValueChange={(value: "days" | "hours" | "minutes") => updateStatsPreferences({ timeFormat: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="days">Days</SelectItem>
                  <SelectItem value="hours">Hours</SelectItem>
                  <SelectItem value="minutes">Minutes</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Color Theme</Label>
              <Select
                value={statsPreferences.colorTheme}
                onValueChange={(value: "default" | "vibrant" | "minimal") =>
                  updateStatsPreferences({ colorTheme: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Default</SelectItem>
                  <SelectItem value="vibrant">Vibrant</SelectItem>
                  <SelectItem value="minimal">Minimal</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Favorite rating threshold</Label>
              <p className="text-xs text-muted-foreground">
                Items rated at or above this value are counted as favorites (in addition to manually favorited items).
              </p>
              <div className="flex items-center gap-2 max-w-xs">
                <Input
                  type="number"
                  min={0}
                  max={10}
                  step={0.1}
                  value={statsPreferences.favoriteThreshold ?? 8}
                  onChange={(e) => {
                    const value = Number(e.target.value)
                    if (Number.isNaN(value)) return
                    updateStatsPreferences({
                      favoriteThreshold: Math.min(Math.max(value, 0), 10),
                    })
                  }}
                />
                <Button
                  variant="outline"
                  onClick={() =>
                    updateStatsPreferences({
                      favoriteThreshold: 8,
                    })
                  }
                >
                  Reset
                </Button>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex items-center space-x-2">
              <Switch
                checked={statsPreferences.compactView}
                onCheckedChange={(checked) => updateStatsPreferences({ compactView: checked })}
              />
              <Label>Compact View</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                checked={statsPreferences.showIcons}
                onCheckedChange={(checked) => updateStatsPreferences({ showIcons: checked })}
              />
              <Label>Show Icons</Label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Configuration */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Stats Configuration</CardTitle>
            <CardDescription>Choose which stats to display and reorder them</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={resetToDefaults}>
            Reset to Defaults
          </Button>
        </CardHeader>
        <CardContent>
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="stats">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-3">
                  {sortedStats.map(([statKey, statConfig], index) => {
                    const Icon = STAT_ICONS[statKey as keyof typeof STAT_ICONS]
                    return (
                      <Draggable key={statKey} draggableId={statKey} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className={`flex items-center justify-between p-4 border rounded-lg transition-all ${
                              snapshot.isDragging ? "shadow-lg bg-accent" : "bg-card"
                            } ${statConfig.enabled ? "border-primary/20" : "border-border"}`}
                          >
                            <div className="flex items-center space-x-3">
                              <div {...provided.dragHandleProps} className="cursor-grab active:cursor-grabbing">
                                <GripVertical className="h-4 w-4 text-muted-foreground" />
                              </div>
                              <Icon
                                className={`h-4 w-4 ${statConfig.enabled ? "text-primary" : "text-muted-foreground"}`}
                              />
                              <div>
                                <div className="flex items-center space-x-2">
                                  <Label className={statConfig.enabled ? "text-foreground" : "text-muted-foreground"}>
                                    {STAT_LABELS[statKey as keyof typeof STAT_LABELS]}
                                  </Label>
                                  {statConfig.enabled && (
                                    <Badge variant="secondary" className="text-xs">
                                      Active
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-xs text-muted-foreground">
                                  {STAT_DESCRIPTIONS[statKey as keyof typeof STAT_DESCRIPTIONS]}
                                </p>
                              </div>
                            </div>
                            <Switch
                              checked={statConfig.enabled}
                              onCheckedChange={(checked) =>
                                toggleStat(statKey as keyof StatsPreferences["stats"], checked)
                              }
                            />
                          </div>
                        )}
                      </Draggable>
                    )
                  })}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </CardContent>
      </Card>

      {/* Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Preview</CardTitle>
          <CardDescription>See how your stats will look with current settings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground text-center py-8 border-2 border-dashed border-border rounded-lg">
            Stats preview will be shown here based on your current configuration
            <br />
            <span className="text-xs">
              Layout: {statsPreferences.layout} • Theme: {statsPreferences.colorTheme} • {enabledCount} stats enabled
            </span>
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  )
}
