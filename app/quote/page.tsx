"use client"

import type React from "react"
import { useState } from "react"
import { useLanguage } from "@/contexts/LanguageContext"
import { translations, type TranslationKey } from "@/utils/translations"
import { sendQuote } from "./actions"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { CheckCircle, AlertCircle, Plane, Ship, ArrowLeft, ArrowRight, Truck } from "lucide-react"
import type { BaseQuoteFormData } from "./schema"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"

type ServiceType = "air" | "sea" | "land" | null

// Update the FormState interface to include the missing properties
interface FormState {
  errors: Partial<Record<keyof BaseQuoteFormData | "form", string>>
  touched: Partial<Record<keyof BaseQuoteFormData, boolean>>
  success: boolean
  isSubmitting: boolean
  serviceType: ServiceType
  currentStep: number
  maxSteps: number
  data: BaseQuoteFormData & {
    // Common fields
    companyNameSupplier: string
    contactPerson: string
    workContactNumber: string
    companyAddress: string

    // Air freight specific fields
    isHazardous?: boolean
    isPerishable?: boolean
    preferredAirline?: string
    deliveryUrgency?: "standard" | "express" | "priority"
    exactPickupAddress?: string
    msdsFile?: File

    // Sea freight specific fields
    typeOfService?: "FOB" | "FCA SUPPLIER WAREHOUSE" | "FCA PORT" | "EXW"
    equipmentNeeded?: "LCL" | "20ft" | "40ft" | "40HC" | "40REEF" | "20OT" | "40OT"
    temperature?: string
    cargoInGauge?: boolean
    cargoDimensions?: string
    cbm?: string

    // Land freight specific fields
    requiresLoadingAssistance: boolean
    requiresUnloadingAssistance: boolean
    numberOfCartons: string
    numberOfPallets: string
  }
}

// Update the initial form state to include the new properties
const initialFormState: FormState = {
  errors: {},
  touched: {},
  success: false,
  isSubmitting: false,
  serviceType: null,
  currentStep: 1,
  maxSteps: 4,
  data: {
    name: "",
    email: "",
    phone: "",
    originAddress: "",
    destinationAddress: "",
    serviceType: "air",
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
    cargoInGauge: false,
    cargoDimensions: "",
    cbm: "",
    workContactNumber: "",
    companyAddress: "",
    requiresLoadingAssistance: false,
    requiresUnloadingAssistance: false,
    numberOfCartons: "",
    numberOfPallets: "",
  },
}

export default function QuotePage() {
  const { language } = useLanguage()
  const t = (key: TranslationKey) => translations[language][key]

  const [formState, setFormState] = useState<FormState>(initialFormState)

  const handleServiceTypeSelect = (type: ServiceType) => {
    setFormState((prev) => ({
      ...prev,
      serviceType: type,
      data: {
        ...prev.data,
        serviceType: type || "air",
      },
    }))
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormState((prev) => ({
      ...prev,
      data: { ...prev.data, [name]: value },
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

      // Success case
      setFormState((prev) => ({
        ...prev,
        success: true,
        isSubmitting: false,
        serviceType: null,
        currentStep: 1,
        maxSteps: 4,
        data: {
          name: "",
          email: "",
          phone: "",
          originAddress: "",
          destinationAddress: "",
          serviceType: "air",
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
          cargoInGauge: false,
          cargoDimensions: "",
          cbm: "",
          workContactNumber: "",
          companyAddress: "",
          requiresLoadingAssistance: false,
          requiresUnloadingAssistance: false,
          numberOfCartons: "",
          numberOfPallets: "",
        },
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

  const renderServiceTypeSelector = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card
          className={`cursor-pointer transition-all hover:shadow-lg ${
            formState.serviceType === "air" ? "ring-2 ring-primary" : ""
          }`}
          onClick={() => handleServiceTypeSelect("air")}
        >
          <CardContent className="p-6 text-center">
            <Plane className="w-12 h-12 mx-auto mb-4 text-primary" />
            <h3 className="text-lg font-semibold mb-2">{t("airFreight")}</h3>
            <p className="text-sm text-muted-foreground">{t("airFreightDescription")}</p>
          </CardContent>
        </Card>
        <Card
          className={`cursor-pointer transition-all hover:shadow-lg ${
            formState.serviceType === "sea" ? "ring-2 ring-primary" : ""
          }`}
          onClick={() => handleServiceTypeSelect("sea")}
        >
          <CardContent className="p-6 text-center">
            <Ship className="w-12 h-12 mx-auto mb-4 text-primary" />
            <h3 className="text-lg font-semibold mb-2">{t("seaFreight")}</h3>
            <p className="text-sm text-muted-foreground">{t("seaFreightDescription")}</p>
          </CardContent>
        </Card>
        <Card
          className={`cursor-pointer transition-all hover:shadow-lg ${
            formState.serviceType === "land" ? "ring-2 ring-primary" : ""
          }`}
          onClick={() => handleServiceTypeSelect("land")}
        >
          <CardContent className="p-6 text-center">
            <Truck className="w-12 h-12 mx-auto mb-4 text-primary" />
            <h3 className="text-lg font-semibold mb-2">{t("landFreight")}</h3>
            <p className="text-sm text-muted-foreground">{t("landFreightDescription")}</p>
          </CardContent>
        </Card>
      </div>
      {formState.serviceType === "air" && (
        <>
          <Card className="mb-4">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-4">{t("cargoDetails")}</h3>
              <div className="grid gap-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="weight">{t("weight")}</Label>
                    <Input
                      id="weight"
                      name="weight"
                      value={formState.data.weight}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dimensions">{t("dimensions")}</Label>
                    <Input
                      id="dimensions"
                      name="dimensions"
                      value={formState.data.dimensions}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="numberOfCartons">{t("numberOfCartons")}</Label>
                    <Input
                      id="numberOfCartons"
                      name="numberOfCartons"
                      type="number"
                      value={formState.data.numberOfCartons}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="numberOfPallets">{t("numberOfPallets")}</Label>
                    <Input
                      id="numberOfPallets"
                      name="numberOfPallets"
                      type="number"
                      value={formState.data.numberOfPallets}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="originAddress">{t("originAddress")}</Label>
                    <Input
                      id="originAddress"
                      name="originAddress"
                      value={formState.data.originAddress}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="destinationAddress">{t("destinationAddress")}</Label>
                    <Input
                      id="destinationAddress"
                      name="destinationAddress"
                      value={formState.data.destinationAddress}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-4">{t("additionalServices")}</h3>
              {renderServiceSpecificFields()}
            </CardContent>
          </Card>
        </>
      )}
      {formState.serviceType === "sea" && (
        <Card>
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold mb-4">{t("additionalServices")}</h3>
            {renderServiceSpecificFields()}
          </CardContent>
        </Card>
      )}
      {formState.serviceType && formState.serviceType !== "air" && formState.serviceType !== "sea" && (
        <Card>
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold mb-4">{t("additionalServices")}</h3>
            {renderServiceSpecificFields()}
          </CardContent>
        </Card>
      )}
    </div>
  )

  const renderStep = () => {
    switch (formState.currentStep) {
      case 1:
        return (
          <>
            <h2 className="text-2xl font-bold mb-4">{t("basicInfo")}</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">{t("name")}</Label>
                <Input id="name" name="name" value={formState.data.name} onChange={handleInputChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">{t("email")}</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formState.data.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">{t("phone")}</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formState.data.phone}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="workContactNumber">{t("workContactNumber")}</Label>
                <Input
                  id="workContactNumber"
                  name="workContactNumber"
                  type="tel"
                  value={formState.data.workContactNumber}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company">{t("company")}</Label>
                <Input
                  id="company"
                  name="company"
                  value={formState.data.companyNameSupplier}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="companyAddress">{t("companyAddress")}</Label>
                <Input
                  id="companyAddress"
                  name="companyAddress"
                  value={formState.data.companyAddress}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
          </>
        )
      case 2:
        return (
          <>
            <h2 className="text-2xl font-bold mb-4">{t("selectShippingMethod")}</h2>
            {renderServiceTypeSelector()}
          </>
        )
      case 3:
        return (
          <>
            <h2 className="text-2xl font-bold mb-4">{t("cargoDetails")}</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="weight">{t("weight")}</Label>
                <Input id="weight" name="weight" value={formState.data.weight} onChange={handleInputChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dimensions">{t("dimensions")}</Label>
                <Input
                  id="dimensions"
                  name="dimensions"
                  value={formState.data.dimensions}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="originAddress">{t("originAddress")}</Label>
                <Input
                  id="originAddress"
                  name="originAddress"
                  value={formState.data.originAddress}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="destinationAddress">{t("destinationAddress")}</Label>
                <Input
                  id="destinationAddress"
                  name="destinationAddress"
                  value={formState.data.destinationAddress}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
          </>
        )
      case 4:
        return (
          <>
            <h2 className="text-2xl font-bold mb-4">{t("finalReview")}</h2>
            <div className="space-y-4">
              <p>
                <strong>{t("name")}:</strong> {formState.data.name}
              </p>
              <p>
                <strong>{t("email")}:</strong> {formState.data.email}
              </p>
              <p>
                <strong>{t("phone")}:</strong> {formState.data.phone}
              </p>
              <p>
                <strong>{t("company")}:</strong> {formState.data.companyNameSupplier}
              </p>
              <p>
                <strong>{t("serviceType")}:</strong> {formState.data.serviceType}
              </p>
              <p>
                <strong>{t("weight")}:</strong> {formState.data.weight}
              </p>
              <p>
                <strong>{t("dimensions")}:</strong> {formState.data.dimensions}
              </p>
              <p>
                <strong>{t("originAddress")}:</strong> {formState.data.originAddress}
              </p>
              <p>
                <strong>{t("destinationAddress")}:</strong> {formState.data.destinationAddress}
              </p>
              {/* Add more fields as needed */}
            </div>
          </>
        )
      default:
        return null
    }
  }

  const renderServiceSpecificFields = () => {
    switch (formState.serviceType) {
      case "air":
        return (
          <div className="space-y-6">
            {/* Replace the hazardous cargo radio group with: */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isHazardous"
                checked={formState.data.isHazardous || false}
                onCheckedChange={(checked) =>
                  setFormState((prev) => ({
                    ...prev,
                    data: { ...prev.data, isHazardous: checked === true },
                  }))
                }
              />
              <Label htmlFor="isHazardous">{t("isHazardousCargo")}</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="isPerishable"
                checked={formState.data.isPerishable || false}
                onCheckedChange={(checked) =>
                  setFormState((prev) => ({
                    ...prev,
                    data: { ...prev.data, isPerishable: checked === true },
                  }))
                }
              />
              <Label htmlFor="isPerishable">{t("isPerishableCargo")}</Label>
            </div>

            <div className="space-y-3">
              <Label className={`text-base font-medium ${language === "ar" ? "text-right" : ""}`}>
                {t("deliveryUrgency")}
              </Label>
              <RadioGroup
                value={formState.data.deliveryUrgency}
                onValueChange={(value) =>
                  setFormState((prev) => ({
                    ...prev,
                    data: { ...prev.data, deliveryUrgency: value as "standard" | "express" | "priority" },
                  }))
                }
                className={`flex gap-4 ${language === "ar" ? "justify-end" : ""}`}
              >
                <div
                  className={`flex items-center ${language === "ar" ? "flex-row-reverse space-x-reverse" : "space-x-2"}`}
                >
                  <RadioGroupItem value="standard" id="standard" />
                  <Label htmlFor="standard">{t("standardDelivery")}</Label>
                </div>
                <div
                  className={`flex items-center ${language === "ar" ? "flex-row-reverse space-x-reverse" : "space-x-2"}`}
                >
                  <RadioGroupItem value="express" id="express" />
                  <Label htmlFor="express">{t("expressDelivery")}</Label>
                </div>
                <div
                  className={`flex items-center ${language === "ar" ? "flex-row-reverse space-x-reverse" : "space-x-2"}`}
                >
                  <RadioGroupItem value="priority" id="priority" />
                  <Label htmlFor="priority">{t("priorityDelivery")}</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        )
      case "sea":
        return (
          <div className="space-y-6">
            <div className="space-y-3">
              <Label className={`text-base font-medium ${language === "ar" ? "text-right" : ""}`}>
                {t("equipmentNeeded")}
              </Label>
              <Select
                value={formState.data.equipmentNeeded}
                onValueChange={(value) =>
                  setFormState((prev) => ({
                    ...prev,
                    data: {
                      ...prev.data,
                      equipmentNeeded: value as "LCL" | "20ft" | "40ft" | "40HC" | "40REEF" | "20OT" | "40OT",
                    },
                  }))
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select equipment type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="LCL">LCL</SelectItem>
                  <SelectItem value="20ft">20ft</SelectItem>
                  <SelectItem value="40ft">40ft</SelectItem>
                  <SelectItem value="40HC">40HC</SelectItem>
                  <SelectItem value="40REEF">40REEF</SelectItem>
                  <SelectItem value="20OT">20OT</SelectItem>
                  <SelectItem value="40OT">40OT</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {formState.data.equipmentNeeded === "LCL" && (
              <div className="space-y-6 mt-6">
                <h3 className="text-xl font-semibold mb-6">{t("cargoDetails")}</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="weight">{t("weight")}</Label>
                      <Input
                        id="weight"
                        name="weight"
                        value={formState.data.weight}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dimensions">{t("dimensions")}</Label>
                      <Input
                        id="dimensions"
                        name="dimensions"
                        placeholder="L x W x H"
                        value={formState.data.dimensions}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="numberOfCartons">{t("numberOfCartons")}</Label>
                      <Input
                        id="numberOfCartons"
                        name="numberOfCartons"
                        type="number"
                        value={formState.data.numberOfCartons}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="numberOfPallets">{t("numberOfPallets")}</Label>
                      <Input
                        id="numberOfPallets"
                        name="numberOfPallets"
                        type="number"
                        value={formState.data.numberOfPallets}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="originAddress">{t("originAddress")}</Label>
                    <Input
                      id="originAddress"
                      name="originAddress"
                      value={formState.data.originAddress}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="destinationAddress">{t("destinationAddress")}</Label>
                    <Input
                      id="destinationAddress"
                      name="destinationAddress"
                      value={formState.data.destinationAddress}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <h3 className="text-base font-medium">{t("isHazardousCargo")}</h3>
                  <RadioGroup
                    value={formState.data.isHazardous ? "yes" : "no"}
                    onValueChange={(value) =>
                      setFormState((prev) => ({
                        ...prev,
                        data: { ...prev.data, isHazardous: value === "yes" },
                      }))
                    }
                    className={`flex gap-4 ${language === "ar" ? "justify-end" : ""}`}
                  >
                    <div
                      className={`flex items-center ${language === "ar" ? "flex-row-reverse space-x-reverse" : "space-x-2"}`}
                    >
                      <RadioGroupItem value="yes" id="hazardous-yes-sea" />
                      <Label htmlFor="hazardous-yes-sea">{t("yes")}</Label>
                    </div>
                    <div
                      className={`flex items-center ${language === "ar" ? "flex-row-reverse space-x-reverse" : "space-x-2"}`}
                    >
                      <RadioGroupItem value="no" id="hazardous-no-sea" />
                      <Label htmlFor="hazardous-no-sea">{t("no")}</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            )}
          </div>
        )
      case "land":
        return (
          <div className="space-y-6">
            <div className="space-y-3">
              <h3 className={`text-base font-medium ${language === "ar" ? "text-right" : ""}`}>
                {t("requiresLoadingAssistance")}
              </h3>
              <RadioGroup
                value={formState.data.requiresLoadingAssistance ? "yes" : "no"}
                onValueChange={(value) =>
                  setFormState((prev) => ({
                    ...prev,
                    data: { ...prev.data, requiresLoadingAssistance: value === "yes" },
                  }))
                }
                className={`flex gap-4 ${language === "ar" ? "justify-end" : ""}`}
              >
                <div
                  className={`flex items-center ${language === "ar" ? "flex-row-reverse space-x-reverse" : "space-x-2"}`}
                >
                  <RadioGroupItem value="yes" id="loading-yes" />
                  <Label htmlFor="loading-yes">{t("yes")}</Label>
                </div>
                <div
                  className={`flex items-center ${language === "ar" ? "flex-row-reverse space-x-reverse" : "space-x-2"}`}
                >
                  <RadioGroupItem value="no" id="loading-no" />
                  <Label htmlFor="loading-no">{t("no")}</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-3">
              <h3 className={`text-base font-medium ${language === "ar" ? "text-right" : ""}`}>
                {t("requiresUnloadingAssistance")}
              </h3>
              <RadioGroup
                value={formState.data.requiresUnloadingAssistance ? "yes" : "no"}
                onValueChange={(value) =>
                  setFormState((prev) => ({
                    ...prev,
                    data: { ...prev.data, requiresUnloadingAssistance: value === "yes" },
                  }))
                }
                className={`flex gap-4 ${language === "ar" ? "justify-end" : ""}`}
              >
                <div
                  className={`flex items-center ${language === "ar" ? "flex-row-reverse space-x-reverse" : "space-x-2"}`}
                >
                  <RadioGroupItem value="yes" id="unloading-yes" />
                  <Label htmlFor="unloading-yes">{t("yes")}</Label>
                </div>
                <div
                  className={`flex items-center ${language === "ar" ? "flex-row-reverse space-x-reverse" : "space-x-2"}`}
                >
                  <RadioGroupItem value="no" id="unloading-no" />
                  <Label htmlFor="unloading-no">{t("no")}</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-3">
              <h3 className={`text-base font-medium ${language === "ar" ? "text-right" : ""}`}>
                {t("isHazardousCargo")}
              </h3>
              <RadioGroup
                value={formState.data.isHazardous ? "yes" : "no"}
                onValueChange={(value) =>
                  setFormState((prev) => ({
                    ...prev,
                    data: { ...prev.data, isHazardous: value === "yes" },
                  }))
                }
                className={`flex gap-4 ${language === "ar" ? "justify-end" : ""}`}
              >
                <div
                  className={`flex items-center ${language === "ar" ? "flex-row-reverse space-x-reverse" : "space-x-2"}`}
                >
                  <RadioGroupItem value="yes" id="hazardous-yes-land" />
                  <Label htmlFor="hazardous-yes-land">{t("yes")}</Label>
                </div>
                <div
                  className={`flex items-center ${language === "ar" ? "flex-row-reverse space-x-reverse" : "space-x-2"}`}
                >
                  <RadioGroupItem value="no" id="hazardous-no-land" />
                  <Label htmlFor="hazardous-no-land">{t("no")}</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        )
      default:
        return null
    }
  }

  const nextStep = () => {
    setFormState((prev) => ({ ...prev, currentStep: prev.currentStep + 1 }))
  }

  const prevStep = () => {
    setFormState((prev) => ({ ...prev, currentStep: prev.currentStep - 1 }))
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
                {/* Replace the navigation buttons section with this RTL-aware version */}
                <div className={`flex ${language === "ar" ? "flex-row-reverse" : ""} justify-between mt-6`}>
                  {formState.currentStep > 1 && (
                    <Button type="button" onClick={prevStep} className="flex items-center">
                      {language === "ar" ? (
                        <>
                          {t("previous")} <ArrowLeft className="ml-2 h-4 w-4" />
                        </>
                      ) : (
                        <>
                          <ArrowLeft className="mr-2 h-4 w-4" /> {t("previous")}
                        </>
                      )}
                    </Button>
                  )}
                  {formState.currentStep < 4 && (
                    <Button type="button" onClick={nextStep} className="flex items-center">
                      {language === "ar" ? (
                        <>
                          <ArrowRight className="mr-2 h-4 w-4" /> {t("next")}
                        </>
                      ) : (
                        <>
                          {t("next")} <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  )}
                  {formState.currentStep === 4 && (
                    <Button type="submit" disabled={formState.isSubmitting} className="flex items-center">
                      {formState.isSubmitting ? t("submitting") : t("submit")}
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

