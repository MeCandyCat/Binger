"use client"

import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import type { List } from "@/types/list"
import Link from "next/link"
import { ListPoster } from "./list-poster"
import { cn } from "@/lib/utils"

interface ListCardProps {
  list: List
  index: number
}

export function ListCard({ list, index }: ListCardProps) {
  // Use a key based on the list ID to ensure the animation only happens on initial mount
  return (
    <Link href={`/list/${list.id}`} key={list.id}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
        // Add layout=false to prevent re-animation when navigating between lists
        layout={false}
        layoutId={`list-${list.id}`}
      >
        <Card
          className={cn(
            "group relative overflow-hidden border border-blue-500 transition-colors hover:border-primary rounded-xl cursor-pointer transition-all duration-300 hover:scale-95 hover:shadow-xl",
          )}
          style={{ borderColor: list.color }}
        >
          <div className="aspect-[2/3] relative">
            {list.poster && !list.poster.includes("placeholder.svg") ? (
              <img src={list.poster || "/placeholder.svg"} alt={list.name} className="object-cover w-full h-full" />
            ) : (
              <ListPoster
                title={list.name}
                color={list.color}
                itemCount={list.items.length}
                className="w-full h-full"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="font-semibold text-white text-lg mb-2">{list.name}</h3>
                <div className="mt-2 text-xs text-white/60">
                  {list.items.length} item{list.items.length !== 1 ? "s" : ""}
                </div>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
    </Link>
  )
}

