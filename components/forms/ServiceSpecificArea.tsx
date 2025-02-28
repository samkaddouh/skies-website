import { SeaServiceSpecificArea } from "@/components/forms/SeaServiceSpecificArea"
import { AirServiceSpecificArea } from "@/components/forms/AirServiceSpecificArea"
import { LandServiceSpecificArea } from "@/components/forms/LandServiceSpecificArea"
import { ServiceSpecificAreaProp } from "@/app/types/formState"

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
    // const [serviceType, setServiceType] = useState("sea") // Default service type is 'sea'

    return (
        <div className="space-y-6">
            <div className="space-y-4">
                {data.serviceType === "sea" && (
                    <SeaServiceSpecificArea
                        handleDimensionsChange={handleDimensionsChange}
                        handleWeightChange={handleWeightChange}
                        formState={formState}
                        data={data}
                        setFormState={setFormState}
                        handleInputChange={handleInputChange}
                        t={t}
                        language={language}
                    />
                )}
                {data.serviceType === "air" && (
                    <AirServiceSpecificArea
                        handleDimensionsChange={handleDimensionsChange}
                        handleWeightChange={handleWeightChange}
                        formState={formState}
                        data={data}
                        setFormState={setFormState}
                        handleInputChange={handleInputChange}
                        t={t}
                        language={language}
                    />
                )}
                {data.serviceType === "land" && (
                    <LandServiceSpecificArea
                        handleDimensionsChange={handleDimensionsChange}
                        handleWeightChange={handleWeightChange}
                        formState={formState}
                        data={data}
                        setFormState={setFormState}
                        handleInputChange={handleInputChange}
                        t={t}
                        language={language}
                    />
                )}
            </div>

        </div>
    )
}
