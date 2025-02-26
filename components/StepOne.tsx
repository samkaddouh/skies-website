"use client"

import type React from "react"
import { FormField } from "./FormField"
import type { TranslationKey } from "@/utils/translations"

interface StepOneProps {
  data: {
    name: string
    email: string
    phone: string
    companyNameSupplier: string
  }
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  t: (key: TranslationKey) => string
}

export function StepOne({ data, handleInputChange, t }: StepOneProps) {
  return (
    <>
      <h2 className="text-2xl font-bold mb-4">{t("basicInfo")}</h2>
      <div className="grid gap-4 md:grid-cols-2">
        <FormField
          label={
            <>
              {t("name")} <span className="text-red-500 ml-1">*</span>
            </>
          }
          name="name"
          value={data.name}
          onChange={handleInputChange}
          required
        />
        <FormField
          label={
            <>
              {t("email")} <span className="text-red-500 ml-1">*</span>
            </>
          }
          name="email"
          type="email"
          value={data.email}
          onChange={handleInputChange}
          required
        />
        <FormField
          label={
            <>
              {t("phone")} <span className="text-red-500 ml-1">*</span>
            </>
          }
          name="phone"
          type="tel"
          value={data.phone}
          onChange={handleInputChange}
          required
        />
        <FormField
          label={
            <>
              {t("companyNameSupplier")} <span className="text-red-500 ml-1">*</span>
            </>
          }
          name="companyNameSupplier"
          value={data.companyNameSupplier}
          onChange={handleInputChange}
          required
        />
      </div>
    </>
  )
}

