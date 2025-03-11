"use client"

import { useState, useEffect } from "react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Save, Trash2, MoveVertical, Settings, Palette, FileText, Image } from "lucide-react"
import type { List } from "@/types/list"
import { SheetFooter } from "@/components/ui/sheet"

interface ListActionsSheetProps {
  isOpen: boolean
  onClose: () => void
  list: List
  onSave: (updates: Partial<List>) => void
  onDelete: () => void
  onReorganize: () => void
}

export function ListActionsSheet({ isOpen, onClose, list, onSave, onDelete, onReorganize }: ListActionsSheetProps) {
  const [activeTab, setActiveTab] = useState("details")
  const [name, setName] = useState(list.name)
  const [description, setDescription] = useState(list.description || "")
  const [color, setColor] = useState(list.color)
  const [poster, setPoster] = useState(list.poster || "")
  const [nameError, setNameError] = useState("")

  useEffect(() => {
    if (isOpen) {
      setName(list.name)
      setDescription(list.description || "")
      setColor(list.color)
      setPoster(list.poster || "")
      setNameError("")
      setActiveTab("details")
    }
  }, [isOpen, list])

  const handleSave = () => {
    if (!name.trim()) {
      setNameError("List name is required")
      return
    }

    if (name.length > 32) {
      setNameError("List name must be 32 characters or less")
      return
    }

    onSave({
      name,
      description: description || null,
      color,
      poster: poster || null,
    })
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="sm:max-w-md overflow-y-auto">
        <SheetHeader className="mb-6">
          <SheetTitle className="text-2xl">Manage List</SheetTitle>
          <SheetDescription>Customize and organize your list</SheetDescription>
        </SheetHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="details" className="flex items-center gap-1">
              <FileText className="w-4 h-4" />
              <span>Details</span>
            </TabsTrigger>
            <TabsTrigger value="appearance" className="flex items-center gap-1">
              <Palette className="w-4 h-4" />
              <span>Style</span>
            </TabsTrigger>
            <TabsTrigger value="actions" className="flex items-center gap-1">
              <Settings className="w-4 h-4" />
              <span>Actions</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="space-y-6">
          {activeTab === "details" && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">
                  List Name <span className="text-red-500">*</span>
                </label>
                <Input
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value)
                    if (e.target.value.trim()) {
                      setNameError("")
                    }
                  }}
                  placeholder="List Name"
                  className="text-lg"
                  maxLength={32}
                />
                <div className="flex justify-between mt-1">
                  {nameError ? (
                    <p className="text-sm text-red-500">{nameError}</p>
                  ) : (
                    <p className="text-sm text-muted-foreground">Required</p>
                  )}
                  <p className="text-sm text-muted-foreground">{name.length}/32</p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">Description</label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What's this list about?"
                  rows={3}
                  className="resize-none"
                />
                <p className="text-sm text-muted-foreground mt-1">Optional</p>
              </div>
            </div>
          )}

          {activeTab === "appearance" && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Theme Color</label>
                <div className="grid grid-cols-[auto_1fr] gap-3 items-center">
                  <div className="w-16 h-16 rounded-md border shadow-sm" style={{ backgroundColor: color }} />
                  <div className="space-y-2">
                    <Input
                      type="color"
                      value={color}
                      onChange={(e) => setColor(e.target.value)}
                      className="w-full h-10 p-1"
                    />
                    <Input
                      type="text"
                      value={color}
                      onChange={(e) => setColor(e.target.value)}
                      placeholder="#000000"
                      pattern="^#[0-9A-Fa-f]{6}$"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">Poster Image</label>
                <div className="grid grid-cols-[auto_1fr] gap-3 items-center">
                  <div className="w-16 h-24 rounded-md border shadow-sm overflow-hidden bg-muted">
                    {poster ? (
                      <img
                        src={poster || "/placeholder.svg"}
                        alt="Poster preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                        <Image className="w-6 h-6" />
                      </div>
                    )}
                  </div>
                  <div>
                    <Input
                      type="url"
                      value={poster}
                      onChange={(e) => setPoster(e.target.value)}
                      placeholder="https://example.com/poster.jpg"
                    />
                    <p className="text-sm text-muted-foreground mt-1">Optional</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "actions" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-3">List Organization</h3>
                <Button onClick={onReorganize} className="w-full justify-start" variant="outline">
                  <MoveVertical className="w-4 h-4 mr-2" />
                  Reorganize Items
                </Button>
                <p className="text-sm text-muted-foreground mt-2">Change the order of items in your list</p>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-medium text-destructive mb-3">Danger Zone</h3>
                <Button onClick={onDelete} variant="destructive" className="w-full justify-start">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete List
                </Button>
                <p className="text-sm text-destructive/70 mt-2">This action cannot be undone</p>
              </div>
            </div>
          )}
        </div>

        {activeTab !== "actions" && (
          <SheetFooter className="mt-6">
            <Button variant="outline" onClick={onClose} className="w-full sm:w-auto">
              Cancel
            </Button>
            <Button onClick={handleSave} className="w-full sm:w-auto">
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  )
}
