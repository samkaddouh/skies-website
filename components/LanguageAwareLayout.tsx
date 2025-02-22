"use client"

import type React from "react"

import { useLanguage } from "@/contexts/LanguageContext"
import { useEffect } from "react"
import Header from "@/components/Header"
import Footer from "@/components/Footer"

export default function LanguageAwareLayout({ children }: { children: React.ReactNode }) {
  const { language, dir } = useLanguage()

  useEffect(() => {
    // Update html attributes on the client side
    document.documentElement.lang = language
    document.documentElement.dir = dir

    // Conditionally load Cairo font
    if (language === "ar" && !document.querySelector('link[href*="Cairo"]')) {
      const link = document.createElement("link")
      link.href = "https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;500;600;700&display=swap"
      link.rel = "stylesheet"
      document.head.appendChild(link)
    }
  }, [language, dir])

  return (
    <>
      <Header />
      <main className={language === "ar" ? "font-cairo" : ""}>{children}</main>
      <Footer />
    </>
  )
}

