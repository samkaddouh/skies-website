import type React from "react"
import type { Metadata } from "next"
import { Roboto_Flex } from 'next/font/google'
import "./globals.css"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { LanguageProvider } from "@/contexts/LanguageContext"
import ClientWrapper from '../components/ClientWrapper'

const robotoFlex = Roboto_Flex({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-roboto-flex",
  weight: "300"
})

export const metadata: Metadata = {
  title: "Skies Shipping & Clearing",
  description: "International Shipping and Customs Clearance Services",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={robotoFlex.variable}>
      <body className={`${robotoFlex.className} antialiased`}>
        <ClientWrapper>
          <LanguageProvider>
            <Header />
            <main>{children}</main>
            <Footer />
          </LanguageProvider>
        </ClientWrapper>
      </body>
    </html>
  )
}