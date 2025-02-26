"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { TranslationKey } from "@/utils/translations"

interface TemperatureInputProps {
  value: string
  onChange: (value: string, unit: "C" | "F") => void
  t: (key: TranslationKey) => string
  language: "en" | "ar"
}

export function TemperatureInput({ value, onChange, t, language }: TemperatureInputProps) {
  const [unit, setUnit] = useState<"C" | "F">("C")
  const [convertedTemp, setConvertedTemp] = useState<string>("")

  useEffect(() => {
    if (!value) {
      setConvertedTemp("")
      return
    }

    const numValue = Number.parseFloat(value)
    if (isNaN(numValue)) {
      setConvertedTemp("")
      return
    }

    if (unit === "C") {
      // Convert Celsius to Fahrenheit
      const fahrenheit = (numValue * 9) / 5 + 32
      setConvertedTemp(`(${fahrenheit.toFixed(1)}°F)`)
    } else {
      // Convert Fahrenheit to Celsius
      const celsius = ((numValue - 32) * 5) / 9
      setConvertedTemp(`(${celsius.toFixed(1)}°C)`)
    }
  }, [value, unit])

  const toggleUnit = (newUnit: "C" | "F") => {
    if (newUnit === unit) return

    setUnit(newUnit)
    if (value) {
      const numValue = Number.parseFloat(value)
      if (!isNaN(numValue)) {
        const convertedValue =
          newUnit === "F" ? ((numValue * 9) / 5 + 32).toFixed(1) : (((numValue - 32) * 5) / 9).toFixed(1)
        onChange(convertedValue, newUnit)
      }
    }
  }

  const isRTL = language === "ar"

  return (
    <div className="space-y-4" dir={isRTL ? "rtl" : "ltr"}>
      <div className="flex-1">
        <Label htmlFor="temperature" className="mb-1.5 block">
          {t("temperature")} <span className="text-red-500">*</span>
        </Label>

        <div className="relative">
          <div className="relative flex items-center">
            <Input
              id="temperature"
              type="number"
              value={value}
              onChange={(e) => onChange(e.target.value, unit)}
              placeholder={t("enterTemperature")}
              className="pr-24"
            />
            <div className="absolute right-2 inset-y-0 flex items-center gap-2">
              <button
                type="button"
                onClick={() => toggleUnit("C")}
                className={`px-2 py-1 rounded text-sm transition-colors ${unit === "C" ? "bg-[#0479c2] text-white" : "hover:bg-gray-100"
                  }`}
              >
                °C
              </button>
              <button
                type="button"
                onClick={() => toggleUnit("F")}
                className={`px-2 py-1 rounded text-sm transition-colors ${unit === "F" ? "bg-[#0479c2] text-white" : "hover:bg-gray-100"
                  }`}
              >
                °F
              </button>
            </div>
          </div>
          {value && convertedTemp && (
            <span className="absolute right-0 -bottom-6 text-sm text-muted-foreground">{convertedTemp}</span>
          )}
        </div>
      </div>
    </div>
  )
}

