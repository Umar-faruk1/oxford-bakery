"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { FavoritesSection } from "./FavouritesSection"
import { mockFavorites } from "@/lib/mock-data"
import { FavoriteItem } from "@/types"

export default function FavoritesPage() {
  const [favorites] = useState<FavoriteItem[]>(mockFavorites)
  const { toast } = useToast()

  const handleAddToCart = (item: FavoriteItem) => {
    toast({
      title: "Added to cart",
      description: `${item.name} has been added to your cart.`,
    })
  }

  return (
    <main className="min-h-screen bg-gray-50 pt-16 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link href="/user">
            <Button variant="outline" className="text-red-500 hover:text-red-600 hover:bg-green-50">
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back to my Profile
            </Button>
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold mb-6">My Favorites</h1>
          <FavoritesSection favorites={favorites} onAddToCart={handleAddToCart} />
        </div>
      </div>
      <Toaster />
    </main>
  )
}

