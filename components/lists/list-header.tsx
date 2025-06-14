"use client"

import { Edit } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { List } from "@/types/list"
import { formatDistanceToNow } from "date-fns"
import { motion } from "framer-motion"

interface ListHeaderProps {
  list: List
  onEdit: () => void
  onAddMedia: () => void
}

export function ListHeader({ list, onEdit, onAddMedia }: ListHeaderProps) {
  const hasPoster = list.poster && !list.poster.includes("placeholder.svg")
  const formattedDate = formatDistanceToNow(new Date(list.updatedAt || list.createdAt), { addSuffix: true })

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative overflow-hidden rounded-xl mb-8 shadow-lg"
    >
      {/* Background with blur effect */}
      <div className="absolute inset-0 overflow-hidden">
        {hasPoster ? (
          <img src={list.poster || "/placeholder.svg"} alt="" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full" style={{ backgroundColor: list.color || "#1e293b" }}></div>
        )}
        <div className="absolute inset-0 backdrop-blur-xl bg-gradient-to-t from-black/80 via-black/60 to-black/40" />
      </div>

      {/* Content */}
      <div className="relative z-10 p-6 md:p-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-2">
            <h1 className="text-2xl md:text-3xl font-bold text-white">{list.name}</h1>
            {list.description && <p className="text-white/80 max-w-2xl">{list.description}</p>}

            <div className="flex flex-wrap gap-2 mt-2">
              <Badge variant="secondary" className="bg-white/20 hover:bg-white/30 text-white">
                {list.items.length} item{list.items.length !== 1 ? "s" : ""}
              </Badge>
              <Badge variant="secondary" className="bg-white/20 hover:bg-white/30 text-white">
                Updated {formattedDate}
              </Badge>
            </div>
          </div>

          <Button
            onClick={onEdit}
            variant="outline"
            className="bg-white/10 hover:bg-white/20 text-white border-white/20"
          >
            <Edit className="w-4 h-4 mr-2" />
            Manage List
          </Button>
        </div>
      </div>
    </motion.div>
  )
}
