"use client"
import type React from "react"
import { useState } from "react"
import { useLanguage } from "@/contexts/LanguageContext"
import { translations, type TranslationKey } from "@/utils/translations"
import { sendEmail } from "@/actions/index"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { CheckCircle, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { z } from "zod"

const ContactFormSchema = z.object({
  name: z
    .string()
    .min(2, "nameTooShort")
    .refine((val) => !/\d/.test(val), "nameContainsNumbers"),
  email: z.string().email("invalidEmail"),
  phone: z
    .string()
    .min(8, "invalidPhone")
    .regex(/^\+?[0-9\s-]{8,}$/, "invalidPhone")
    .refine((val) => {
      // Must contain at least one number
      return /\d/.test(val)
    }, "invalidPhone"),
  company: z
    .string()
    .min(2, "companyTooShort")
    .refine((val) => !/\d/.test(val), "companyContainsNumbers")
    .optional(),
  message: z.string().min(10, "messageTooShort"),
})

type ContactFormData = z.infer<typeof ContactFormSchema>

interface FormState {
  errors: Partial<Record<keyof ContactFormData | "form", string>>
  touched: Partial<Record<keyof ContactFormData, boolean>>
  success: boolean
  isSubmitting: boolean
  data: ContactFormData
}

export default function ContactPage() {
  const { language } = useLanguage()
  const t = (key: TranslationKey) => translations[language][key]
  const [formState, setFormState] = useState<FormState>({
    errors: {},
    touched: {},
    success: false,
    isSubmitting: false,
    data: {
      name: "",
      email: "",
      phone: "",
      company: "",
      message: "",
    },
  })

  const validateField = (field: keyof ContactFormData, value: string | undefined) => {
    try {
      if (!value) {
        // Handle empty values based on field requirements
        if (field === "company") {
          return undefined // company is optional
        }
        throw new z.ZodError([
          {
            code: "custom",
            path: [field],
            message: field === "message" ? "messageTooShort" : "required",
          },
        ])
      }

      // For phone field - allow numbers, spaces, dashes, and plus sign at start
      if (field === "phone") {
        if (!/^\+?[0-9\s-]*$/.test(value)) {
          throw new z.ZodError([
            {
              code: "custom",
              path: [field],
              message: "invalidPhone",
            },
          ])
        }
      }

      // For name and company fields - prevent numbers
      if ((field === "name" || field === "company") && /\d/.test(value)) {
        throw new z.ZodError([
          {
            code: "custom",
            path: [field],
            message: field === "name" ? "nameContainsNumbers" : "companyContainsNumbers",
          },
        ])
      }

      ContactFormSchema.shape[field].parse(value)
      return undefined
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMessage = error.issues[0].message as TranslationKey
        return t(errorMessage)
      }
      return t("invalidInput")
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target

    // For phone field - only allow numbers, spaces, dashes, and plus at start
    if (name === "phone" && value !== "") {
      const sanitizedValue = value.replace(/[^\d\s-+]/g, "")
      // Only allow plus sign at the start
      if (sanitizedValue.indexOf("+") > 0) {
        return
      }
      setFormState((prev) => ({
        ...prev,
        data: {
          ...prev.data,
          [name]: sanitizedValue,
        },
      }))
      return
    }

    // For name and company fields - prevent numeric input
    if ((name === "name" || name === "company") && /\d/.test(value)) {
      return
    }

    setFormState((prev) => ({
      ...prev,
      data: {
        ...prev.data,
        [name]: value,
      },
    }))
  }

  const handleBlur = (field: keyof ContactFormData) => {
    const value = formState.data[field]
    const error = validateField(field, value)

    setFormState((prev) => ({
      ...prev,
      touched: { ...prev.touched, [field]: true },
      errors: {
        ...prev.errors,
        [field]: error,
      },
    }))
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setFormState((prev) => ({ ...prev, isSubmitting: true }))

    // Validate all fields
    const newErrors: Partial<Record<keyof ContactFormData, string>> = {}
    let hasErrors = false
    Object.keys(formState.data).forEach((key) => {
      const field = key as keyof ContactFormData
      const error = validateField(field, formState.data[field])
      if (error) {
        newErrors[field] = error
        hasErrors = true
      }
    })

    if (hasErrors) {
      setFormState((prev) => ({
        ...prev,
        errors: newErrors,
        touched: Object.keys(prev.data).reduce((acc, key) => ({ ...acc, [key]: true }), {}),
        isSubmitting: false,
      }))
      return
    }

    try {
      const result = await sendEmail(new FormData(event.currentTarget))

      if (result.error) {
        setFormState((prev) => ({
          ...prev,
          errors: { form: result.error },
          success: false,
          isSubmitting: false,
        }))
      } else {
        setFormState({
          errors: {},
          touched: {},
          success: true,
          isSubmitting: false,
          data: {
            name: "",
            email: "",
            phone: "",
            company: "",
            message: "",
          },
        })
      }
    } catch (error) {
      setFormState((prev) => ({
        ...prev,
        errors: { form: t("unexpectedError") },
        isSubmitting: false,
      }))
    }
  }

  const formFields = [
    { name: "name", label: t("name"), type: "text", required: true },
    { name: "email", label: t("email"), type: "email", required: true },
    { name: "phone", label: t("phone"), type: "tel", required: true },
    { name: "company", label: t("company"), type: "text", required: false },
  ]

  return (
    <div className="bg-white min-h-[calc(100vh-64px)]">
      <section className="bg-[#828282] text-white py-6 md:py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-3 animate-subtle-jump">{t("contactUs")}</h1>
          <p className="text-lg md:text-xl mb-4">{t("contactDescription")}</p>
        </div>
      </section>
      <div className="container mx-auto px-4 py-8 pb-16 md:pb-24">
        <Card className="w-full max-w-[95%] md:max-w-4xl mx-auto">
          <CardContent className="p-4 md:p-8 pt-6">
            {formState.errors.form && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{formState.errors.form}</AlertDescription>
              </Alert>
            )}
            {formState.success && (
              <Alert className="mb-6 bg-green-50 text-green-600 border-green-200">
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>{t("messageSent")}</AlertDescription>
              </Alert>
            )}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                {formFields.map((field) => (
                  <div key={field.name} className="flex flex-col space-y-2">
                    <Label htmlFor={field.name} className="text-sm font-medium">
                      {field.label}{" "}
                      {!field.required && <span className="text-gray-400 text-sm">({t("optional")})</span>}
                    </Label>
                    <div className="relative pb-6">
                      <Input
                        type={field.type}
                        id={field.name}
                        name={field.name}
                        value={formState.data[field.name as keyof ContactFormData]}
                        onChange={handleInputChange}
                        onBlur={() => handleBlur(field.name as keyof ContactFormData)}
                        className={`w-full text-base md:text-lg p-3 ${formState.touched[field.name as keyof ContactFormData] &&
                          formState.errors[field.name as keyof ContactFormData]
                          ? "border-red-500 focus:border-red-500"
                          : ""
                          }`}
                        required={field.required}
                        placeholder={`${t("enter")} ${field.label.toLowerCase()}`}
                      />
                      {formState.touched[field.name as keyof ContactFormData] &&
                        formState.errors[field.name as keyof ContactFormData] && (
                          <div className="absolute bottom-0 left-0 w-full">
                            <p className="text-red-500 text-sm flex items-center">
                              <AlertCircle className="w-3 h-3 mr-1 inline-block flex-shrink-0" />
                              {formState.errors[field.name as keyof ContactFormData]}
                            </p>
                          </div>
                        )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-2 mt-8">
                <Label htmlFor="message" className="text-sm font-medium">
                  {t("message")}
                </Label>
                <div className="relative pb-6">
                  <Textarea
                    id="message"
                    name="message"
                    value={formState.data.message}
                    onChange={handleInputChange}
                    onBlur={() => handleBlur("message")}
                    rows={6}
                    className={`w-full resize-none text-base md:text-lg p-3 ${formState.touched.message && formState.errors.message ? "border-red-500 focus:border-red-500" : ""
                      }`}
                    required
                    placeholder={t("messagePlaceholder")}
                  />
                  {formState.touched.message && formState.errors.message && (
                    <div className="absolute bottom-0 left-0 w-full">
                      <p className="text-red-500 text-sm flex items-center">
                        <AlertCircle className="w-3 h-3 mr-1 inline-block flex-shrink-0" />
                        {formState.errors.message}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-8">
                <Button
                  type="submit"
                  className="w-full sm:w-auto min-w-[200px] md:min-w-[250px] bg-[#0479c2] hover:bg-[#0479c2]/90 text-base md:text-lg py-6 md:py-7 text-white"
                  disabled={formState.isSubmitting}
                >
                  {formState.isSubmitting ? t("sending") : t("sendMessage")}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

