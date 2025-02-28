"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useLanguage } from "@/contexts/LanguageContext"
import { translations, type TranslationKey } from "@/utils/translations"
import { Menu, X } from "lucide-react"

const Header: React.FC = () => {
  const { language, setLanguage, dir } = useLanguage()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const t = (key: TranslationKey) => translations[language][key]

  const navItems = [
    { href: "/", label: "home" },
    { href: "/about", label: "about" },
    { href: "/services", label: "services" },
    { href: "/quote", label: "getQuote" },
    { href: "/contact", label: "contact" },
  ]

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "ar" : "en")
  }

  if (!isMounted) {
    return null // or a loading placeholder
  }

  return (
    <header className="bg-white shadow-md md:shadow-none md:border-b border-gray-200 sticky md:static top-0 z-50">
      <div className="container mx-auto px-4 py-2">
        <div className={`flex justify-between items-center ${dir === "rtl" ? "flex-row-reverse" : ""}`}>
          <Link href="/" className="flex items-center">
            <Image
              src="/Skies_Logo.png"
              alt="Skies Shipping & Clearing"
              width={215}
              height={125}
              className={`${dir === "rtl" ? "ml-2" : "mr-2"} h-20 w-auto md:h-24`}
            />
          </Link>
          <nav className="hidden md:block">
            <ul className={`flex ${dir === "rtl" ? "space-x-reverse space-x-8" : "space-x-8"} items-center`}>
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-gray-800 hover:text-primary-color transition-colors relative group text-lg"
                  >
                    {t(item.label as TranslationKey)}
                    <span
                      className={`absolute bottom-0 ${dir === "rtl" ? "right-0" : "left-0"} w-full h-0.5 bg-primary-color scale-x-0 group-hover:scale-x-100 transition-transform ${dir === "rtl" ? "origin-right" : "origin-left"}`}
                    ></span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="hidden md:flex items-center">
            <button
              onClick={toggleLanguage}
              className="bg-primary-color text-white px-4 py-2 rounded hover:bg-primary-color/90 transition-colors"
            >
              {language === "en" ? "عربي" : "English"}
            </button>
          </div>
          <button className="md:hidden text-primary-color" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>
      {mobileMenuOpen && (
        <div className="md:hidden">
          <nav className="bg-white px-4 pt-2 pb-4 shadow-lg">
            <ul className="space-y-4">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`block py-2 text-gray-800 hover:text-primary-color transition-colors relative group ${dir === "rtl" ? "text-right" : "text-left"} text-lg`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t(item.label as TranslationKey)}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-6">
              <button
                onClick={() => {
                  toggleLanguage()
                  setMobileMenuOpen(false)
                }}
                className="w-full bg-primary-color text-white px-4 py-2 rounded hover:bg-primary-color/90 transition-colors"
              >
                {language === "en" ? "عربي" : "English"}
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}

export default Header

