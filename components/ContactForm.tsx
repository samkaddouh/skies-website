"use client"

import type React from "react"

import { useState } from "react"
import { useLanguage } from "@/contexts/LanguageContext"
import { translations, type TranslationKey } from "@/utils/translations"
import { sendEmail } from "@/app/actions"

export default function ContactForm() {
    const { language } = useLanguage()
    const t = (key: TranslationKey) => translations[language][key]
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const formData = new FormData(event.currentTarget)
        const result = await sendEmail(formData)

        if (result.error) {
            setError(result.error)
            setSuccess(false)
        } else {
            setError(null)
            setSuccess(true)
            event.currentTarget.reset()
        }
    }

    const formFields = [
        { name: "name", label: t("name"), type: "text" },
        { name: "email", label: t("email"), type: "email" },
        { name: "phone", label: t("phone"), type: "tel" },
    ]

    return (
        <div className="bg-gray-100 p-6 rounded-lg shadow-md">
            <h2 className="text-3xl font-bold mb-6">{t("contactUs")}</h2>
            <p className="mb-4">{t("contactDescription")}</p>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            {success && <p className="text-green-500 mb-4">{t("messageSent")}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
                {formFields.map((field) => (
                    <div key={field.name}>
                        <label htmlFor={field.name} className="block mb-1 font-medium">
                            {field.label}
                        </label>
                        <input type={field.type} id={field.name} name={field.name} className="w-full p-2 border rounded" required />
                    </div>
                ))}

                <div>
                    <label htmlFor="message" className="block mb-1 font-medium">
                        {t("message")}
                    </label>
                    <textarea id="message" name="message" rows={5} className="w-full p-2 border rounded" required></textarea>
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

