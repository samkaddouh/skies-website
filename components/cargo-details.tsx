"use client"

import type React from "react"
import type { TranslationKey } from "@/utils/translations"
import { useLanguage } from "@/contexts/LanguageContext"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { DimensionsInput } from "./DimensionsInput"
import { WeightInput } from "./WeightInput"
import { useState } from "react"
import { BaseQuoteSchema } from "@/app/quote/schema"

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

export function CargoDetails({
  data,
  handleInputChange,
  onDimensionsChange,
  onWeightChange,
  t,
}: CargoDetailsProps) {
  const { language } = useLanguage()
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    console.log("hellloooo");
    console.log("Handling blur for field:", name, "with value:", value)

    const result = BaseQuoteSchema.safeParse({ [name]: value })
    console.log("Validation result:", result)

    if (!result.success) {
      const error = result?.error?.errors.filter((a) => a.path[0] === name)
      if (error && error.length > 0) {
        const message = error[0].message as string
        console.log("Error message:", message)
        setErrors((prev) => ({ ...prev, [name]: t(message as string) }))
      } else {
        setErrors((prev) => ({ ...prev, [name]: "" }))
      }
    } else {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
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
            onChange={(value, unit) => onWeightChange?.(value, unit)}
            t={t}
            language={language}
            hideLabel
            name="weightValue"
            handleBlur={handleBlur}
          />
          {errors.weightValue && <p className="text-red-500 text-sm">{errors.weightValue}</p>}
        </div>

        <div className="space-y-2">
          <Label className="text-base font-medium">
            {t("dimensions")} <span className="text-red-500">*</span>
          </Label>
          <DimensionsInput
            name="cargoDimensions"
            value={data.cargoDimensions || ""}
            onChange={onDimensionsChange ?? (() => { })}
            t={t}
            language={language}
            hideLabel
            handleBlur={handleBlur}
          />
          {errors.cargoDimensions && <p className="text-red-500 text-sm">{errors.cargoDimensions}</p>}
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
            onBlur={handleBlur}
            className="placeholder:text-muted-foreground placeholder:italic"
          />
          {errors.originAddress && <p className="text-red-500 text-sm">{errors.originAddress}</p>}
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
            onBlur={handleBlur}
            className="placeholder:text-muted-foreground placeholder:italic"
          />
          {errors.destinationAddress && <p className="text-red-500 text-sm">{errors.destinationAddress}</p>}
        </div>

        <div className="space-y-2">
          <Label className="text-base font-medium">
            {t("numberOfPackages")} <span className="text-red-500">*</span>
          </Label>
          <Input
            id="packages"
            name="packages"
            value={data.packages || ""}
            onChange={handleInputChange}
            placeholder={t("packagesPlaceholder")}
            className="placeholder:text-muted-foreground placeholder:italic"
            required
            onBlur={handleBlur}
          />
          {errors.packages && <p className="text-red-500 text-sm">{errors.packages}</p>}
          <p className="text-sm text-muted-foreground">{t("packagesHelp")}</p>
        </div>
      </div>
    </>
  )
}
