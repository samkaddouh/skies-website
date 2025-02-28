"use client"

import type React from "react"
import Link from "next/link"
import { useLanguage } from "@/contexts/LanguageContext"
import { translations, type TranslationKey } from "@/utils/translations"
import { Clock, MapPin, Phone, Printer, Mail } from "lucide-react"

const Footer: React.FC = () => {
  const { language } = useLanguage()
  const t = (key: TranslationKey) => translations[language][key]

  const links = [
    { id: "services", label: "services" },
    { id: "quote", label: "getQuote" },
    { id: "contact", label: "contact" },
  ]

  return (
    <footer className="bg-gradient-to-b from-gray-900 to-gray-800 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">{t("companyName")}</h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <MapPin className="mr-2 h-5 w-5 text-blue-400 flex-shrink-0 mt-1" />
                <span>
                  {t("footerAddress1")}
                  <br />
                  {t("footerAddress2")}
                </span>
              </li>
              <li className="flex items-center">
                <Phone className="mr-2 h-5 w-5 text-blue-400 flex-shrink-0" />
                <span>{t("footerTel1")}</span>
              </li>
              <li className="flex items-center">
                <Printer className="mr-2 h-5 w-5 text-blue-400 flex-shrink-0" />
                <span>{t("footerFax1")}</span>
              </li>
              <li className="flex items-center">
                <Mail className="mr-2 h-5 w-5 text-blue-400 flex-shrink-0" />
                <span>info@skieslb.com</span>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-4">{t("quickLinks")}</h3>
            <ul className="space-y-2">
              {links.map((link) => (
                <li key={link.id}>
                  <Link href={`/${link.id}`} className="hover:text-blue-400 transition-colors flex items-center">
                    <span className="mr-2">›</span>
                    {t(link.label as TranslationKey)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Opening Hours */}
          <div>
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <Clock className="mr-2 text-blue-400" size={24} />
              {t("openingHours")}
            </h3>
            <p className="mb-2">{t("workingHoursWeekdays")}</p>
            <p>{t("workingHoursSaturdaySunday")}</p>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-700 text-center">
          <p className="text-sm text-gray-400">{t("footerCopyright")}</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer

