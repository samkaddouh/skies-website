"use client"

import type React from "react"
import { useState, useRef, useCallback, useEffect } from "react"
import { cn } from "@/lib/utils"
import type { TranslationKey } from "@/utils/translations"

interface GaugeButtonProps {
  value: number
  onChange: (value: number) => void
  className?: string
  t: (key: TranslationKey) => string
  language: "en" | "ar"
  step?: number
}

export function GaugeButton({ value, onChange, className, t, language, step = 5 }: GaugeButtonProps) {
  const [localValue, setLocalValue] = useState(value)
  const [isDragging, setIsDragging] = useState(false)
  const gaugeRef = useRef<HTMLDivElement>(null)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const debouncedOnChange = useCallback(
    (newValue: number) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      timeoutRef.current = setTimeout(() => {
        onChange(newValue)
        timeoutRef.current = null
      }, 50)
    },
    [onChange],
  )

  useEffect(() => {
    setLocalValue(value)
  }, [value])

  const calculateNewValue = useCallback(
    (clientX: number) => {
      if (!gaugeRef.current) return localValue

      const rect = gaugeRef.current.getBoundingClientRect()
      const x = language === "ar" ? rect.right - clientX : clientX - rect.left
      const percentage = Math.round(((x / rect.width) * 100) / step) * step
      return Math.max(0, Math.min(100, percentage))
    },
    [language, step, localValue],
  )

  const updateValue = useCallback(
    (clientX: number) => {
      const newValue = calculateNewValue(clientX)
      setLocalValue(newValue)
      debouncedOnChange(newValue)
    },
    [calculateNewValue, debouncedOnChange],
  )

  // Mouse event handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    updateValue(e.clientX)
  }

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return
      updateValue(e.clientX)
    },
    [isDragging, updateValue],
  )

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  // Touch event handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault() // Prevent scrolling while dragging
    setIsDragging(true)
    updateValue(e.touches[0].clientX)
  }

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (!isDragging) return
      e.preventDefault() // Prevent scrolling while dragging
      updateValue(e.touches[0].clientX)
    },
    [isDragging, updateValue],
  )

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false)
  }, [])

  // Add event listeners
  useEffect(() => {
    if (isDragging) {
      // Mouse events
      window.addEventListener("mousemove", handleMouseMove)
      window.addEventListener("mouseup", handleMouseUp)
      // Touch events
      window.addEventListener("touchmove", handleTouchMove, { passive: false })
      window.addEventListener("touchend", handleTouchEnd)
      window.addEventListener("touchcancel", handleTouchEnd)

      return () => {
        // Cleanup
        window.removeEventListener("mousemove", handleMouseMove)
        window.removeEventListener("mouseup", handleMouseUp)
        window.removeEventListener("touchmove", handleTouchMove)
        window.removeEventListener("touchend", handleTouchEnd)
        window.removeEventListener("touchcancel", handleTouchEnd)
      }
    }
  }, [isDragging, handleMouseMove, handleMouseUp, handleTouchMove, handleTouchEnd])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    let newValue = localValue
    switch (e.key) {
      case "ArrowLeft":
        newValue = language === "ar" ? localValue + step : localValue - step
        break
      case "ArrowRight":
        newValue = language === "ar" ? localValue - step : localValue + step
        break
      case "Home":
        newValue = 0
        break
      case "End":
        newValue = 100
        break
      default:
        return
    }
    newValue = Math.max(0, Math.min(100, newValue))
    setLocalValue(newValue)
    onChange(newValue)
    e.preventDefault()
  }

  const isRTL = language === "ar"

  return (
    <div className={cn("space-y-2", className)} dir={isRTL ? "rtl" : "ltr"}>
      <div className="flex justify-between text-sm">
        <span>{t("containerCapacity")}</span>
        <span className="font-medium" dir={isRTL ? "rtl" : "ltr"}>
          {isRTL ? `${localValue}% ${t("full")}` : `${localValue}% ${t("full")}`}
        </span>
      </div>
      <div
        ref={gaugeRef}
        role="slider"
        tabIndex={0}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={localValue}
        aria-label={t("containerCapacity")}
        onKeyDown={handleKeyDown}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        className={cn(
          "relative h-8 rounded-full bg-[#f5f5f5] cursor-pointer select-none touch-none",
          isDragging && "cursor-grabbing",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        )}
      >
        <div
          className={cn(
            "absolute inset-y-0 bg-[#0479c2] rounded-full transition-all",
            isRTL ? "right-0" : "left-0",
            isDragging ? "duration-0" : "duration-200",
          )}
          style={{ width: `${localValue}%` }}
        />
        <div
          className={cn(
            "absolute top-1/2 -translate-y-1/2 size-6 rounded-full bg-white border-2 border-[#0479c2] shadow-sm transition-all",
            isDragging ? "scale-110 duration-0" : "duration-200",
          )}
          style={{
            [isRTL ? "right" : "left"]: `calc(${localValue}% - 12px)`,
          }}
        />
      </div>
      <div className={`flex justify-between text-xs text-muted-foreground ${isRTL ? "flex-row-reverse" : ""}`}>
        <span>{t("empty")}</span>
        <span>{t("full")}</span>
      </div>
    </div>
  )
}

