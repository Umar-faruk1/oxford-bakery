"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Loader2 } from "lucide-react"
import api from "@/lib/axios"
import { Button } from "@/components/ui/button"

const API_URL = "http://localhost:8000"
const REFRESH_INTERVAL = 10000 // 10 seconds

interface Category {
  id: number
  name: string
  image: string
  description: string
}

export default function CategoriesSection() {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchCategories = async () => {
    try {
      console.log('Fetching categories...')
      const response = await api.get('/menu/categories')
      console.log('Categories response:', response.data)

      if (!response.data || !Array.isArray(response.data)) {
        throw new Error('Invalid response format')
      }

      const allCategory = {
        id: 0,
        name: "All",
        image: response.data[0]?.image || '/placeholder.svg',
        description: "All Categories"
      }

      const formattedCategories = response.data.map((category: Category) => {
        console.log('Processing category:', category)
        return {
          ...category,
          image: category.image || '/placeholder.svg'
        }
      })

      console.log('Processed categories:', formattedCategories)
      setCategories([allCategory, ...formattedCategories])
      setError(null)
    } catch (error: any) {
      console.error("Error fetching categories:", error)
      setError(error.response?.data?.message || "Failed to load categories")
      setCategories([])
    } finally {
      setIsLoading(false)
    }
  }

  // Initial fetch and setup polling
  useEffect(() => {
    let mounted = true

    const loadData = async () => {
      if (!mounted) return
      setIsLoading(true)
      await fetchCategories()
    }

    loadData()

    // Set up polling
    const intervalId = setInterval(() => {
      if (mounted) {
        fetchCategories()
      }
    }, REFRESH_INTERVAL)

    // Cleanup
    return () => {
      mounted = false
      clearInterval(intervalId)
    }
  }, [])

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(categoryId)

    // Dispatch a custom event to notify other components
    const event = new CustomEvent("categoryChange", {
      detail: { category: categoryId },
    })
    window.dispatchEvent(event)
  }

  if (error) {
    return (
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4 text-center">
            <p className="text-lg text-red-600">{error}</p>
            <Button 
              onClick={() => {
                setIsLoading(true)
                fetchCategories()
              }}
              className="bg-[#FF7F00] hover:bg-[#FF7F00]/90"
            >
              Try Again
            </Button>
          </div>
        </div>
      </section>
    )
  }

  if (isLoading) {
    return (
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-[#FF7F00]" />
            <p className="text-lg text-gray-600">Loading categories...</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 text-center">Categories</h2>

        <ScrollArea className="w-full whitespace-nowrap">
          <div className="flex justify-center space-x-6 pb-4">
            {categories.map((category) => (
              <motion.button
                key={category.id}
                onClick={() => handleCategoryClick(category.id === 0 ? "all" : category.name.toLowerCase())}
                className={`flex flex-col items-center p-3 rounded-lg transition-colors ${
                  selectedCategory === (category.id === 0 ? "all" : category.name.toLowerCase())
                    ? "bg-[#FF7F00] text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div
                  className={`w-20 h-20 rounded-full overflow-hidden mb-3 border-2 ${
                    selectedCategory === (category.id === 0 ? "all" : category.name.toLowerCase())
                      ? "border-white"
                      : "border-[#FF7F00]"
                  }`}
                >
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="text-sm font-medium text-center">{category.name}</span>
              </motion.button>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </section>
  )
}

