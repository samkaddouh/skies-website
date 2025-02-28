"use client"

import type React from "react"
import { useState } from "react"
import { useLanguage } from "@/contexts/LanguageContext"
import { translations, type TranslationKey } from "@/utils/translations"
import { sendQuote } from "@/actions/index"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, AlertCircle } from "lucide-react"
import { StepOne } from "@/components/StepOne"
import { StepTwo } from "@/components/StepTwo"
import { ServiceType, CargoType, FormState, type ShippingTerm } from "@/app/types/formState"
import { initialFormState } from "@/app/states/initialFormState"
export default function QuotePage() {
    const { language } = useLanguage()
    const t = (key: TranslationKey) => translations[language][key]

    const [formState, setFormState] = useState<FormState>(initialFormState)

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setFormState((prev) => ({
            ...prev,
            data: { ...prev.data, [name]: value },
        }))
    }

    const handleServiceTypeSelect = (type: ServiceType) => {
        setFormState((prev) => ({
            ...prev,
            serviceType: type,
            data: {
                ...prev.data,
                serviceType: type || null,
            },
        }))
    }

    const handleShippingTermChange = (term: ShippingTerm) => {
        setFormState((prev) => ({
            ...prev,
            data: { ...prev.data, shippingTerm: term },
        }))
    }

    const handleCargoTypeChange = (type: CargoType) => {
        setFormState((prev) => ({
            ...prev,
            data: { ...prev.data, cargoType: type },
        }))
    }

    const handleDimensionsChange = (value: string, unit: "cm" | "in" | "m" | "ft") => {
        setFormState((prev) => ({
            ...prev,
            data: { ...prev.data, cargoDimensions: value, dimensionsUnit: unit },
        }))
    }

    const handleWeightChange = (value: string, unit: "kg" | "lb" | "ton") => {
        setFormState((prev) => ({
            ...prev,
            data: { ...prev.data, weightValue: value, weightUnit: unit },
        }))
    }

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault()
        setFormState((prev) => ({ ...prev, isSubmitting: true, errors: {} }))

        const form = event.target as HTMLFormElement

        try {
            const result = await sendQuote(formState)

            if ("error" in result) {
                setFormState((prev) => ({
                    ...prev,
                    errors: { form: result.error },
                    success: false,
                    isSubmitting: false,
                }))
                return
            }

            setFormState((prev) => ({
                ...prev,
                success: true,
                isSubmitting: false,
                serviceType: null,
                currentStep: 1,
                maxSteps: 2,
                data: initialFormState.data,
            }))
            form.reset()
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error: unknown) {
            setFormState((prev) => ({
                ...prev,
                errors: { form: t("errorMessage") },
                success: false,
                isSubmitting: false,
            }))
        }
    }


    const validateStepOne = () => {
        const errors: Record<string, string> = {};
        if (!formState.data.name.trim()) errors.name = t("nameTooShort");
        if (!formState.data.email.trim() || !/^[\w.%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formState.data.email))
            errors.email = t("invalidEmail");
        if (!formState.data.phone.trim() || !/^\+?\d{7,15}$/.test(formState.data.phone))
            errors.phone = t("invalidPhone");

        setFormState((prev) => ({ ...prev, errors }));
        return Object.keys(errors).length === 0;
    };

    const nextStep = () => {
        if (formState.currentStep === 1 && !validateStepOne()) {
            return; // Prevent navigation if validation fails
        }
        setFormState((prev) => ({
            ...prev,
            currentStep: Math.min(prev.currentStep + 1, prev.maxSteps),
        }));
    };


    const prevStep = () => {
        setFormState((prev) => ({
            ...prev,
            currentStep: Math.max(prev.currentStep - 1, 1),
        }))
    }

    const handleResetStep2 = () => {
        setFormState((prev) => ({
            ...prev,
            data: {
                ...initialFormState.data,
                name: prev.data.name,
                email: prev.data.email,
                phone: prev.data.phone,
                companyNameSupplier: prev.data.companyNameSupplier,
                contactPerson: prev.data.contactPerson,
            },
            serviceType: null,
        }))
    }

    const renderStep = () => {
        switch (formState.currentStep) {
            case 1:
                return (
                    <>
                        <StepOne data={formState.data} handleInputChange={handleInputChange} t={t} />
                        <div className={`flex justify-end mt-6 ${language === "ar" ? "flex-row-reverse" : ""}`}>
                            <Button type="button" onClick={() => { nextStep(1) }}>
                                {t("next")}
                            </Button>
                        </div>
                    </>
                )
            case 2:
                return (
                    <StepTwo
                        data={{ ...formState.data, serviceType: formState.serviceType, shippingTerm: formState.data.shippingTerm as "EXW" | "FOB" | undefined }}
                        onServiceTypeSelect={handleServiceTypeSelect}
                        onShippingTermChange={handleShippingTermChange}
                        onCargoTypeChange={handleCargoTypeChange}
                        handleInputChange={handleInputChange}
                        t={t}
                        handleDimensionsChange={handleDimensionsChange}
                        handleWeightChange={handleWeightChange}
                        onPrevious={prevStep}
                        onNext={() => nextStep()} // Change this to a simple function with no parameters
                        onReset={handleResetStep2}
                        language={language}
                        formState={formState}
                        setFormState={setFormState}
                    />
                )
            default:
                return (
                    <div className="flex justify-center">
                        <Button type="submit" disabled={formState.isSubmitting}>
                            {formState.isSubmitting ? t("submitting") : t("submitQuote")}
                        </Button>
                    </div>
                )
        }
    }

    return (
        <div className="min-h-screen bg-white flex flex-col">

            <section className="relative py-8 md:py-12 lg:py-16 xl:py-20 overflow-hidden">
                <div className="absolute inset-0 bg-[#828282] bg-opacity-90 bg-gradient-to-r from-gray-900 to-gray-700">
                    <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 to-gray-800/80"></div>
                </div>

                <div className="container relative mx-auto px-6 sm:px-8">
                    <div className="max-w-3xl">
                        <h1 className="animate-subtle-jump text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-[#f8f9fa]">{t("getQuoteTitle")}</h1>

                        <p className="text-lg sm:text-xl md:text-2xl mb-6 text-gray-100">{t("getQuoteDescription")}</p>

                    </div>
                </div>
            </section>
            <div className="container mx-auto px-4 py-8 flex-grow">
                <div className="max-w-4xl mx-auto">
                    <Card className="mb-8">
                        <CardContent className="p-6">
                            {formState.success && (
                                <Alert className="mb-6">
                                    <CheckCircle className="h-4 w-4" />
                                    <AlertDescription>{t("quoteSuccess")}</AlertDescription>
                                </Alert>
                            )}
                            {formState.errors.form && (
                                <Alert variant="destructive" className="mb-6">
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertDescription>{formState.errors.form}</AlertDescription>
                                </Alert>
                            )}
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {renderStep()}
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}

