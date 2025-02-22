"use client"

import type React from "react"

import { useState, useRef } from "react"
import { useLanguage } from "@/contexts/LanguageContext"
import { translations, type TranslationKey } from "@/utils/translations"
import { sendQuote } from "@/app/actions"

interface QuoteFormProps {
    formType?: string
}

export default function QuoteForm({ formType }: QuoteFormProps) {
    const { language } = useLanguage()
    const t = (key: TranslationKey) => translations[language][key]
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const formData = new FormData(event.currentTarget)
        const result = await sendQuote(formData)

        if (result.error) {
            setError(result.error)
            setSuccess(false)
        } else {
            setError(null)
            setSuccess(true)
            event.currentTarget.reset()
            if (fileInputRef.current) {
                fileInputRef.current.value = ""
            }
        }
    }

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files
        if (files) {
            const invalidFiles = Array.from(files).filter(
                (file) => !["application/pdf", "image/jpeg", "image/png", "image/gif", "text/plain"].includes(file.type),
            )
            if (invalidFiles.length > 0) {
                setError("Invalid file type. Only PDF, JPG, PNG, GIF, and TXT files are allowed.")
                event.target.value = ""
            } else {
                setError(null)
            }
        }
    }

    const commonFields = [
        { name: "name", label: t("name"), type: "text" },
        { name: "email", label: t("email"), type: "email" },
        { name: "phone", label: t("phone"), type: "tel" },
        { name: "originAddress", label: t("originAddress"), type: "text" },
        { name: "destinationAddress", label: t("destinationAddress"), type: "text" },
    ]

    const serviceTypes = [
        "Air Freight",
        "Sea Freight",
        "Customs Clearance Only",
        "Insurance",
        "Door to Door",
        "Door to Port",
        "Port to Door",
        "Port to Port",
        "Other",
    ]

    return (
        <div className="bg-gray-100 p-6 rounded-lg shadow-md">
            {error && <p className="text-red-500 mb-4">{error}</p>}
            {success && <p className="text-green-500 mb-4">{t("quoteRequestSent")}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
                {commonFields.map((field) => (
                    <div key={field.name}>
                        <label htmlFor={field.name} className="block mb-1 font-medium">
                            {field.label}
                        </label>
                        <input
                            type={field.type}
                            id={field.name}
                            name={field.name}
                            className="w-full p-2 border rounded"
                            required={["name", "email", "phone"].includes(field.name)}
                        />
                    </div>
                ))}

                <div>
                    <label htmlFor="serviceType" className="block mb-1 font-medium">
                        {t("serviceType")}
                    </label>
                    <select id="serviceType" name="serviceType" className="w-full p-2 border rounded">
                        <option value="">{t("selectService")}</option>
                        {serviceTypes.map((service) => (
                            <option key={service} value={service}>
                                {service}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label htmlFor="description" className="block mb-1 font-medium">
                        {t("descriptionOfGoods")}
                    </label>
                    <textarea id="description" name="description" rows={3} className="w-full p-2 border rounded"></textarea>
                </div>

                <div>
                    <label htmlFor="value" className="block mb-1 font-medium">
                        {t("value")}
                    </label>
                    <input type="number" id="value" name="value" className="w-full p-2 border rounded" />
                </div>

                <div>
                    <label htmlFor="weight" className="block mb-1 font-medium">
                        {t("weight")}
                    </label>
                    <input type="text" id="weight" name="weight" className="w-full p-2 border rounded" />
                </div>

                <div>
                    <label htmlFor="dimensions" className="block mb-1 font-medium">
                        {t("dimensions")}
                    </label>
                    <input type="text" id="dimensions" name="dimensions" className="w-full p-2 border rounded" />
                </div>

                <div>
                    <label htmlFor="additionalInfo" className="block mb-1 font-medium">
                        {t("additionalInfo")}
                    </label>
                    <textarea id="additionalInfo" name="additionalInfo" rows={3} className="w-full p-2 border rounded"></textarea>
                </div>

                <div>
                    <label htmlFor="fileUpload" className="block mb-1 font-medium">
                        {t("attachFiles")}
                    </label>
                    <input
                        type="file"
                        id="fileUpload"
                        name="fileUpload"
                        ref={fileInputRef}
                        onChange={handleFileUpload}
                        accept=".pdf,.jpg,.jpeg,.png,.gif,.txt"
                        multiple
                        className="w-full p-2 border rounded"
                    />
                </div>

                <button
                    type="submit"
                    className="bg-[#0479c2] text-white px-4 py-2 rounded hover:bg-[#0479c2]/80 transition-colors"
                >
                    {t("sendMessage")}
                </button>
            </form>
        </div>
    )
}

