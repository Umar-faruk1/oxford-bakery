import { ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { FavoriteItem } from "@/types"
interface FavoritesCardProps {
  item: FavoriteItem
  onAddToCart: (item: FavoriteItem) => void
}

export function FavoritesCard({ item, onAddToCart }: FavoritesCardProps) {
  return (
    <Card className="p-4 flex items-center justify-between hover:shadow-md transition-shadow">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full overflow-hidden">
          <img src={item.image || "/placeholder.svg"} alt={item.name} className="w-full h-full object-cover" />
        </div>
        <div>
          <h3 className="font-medium">{item.name}</h3>
          <p className="text-sm text-muted-foreground">Category: {item.category}</p>
          <p className="text-sm">Price: ${item.price}</p>
        </div>
      </div>
      <Button
        size="icon"
        variant="ghost"
        className="text-green-600 hover:text-green-700 hover:bg-green-50"
        onClick={() => onAddToCart(item)}
      >
        <ShoppingCart className="h-5 w-5" />
        <span className="sr-only">Add to cart</span>
      </Button>
    </Card>
  )
}

