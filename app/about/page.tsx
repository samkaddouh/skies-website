"use client"

import React from 'react'
import Link from 'next/link'
import { useLanguage } from "@/contexts/LanguageContext"
import { translations, type TranslationKey } from "@/utils/translations"
import { Star, CheckCircle, Users, Globe, PhoneCall, Award } from 'lucide-react'

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
      <section className="bg-[#828282] text-white py-6 md:py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-3 animate-subtle-jump">{t("aboutHeroTitle")}</h1>
          <p className="text-lg md:text-xl mb-4">{t("aboutHeroSubtitle")}</p>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 max-w-5xl">
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
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="text-3xl font-bold mb-12 text-center">{t("whyChooseUs")}</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start p-6 bg-gray-50 rounded-lg">
                <feature.icon className="w-8 h-8 text-primary-color flex-shrink-0 mr-4" />
                <p className="text-gray-700">{t(feature.text as TranslationKey)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl font-bold mb-12 text-center">{t("meetTheTeam")}</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md text-center">
                <h3 className="text-xl font-bold mb-2">{member.name}</h3>
                <p className="text-primary-color font-medium mb-2">{t(member.role)}</p>
                <p className="text-gray-600 text-sm">{t(member.experience)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
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
        </div>
      </section>
    </div>
  )
}

export default AboutPage
