"use server"

import { HelpQuery } from "@/types"

export async function submitHelpQuery(data: HelpQuery) {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // In a real app, you'd send this to your backend
  console.log("Help query submitted:", data)

  return {
    success: true,
    message: "Your query has been submitted successfully. We'll get back to you soon.",
  }
}

