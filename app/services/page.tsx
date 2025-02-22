"use client"
import { useEffect, useRef, useState } from "react"
import type React from "react"

import { useSearchParams } from "next/navigation"
import { useLanguage } from "@/contexts/LanguageContext"
import { translations, type TranslationKey } from "@/utils/translations"
import { Ship, ArrowLeftRight, Plane, Globe, Shield, FileCheck, Warehouse, Truck } from "lucide-react"

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
      longDescription: t("seaFreightLong"),
      videoSrc: "/videos/sea-freight.mp4",
      posterSrc: "/images/sea-freight-poster.jpg",
    },
    {
      id: "freight-forwarding",
      icon: ArrowLeftRight,
      title: t("freightForwarding"),
      description: t("freightForwardingDescription"),
      longDescription: t("freightForwardingLong"),
      videoSrc: "/videos/freight-forwarding.mp4",
      posterSrc: "/images/freight-forwarding-poster.jpg",
    },
    {
      id: "air-freight",
      icon: Plane,
      title: t("airFreight"),
      description: t("airFreightDescription"),
      longDescription: t("airFreightLong"),
      videoSrc: "/videos/air-freight.mp4",
      posterSrc: "/images/air-freight-poster.jpg",
    },
    {
      id: "international-shipping",
      icon: Globe,
      title: t("internationalShipping"),
      description: t("internationalShippingDescription"),
      longDescription: t("internationalShippingLong"),
      videoSrc: "/videos/international-shipping.mp4",
      posterSrc: "/images/international-shipping-poster.jpg",
    },
    {
      id: "cargo-insurance",
      icon: Shield,
      title: t("cargoInsurance"),
      description: t("cargoInsuranceDescription"),
      longDescription: t("cargoInsuranceLong"),
      videoSrc: "/videos/cargo-insurance.mp4",
      posterSrc: "/images/cargo-insurance-poster.jpg",
    },
    {
      id: "customs-clearance",
      icon: FileCheck,
      title: t("customsClearance"),
      description: t("customsClearanceDescription"),
      longDescription: t("customsClearanceLong"),
      videoSrc: "/videos/customs-clearance.mp4",
      posterSrc: "/images/customs-clearance-poster.jpg",
    },
    {
      id: "warehousing",
      icon: Warehouse,
      title: t("warehousing"),
      description: t("warehousingDescription"),
      longDescription: t("warehousingLong"),
      videoSrc: "/videos/warehousing.mp4",
      posterSrc: "/images/warehousing-poster.jpg",
    },
    {
      id: "last-mile-delivery",
      icon: Truck,
      title: t("lastMileDelivery"),
      description: t("lastMileDeliveryDescription"),
      longDescription: t("lastMileDeliveryLong"),
      videoSrc: "/videos/last-mile-delivery.mp4",
      posterSrc: "/images/last-mile-delivery-poster.jpg",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-[#828282] text-white py-6 md:py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-3 animate-subtle-jump">{t("ourServices")}</h1>
          <p className="text-lg md:text-xl mb-4">{t("servicesDescription")}</p>
        </div>
      </section>
      <div className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto space-y-12">
            {services.map((service) => (
              <ServiceSection key={service.id} service={service} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function ServiceSection({ service }: { service: {
  id: string;
  icon: React.ElementType;
  title: string;
  description: string;
  longDescription: string;
  videoSrc: string;
  posterSrc: string;
} }) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && videoRef.current) {
            videoRef.current.play().catch(() => {});
          } else if (videoRef.current) {
            videoRef.current.pause();
          }
        });
      },
      { threshold: 0.5 }
    );
    if (videoRef.current) {
      observer.observe(videoRef.current);
    }
    return () => {
      if (videoRef.current) {
        observer.unobserve(videoRef.current);
      }
    };
  }, []);

  return (
    <section id={service.id} className="scroll-mt-20">
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="grid md:grid-cols-2 items-start">
          <div className="video-aspect-ratio-container">
            <video ref={videoRef} className="w-full h-full object-cover" playsInline muted loop poster={service.posterSrc}>
              <source src={service.videoSrc} type="video/mp4" />
            </video>
          </div>
          <div className="p-8">
            <h2 className="text-2xl font-bold">{service.title}</h2>
            <p className="text-lg mb-4 font-medium">{service.description}</p>
            <p className="text-gray-600 leading-relaxed">{service.longDescription}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
