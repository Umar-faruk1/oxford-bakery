"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import CakeCard from "@/components/cake-card"
import type { Cake } from "@/types/types"
import api from "@/lib/axios"
import { Button } from "@/components/ui/button"

const API_URL = "http://localhost:8000"
const REFRESH_INTERVAL = 10000 // 10 seconds

export default function MenuSection() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredCakes, setFilteredCakes] = useState<Cake[]>([])
  const [allCakes, setAllCakes] = useState<Cake[]>([])
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch menu items
  const fetchMenuItems = async () => {
    try {
      console.log('Fetching menu items...')
      const response = await api.get('/menu/items')
      console.log('Menu items response:', response.data)
      
      if (!response.data || !Array.isArray(response.data)) {
        throw new Error('Invalid response format')
      }

      const menuItems = response.data.map((item: any) => {
        console.log('Processing item:', item)
        return {
          id: item.id,
          name: item.name,
          price: item.price,
          image: item.image || '/placeholder.svg',
          category: item.category?.name?.toLowerCase() || 'uncategorized',
          description: item.description,
        }
      })

      console.log('Processed menu items:', menuItems)
      setAllCakes(menuItems)
      setFilteredCakes(menuItems)
      setError(null)
    } catch (error: any) {
      console.error("Error fetching menu items:", error)
      setError(error.response?.data?.message || "Failed to load menu items")
      setAllCakes([])
      setFilteredCakes([])
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
      await fetchMenuItems()
    }

    loadData()

    // Set up polling
    const intervalId = setInterval(() => {
      if (mounted) {
        fetchMenuItems()
      }
    }, REFRESH_INTERVAL)

    // Cleanup
    return () => {
      mounted = false
      clearInterval(intervalId)
    }
  }, [])

  // Filter cakes based on search query and selected category
  useEffect(() => {
    let result = allCakes

    // Filter by category if not "all"
    if (selectedCategory !== "all") {
      result = result.filter((cake) => cake.category === selectedCategory)
    }

    // Filter by search query
    if (searchQuery) {
      result = result.filter((cake) => cake.name.toLowerCase().includes(searchQuery.toLowerCase()))
    }

    setFilteredCakes(result)
  }, [searchQuery, selectedCategory, allCakes])

  // Listen for category changes from CategoriesSection
  useEffect(() => {
    const handleCategoryChange = (event: CustomEvent<{ category: string }>) => {
      setSelectedCategory(event.detail.category)
    }

    window.addEventListener("categoryChange", handleCategoryChange as EventListener)

    return () => {
      window.removeEventListener("categoryChange", handleCategoryChange as EventListener)
    }
  }, [])

  if (error) {
    return (
      <section className="py-12">
        <div className="container mx-auto px-4 flex items-center justify-center min-h-[40vh]">
          <div className="flex flex-col items-center gap-4 text-center">
            <p className="text-lg text-red-600">{error}</p>
            <Button 
              onClick={() => {
                setIsLoading(true)
                fetchMenuItems()
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
      <section className="py-12">
        <div className="container mx-auto px-4 flex items-center justify-center min-h-[40vh]">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-[#FF7F00]" />
            <p className="text-lg text-gray-600">Loading menu items...</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 text-center">Our Menu</h2>

        {/* Search Bar */}
        <div className="max-w-md mx-auto mb-10 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="Search for cakes..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Cake Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedCategory + searchQuery}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
          >
            {filteredCakes.length > 0 ? (
              filteredCakes.slice(0, 8).map((cake) => (
                <CakeCard 
                  key={cake.id} 
                  cake={cake}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-10">
                <p className="text-lg text-gray-500">No cakes found. Try a different search or category.</p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  )
}

