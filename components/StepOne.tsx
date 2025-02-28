"use client"

import type React from "react"
import { useState } from "react"
import { FormField } from "./FormField"
import { StepOneProps } from "@/app/types/formState";

export function StepOne({ data, handleInputChange, t }: StepOneProps) {
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    phone: "",
    companyNameSupplier: "",
  })

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    let errorMessage = ""
    if (!value.trim()) {
      errorMessage = t("required")
    } else if (name === "email" && !/^[\w.%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)) {
      errorMessage = t("invalidEmail")
    } else if (name === "phone" && !/^\+?\d{7,15}$/.test(value)) {
      errorMessage = t("invalidPhone")
    }

    setErrors((prev) => ({ ...prev, [name]: errorMessage }))
  }

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
          onBlur={handleBlur}
          required
          error={errors.name}
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
          onBlur={handleBlur}
          required
          error={errors.email}
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
          onBlur={handleBlur}
          required
          error={errors.phone}
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
          onBlur={handleBlur}
          required
          error={errors.companyNameSupplier}
        />
      </div>
    </>
  )
}

