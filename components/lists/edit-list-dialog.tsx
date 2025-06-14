"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Save } from "lucide-react"
import type { List } from "@/types/list"

interface EditListDialogProps {
  isOpen: boolean
  onClose: () => void
  list: List
  onSave: (id: string, updates: Partial<List>) => void
}

export function EditListDialog({ isOpen, onClose, list, onSave }: EditListDialogProps) {
  const [name, setName] = useState(list.name)
  const [description, setDescription] = useState(list.description)
  const [color, setColor] = useState(list.color)
  const [poster, setPoster] = useState(list.poster)
  const [nameError, setNameError] = useState("")

  useEffect(() => {
    if (isOpen) {
      setName(list.name)
      setDescription(list.description)
      setColor(list.color)
      setPoster(list.poster)
      setNameError("")
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

    onSave(list.id, {
      name,
      description,
      color,
      poster,
    })
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit List</DialogTitle>
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
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
