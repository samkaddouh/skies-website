"use client"
import Link from "next/link"
import { useLanguage } from "@/contexts/LanguageContext"
import { translations, type TranslationKey } from "@/utils/translations"
import {
  Ship,
  ArrowLeftRight,
  Plane,
  Globe,
  Shield,
  FileCheck,
  Warehouse,
  Truck,
  Package,
  Briefcase,
  Building,
  AlertTriangle,
  Award,
  Clock,
  Users,
  TrendingUp,
} from "lucide-react"
import { useAutoAnimate } from "@formkit/auto-animate/react"
import { useEffect, useState, useRef } from "react"

export default function ClientHomeContent() {
  const { language } = useLanguage()
  const t = (key: TranslationKey) => translations[language][key]
  const [parent] = useAutoAnimate()
  const [isLoaded, setIsLoaded] = useState(false)
  const [startCounting, setStartCounting] = useState(false)

  const observerRef = useRef(null)

  useEffect(() => {
    setIsLoaded(true)

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStartCounting(true)
          observer.disconnect()
        }
      },
      { threshold: 0.5 },
    )

    if (observerRef.current) {
      observer.observe(observerRef.current)
    }

    return () => observer.disconnect()
  }, [])

  const services = [
    {
      icon: Globe,
      label: "internationalShipping",
      description: "internationalShippingDescription",
      id: "international-shipping",
    },
    {
      icon: ArrowLeftRight,
      label: "freightForwarding",
      description: "freightForwardingDescription",
      id: "freight-forwarding",
    },
    
    
    { icon: Plane, label: "airFreight", description: "airFreightDescription", id: "air-freight" },
    { icon: Ship, label: "seaFreight", description: "seaFreightDescription", id: "sea-freight" },
    { icon: Truck, label: "lastMileDelivery", description: "lastMileDeliveryDescription", id: "last-mile-delivery" },
    { icon: Shield, label: "cargoInsurance", description: "cargoInsuranceDescription", id: "cargo-insurance" },
    { icon: FileCheck, label: "customsClearance", description: "customsClearanceDescription", id: "customs-clearance" },
    { icon: Warehouse, label: "warehousing", description: "warehousingDescription", id: "warehousing" },
    
  ] as const

  const solutions = [
    { icon: Package, title: "bulkCargoShippers", desc: "bulkCargoShippersDesc", long: "bulkCargoShippersLong" },
    { icon: Briefcase, title: "newBusinessOwners", desc: "newBusinessOwnersDesc", long: "newBusinessOwnersLong" },
    {
      icon: Building,
      title: "distributorsWholesalers",
      desc: "distributorsWholesalersDesc",
      long: "distributorsWholesalersLong",
    },
    {
      icon: AlertTriangle,
      title: "hazardousCargoShippers",
      desc: "hazardousCargoShippersDesc",
      long: "hazardousCargoShippersLong",
    },
  ]

  const whyChooseUs = [
    { icon: Award, stat: 98, label: "customerSatisfaction", suffix: "%" },
    { icon: Clock, stat: 24, label: "hourSupport", suffix: "/7" },
    { icon: Users, stat: 10000, label: "happyClients", suffix: "+" },
    { icon: TrendingUp, stat: 15, label: "yearsExperience", suffix: "+" },
  ]

  const AnimatedCounter = ({
    end,
    duration = 2000,
    suffix = "",
  }: { end: number; duration?: number; suffix?: string }) => {
    const [count, setCount] = useState(0)
    const countRef = useRef(0)
    const [startTime, setStartTime] = useState<number | null>(null)

    useEffect(() => {
      if (startCounting && countRef.current !== end) {
        setStartTime(Date.now())
        const interval = setInterval(() => {
          const currentTime = Date.now()
          const elapsedTime = currentTime - (startTime ?? currentTime)
          const progress = Math.min(elapsedTime / duration, 1)
          const nextCount = Math.floor(end * progress)

          if (nextCount !== countRef.current) {
            countRef.current = nextCount
            setCount(nextCount)
          }

          if (progress === 1) {
            clearInterval(interval)
          }
        }, 16)

        return () => clearInterval(interval)
      }
    }, [end, duration, startCounting, startTime])

    return (
      <span>
        {count}
        {suffix}
      </span>
    )
  }

  return (
    <div>
      {/* Hero Section with gradient overlay */}
      <section className="relative py-8 md:py-12 lg:py-16 xl:py-20 overflow-hidden">
        <div className="absolute inset-0 bg-[#828282] bg-opacity-90 bg-gradient-to-r from-gray-900 to-gray-700">
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 to-gray-800/80"></div>
        </div>

        <div className="container relative mx-auto px-6 sm:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-[#f8f9fa]">
              {t("accompanyingYourSuccess")}
            </h1>

            <p className="text-lg sm:text-xl md:text-2xl mb-6 text-gray-100">{t("homeDescription")}</p>

            <Link
              href="/quote"
              className="inline-flex items-center justify-center bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-lg font-bold text-lg hover:opacity-90 transition-opacity duration-300 transform hover:scale-105 shadow-lg"
            >
              {t("getStartedNow")}
            </Link>
          </div>
        </div>
      </section>

      {/* Our Services Section */}
      <section className="py-8 md:py-12 lg:py-16 bg-white">
        <div className="container mx-auto px-6 sm:px-8">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-8 md:mb-12 text-center">{t("ourServices")}</h2>

          <div ref={parent} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            {isLoaded &&
              services.map((service) => (
                <div key={service.id}>
                  <Link
                    href={`/services?section=${service.id}`}
                    className="flex flex-col h-full text-center group bg-white hover:bg-[#f1f5f9] p-6 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1 border border-gray-100"
                  >
                    <service.icon
                      size={48}
                      strokeWidth={1.5}
                      className="mx-auto mb-4 text-[#0479c2] transition-transform duration-300 group-hover:scale-110"
                    />
                    <h3 className="text-lg sm:text-xl md:text-2xl font-semibold mb-2">
                      {t(service.label as TranslationKey)}
                    </h3>
                    <p className="text-gray-600 flex-grow">{t(service.description as TranslationKey)}</p>
                  </Link>
                </div>
              ))}
          </div>
        </div>
      </section>

      {/* Solutions for You Section */}
      <section className="py-8 md:py-12 lg:py-16 bg-gray-100">
        <div className="container mx-auto px-6 sm:px-8">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-8 md:mb-12 text-center">
            {t("solutionsForYou")}
          </h2>

          <div ref={parent} className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {isLoaded &&
              solutions.map((solution, index) => (
                <div key={index}>
                  <div className="bg-white p-6 md:p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 h-full group">
                    <solution.icon
                      size={48}
                      className="mb-4 text-[#0479c2] transition-transform duration-300 group-hover:scale-110"
                      strokeWidth={1.5}
                    />
                    <h3 className="text-lg sm:text-xl md:text-2xl font-semibold mb-2">
                      {t(solution.title as TranslationKey)}
                    </h3>
                    <p className="font-medium mb-2 text-gray-800">{t(solution.desc as TranslationKey)}</p>
                    <p className="text-gray-600">{t(solution.long as TranslationKey)}</p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section ref={observerRef} className="py-8 md:py-12 lg:py-16 bg-white">
        <div className="container mx-auto px-6 sm:px-8">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-8 md:mb-12 text-center">{t("whyChooseUs")}</h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {whyChooseUs.map((item, index) => (
              <div key={index} className="text-center">
                <item.icon size={48} className="mx-auto mb-4 text-[#0479c2]" strokeWidth={1.5} />
                <div className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
                  <AnimatedCounter end={item.stat} suffix={item.suffix} />
                </div>
                <p className="text-lg text-gray-600">{t(item.label as TranslationKey)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

