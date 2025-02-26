"use client"

import type React from "react"
import type { TranslationKey } from "@/utils/translations"
import { useLanguage } from "@/contexts/LanguageContext"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { DimensionsInput } from "./DimensionsInput"
import { WeightInput } from "./WeightInput"

interface CargoDetailsProps {
  data: {
    cargoGaugeType?: "in" | "out"
    containerCapacity?: number
    cargoDimensions?: string
    dimensionsUnit?: "cm" | "in" | "m" | "ft"
    weightValue?: string
    weightUnit?: "kg" | "lb" | "ton"
    temperature?: string
    packages?: string
    originAddress?: string
    destinationAddress?: string
  }
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  onDimensionsChange?: (value: string, unit: "cm" | "in" | "m" | "ft") => void
  onWeightChange?: (value: string, unit: "kg" | "lb" | "ton") => void
  t: (key: TranslationKey) => string
}

export function CargoDetails({ data, handleInputChange, onDimensionsChange, onWeightChange, t }: CargoDetailsProps) {
  const { language } = useLanguage()

  const handlePackagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleInputChange(e)
  }

  const handleDimensionsChange = (value: string, unit: "cm" | "in" | "m" | "ft") => {
    if (onDimensionsChange) {
      onDimensionsChange(value, unit)
    }
  }

  const handleWeightChange = (value: string, unit: "kg" | "lb" | "ton") => {
    if (onWeightChange) {
      onWeightChange(value, unit)
    }
  }

  return (
    <>
      <h2 className="text-2xl font-bold mb-4">{t("cargoDetails")}</h2>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label className="text-base font-medium">
            {t("weight")} <span className="text-red-500">*</span>
          </Label>
          <WeightInput
            value={data.weightValue || ""}
            onChange={handleWeightChange}
            t={t}
            language={language}
            hideLabel
          />
        </div>

        <div className="space-y-2">
          <Label className="text-base font-medium">
            {t("dimensions")} <span className="text-red-500">*</span>
          </Label>
          <DimensionsInput
            value={data.cargoDimensions || ""}
            onChange={handleDimensionsChange}
            t={t}
            language={language}
            hideLabel
          />
        </div>

        <div className="space-y-2">
          <Label className="text-base font-medium">
            {t("originAddress")} <span className="text-red-500">*</span>
          </Label>
          <Input
            placeholder={t("destinationAddressPlaceholder")}
            name="originAddress"
            value={data.originAddress || ""}
            onChange={handleInputChange}
            required
            className="placeholder:text-muted-foreground placeholder:italic"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-base font-medium">
            {t("destinationAddress")} <span className="text-red-500">*</span>
          </Label>
          <Input
            placeholder={t("destinationAddressPlaceholder")}
            name="destinationAddress"
            value={data.destinationAddress || ""}
            onChange={handleInputChange}
            required
            className="placeholder:text-muted-foreground placeholder:italic"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-base font-medium">
            {t("numberOfPackages")} <span className="text-red-500">*</span>
          </Label>
          <Input
            id="packages"
            name="packages"
            value={data.packages || ""}
            onChange={handlePackagesChange}
            placeholder={t("packagesPlaceholder")}
            className="placeholder:text-muted-foreground placeholder:italic"
            required
          />
          <p className="text-sm text-muted-foreground">{t("packagesHelp")}</p>
        </div>
      </div>
    </>
  )
}

