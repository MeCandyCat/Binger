"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLists } from "@/hooks/use-lists"
import { toast } from "@/components/ui/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { NavBar } from "@/components/nav-bar"
import { useMediaLibrary } from "@/hooks/use-media-library"
import { ThemeProvider } from "@/components/theme-provider"
import Link from "next/link"
import { ListAddMediaDialog } from "@/components/lists/list-add-media-dialog"
import { ListHeader } from "@/components/lists/list-header"
import { ListContent } from "@/components/lists/list-content"
import { MediaReorganizer } from "@/components/media-reorganizer"
import { ListActionsSheet } from "@/components/lists/list-actions-sheet"

export default function ListDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { lists, updateList, deleteList, addItemToList, removeItemFromList } = useLists()
  const { media, addMedia } = useMediaLibrary()
  const [list, setList] = useState(lists.find((l) => l.id === params.id))
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showReorganizeDialog, setShowReorganizeDialog] = useState(false)
  const [showActionsSheet, setShowActionsSheet] = useState(false)

  // Update local state when lists change
  useEffect(() => {
    const currentList = lists.find((l) => l.id === params.id)
    setList(currentList)
  }, [lists, params.id])

  if (!list) {
    return (
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
        <div className="min-h-screen bg-background">
          <div className="container py-6 md:py-10 px-4 md:px-6">
            <NavBar onAddMedia={addMedia} />
            <div className="text-center py-16">
              <h1 className="text-2xl font-bold mb-4">List not found</h1>
              <Button asChild>
                <Link href="/list">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Lists
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </ThemeProvider>
    )
  }

  const handleSaveEdit = (updates: Partial<typeof list>) => {
    updateList(list.id, updates)
    toast({
      title: "Success",
      description: "List updated successfully",
    })
  }

  const handleDelete = () => {
    deleteList(list.id)
    router.push("/list")
    toast({
      title: "Success",
      description: "List deleted successfully",
    })
  }

  const handleAddMedia = (selectedMedia) => {
    try {
      // Check if media already exists in the list
      const exists = list.items.some((item) => item.id === selectedMedia.id)
      if (exists) {
        toast({
          title: "Already in List",
          description: "This item is already in this list",
          variant: "destructive",
        })
        return
      }

      addItemToList(list.id, selectedMedia)
      toast({
        title: "Success",
        description: "Media added to list successfully",
      })
      // Don't close the dialog
    } catch (error) {
      console.error("Error adding media to list:", error)
      toast({
        title: "Error",
        description: "Failed to add media to list",
        variant: "destructive",
      })
    }
  }

  const handleUpdateItem = (id: string, updates: Partial<(typeof list.items)[0]>) => {
    const updatedItems = list.items.map((item) => (item.id === id ? { ...item, ...updates } : item))
    updateList(list.id, { items: updatedItems })
  }

  const handleSaveReorder = (reorderedItems) => {
    updateList(list.id, { items: reorderedItems })
    toast({
      title: "Success",
      description: "List order updated successfully",
    })
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <div className="min-h-screen bg-background">
        <div className="container py-6 md:py-10 px-4 md:px-6">
          <NavBar onAddMedia={addMedia} />

          <div className="mb-4">
            <Button asChild variant="ghost" size="sm">
              <Link href="/list">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Lists
              </Link>
            </Button>
          </div>

          <ListHeader list={list} onEdit={() => setShowActionsSheet(true)} onAddMedia={() => setShowAddDialog(true)} />

          <div className="flex justify-end mb-6">
            <Button onClick={() => setShowAddDialog(true)} className="shadow-md">
              <Plus className="w-4 h-4 mr-2" />
              Add Media
            </Button>
          </div>

          <ListContent
            list={list}
            libraryMedia={media}
            onUpdateItem={handleUpdateItem}
            onRemoveItem={(id) => removeItemFromList(list.id, id)}
            onAddMedia={() => setShowAddDialog(true)}
          />

          <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete List</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this list? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <ListAddMediaDialog
            isOpen={showAddDialog}
            onClose={() => setShowAddDialog(false)}
            onAddToList={handleAddMedia}
            libraryMedia={media}
          />

          <MediaReorganizer
            isOpen={showReorganizeDialog}
            onClose={() => setShowReorganizeDialog(false)}
            media={list.items}
            onSave={handleSaveReorder}
          />

          <ListActionsSheet
            isOpen={showActionsSheet}
            onClose={() => setShowActionsSheet(false)}
            list={list}
            onSave={handleSaveEdit}
            onDelete={() => setShowDeleteDialog(true)}
            onReorganize={() => setShowReorganizeDialog(true)}
          />
        </div>
      </div>
    </ThemeProvider>
  )
}
