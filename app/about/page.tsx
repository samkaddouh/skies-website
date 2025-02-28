"use client"

import type React from "react"
import Link from "next/link"
import { useLanguage } from "@/contexts/LanguageContext"
import { translations, type TranslationKey } from "@/utils/translations"
import { Star, CheckCircle, Users, Globe, PhoneCall, Award } from "lucide-react"
import { useAutoAnimate } from "@formkit/auto-animate/react"
import { useEffect, useState, useRef } from "react"

interface Testimonial {
  text: TranslationKey
  client: string
}

interface TeamMember {
  name: string
  role: TranslationKey
  experience: TranslationKey
}

const AboutPage: React.FC = () => {
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

  const features = [
    { icon: Award, text: "yearsExperience" },
    { icon: Users, text: "trustedPartnerships" },
    { icon: CheckCircle, text: "customsExpertise" },
    { icon: Globe, text: "globalReach" },
    { icon: PhoneCall, text: "support" },
  ]

  const teamMembers: TeamMember[] = [
    { name: "Hassan Beydoun", role: "ceoRole", experience: "ceoExperience" },
    { name: "Ali Beydoun", role: "customsRole", experience: "customsExperience" },
  ]

  const testimonials: Testimonial[] = [
    { text: "testimonial1", client: "Mohammad K." },
    { text: "testimonial2", client: "Ahmad R." },
  ]

  return (
    <div className="bg-white">
      {/* Updated Hero Section */}
      <section className="relative py-8 md:py-12 lg:py-16 xl:py-20 overflow-hidden">
        <div className="absolute inset-0 bg-[#828282] bg-opacity-90 bg-gradient-to-r from-gray-900 to-gray-700">
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 to-gray-800/80"></div>
        </div>

        <div className="container relative mx-auto px-6 sm:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-[#f8f9fa]">{t("aboutHeroTitle")}</h1>

            <p className="text-lg sm:text-xl md:text-2xl mb-6 text-gray-100">{t("aboutHeroSubtitle")}</p>

            <Link
              href="/contact"
              className="inline-flex items-center justify-center bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-lg font-bold text-lg hover:opacity-90 transition-opacity duration-300 transform hover:scale-105 shadow-lg"
            >
              {t("contactUs")}
            </Link>
          </div>
        </div>
      </section>

      <div ref={parent}>
        {isLoaded && (
          <>
            <section className="py-16 bg-gray-50">
              <div className="container mx-auto px-4 max-w-5xl">
                {isLoaded && (
                  <div className="grid md:grid-cols-2 gap-12">
                    <div className="text-center md:text-left">
                      <h3 className="text-2xl font-bold mb-4">{t("ourMission")}</h3>
                      <p className="text-gray-600 leading-relaxed">{t("missionStatement")}</p>
                    </div>
                    <div className="text-center md:text-left">
                      <h3 className="text-2xl font-bold mb-4">{t("ourVision")}</h3>
                      <p className="text-gray-600 leading-relaxed">{t("visionStatement")}</p>
                    </div>
                  </div>
                )}
              </div>
            </section>

            <section className="py-16">
              <div className="container mx-auto px-4 max-w-6xl">
                <h2 className="text-3xl font-bold mb-12 text-center">{t("whyChooseUs")}</h2>
                <div className="grid md:grid-cols-3 gap-8">
                  {isLoaded &&
                    features.map((feature, index) => (
                      <div
                        key={index}
                        className="flex items-start p-6 bg-gray-50 rounded-lg"
                        style={{
                          opacity: 0,
                          animation: `fadeIn 0.5s ease-out ${index * 0.1}s forwards`,
                        }}
                      >
                        <feature.icon className="w-8 h-8 text-primary-color flex-shrink-0 mr-4" />
                        <p className="text-gray-700">{t(feature.text as TranslationKey)}</p>
                      </div>
                    ))}
                </div>
              </div>
            </section>

            <section className="py-16 bg-gray-50">
              <div className="container mx-auto px-4 max-w-4xl">
                {isLoaded && (
                  <div className="grid md:grid-cols-2 gap-8">
                    <h2 className="text-3xl font-bold mb-12 text-center">{t("meetTheTeam")}</h2>
                    {teamMembers.map((member, index) => (
                      <div key={index} className="bg-white p-6 rounded-lg shadow-md text-center">
                        <h3 className="text-xl font-bold mb-2">{member.name}</h3>
                        <p className="text-primary-color font-medium mb-2">{t(member.role)}</p>
                        <p className="text-gray-600 text-sm">{t(member.experience)}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>

            <section className="py-16" ref={observerRef}>
              <div className="container mx-auto px-4 max-w-4xl">
                {isLoaded && (
                  <>
                    <h2 className="text-3xl font-bold mb-12 text-center">{t("clientTestimonials")}</h2>
                    <div className="grid md:grid-cols-2 gap-8">
                      {testimonials.map((testimonial, index) => (
                        <div key={index} className="bg-gray-50 p-6 rounded-lg">
                          <div className="flex mb-4">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" />
                            ))}
                          </div>
                          <p className="text-gray-700 mb-4 italic">"{t(testimonial.text)}"</p>
                          <p className="font-semibold text-gray-900">- {testimonial.client}</p>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  )
}

export default AboutPage

const fadeInKeyframes = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
`

const styleTag = document.createElement("style")
styleTag.appendChild(document.createTextNode(fadeInKeyframes))
document.head.appendChild(styleTag)

