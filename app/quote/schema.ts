import { z } from "zod"

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
  description: z.string().min(10, "descriptionTooShort"),
  value: z.string().min(1, "valueRequired"),
  weight: z.string().min(1, "weightRequired"),
  dimensions: z.string().min(1, "dimensionsRequired"),
  additionalInfo: z.string().optional(),
})

// Air freight specific fields
export const AirFreightSchema = BaseQuoteSchema.extend({
  isHazardous: z.boolean(),
  isPerishable: z.boolean(),
  preferredAirline: z.string().optional(),
  deliveryUrgency: z.enum(["standard", "express", "priority"]),
})

// Sea freight specific fields
export const SeaFreightSchema = BaseQuoteSchema.extend({
  containerType: z.enum(["20ft", "40ft", "40ft-hc", "lcl"]),
  isHazardous: z.boolean(),
  requiresRefrigeration: z.boolean(),
  preferredShippingLine: z.string().optional(),
})

// Land freight specific fields
export const LandFreightSchema = BaseQuoteSchema.extend({
  vehicleType: z.enum(["van", "truck", "trailer"]),
  requiresLoadingAssistance: z.boolean(),
  requiresUnloadingAssistance: z.boolean(),
  preferredDeliveryDate: z.string().optional(),
})

export type BaseQuoteFormData = z.infer<typeof BaseQuoteSchema>
export type AirFreightFormData = z.infer<typeof AirFreightSchema>
export type SeaFreightFormData = z.infer<typeof SeaFreightSchema>
export type LandFreightFormData = z.infer<typeof LandFreightSchema>

