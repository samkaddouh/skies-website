"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import type { TranslationKey } from "@/utils/translations"

export const shippingTerms = ["EXW", "FOB"] as const

export type ShippingTerm = (typeof shippingTerms)[number]

interface ShippingTermsSelectorProps {
  value: ShippingTerm | undefined
  onChange: (value: ShippingTerm) => void
  t: (key: TranslationKey) => string
}

export function ShippingTermsSelector({ value, onChange, t }: ShippingTermsSelectorProps) {
  return (
    <div className="space-y-3">
      <Label className="text-base font-medium">
        {t("shippingTerms")} <span className="text-red-500">*</span>
      </Label>
      <Select value={value} onValueChange={(value) => onChange(value as ShippingTerm)}>
        <SelectTrigger className="w-full">
          <SelectValue
            placeholder={
              <span className="text-muted-foreground italic">
                {t("selectShippingTerm")}
              </span>
            }
          />
        </SelectTrigger>
        <SelectContent>
          {shippingTerms.map((term) => (
            <SelectItem key={term} value={term}>
              {term} - {t(`shippingTerm${term}`)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

