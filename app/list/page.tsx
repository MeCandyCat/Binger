"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Plus, ListPlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CreateListDialog } from "@/components/lists/create-list-dialog"
import { ListCard } from "@/components/lists/list-card"
import { useLists } from "@/hooks/use-lists"
import { useMediaLibrary } from "@/hooks/use-media-library"
import { toast } from "@/components/ui/use-toast"
import { NavBar } from "@/components/nav-bar"
import { ThemeProvider } from "@/components/theme-provider"

export default function ListsPage() {
  const { lists, createList } = useLists()
  const { addMedia } = useMediaLibrary()
  const [showCreateDialog, setShowCreateDialog] = useState(false)

  const handleCreateList = (input) => {
    try {
      createList(input)
      toast({
        title: "Success",
        description: "List created successfully",
      })
    } catch (error) {
      console.error("Error creating list:", error)
      toast({
        title: "Error",
        description: "Failed to create list",
        variant: "destructive",
      })
    }
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <div className="min-h-screen bg-background">
        <div className="container py-10">
          <NavBar onAddMedia={addMedia} />

          <div className="flex justify-between items-center mb-8">
            <div className="space-y-1">
              <h2 className="text-2xl font-semibold">My Lists</h2>
              <p className="text-sm text-muted-foreground">Create and manage your custom media collections</p>
            </div>
            <Button onClick={() => setShowCreateDialog(true)}>
              <ListPlus className="w-4 h-4 mr-2" />
              Create List
            </Button>
          </div>

          {lists.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {lists.map((list, index) => (
                <ListCard key={list.id} list={list} index={index} />
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16 px-4 rounded-lg border-2 border-dashed"
            >
              <div className="max-w-md mx-auto space-y-4">
                <div className="p-4 rounded-full bg-primary/10 w-fit mx-auto">
                  <ListPlus className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Create Your First List</h3>
                <p className="text-muted-foreground">
                  Start organizing your media into custom collections. Create lists for genres, moods, or any theme you
                  like.
                </p>
                <Button onClick={() => setShowCreateDialog(true)} size="lg">
                  <Plus className="w-4 h-4 mr-2" />
                  Create List
                </Button>
              </div>
            </motion.div>
          )}

          <CreateListDialog
            isOpen={showCreateDialog}
            onClose={() => setShowCreateDialog(false)}
            onCreate={handleCreateList}
          />
        </div>
      </div>
    </ThemeProvider>
  )
}

