"use client"

import { Edit2, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ListPoster } from "./list-poster"
import type { List } from "@/types/list"

interface ListHeaderProps {
  list: List
  onEdit: () => void
  onAddMedia: () => void
  onDelete: () => void
}

export function ListHeader({ list, onEdit, onAddMedia, onDelete }: ListHeaderProps) {
  return (
    <div className="relative mb-8 rounded-xl overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center blur-xl opacity-20"
        style={{
          backgroundImage: list.poster && !list.poster.includes("placeholder.svg") ? `url(${list.poster})` : "none",
          backgroundColor: list.color,
        }}
      />
      <div className="relative z-10 flex flex-col md:flex-row gap-6 p-4 md:p-6">
        <div
          className="w-28 h-40 md:w-48 md:h-72 rounded-lg shadow-lg mx-auto md:mx-0 flex-shrink-0"
          style={{ borderColor: list.color, borderWidth: "2px" }}
        >
          {list.poster && !list.poster.includes("placeholder.svg") ? (
            <img
              src={list.poster || "/placeholder.svg"}
              alt={list.name}
              className="w-full h-full object-cover rounded-lg"
            />
          ) : (
            <ListPoster title={list.name} color={list.color} itemCount={list.items.length} className="w-full h-full" />
          )}
        </div>
        <div className="flex-1">
          <h1 className="text-xl md:text-3xl font-bold mb-2 text-center md:text-left">{list.name}</h1>
          {list.description && (
            <p className="text-muted-foreground mb-4 text-center md:text-left line-clamp-3 md:line-clamp-none">
              {list.description}
            </p>
          )}
          <div className="flex flex-wrap gap-2 items-center text-sm text-muted-foreground justify-center md:justify-start">
            <span>
              {list.items.length} item{list.items.length !== 1 ? "s" : ""}
            </span>
            <span>•</span>
            <span>Created {new Date(list.createdAt).toLocaleDateString()}</span>
          </div>

          <div className="flex flex-wrap gap-2 mt-4 justify-center md:justify-start">
            <Button onClick={onEdit} size="sm" className="sm:size-md">
              <Edit2 className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Edit List</span>
              <span className="sm:hidden">Edit</span>
            </Button>
            <Button
              variant="outline"
              onClick={onAddMedia}
              size="sm"
              className="sm:size-md bg-background/40 backdrop-blur-sm border-white/20 hover:bg-background/60"
            >
              <Plus className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Add Media</span>
              <span className="sm:hidden">Add</span>
            </Button>
            <Button variant="destructive" onClick={onDelete} size="sm" className="sm:size-md">
              <Trash2 className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Delete List</span>
              <span className="sm:hidden">Delete</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

