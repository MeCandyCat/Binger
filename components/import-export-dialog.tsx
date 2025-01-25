import React, { useState } from "react"
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Media } from "@/types"

interface MediaImportExportDialogProps {
  isOpen: boolean
  onClose: () => void
  onImport: (mediaToImport: Media[]) => void
  media: Media[]
}

export function MediaImportExportDialog({ 
  isOpen, 
  onClose, 
  onImport, 
  media 
}: MediaImportExportDialogProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [importedMedia, setImportedMedia] = useState<Media[]>([])
  const [selectedMedia, setSelectedMedia] = useState<Set<string>>(new Set())

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      try {
        const text = await file.text()
        const parsedMedia: Media[] = JSON.parse(text)
        setImportedMedia(parsedMedia)
        setSelectedMedia(new Set(parsedMedia.map((item) => item.id)))
      } catch (error) {
        console.error("Error parsing import file:", error)
      }
    }
  }

  const toggleMediaSelection = (id: string) => {
    const newSelection = new Set(selectedMedia)
    if (newSelection.has(id)) {
      newSelection.delete(id)
    } else {
      newSelection.add(id)
    }
    setSelectedMedia(newSelection)
  }

  const handleImport = () => {
    const mediaToImport = importedMedia.filter((item) => selectedMedia.has(item.id))
    onImport(mediaToImport)
    onClose()
  }

  const exportMedia = () => {
    const dataStr = JSON.stringify(media)
    const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr)
    const exportFileDefaultName = "binger_media_export.json"

    const linkElement = document.createElement("a")
    linkElement.setAttribute("href", dataUri)
    linkElement.setAttribute("download", exportFileDefaultName)
    linkElement.click()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Media Import/Export</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="import" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="import">Import</TabsTrigger>
            <TabsTrigger value="export">Export</TabsTrigger>
          </TabsList>
          <TabsContent value="import">
            <div className="grid gap-4 py-4">
              <Button asChild>
                <label htmlFor="file-upload" className="cursor-pointer">
                  Select File
                  <input 
                    id="file-upload" 
                    type="file" 
                    className="hidden" 
                    accept=".json" 
                    onChange={handleFileChange} 
                  />
                </label>
              </Button>
              {selectedFile && (
                <p className="text-sm text-muted-foreground">
                  Selected file: {selectedFile.name}
                </p>
              )}
              {importedMedia.length > 0 && (
                <>
                  <p className="text-sm font-medium">Select media to import:</p>
                  <ScrollArea className="h-[200px] w-full rounded-md border p-4">
                    {importedMedia.map((item) => (
                      <div key={item.id} className="flex items-center space-x-2 mb-2">
                        <Checkbox
                          id={item.id}
                          checked={selectedMedia.has(item.id)}
                          onCheckedChange={() => toggleMediaSelection(item.id)}
                        />
                        <label
                          htmlFor={item.id}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {item.title}
                        </label>
                      </div>
                    ))}
                  </ScrollArea>
                  <Button onClick={handleImport}>
                    Import Selected ({selectedMedia.size})
                  </Button>
                </>
              )}
            </div>
          </TabsContent>
          <TabsContent value="export">
            <div className="grid gap-4 py-4 text-center">
              <p className="text-sm text-muted-foreground">
                Export your entire media collection as a JSON file
              </p>
              <Button onClick={exportMedia}>
                Export Media Collection
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}