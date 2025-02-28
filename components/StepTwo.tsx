import type React from "react"
import { useState } from "react"

import { ShippingTermsSelector } from "./ShippingTermsSelector"
import { CargoTypeSelector } from "./CargoTypeSelector"

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

import { Label } from "@/components/ui/label"

import { StepTwoProps } from "@/app/types/formState"

import { ServiceSpecificArea } from "@/components/forms/ServiceSpecificArea"

import { ServiceTypeSelector } from "@/components/forms/ServiceTypeSelector"


import { BaseQuoteSchema } from "@/app/quote/schema"


export function StepTwo({
  data,
  onServiceTypeSelect,
  onShippingTermChange,
  onCargoTypeChange,
  handleInputChange,
  t,
  onPrevious,
  onNext,
  onReset,
  language,
  handleDimensionsChange,
  handleWeightChange,
  formState,
  setFormState
}: StepTwoProps) {
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    console.log("helllo");
    const result = BaseQuoteSchema.safeParse({ [name]: value });
    if (!result.success) {
      const error = result?.error?.errors.filter(a => a.path[0] === name);
      if (error && error.length > 0) {
        const message = error[0].message as string;
        setErrors((prev) => ({ ...prev, [name]: t(message as string) }));
      } else {
        setErrors((prev) => ({ ...prev, [name]: "" }));
      }
    } else {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

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
                onBlur={handleBlur}
                placeholder={t("destinationAddressPlaceholder")}
                className="w-full px-3 py-2 border rounded-md border-input bg-background text-sm ring-offset-background placeholder:italic placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                required
              />
              {errors.exactPickupAddress && <p className="text-red-500 text-sm">{errors.exactPickupAddress}</p>}
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
            <ServiceTypeSelector
              t={t}
              value={data.serviceType}
              onServiceTypeSelect={onServiceTypeSelect}
            />
            {data.serviceType &&
              <ServiceSpecificArea
                handleDimensionsChange={handleDimensionsChange}
                handleWeightChange={handleWeightChange}
                formState={formState}
                data={data}
                setFormState={setFormState}
                handleInputChange={handleInputChange}
                t={t}
                language={language}
              />
            }

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="descriptionOfGoods" className="text-base font-medium">
                  {t("descriptionOfGoods")}
                  <span className="text-red-500 ml-1">*</span>
                </Label>
                <Textarea
                  id="descriptionOfGoods"
                  name="descriptionOfGoods"
                  value={data.descriptionOfGoods || ""}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  placeholder={t("descriptionOfGoodsPlaceholder")}
                  className="w-full px-3 py-2 border rounded-md border-input bg-background text-sm ring-offset-background placeholder:italic placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  required
                />
                {errors.descriptionOfGoods && <p className="text-red-500 text-sm">{errors.descriptionOfGoods}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="additionalInfo" className="text-base font-medium">
                  {t("additionalInfo")}
                </Label>
                <Textarea
                  id="additionalInfo"
                  name="additionalInfo"
                  value={data.additionalInfo || ""}
                  onChange={handleInputChange}
                  placeholder={t("additionalInfoPlaceholder")}
                  className="w-full px-3 py-2 border rounded-md border-input bg-background text-sm ring-offset-background placeholder:italic placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {
        data.shippingTerm && (
          <div className={`flex justify-between items-center mt-6 ${language === "ar" ? "flex-row-reverse" : ""}`}>
            <Button onClick={onPrevious}>{t("previous")}</Button>
            <Button variant="destructive" onClick={onReset} type="button">
              {t("resetForm")}
            </Button>
            <Button onClick={onNext}>{t("submitQuote")}</Button>
          </div>
        )
      }
    </div >
  )
}