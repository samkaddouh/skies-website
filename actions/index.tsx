"use server"

import { FormState } from "@/app/types/formState"
import { BaseQuoteSchema } from "@/app/quote/schema"
import nodemailer from "nodemailer"
import { z } from "zod"

export async function sendQuote(formData: FormState) {
    try {


        // console.log(formData);
        // Convert FormData to a regular object
        // const rawFormData = Object.fromEntries(formData.entries())


        // Validate the form data
        console.log(formData);
        const validatedFields = BaseQuoteSchema.safeParse(formData.data)
        console.log(JSON.stringify(validatedFields));
        // If validation fails, return the errors
        if (!validatedFields.success) {
            return {
                error: validatedFields.error.issues[0].message,
            }
        }

        const data = validatedFields.data

        // Create email transporter
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        })

        // Prepare email content
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER,
            subject: `New Quote Request - ${data.serviceType.toUpperCase()} Freight`,
            html: `
        <h2>New Quote Request</h2>
        <p><strong>Service Type:</strong> ${data.serviceType}</p>
        <p><strong>Name:</strong> ${data.name}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Phone:</strong> ${data.phone}</p>
        <p><strong>Company Name:</strong> ${data.companyNameSupplier}</p>
        <p><strong>Origin:</strong> ${data.originAddress}</p>
        <p><strong>Destination:</strong> ${data.destinationAddress}</p>
        <p><strong>Description:</strong> ${data.additionalInfo}</p>
        <p><strong>Value:</strong> ${data.value}</p>
        <p><strong>Weight:</strong> ${data.weight}</p>
        <p><strong>Dimensions:</strong> ${data.dimensions}</p>
        ${data.additionalInfo ? `<p><strong>Additional Info:</strong> ${data.additionalInfo}</p>` : ""}
      `,
        }

        // Send the email
        await transporter.sendMail(mailOptions)

        return { success: true }
    } catch (error) {
        console.error("Quote request error:", error)
        return {
            error: "An error occurred while sending the quote request. Please try again.",
        }
    }
}




// Define the validation schema
const ContactFormSchema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    phone: z.string().regex(/^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/),
    company: z
        .string()
        .refine((val) => {
            if (val.length === 0) return true // Allow empty string
            return val.length >= 2 // Only check length if value is provided
        })
        .optional(),
    message: z.string().min(10),
})

type ContactFormData = z.infer<typeof ContactFormSchema>

export async function sendEmail(formData: FormData) {
    try {
        // Convert FormData to a regular object
        const rawFormData = Object.fromEntries(formData.entries())

        // Validate the form data
        const validatedFields = ContactFormSchema.safeParse(rawFormData)

        // If validation fails, return the errors
        if (!validatedFields.success) {
            return {
                error: validatedFields.error.issues[0].message,
            }
        }

        const data = validatedFields.data as ContactFormData

        // Create email transporter
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        })

        // Prepare email content
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER, // Send to yourself or a designated email
            subject: "New Contact Form Submission",
            html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${data.name}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Phone:</strong> ${data.phone}</p>
        ${data.company ? `<p><strong>Company:</strong> ${data.company}</p>` : ""}
        <p><strong>Message:</strong></p>
        <p>${data.message.replace(/\n/g, "<br>")}</p>
      `,
        }

        // Send the email
        await transporter.sendMail(mailOptions)

        return { success: true }
    } catch (error) {
        console.error("Email sending error:", error)
        return {
            error: "An error occurred while sending the message. Please try again.",
        }
    }
}

