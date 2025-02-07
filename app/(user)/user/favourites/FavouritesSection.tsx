import { TabNavigation } from "@/app/components/Common/TabNavigation"
import { FavoritesCard } from "./FavouritesCard"
import { FavoriteItem } from "@/types"

interface FavoritesSectionProps {
  favorites: FavoriteItem[]
  onAddToCart: (item: FavoriteItem) => void
}

export function FavoritesSection({ favorites, onAddToCart }: FavoritesSectionProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {favorites.map((item) => (
        <FavoritesCard key={item.id} item={item} onAddToCart={onAddToCart} />
      ))}
      <TabNavigation/>
    </div>
  )
}

