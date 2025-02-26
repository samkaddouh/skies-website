"use server"

import { BaseQuoteSchema } from "./schema"
import nodemailer from "nodemailer"

export async function sendQuote(formData: FormData) {
  try {
    // Convert FormData to a regular object
    const rawFormData = Object.fromEntries(formData.entries())

    // Validate the form data
    const validatedFields = BaseQuoteSchema.safeParse(rawFormData)

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
        <p><strong>Description:</strong> ${data.description}</p>
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

