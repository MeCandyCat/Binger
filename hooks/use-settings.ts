"use client"

import { useState, useEffect } from "react"
import { getStoredSettings, storeSettings, DEFAULT_SETTINGS } from "@/lib/settings"
import type { Settings } from "@/types"

export function useSettings() {
  // Initialize with default settings to avoid hydration mismatch
  // We'll load from localStorage in useEffect (client-side only)
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS)
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    // Only read from localStorage on the client after mount
    const storedSettings = getStoredSettings()
    setSettings(storedSettings)
    setIsHydrated(true)
  }, [])

  const updateSettings = (newSettings: Settings) => {
    setSettings(newSettings)
    storeSettings(newSettings)
  }

  return {
    settings,
    updateSettings,
    isHydrated,
  }
}
