"use client"

import { useState, useEffect, FormEventHandler } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { TranslationKey } from "@/utils/translations"

type Unit = "cm" | "in" | "m" | "ft"

interface DimensionsInputProps {
    name?: string
    value: string
    onChange: (value: string, unit: Unit) => void
    t: (key: TranslationKey) => string
    language: "en" | "ar"
    hideLabel?: boolean,
    handleBlur: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void
}

export function DimensionsInput({ name, value, onChange, t, language, hideLabel = false, handleBlur }: DimensionsInputProps) {
    const [unit, setUnit] = useState<Unit>("cm")
    const [convertedDimensions, setConvertedDimensions] = useState<string>("")

    useEffect(() => {
        if (!value) {
            setConvertedDimensions("")
            return
        }

        const dimensions = value.split("x").map((dim) => dim.trim())
        if (dimensions.length !== 3) {
            setConvertedDimensions("")
            return
        }

        const convertedValues = dimensions.map((dim) => {
            const numValue = Number.parseFloat(dim)
            if (isNaN(numValue)) return ""

            let converted: number
            switch (unit) {
                case "cm":
                    converted = numValue / 2.54 // cm to inches
                    return converted.toFixed(2) + " in"
                case "in":
                    converted = numValue * 2.54 // inches to cm
                    return converted.toFixed(2) + " cm"
                case "m":
                    converted = numValue * 3.28084 // meters to feet
                    return converted.toFixed(2) + " ft"
                case "ft":
                    converted = numValue / 3.28084 // feet to meters
                    return converted.toFixed(2) + " m"
            }
        })

        if (convertedValues.some((v) => v === "")) {
            setConvertedDimensions("")
            return
        }

        const convertedString = convertedValues.join(" x ")
        const convertedUnit = unit === "cm" || unit === "in" ? (unit === "cm" ? "in" : "cm") : unit === "m" ? "ft" : "m"
        setConvertedDimensions(`(${convertedString})`)
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
                    <Label htmlFor="dimensions" className="mb-1.5 block">
                        {t("dimensions")}
                        <span className="text-red-500 ml-1">*</span>
                    </Label>

                )}
                <div className="relative">
                    <div className="flex items-center gap-2">
                        <Select value={unit} onValueChange={(value: Unit) => handleUnitChange(value)}>
                            <SelectTrigger className="w-[120px]">
                                <SelectValue placeholder={t("selectUnit")} />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="cm">{t("centimeters")}</SelectItem>
                                <SelectItem value="in">{t("inches")}</SelectItem>
                                <SelectItem value="m">{t("meters")}</SelectItem>
                                <SelectItem value="ft">{t("feet")}</SelectItem>
                            </SelectContent>
                        </Select>
                        <Input
                            name={name}
                            id="dimensions"
                            value={value}
                            onChange={(e) => onChange(e.target.value, unit)}
                            placeholder={t(`dimensionsPlaceholder${unit.toUpperCase()}` as TranslationKey)}
                            className="flex-grow placeholder:text-muted-foreground placeholder:italic"
                            onBlur={handleBlur}
                        />
                    </div>
                    {value && convertedDimensions && (
                        <span className="absolute right-0 -bottom-6 text-sm text-muted-foreground">{convertedDimensions}</span>
                    )}
                </div>
            </div>
        </div>
    )
}

