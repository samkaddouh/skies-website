"use client"
import { useLanguage } from "../../contexts/LanguageContext"
import { translations, type TranslationKey } from "../../utils/translations"
import QuoteForm from "../../components/QuoteForm"

export default function QuotePage() {
  const { language } = useLanguage()
  const t = (key: TranslationKey) => translations[language][key]

  return (
    <div className="container mx-auto px-4 py-8">
      <QuoteForm />
    </div>
  )
}

