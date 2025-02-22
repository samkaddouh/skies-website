"use client"

import { useLanguage } from "../../contexts/LanguageContext"
import { translations, type TranslationKey } from "../../utils/translations"
import QuoteForm from "../../components/QuoteForm"

export default function QuotePage() {
  const { language } = useLanguage()
  const t = (key: TranslationKey) => translations[language][key]

  return (
    <div className="bg-white">
      <section className="bg-[#828282] text-white py-6 md:py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-3 animate-subtle-jump">{t("getQuoteTitle")}</h1>
          <p className="text-lg md:text-xl mb-4">{t("getQuoteDescription")}</p>
        </div>
      </section>
      <div className="container mx-auto px-4 py-8">
        <QuoteForm />
      </div>
    </div>
  )
}

