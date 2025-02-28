import { ServiceSpecificAreaProp } from "@/app/types/formState"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TemperatureInput } from "@/components/TemperatureInput"
import { DimensionsInput } from "@/components/DimensionsInput"
import { GaugeButton } from "@/components/GaugeButton"
import { Label } from "@/components/ui/label"


import { CargoDetails } from "@/components/cargo-details"

export function ServiceSpecificArea({
    handleDimensionsChange,
    handleWeightChange,
    formState,
    data,
    setFormState,
    handleInputChange,
    t,
    language
}: ServiceSpecificAreaProp) {
    switch (data.serviceType) {
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
                                    language={language as "en" | "ar"}
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
                                            language={language as "en" | "ar"}
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
                                            language={language as "en" | "ar"}
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