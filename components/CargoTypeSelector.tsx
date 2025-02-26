"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import type { TranslationKey } from "@/utils/translations"

type CargoType = "general" | "hazardous"

interface CargoTypeSelectorProps {
  value: CargoType | undefined
  onChange: (value: CargoType) => void
  t: (key: TranslationKey) => string
}

export function CargoTypeSelector({ value, onChange, t }: CargoTypeSelectorProps) {
  return (
    <div className="space-y-3">
      <Label className="text-base font-medium">
        {t("cargoType")} <span className="text-red-500">*</span>
      </Label>
      <Select value={value} onValueChange={(value) => onChange(value as CargoType)}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder={<span className="italic text-muted-foreground">{t("selectCargoType")}</span>} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="general">{t("isGeneralCargo")}</SelectItem>
          <SelectItem value="hazardous">{t("isHazardousCargo")}</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}

