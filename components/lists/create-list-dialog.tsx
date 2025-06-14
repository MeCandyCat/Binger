"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useLists } from "@/hooks/use-lists"
import { toast } from "@/components/ui/use-toast"
import { Save } from "lucide-react"

interface CreateListDialogProps {
  isOpen: boolean
  onClose: () => void
  onCreate?: (list: any) => void
}

export function CreateListDialog({ isOpen, onClose, onCreate }: CreateListDialogProps) {
  const { createList } = useLists()
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [color, setColor] = useState("#3b82f6") // Default blue color
  const [poster, setPoster] = useState("")
  const [nameError, setNameError] = useState("")
  const [isCreating, setIsCreating] = useState(false)

  const handleCreate = () => {
    if (!name.trim()) {
      setNameError("List name is required")
      return
    }

    if (name.length > 32) {
      setNameError("List name must be 32 characters or less")
      return
    }

    try {
      setIsCreating(true)
      const newList = createList({
        name,
        description,
        color,
        poster,
      })

      toast({
        title: "Success",
        description: "List created successfully",
      })

      resetForm()
      onClose()

      // If onCreate callback is provided, call it
      if (onCreate) {
        onCreate(newList)
      }
    } catch (error) {
      console.error("Error creating list:", error)
      toast({
        title: "Error",
        description: "Failed to create list",
        variant: "destructive",
      })
    } finally {
      setIsCreating(false)
    }
  }

  const resetForm = () => {
    setName("")
    setDescription("")
    setColor("#3b82f6")
    setPoster("")
    setNameError("")
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          resetForm()
        }
        onClose()
      }}
    >
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New List</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
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
            <label className="text-sm font-medium mb-1 block">Description (Optional)</label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="List Description"
              rows={3}
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">Theme Color</label>
            <div className="flex gap-2">
              <Input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="w-12 h-12 p-1" />
              <Input
                type="text"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                placeholder="#000000"
                pattern="^#[0-9A-Fa-f]{6}$"
                className="flex-1"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">Poster URL (Optional)</label>
            <Input
              type="url"
              value={poster}
              onChange={(e) => setPoster(e.target.value)}
              placeholder="https://example.com/poster.jpg"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isCreating}>
            Cancel
          </Button>
          <Button onClick={handleCreate} disabled={isCreating}>
            <Save className="w-4 h-4 mr-2" />
            {isCreating ? "Creating..." : "Create List"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
