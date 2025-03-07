"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, SlidersHorizontal, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import CakeCard from "@/components/cake-card"
import type { Cake } from "@/types/types"
import api from "@/lib/axios"

export default function MenuPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [priceRange, setPriceRange] = useState([0, 150])
  const [filteredCakes, setFilteredCakes] = useState<Cake[]>([])
  const [allCakes, setAllCakes] = useState<Cake[]>([])
  const [categories, setCategories] = useState<string[]>(["all"])
  const [isLoading, setIsLoading] = useState(true)
  const menuRef = useRef<HTMLDivElement>(null)

  // Fetch menu items and categories
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        // Fetch menu items
        const menuResponse = await api.get('/menu/items')
        const menuItems = menuResponse.data.map((item: any) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          image: item.image,
          category: item.category.name.toLowerCase(),
          description: item.description,
        }))
        setAllCakes(menuItems)

        // Fetch categories
        const categoriesResponse = await api.get('/menu/categories')
        const categoryNames = ["all", ...categoriesResponse.data.map((cat: any) => cat.name.toLowerCase())]
        setCategories(categoryNames)
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  // Filter cakes based on search query, category, and price range
  useEffect(() => {
    let result = allCakes

    // Filter by category
    if (selectedCategory !== "all") {
      result = result.filter((cake) => cake.category === selectedCategory)
    }

    // Filter by search query
    if (searchQuery) {
      result = result.filter(
        (cake) =>
          cake.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          cake.description.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    // Filter by price range
    result = result.filter((cake) => cake.price >= priceRange[0] && cake.price <= priceRange[1])

    setFilteredCakes(result)
  }, [searchQuery, selectedCategory, priceRange, allCakes])

  // Smooth scroll to top when filters change
  useEffect(() => {
    if (menuRef.current) {
      menuRef.current.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }, [])

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-[#FF7F00]" />
          <p className="text-lg text-gray-600">Loading menu items...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12 mb-16 md:mb-0" ref={menuRef}>
      <h1 className="text-3xl font-bold mb-8 text-center">Our Menu</h1>

      <div className="flex flex-col md:flex-row gap-4 mb-8 items-center justify-between">
        <div className="relative w-full md:w-auto md:flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="Search for cakes..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              className={selectedCategory === category ? "bg-[#FF7F00] hover:bg-[#FF7F00]/90" : ""}
              onClick={() => setSelectedCategory(category)}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </Button>
          ))}
        </div>

        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="gap-2">
              <SlidersHorizontal className="h-4 w-4" />
              Filters
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Filter Options</SheetTitle>
              <SheetDescription>Adjust filters to find the perfect cake</SheetDescription>
            </SheetHeader>

            <div className="py-6">
              <h3 className="text-sm font-medium mb-4">Price Range</h3>
              <Slider
                defaultValue={[0, 150]}
                max={150}
                step={1}
                value={priceRange}
                onValueChange={setPriceRange}
                className="mb-6"
              />
              <div className="flex justify-between text-sm">
                <span>GH₵{priceRange[0]}</span>
                <span>GH₵{priceRange[1]}</span>
              </div>
            </div>

            <div className="py-4">
              <h3 className="text-sm font-medium mb-4">Categories</h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    className={`w-full justify-start ${
                      selectedCategory === category ? "bg-[#FF7F00] hover:bg-[#FF7F00]/90" : ""
                    }`}
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </Button>
                ))}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <AnimatePresence mode="wait">
        {filteredCakes.length > 0 ? (
          <motion.div
            key={`${selectedCategory}-${searchQuery}-${priceRange.join("-")}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
          >
            {filteredCakes.map((cake) => (
              <CakeCard key={cake.id} cake={cake} />
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-12"
          >
            <p className="text-xl text-gray-500">No cakes found matching your criteria</p>
            <Button
              className="mt-4 bg-[#FF7F00] hover:bg-[#FF7F00]/90"
              onClick={() => {
                setSearchQuery("")
                setSelectedCategory("all")
                setPriceRange([0, 150])
              }}
            >
              Reset Filters
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

