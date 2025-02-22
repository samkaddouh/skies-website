import type React from "react"
import type { Metadata } from "next"
import { Roboto_Flex } from "next/font/google"
import "./globals.css"
import { LanguageProvider } from "@/contexts/LanguageContext"
import ClientWrapper from "../components/ClientWrapper"
import LanguageAwareLayout from "../components/LanguageAwareLayout"

const robotoFlex = Roboto_Flex({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-roboto-flex",
  weight: "300",
})

export const metadata: Metadata = {
  title: "Skies Shipping & Clearing",
  description: "International Shipping and Customs Clearance Services",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html className={robotoFlex.variable}>
      <body className={`${robotoFlex.className} antialiased`}>
        <ClientWrapper>
          <LanguageProvider>
            <LanguageAwareLayout>{children}</LanguageAwareLayout>
          </LanguageProvider>
        </ClientWrapper>
      </body>
    </html>
  )
}

