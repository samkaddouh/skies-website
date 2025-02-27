"use client"

import type React from "react"
import { useState } from "react"
import { useLanguage } from "@/contexts/LanguageContext"
import { translations, type TranslationKey } from "@/utils/translations"
import { sendQuote } from "./actions"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, AlertCircle } from "lucide-react"
import type { BaseQuoteFormData } from "./schema"
import { StepOne } from "@/components/StepOne"
import { StepTwo } from "@/components/StepTwo"
import { CargoDetails } from "@/components/cargo-details"
import type { ShippingTerm } from "@/components/ShippingTermsSelector"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TemperatureInput } from "@/components/TemperatureInput"
import { DimensionsInput } from "@/components/DimensionsInput"
import { GaugeButton } from "@/components/GaugeButton"

type ServiceType = "air" | "sea" | "land" | null
type CargoType = "general" | "hazardous"

interface FormState {
  errors: Partial<Record<keyof BaseQuoteFormData | "form", string>>
  touched: Partial<Record<keyof BaseQuoteFormData, boolean>>
  success: boolean
  isSubmitting: boolean
  serviceType: ServiceType
  currentStep: number
  maxSteps: number
  data: Omit<BaseQuoteFormData, "serviceType" | "numberOfCartons" | "numberOfPallets"> & {
    companyNameSupplier: string
    contactPerson: string
    isGeneral?: boolean
    isHazardous?: boolean
    isPerishable?: boolean
    preferredAirline?: string
    deliveryUrgency?: "standard" | "express" | "priority"
    exactPickupAddress?: string
    msdsFile?: File
    typeOfService?: "FOB" | "EXW"
    equipmentNeeded?: "LCL" | "20ft" | "40ft" | "20HC" | "40HC" | "20REEF" | "40REEF" | "20OT" | "40OT"
    temperature?: string
    temperatureUnit?: "C" | "F"
    cargoInGauge?: boolean
    cargoDimensions?: string
    dimensionsUnit?: "cm" | "in" | "m" | "ft"
    requiresLoadingAssistance: boolean
    requiresUnloadingAssistance: boolean
    packages: string
    serviceType: ServiceType
    shippingTerm?: ShippingTerm
    containerCapacity?: number
    cargoGaugeType?: "in" | "out"
    cargoType?: CargoType
    weightValue?: string
    weightUnit?: "kg" | "lb" | "ton"
    descriptionOfGoods?: string
    additionalInfo?: string
  }
}

const initialFormState: FormState = {
  errors: {},
  touched: {},
  success: false,
  isSubmitting: false,
  serviceType: null,
  currentStep: 1,
  maxSteps: 2,
  data: {
    name: "",
    email: "",
    phone: "",
    originAddress: "",
    destinationAddress: "",
    serviceType: null,
    description: "",
    value: "",
    weight: "",
    dimensions: "",
    additionalInfo: "",
    companyNameSupplier: "",
    contactPerson: "",
    exactPickupAddress: "",
    typeOfService: undefined,
    equipmentNeeded: undefined,
    temperature: "",
    temperatureUnit: undefined,
    cargoInGauge: false,
    cargoDimensions: "",
    dimensionsUnit: "m",
    requiresLoadingAssistance: false,
    requiresUnloadingAssistance: false,
    packages: "",
    shippingTerm: undefined,
    containerCapacity: 0,
    cargoGaugeType: "in",
    isGeneral: false,
    isHazardous: false,
    isPerishable: false,
    cargoType: undefined,
    weightValue: "",
    weightUnit: "kg",
    descriptionOfGoods: "",
  },
}

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
    const formData = new FormData(form)

    try {
      const result = await sendQuote(formData)

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
    } catch (error) {
      setFormState((prev) => ({
        ...prev,
        errors: { form: t("errorMessage") },
        success: false,
        isSubmitting: false,
      }))
    }
  }

  const renderServiceSpecificFields = () => {
    switch (formState.serviceType) {
      case "sea":
        return (
          <div className="space-y-6">
            <div className="space-y-3">
              <Label className="text-base font-medium">
                {t("equipmentNeeded")}
                <span className="text-red-500 ml-1">*</span>
              </Label>
              <Select
                value={formState.data.equipmentNeeded}
                onValueChange={(value) =>
                  setFormState((prev) => ({
                    ...prev,
                    data: {
                      ...prev.data,
                      equipmentNeeded: value as
                        | "LCL"
                        | "20ft"
                        | "40ft"
                        | "20HC"
                        | "40HC"
                        | "20REEF"
                        | "40REEF"
                        | "20OT"
                        | "40OT",
                      temperature: value === "40REEF" || value === "20REEF" ? prev.data.temperature : "",
                      temperatureUnit: value === "40REEF" || value === "20REEF" ? prev.data.temperatureUnit : undefined,
                      cargoGaugeType: value === "20OT" || value === "40OT" ? "in" : undefined,
                      containerCapacity: value === "20OT" || value === "40OT" ? 0 : undefined,
                      cargoDimensions: value === "20OT" || value === "40OT" ? "" : prev.data.cargoDimensions,
                    },
                  }))
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={<span className="italic text-gray-500">{t("selectContainerType")}</span>} />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="LCL">LCL</SelectItem>
                  <SelectItem value="20ft">20ft</SelectItem>
                  <SelectItem value="40ft">40ft</SelectItem>
                  <SelectItem value="20HC">20HC</SelectItem>
                  <SelectItem value="40HC">40HC</SelectItem>
                  <SelectItem value="20REEF">20REEF</SelectItem>
                  <SelectItem value="40REEF">40REEF</SelectItem>
                  <SelectItem value="20OT">20OT</SelectItem>
                  <SelectItem value="40OT">40OT</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {formState.data.equipmentNeeded && formState.data.equipmentNeeded !== "LCL" && (
              <div className="space-y-6">
                {(formState.data.equipmentNeeded === "20REEF" || formState.data.equipmentNeeded === "40REEF") && (
                  <TemperatureInput
                    value={formState.data.temperature || ""}
                    onChange={(value, unit) =>
                      setFormState((prev) => ({
                        ...prev,
                        data: {
                          ...prev.data,
                          temperature: value,
                          temperatureUnit: unit,
                        },
                      }))
                    }
                    t={t}
                    language={language}
                  />
                )}

                {(formState.data.equipmentNeeded === "20OT" || formState.data.equipmentNeeded === "40OT") && (
                  <div className="space-y-6">
                    <div className="space-y-3">
                      <Label className="text-base font-medium">
                        {t("cargoGaugeType")}
                        <span className="text-red-500 ml-1">*</span>
                      </Label>

                      <RadioGroup
                        value={formState.data.cargoGaugeType}
                        onValueChange={(value: "in" | "out") =>
                          setFormState((prev) => ({
                            ...prev,
                            data: {
                              ...prev.data,
                              cargoGaugeType: value,
                              containerCapacity: value === "in" ? 0 : prev.data.containerCapacity,
                              cargoDimensions: value === "in" ? "" : prev.data.cargoDimensions,
                            },
                          }))
                        }
                        className="flex flex-col space-y-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="in" id="gauge-in" />
                          <Label htmlFor="gauge-in">{t("inGauge")}</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="out" id="gauge-out" />
                          <Label htmlFor="gauge-out">{t("outOfGauge")}</Label>
                        </div>
                      </RadioGroup>
                    </div>

                    {formState.data.cargoGaugeType === "out" && (
                      <GaugeButton
                        value={formState.data.containerCapacity || 0}
                        onChange={(value) =>
                          setFormState((prev) => ({
                            ...prev,
                            data: { ...prev.data, containerCapacity: value },
                          }))
                        }
                        className="mt-4"
                        t={t}
                        language={language}
                      />
                    )}
                  </div>
                )}

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-base font-medium">
                      {t("originAddress")}
                      <span className="text-red-500 ml-1">*</span>
                    </Label>
                    <input
                      type="text"
                      name="originAddress"
                      value={formState.data.originAddress}
                      onChange={handleInputChange}
                      placeholder={t("destinationAddressPlaceholder")}
                      className="w-full px-3 py-2 border rounded-md border-input bg-background text-sm ring-offset-background placeholder:italic placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-base font-medium">
                      {t("destinationAddress")}
                      <span className="text-red-500 ml-1">*</span>
                    </Label>
                    <input
                      type="text"
                      name="destinationAddress"
                      value={formState.data.destinationAddress}
                      onChange={handleInputChange}
                      placeholder={t("destinationAddressPlaceholder")}
                      className="w-full px-3 py-2 border rounded-md border-input bg-background text-sm ring-offset-background placeholder:italic placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      required
                    />
                  </div>
                </div>

                {(formState.data.equipmentNeeded === "20OT" || formState.data.equipmentNeeded === "40OT") &&
                  formState.data.cargoGaugeType === "out" && (
                    <div className="space-y-2">
                      <DimensionsInput
                        value={formState.data.cargoDimensions || ""}
                        onChange={handleDimensionsChange}
                        t={t}
                        language={language}
                      />
                    </div>
                  )}
              </div>
            )}

            {formState.data.equipmentNeeded === "LCL" && (
              <CargoDetails
                data={formState.data}
                handleInputChange={handleInputChange}
                onDimensionsChange={handleDimensionsChange}
                onWeightChange={handleWeightChange}
                t={t}
              />
            )}
          </div>
        )
      case "air":
        return (
          <div className="space-y-6">
            <CargoDetails
              data={formState.data}
              handleInputChange={handleInputChange}
              onDimensionsChange={handleDimensionsChange}
              onWeightChange={handleWeightChange}
              t={t}
            />
            <div className="space-y-3">
              <Label className="text-base font-medium">{t("deliveryUrgency")}</Label>
              <RadioGroup
                value={formState.data.deliveryUrgency}
                onValueChange={(value) =>
                  setFormState((prev) => ({
                    ...prev,
                    data: { ...prev.data, deliveryUrgency: value as "standard" | "express" | "priority" },
                  }))
                }
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="standard" id="standard" />
                  <Label htmlFor="standard">{t("standardDelivery")}</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="express" id="express" />
                  <Label htmlFor="express">{t("expressDelivery")}</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="priority" id="priority" />
                  <Label htmlFor="priority">{t("priorityDelivery")}</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        )
      case "land":
        return (
          <div className="space-y-6">
            <div className="space-y-3">
              <Label className="text-base font-medium">{t("loadingAssistance")}</Label>
              <RadioGroup
                value={formState.data.requiresLoadingAssistance ? "yes" : "no"}
                onValueChange={(value) =>
                  setFormState((prev) => ({
                    ...prev,
                    data: { ...prev.data, requiresLoadingAssistance: value === "yes" },
                  }))
                }
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="loading-yes" />
                  <Label htmlFor="loading-yes">{t("yes")}</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="loading-no" />
                  <Label htmlFor="loading-no">{t("no")}</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-3">
              <Label className="text-base font-medium">{t("unloadingAssistance")}</Label>
              <RadioGroup
                value={formState.data.requiresUnloadingAssistance ? "yes" : "no"}
                onValueChange={(value) =>
                  setFormState((prev) => ({
                    ...prev,
                    data: { ...prev.data, requiresUnloadingAssistance: value === "yes" },
                  }))
                }
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="unloading-yes" />
                  <Label htmlFor="unloading-yes">{t("yes")}</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="unloading-no" />
                  <Label htmlFor="unloading-no">{t("no")}</Label>
                </div>
              </RadioGroup>
            </div>

            <CargoDetails
              data={formState.data}
              handleInputChange={handleInputChange}
              onDimensionsChange={handleDimensionsChange}
              onWeightChange={handleWeightChange}
              t={t}
            />
          </div>
        )
      default:
        return null
    }
  }

  const nextStep = () => {
    setFormState((prev) => ({
      ...prev,
      currentStep: Math.min(prev.currentStep + 1, prev.maxSteps),
    }))
  }

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
              <Button type="button" onClick={nextStep}>
                {t("next")}
              </Button>
            </div>
          </>
        )
      case 2:
        return (
          <StepTwo
            data={formState.data}
            onServiceTypeSelect={handleServiceTypeSelect}
            onShippingTermChange={handleShippingTermChange}
            onCargoTypeChange={handleCargoTypeChange}
            handleInputChange={handleInputChange}
            t={t}
            renderServiceSpecificFields={renderServiceSpecificFields}
            onPrevious={prevStep}
            onNext={() => nextStep()} // Change this to a simple function with no parameters
            onReset={handleResetStep2}
            language={language}
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
      <section className="bg-[#828282] text-white py-6 md:py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-3 animate-subtle-jump">{t("getQuoteTitle")}</h1>
          <p className="text-lg md:text-xl mb-4">{t("getQuoteDescription")}</p>
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

