import { z } from "zod"

export type ServiceType = "air" | "sea" | "land" | null


// Base schema for fields common to all freight types
export const BaseQuoteSchema = z.object({
  name: z
    .string()
    .min(2, "nameTooShort")
    .refine((val) => !/\d/.test(val), "nameContainsNumbers"),
  email: z.string().email("invalidEmail"),
  phone: z
    .string()
    .min(8, "invalidPhone")
    .regex(/^\+?[0-9\s-]{8,}$/, "invalidPhone")
    .refine((val) => {
      return /\d/.test(val)
    }, "invalidPhone"),
  originAddress: z.string().min(5, "originAddressTooShort"),
  destinationAddress: z.string().min(5, "destinationAddressTooShort"),
  serviceType: z.enum(["air", "sea", "land"] as const),
  description: z.string().min(0, "descriptionTooShort"),
  // value: z.string().min(1, "valueRequired"),
  weightValue: z.string().min(1, "required"),
  dimensions: z.string().min(0, "required"),
  additionalInfo: z.string().optional(),
  companyNameSupplier: z.string().min(2, "companyNameTooShort"),
  packages: z.string().min(1, "packagesRequired"),
  shippingTerm: z.enum(["EXW", "FOB"] as const).optional(),
  exactPickupAddress: z.string().min(6, "required"),
  descriptionOfGoods: z.string().min(6, "required"),
  cargoGaugeType: z.enum(["in", "out"]).optional(),
  containerCapacity: z.number().optional(),
  cargoDimensions: z.string().min(3, "required"),
})

// Air freight specific fields
export const AirFreightSchema = BaseQuoteSchema.extend({
  preferredAirline: z.string().optional(),
  deliveryUrgency: z.enum(["standard", "express", "priority"]),
})

// Sea freight specific fields
export const SeaFreightSchema = BaseQuoteSchema.extend({
  equipmentNeeded: z.enum(["LCL", "20ft", "40ft", "20HC", "40HC", "20REEF", "40REEF", "20OT", "40OT"]),
})

// Land freight specific fields
export const LandFreightSchema = BaseQuoteSchema.extend({
  requiresLoadingAssistance: z.boolean(),
  requiresUnloadingAssistance: z.boolean(),
})

export type BaseQuoteFormData = z.infer<typeof BaseQuoteSchema>
export type AirFreightFormData = z.infer<typeof AirFreightSchema>
export type SeaFreightFormData = z.infer<typeof SeaFreightSchema>
export type LandFreightFormData = z.infer<typeof LandFreightSchema>

