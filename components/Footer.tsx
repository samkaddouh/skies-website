"use client"

import type React from "react"
import Link from "next/link"
import { useLanguage } from "@/contexts/LanguageContext"
import { translations, type TranslationKey } from "@/utils/translations"

const Footer: React.FC = () => {
  const { language } = useLanguage()
  const t = (key: TranslationKey) => translations[language][key]

  const links = [
    { id: "services", label: "services" },
    { id: "quote", label: "getQuote" },
    { id: "contact", label: "contact" }
  ]

  return (
    <footer className="bg-gray-600/80 text-white py-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Company Info */}
          <div>
            <h3 className="text-lg font-semibold mb-2">{t("companyName")}</h3>
            <p className="text-sm">{t("footerAddress1")}</p>
            <p className="text-sm">{t("footerAddress2")}</p>
            <p className="text-sm">{t("footerTel")}: +961 1 456 000</p>
            <p className="text-sm">{t("footerFax")}: +961 1 456 002</p>
            <p className="text-sm">{t("footerEmail")}: info@skieslb.com</p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-2">{t("quickLinks")}</h3>
            <ul className="flex flex-col space-y-1">
              {links.map((link) => (
                <li key={link.id}>
                  <Link 
                    href={`/${link.id}`}
                    className="text-sm hover:text-gray-300 transition-colors"
                  >
                    {t(link.label as TranslationKey)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-4 pt-2 border-t border-gray-500/30 text-center">
          <p className="text-sm">{t("footerCopyright")}</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer