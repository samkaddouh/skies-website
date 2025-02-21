"use client"
import Link from "next/link"
import { useLanguage } from "@/contexts/LanguageContext"
import { translations, type TranslationKey } from "@/utils/translations"
import { Ship, ArrowLeftRight, Plane, Globe, Shield, FileCheck, Warehouse, Truck, Package, Briefcase, Building, AlertTriangle } from 'lucide-react'

export default function ClientHomeContent() {
  const { language } = useLanguage()
  const t = (key: TranslationKey) => translations[language][key]

  const services = [
    { icon: Ship, label: "seaFreight", description: "seaFreightDescription", id: "sea-freight" },
    { icon: ArrowLeftRight, label: "freightForwarding", description: "freightForwardingDescription", id: "freight-forwarding" },
    { icon: Plane, label: "airFreight", description: "airFreightDescription", id: "air-freight" },
    { icon: Globe, label: "internationalShipping", description: "internationalShippingDescription", id: "international-shipping" },
    { icon: Shield, label: "cargoInsurance", description: "cargoInsuranceDescription", id: "cargo-insurance" },
    { icon: FileCheck, label: "customsClearance", description: "customsClearanceDescription", id: "customs-clearance" },
    { icon: Warehouse, label: "warehousing", description: "warehousingDescription", id: "warehousing" },
    { icon: Truck, label: "lastMileDelivery", description: "lastMileDeliveryDescription", id: "last-mile-delivery" },
  ] as const

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-primary-color text-white py-6 md:py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-3 animate-subtle-jump">{t("expeditingYourSuccess")}</h1>
          <p className="text-lg md:text-xl mb-4">{t("homeDescription")}</p>
          <Link
            href="/quote"
            className="bg-white text-primary-color px-6 py-3 rounded-lg font-bold text-lg inline-block hover:bg-gray-100 transition-colors"
          >
            {t("getStartedNow")}
          </Link>
        </div>
      </section>

      {/* Our Services Section */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 md:mb-12 text-center">{t("ourServices")}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {services.slice(0, 4).map((service) => (
              <Link
                key={service.id}
                href={`/services#${service.id}`}
                className="text-center group hover:bg-gray-50 p-4 rounded-lg transition-colors"
              >
                <service.icon
                  size={48}
                  className="mx-auto mb-4 text-[#0479c2] transition-transform duration-300 group-hover:scale-110"
                />
                <h3 className="text-xl font-semibold mb-2">{t(service.label as TranslationKey)}</h3>
                <p>{t(service.description as TranslationKey)}</p>
              </Link>
            ))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.slice(4).map((service) => (
              <Link
                key={service.id}
                href={`/services#${service.id}`}
                className="text-center group hover:bg-gray-50 p-4 rounded-lg transition-colors"
              >
                <service.icon
                  size={48}
                  className="mx-auto mb-4 text-[#0479c2] transition-transform duration-300 group-hover:scale-110"
                />
                <h3 className="text-xl font-semibold mb-2">{t(service.label as TranslationKey)}</h3>
                <p>{t(service.description as TranslationKey)}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Solutions for You Section */}
      <section className="py-12 md:py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8 text-center">{t("solutionsForYou")}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md solutions-card">
              <Package size={48} className="mb-4" />
              <h3 className="text-xl font-semibold mb-2">{t("bulkCargoShippers")}</h3>
              <p className="font-medium mb-2">{t("bulkCargoShippersDesc")}</p>
              <p>{t("bulkCargoShippersLong")}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md solutions-card">
              <Briefcase size={48} className="mb-4" />
              <h3 className="text-xl font-semibold mb-2">{t("newBusinessOwners")}</h3>
              <p className="font-medium mb-2">{t("newBusinessOwnersDesc")}</p>
              <p>{t("newBusinessOwnersLong")}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md solutions-card">
              <Building size={48} className="mb-4" />
              <h3 className="text-xl font-semibold mb-2">{t("distributorsWholesalers")}</h3>
              <p className="font-medium mb-2">{t("distributorsWholesalersDesc")}</p>
              <p>{t("distributorsWholesalersLong")}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md solutions-card">
              <AlertTriangle size={48} className="mb-4" />
              <h3 className="text-xl font-semibold mb-2">{t("hazardousCargoShippers")}</h3>
              <p className="font-medium mb-2">{t("hazardousCargoShippersDesc")}</p>
              <p>{t("hazardousCargoShippersLong")}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}