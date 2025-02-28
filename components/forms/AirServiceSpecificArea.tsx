import { ServiceSpecificAreaProp } from "@/app/types/formState"
import { CargoDetails } from "@/components/cargo-details"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

export function AirServiceSpecificArea({
    handleDimensionsChange,
    handleWeightChange,
    formState,
    data,
    setFormState,
    handleInputChange,
    t,
    language
}: ServiceSpecificAreaProp) {
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
}
