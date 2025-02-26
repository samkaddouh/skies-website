"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { TranslationKey } from "@/utils/translations"

type Unit = "kg" | "lb" | "ton"

interface WeightInputProps {
  value: string
  onChange: (value: string, unit: Unit) => void
  t: (key: TranslationKey) => string
  language: "en" | "ar"
  hideLabel?: boolean
}

export function WeightInput({ value, onChange, t, language, hideLabel = false }: WeightInputProps) {
  const [unit, setUnit] = useState<Unit>("kg")
  const [convertedWeight, setConvertedWeight] = useState<string>("")

  useEffect(() => {
    if (!value || unit === "ton") {
      setConvertedWeight("")
      return
    }

    const numValue = Number.parseFloat(value)
    if (isNaN(numValue)) {
      setConvertedWeight("")
      return
    }

    let converted: number
    let convertedUnit: string
    if (unit === "kg") {
      // Convert kg to lb
      converted = numValue * 2.20462
      convertedUnit = "lb"
    } else {
      // Convert lb to kg
      converted = numValue / 2.20462
      convertedUnit = "kg"
    }

    setConvertedWeight(`(${converted.toFixed(2)} ${convertedUnit})`)
  }, [value, unit])

  const handleUnitChange = (newUnit: Unit) => {
    setUnit(newUnit)
    // Reset the value when changing units
    onChange("", newUnit)
  }

  const isRTL = language === "ar"

  return (
    <div className="space-y-4" dir={isRTL ? "rtl" : "ltr"}>
      <div className="flex-1">
        {!hideLabel && (
          <Label htmlFor="weight" className="mb-1.5 block">
            {t("weight")}
          </Label>
        )}
        <div className="relative">
          <div className="flex items-center gap-2">
            <Select value={unit} onValueChange={(value: Unit) => handleUnitChange(value)}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder={t("selectUnit")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="kg">{t("kilograms")}</SelectItem>
                <SelectItem value="lb">{t("pounds")}</SelectItem>
                <SelectItem value="ton">{t("tons")}</SelectItem>
              </SelectContent>
            </Select>
            <Input
              id="weight"
              type="number"
              value={value}
              onChange={(e) => onChange(e.target.value, unit)}
              placeholder={t(`weightPlaceholder${unit.toUpperCase()}` as TranslationKey)}
              className="flex-grow placeholder:text-muted-foreground placeholder:italic"
            />
          </div>
          {value && convertedWeight && (
            <span className="absolute right-0 -bottom-6 text-sm text-muted-foreground">{convertedWeight}</span>
          )}
        </div>
      </div>
    </div>
  )
}

