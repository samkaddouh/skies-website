import type React from "react"
import { Plane, Ship, Truck } from "lucide-react"
import { ServiceTypeCard } from "./ServiceTypeCard"
import { ShippingTermsSelector } from "./ShippingTermsSelector"
import { CargoTypeSelector } from "./CargoTypeSelector"
import type { TranslationKey } from "@/utils/translations"
import type { ShippingTerm } from "./ShippingTermsSelector"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

type ServiceType = "air" | "sea" | "land" | null
type CargoType = "general" | "hazardous"

interface StepTwoProps {
  data: {
    shippingTerm?: ShippingTerm
    serviceType: ServiceType
    exactPickupAddress?: string
    cargoType?: CargoType
    packages?: string
  }
  onServiceTypeSelect: (type: ServiceType) => void
  onShippingTermChange: (term: ShippingTerm) => void
  onCargoTypeChange: (type: CargoType) => void
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  t: (key: TranslationKey) => string
  renderServiceSpecificFields: () => React.ReactNode
  onPrevious: () => void
  onNext: () => void
  onReset: () => void
  language: string
}

export function StepTwo({
  data,
  onServiceTypeSelect,
  onShippingTermChange,
  onCargoTypeChange,
  handleInputChange,
  t,
  renderServiceSpecificFields,
  onPrevious,
  onNext,
  onReset,
  language,
}: StepTwoProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-4">{t("selectShippingMethod")}</h2>

      <div className="space-y-4">
        <div className="space-y-2">
          <ShippingTermsSelector value={data.shippingTerm} onChange={onShippingTermChange} t={t} />
        </div>

        {data.shippingTerm === "EXW" && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-base font-medium">
                {t("exactPickupAddress")}
                <span className="text-red-500 ml-1">*</span>
              </Label>
              <input
                type="text"
                name="exactPickupAddress"
                value={data.exactPickupAddress || ""}
                onChange={handleInputChange}
                placeholder={t("destinationAddressPlaceholder")}
                className="w-full px-3 py-2 border rounded-md border-input bg-background text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                required
              />
            </div>
            <div className="space-y-3">
              <Label className="text-base font-medium"></Label>
              <CargoTypeSelector value={data.cargoType} onChange={onCargoTypeChange} t={t} />
            </div>
          </div>
        )}

        {data.shippingTerm === "FOB" && (
          <div className="space-y-3">
            <Label className="text-base font-medium"></Label>
            <CargoTypeSelector value={data.cargoType} onChange={onCargoTypeChange} t={t} />
          </div>
        )}

        {data.shippingTerm && (
          <div className="space-y-6">
            <div className="space-y-3">
              <Label className="text-base font-medium">
                {t("chooseService")}
                <span className="text-red-500 ml-1">*</span>
              </Label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <ServiceTypeCard
                  icon={Plane}
                  title={t("airFreight")}
                  description={t("airFreightDescription")}
                  onClick={() => onServiceTypeSelect("air")}
                  isSelected={data.serviceType === "air"}
                />
                <ServiceTypeCard
                  icon={Ship}
                  title={t("seaFreight")}
                  description={t("seaFreightDescription")}
                  onClick={() => onServiceTypeSelect("sea")}
                  isSelected={data.serviceType === "sea"}
                />
                <ServiceTypeCard
                  icon={Truck}
                  title={t("landFreight")}
                  description={t("landFreightDescription")}
                  onClick={() => onServiceTypeSelect("land")}
                  isSelected={data.serviceType === "land"}
                />
              </div>
            </div>

            {data.serviceType && renderServiceSpecificFields()}
          </div>
        )}
      </div>

      <div className={`flex justify-between items-center mt-6 ${language === "ar" ? "flex-row-reverse" : ""}`}>
        <Button onClick={onPrevious}>{t("previous")}</Button>
        <Button variant="destructive" onClick={onReset} type="button">
          {t("resetForm")}
        </Button>
        <Button onClick={onNext}>{t("next")}</Button>
      </div>
    </div>
  )
}

