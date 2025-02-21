"use client"
import { useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { useLanguage } from "@/contexts/LanguageContext"
import { translations, type TranslationKey } from "@/utils/translations"
import { Ship, ArrowLeftRight, Plane, Globe, Shield, FileCheck, Warehouse, Truck } from 'lucide-react'

export default function ServicesPage() {
  const { language } = useLanguage()
  const searchParams = useSearchParams()
  const t = (key: TranslationKey) => translations[language][key]

  useEffect(() => {
    const section = searchParams.get("section")
    if (section) {
      const element = document.getElementById(section)
      if (element) {
        element.scrollIntoView({ behavior: "smooth" })
      }
    }
  }, [searchParams])

  const services = [
    {
      id: "sea-freight",
      icon: Ship,
      title: t("seaFreight"),
      description: t("seaFreightDescription"),
      longDescription: t("seaFreightLong")
    },
    {
      id: "freight-forwarding",
      icon: ArrowLeftRight,
      title: t("freightForwarding"),
      description: t("freightForwardingDescription"),
      longDescription: t("freightForwardingLong")
    },
    {
      id: "air-freight",
      icon: Plane,
      title: t("airFreight"),
      description: t("airFreightDescription"),
      longDescription: t("airFreightLong")
    },
    {
      id: "international-shipping",
      icon: Globe,
      title: t("internationalShipping"),
      description: t("internationalShippingDescription"),
      longDescription: t("internationalShippingLong")
    },
    {
      id: "cargo-insurance",
      icon: Shield,
      title: t("cargoInsurance"),
      description: t("cargoInsuranceDescription"),
      longDescription: t("cargoInsuranceLong")
    },
    {
      id: "customs-clearance",
      icon: FileCheck,
      title: t("customsClearance"),
      description: t("customsClearanceDescription"),
      longDescription: t("customsClearanceLong")
    },
    {
      id: "warehousing",
      icon: Warehouse,
      title: t("warehousing"),
      description: t("warehousingDescription"),
      longDescription: t("warehousingLong")
    },
    {
      id: "last-mile-delivery",
      icon: Truck,
      title: t("lastMileDelivery"),
      description: t("lastMileDeliveryDescription"),
      longDescription: t("lastMileDeliveryLong")
    }
  ]

  return (
    <div className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">{t("ourServices")}</h1>
        <div className="space-y-16">
          {services.map((service) => (
            <section key={service.id} id={service.id} className="scroll-mt-20">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center mb-4">
                  <service.icon size={48} className="text-[#0479c2] mr-4" />
                  <h2 className="text-2xl font-bold">{service.title}</h2>
                </div>
                <p className="text-lg mb-4 font-medium">{service.description}</p>
                <p className="text-gray-600">{service.longDescription}</p>
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  )
}
