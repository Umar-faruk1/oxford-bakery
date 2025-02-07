"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { submitHelpQuery } from "./actions"
import { HelpCategory, HelpQuery } from "@/types"
import { TabNavigation } from "@/app/components/Common/TabNavigation"

const helpCategories: HelpCategory[] = [
  { value: "order_delivery", label: "Order Delivery" },
  { value: "payment", label: "Payment" },
  { value: "customer_service", label: "Customer Service" },
  { value: "account_related", label: "Account Related" },
  { value: "other", label: "Other" },
]

export default function HelpPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [query, setQuery] = useState<HelpQuery>({
    category: "",
    description: "",
  })
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!query.category || !query.description) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please fill in all fields",
      })
      return
    }

    setIsSubmitting(true)
    try {
      const result = await submitHelpQuery(query)
      if (result.success) {
        toast({
          title: "Success",
          description: result.message,
        })
        // Reset form
        setQuery({ category: "", description: "" })
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Something went wrong. Please try again.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 pt-16 pb-16">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link href="/user">
            <Button variant="outline" className="text-red-500 hover:text-red-600 hover:bg-red-60">
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back to my Profile
            </Button>
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold mb-6">Get Support</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">What kind of help do you need?</label>
              <Select value={query.category} onValueChange={(value) => setQuery({ ...query, category: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {helpCategories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Describe your issue</label>
              <Textarea
                value={query.description}
                onChange={(e) => setQuery({ ...query, description: e.target.value })}
                placeholder="Please provide details about your issue..."
                className="min-h-[150px]"
              />
            </div>

            <Button type="submit" className="w-full bg-red-500 hover:bg-red-600" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit Query"}
            </Button>
          </form>
        </div>
      </div>
      <TabNavigation/>
      <Toaster />
    </main>
  )
}

