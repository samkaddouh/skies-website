"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useLanguage } from "@/contexts/LanguageContext"
import { translations, type TranslationKey } from "@/utils/translations"
import { Menu, X } from 'lucide-react'

const Header: React.FC = () => {
  const { language, setLanguage } = useLanguage()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

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

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center">
            <Image
              src="/Skies_Logo.png"
              alt="Skies Shipping & Clearing"
              width={215}
              height={125}
              className="mr-2"
            />
          </Link>
          <nav className="hidden md:block">
            <ul className="flex space-x-6 items-center">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-gray-800 hover:text-primary-color transition-colors relative group"
                  >
                    {t(item.label as TranslationKey)}
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary-color scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="hidden md:flex items-center">
            <button
              onClick={toggleLanguage}
              className="bg-white text-primary-color border border-primary-color px-3 py-1 rounded hover:bg-gray-100 transition-colors"
            >
              {language === "en" ? "عربي" : "English"}
            </button>
          </div>
          <button className="md:hidden text-primary-color" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
      {mobileMenuOpen && (
        <div className="md:hidden">
          <nav className="bg-white px-4 pt-2 pb-4 shadow-lg">
            <ul className="space-y-2">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="block py-2 text-gray-800 hover:text-primary-color transition-colors relative group"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t(item.label as TranslationKey)}
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary-color scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-4">
              <button
                onClick={() => {
                  toggleLanguage()
                  setMobileMenuOpen(false)
                }}
                className="w-full bg-white text-primary-color border border-primary-color px-3 py-2 rounded hover:bg-gray-100 transition-colors"
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