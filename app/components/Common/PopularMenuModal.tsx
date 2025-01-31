import React from "react";
import { X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FavoriteIcon } from "./FavouritesBtn";

interface Dish {
  id: number;
  name: string;
  price: number;
  description: string;
  image: string;
  category: string;
}

interface PopularDishModalProps {
  dish: Dish;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (dish: Dish) => void;
  onToggleFavorite: (dish: Dish) => void;
}

export const PopularMenuModal: React.FC<PopularDishModalProps> = ({
  dish,
  isOpen,
  onClose,
  onAddToCart,
  onToggleFavorite,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[90%] max-w-[400px] p-4 sm:p-6">
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 top-2"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>
        <DialogHeader>
          <DialogTitle className="pr-4">{dish.name}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-3">
          <img
            src={dish.image}
            alt={dish.name}
            className="w-full h-48 sm:h-64 object-cover rounded-lg"
          />
          <p className="text-sm sm:text-base text-gray-600">{dish.description}</p>
          <p className="text-lg sm:text-xl font-bold text-red-500">
            ${dish.price.toFixed(2)}
          </p>
        </div>
        <DialogFooter className="flex justify-between items-center sm:justify-end sm:space-x-2">
          <FavoriteIcon onClick={() => onToggleFavorite(dish)} />
          <Button onClick={() => onAddToCart(dish)} className="flex-1 sm:flex-none">
            Add to Cart
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
