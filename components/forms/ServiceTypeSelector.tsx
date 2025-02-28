import React from "react";
import { Plane, Ship, Truck } from "lucide-react"
import { ServiceTypeCard } from "@/components/ServiceTypeCard"
import { Label } from "@/components/ui/label"
import { ServiceTypeSelectorProps } from "@/app/types/formState"
export function ServiceTypeSelector({
    t,
    value,
    onServiceTypeSelect
}: ServiceTypeSelectorProps
) {
    return <div className="space-y-3">
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
                isSelected={value === "air"}
            />
            <ServiceTypeCard
                icon={Ship}
                title={t("seaFreight")}
                description={t("seaFreightDescription")}
                onClick={() => onServiceTypeSelect("sea")}
                isSelected={value === "sea"}
            />
            <ServiceTypeCard
                icon={Truck}
                title={t("landFreight")}
                description={t("landFreightDescription")}
                onClick={() => onServiceTypeSelect("land")}
                isSelected={value === "land"}
            />
        </div>
    </div>
}
