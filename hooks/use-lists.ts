"use client"

import { useState, useEffect } from "react"
import type { List, CreateListInput } from "@/types/list"
import type { Media } from "@/types"

const STORAGE_KEY = "binger-lists"

export function useLists() {
  const [lists, setLists] = useState<List[]>([])

  // Load lists from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        setLists(
          parsed.map((list: any) => ({
            ...list,
            createdAt: new Date(list.createdAt),
            updatedAt: new Date(list.updatedAt),
            items: list.items || [],
          })),
        )
      } catch (error) {
        console.error("Error loading lists:", error)
      }
    }
  }, [])

  // Save lists to localStorage
  const saveLists = (newLists: List[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newLists))
      setLists(newLists)
    } catch (error) {
      console.error("Error saving lists:", error)
    }
  }

  const createList = (input: CreateListInput) => {
    const newList: List = {
      ...input,
      id: Math.random().toString(36).substring(7),
      items: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    saveLists([...lists, newList])
    return newList
  }

  const updateList = (id: string, updates: Partial<List>) => {
    const updatedLists = lists.map((list) =>
      list.id === id
        ? {
            ...list,
            ...updates,
            updatedAt: new Date(),
          }
        : list,
    )
    saveLists(updatedLists)
  }

  const deleteList = (id: string) => {
    const filteredLists = lists.filter((list) => list.id !== id)
    saveLists(filteredLists)
  }

  const addItemToList = (listId: string, item: Media) => {
    const list = lists.find((l) => l.id === listId)
    if (!list) {
      console.error(`List with ID ${listId} not found`)
      return
    }

    // Check if item already exists in the list
    const itemExists = list.items.some((existingItem) => existingItem.id === item.id)
    if (itemExists) {
      console.log(`Item ${item.id} already exists in list ${listId}`)
      return
    }

    const updatedLists = lists.map((list) =>
      list.id === listId
        ? {
            ...list,
            items: [...list.items, item],
            updatedAt: new Date(),
          }
        : list,
    )
    saveLists(updatedLists)
  }

  const removeItemFromList = (listId: string, itemId: string) => {
    const updatedLists = lists.map((list) =>
      list.id === listId
        ? {
            ...list,
            items: list.items.filter((item) => item.id !== itemId),
            updatedAt: new Date(),
          }
        : list,
    )
    saveLists(updatedLists)
  }

  const reorderListItems = (listId: string, items: Media[]) => {
    const updatedLists = lists.map((list) =>
      list.id === listId
        ? {
            ...list,
            items,
            updatedAt: new Date(),
          }
        : list,
    )
    saveLists(updatedLists)
  }

  return {
    lists,
    createList,
    updateList,
    deleteList,
    addItemToList,
    removeItemFromList,
    reorderListItems,
  }
}

