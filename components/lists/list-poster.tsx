"use client"

import { useEffect, useRef } from "react"

interface ListPosterProps {
  title: string
  color: string
  itemCount?: number
  className?: string
  aspectRatio?: "portrait" | "landscape"
}

export function ListPoster({ title, color, itemCount, className = "", aspectRatio = "portrait" }: ListPosterProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height

    // Clear canvas
    ctx.clearRect(0, 0, width, height)

    // Create a more dynamic background
    drawBackground(ctx, width, height, color)

    // Add subtle grid pattern overlay
    drawGridPatternOverlay(ctx, width, height)

    // Add depth with layered gradients
    drawLayeredGradients(ctx, width, height, color)

    // Vignette Effect (improved)
    drawVignette(ctx, width, height)

    // Branding (BINGER)
    drawBranding(ctx)

    // List Title with improved typography
    drawTitle(ctx, title, width, height, aspectRatio)

    // Item Count with better styling
    if (itemCount !== undefined) {
      drawItemCount(ctx, itemCount, width, height)
    }

    // Bottom Gradient Overlay (more subtle)
    drawBottomOverlay(ctx, width, height)
  }, [title, color, itemCount, aspectRatio])

  const dimensions = aspectRatio === "portrait" ? { width: 300, height: 450 } : { width: 600, height: 338 }

  return (
    <canvas
      ref={canvasRef}
      width={dimensions.width}
      height={dimensions.height}
      className={`rounded-lg shadow-lg ${className}`}
      style={{ pointerEvents: "none", width: "100%", height: "100%", objectFit: "contain" }}
    />
  )
}

function drawBackground(ctx: CanvasRenderingContext2D, width: number, height: number, color: string) {
  // Parse the color to get its RGB components
  let r = 0,
    g = 0,
    b = 0

  // Simple color parsing from hex
  if (color.startsWith("#")) {
    const hex = color.slice(1)
    r = Number.parseInt(hex.slice(0, 2), 16)
    g = Number.parseInt(hex.slice(2, 4), 16)
    b = Number.parseInt(hex.slice(4, 6), 16)
  }

  // Create a diagonal gradient from original color to a slightly brighter variant
  const bgGradient = ctx.createLinearGradient(0, 0, width, height)
  bgGradient.addColorStop(0, color)

  // Create a slightly brighter/different color variant
  const brighterColor = `rgb(${Math.min(r * 1.3, 255)}, ${Math.min(g * 1.3, 255)}, ${Math.min(b * 1.3, 255)})`
  bgGradient.addColorStop(1, brighterColor)

  ctx.fillStyle = bgGradient
  ctx.fillRect(0, 0, width, height)
}

function drawGridPatternOverlay(ctx: CanvasRenderingContext2D, width: number, height: number) {
  ctx.save()
  ctx.globalAlpha = 0.1 // Low opacity for subtle effect

  // Rotate the context to create a diagonal grid
  ctx.translate(width / 2, height / 2)
  ctx.rotate(Math.PI / 4)
  ctx.translate(-width / 2, -height / 2)

  // Grid parameters
  const gridSize = 20
  ctx.strokeStyle = "rgba(255, 255, 255, 0.5)"
  ctx.lineWidth = 1

  // Draw vertical lines
  for (let x = 0; x < width; x += gridSize) {
    ctx.beginPath()
    ctx.moveTo(x, 0)
    ctx.lineTo(x, height)
    ctx.stroke()
  }

  // Draw horizontal lines
  for (let y = 0; y < height; y += gridSize) {
    ctx.beginPath()
    ctx.moveTo(0, y)
    ctx.lineTo(width, y)
    ctx.stroke()
  }

  ctx.restore()
}

function drawLayeredGradients(ctx: CanvasRenderingContext2D, width: number, height: number, color: string) {
  // Add a second gradient layer for depth
  ctx.save()
  ctx.globalAlpha = 0.3

  const secondGradient = ctx.createLinearGradient(width, 0, 0, height)
  secondGradient.addColorStop(0, "rgba(255, 255, 255, 0.1)")
  secondGradient.addColorStop(1, "rgba(0, 0, 0, 0.2)")

  ctx.fillStyle = secondGradient
  ctx.fillRect(0, 0, width, height)
  ctx.restore()
}

function drawVignette(ctx: CanvasRenderingContext2D, width: number, height: number) {
  // Create a more subtle and natural vignette
  const vignette = ctx.createRadialGradient(
    width / 2,
    height / 2,
    Math.min(width, height) * 0.4,
    width / 2,
    height / 2,
    Math.max(width, height) * 0.8,
  )

  vignette.addColorStop(0, "rgba(0, 0, 0, 0)")
  vignette.addColorStop(0.7, "rgba(0, 0, 0, 0.2)")
  vignette.addColorStop(1, "rgba(0, 0, 0, 0.5)")

  ctx.fillStyle = vignette
  ctx.fillRect(0, 0, width, height)
}

function drawDecorativeElements(ctx: CanvasRenderingContext2D, width: number, height: number, color: string) {
  // Parse color to RGB for accent elements
  let r = 0,
    g = 0,
    b = 0
  if (color.startsWith("#")) {
    const hex = color.slice(1)
    r = Number.parseInt(hex.slice(0, 2), 16)
    g = Number.parseInt(hex.slice(2, 4), 16)
    b = Number.parseInt(hex.slice(4, 6), 16)
  }

  // Add accent line
  ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, 0.8)`
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(20, 50)
  ctx.lineTo(20, height - 50)
  ctx.stroke()

  // Add some floating particles for visual interest
  ctx.save()
  const particleCount = 15
  for (let i = 0; i < particleCount; i++) {
    const x = Math.random() * width
    const y = Math.random() * height
    const size = Math.random() * 3 + 1
    const opacity = Math.random() * 0.4 + 0.1

    ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${opacity})`
    ctx.beginPath()
    ctx.arc(x, y, size, 0, Math.PI * 2)
    ctx.fill()
  }
  ctx.restore()
}

function drawBranding(ctx: CanvasRenderingContext2D) {
  // Enhanced BINGER branding with shadow
  ctx.save()
  ctx.shadowColor = "rgba(0, 0, 0, 0.5)"
  ctx.shadowBlur = 10
  ctx.shadowOffsetX = 2
  ctx.shadowOffsetY = 2

  ctx.font = "bold 20px 'Poppins', sans-serif"
  ctx.fillStyle = "rgba(255, 255, 255, 0.95)"
  ctx.textBaseline = "top"
  ctx.fillText("BINGER", 30, 20)

  ctx.restore()
}

function drawTitle(ctx: CanvasRenderingContext2D, title: string, width: number, height: number, aspectRatio: string) {
  const maxTitleWidth = width * 0.85
  const titleFontSize =
    aspectRatio === "portrait"
      ? Math.min(36, 400 / Math.sqrt(title.length))
      : Math.min(42, 600 / Math.sqrt(title.length))

  // Add text shadow for better readability
  ctx.save()
  ctx.shadowColor = "rgba(0, 0, 0, 0.7)"
  ctx.shadowBlur = 15
  ctx.shadowOffsetX = 2
  ctx.shadowOffsetY = 2

  ctx.font = `bold ${titleFontSize}px 'Poppins', sans-serif`
  ctx.fillStyle = "white"
  ctx.textAlign = "center"
  ctx.textBaseline = "middle"

  const lines = []
  let currentLine = ""
  const words = title.split(" ")

  for (const word of words) {
    const testLine = currentLine + (currentLine ? " " : "") + word
    if (ctx.measureText(testLine).width > maxTitleWidth) {
      lines.push(currentLine)
      currentLine = word
    } else {
      currentLine = testLine
    }
  }
  if (currentLine) lines.push(currentLine)

  const lineHeight = titleFontSize * 1.2
  let textY = height / 2 - (lines.length * lineHeight) / 2

  for (const line of lines) {
    ctx.fillText(line, width / 2, textY)
    textY += lineHeight
  }

  ctx.restore()
}

function drawItemCount(ctx: CanvasRenderingContext2D, itemCount: number, width: number, height: number) {
  ctx.save()

  // Draw pill background for item count - BIGGER VERSION
  const text = `${itemCount} item${itemCount !== 1 ? "s" : ""}`

  // Increase font size
  ctx.font = "bold 16px 'Poppins', sans-serif"
  const textWidth = ctx.measureText(text).width

  // Make pill bigger
  const pillWidth = textWidth + 32
  const pillHeight = 34
  const pillX = width / 2 - pillWidth / 2
  const pillY = height - 50

  // Draw pill background with more contrast
  ctx.fillStyle = "rgba(0, 0, 0, 0.7)"
  ctx.beginPath()
  ctx.roundRect(pillX, pillY, pillWidth, pillHeight, 17)
  ctx.fill()

  // Add a subtle border
  ctx.strokeStyle = "rgba(255, 255, 255, 0.3)"
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.roundRect(pillX, pillY, pillWidth, pillHeight, 17)
  ctx.stroke()

  // Draw item count text with larger font
  ctx.font = "bold 16px 'Poppins', sans-serif"
  ctx.fillStyle = "rgba(255, 255, 255, 0.95)"
  ctx.textAlign = "center"
  ctx.textBaseline = "middle"
  ctx.fillText(text, width / 2, pillY + pillHeight / 2)

  ctx.restore()
}

function drawBottomOverlay(ctx: CanvasRenderingContext2D, width: number, height: number) {
  const bottomOverlay = ctx.createLinearGradient(0, height - 100, 0, height)
  bottomOverlay.addColorStop(0, "rgba(0, 0, 0, 0)")
  bottomOverlay.addColorStop(0.6, "rgba(0, 0, 0, 0.4)")
  bottomOverlay.addColorStop(1, "rgba(0, 0, 0, 0.7)")

  ctx.fillStyle = bottomOverlay
  ctx.fillRect(0, height - 100, width, 100)
}
