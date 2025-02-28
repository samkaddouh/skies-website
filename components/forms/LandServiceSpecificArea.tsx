import { ServiceSpecificAreaProp } from "@/app/types/formState"
import { CargoDetails } from "@/components/cargo-details"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

export function LandServiceSpecificArea({
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
            <div className="space-y-4">
                <div className="space-y-2">
                    <Label className="text-base font-medium">
                        {t("loadingAssistance")}
                    </Label>
                    <RadioGroup
                        value={formState.data.loadingAssistance}
                        onValueChange={(value) =>
                            setFormState((prev) => ({
                                ...prev,
                                data: { ...prev.data, loadingAssistance: value },
                            }))
                        }
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
                <div className="space-y-2">
                    <Label className="text-base font-medium">
                        {t("unloadingAssistance")}
                    </Label>
                    <RadioGroup
                        value={formState.data.unloadingAssistance}
                        onValueChange={(value) =>
                            setFormState((prev) => ({
                                ...prev,
                                data: { ...prev.data, unloadingAssistance: value },
                            }))
                        }
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
}
