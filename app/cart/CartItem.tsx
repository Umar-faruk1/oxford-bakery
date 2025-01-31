'use client';

import { Button } from "@/components/ui/button";
import { Minus, Plus, X } from "lucide-react";

interface CartItemProps {
  id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  image: string;
  onUpdateQuantity: (id: string, newQuantity: number) => void;
  onRemove: (id: string) => void;
}

export const CartItem = ({
  id,
  name,
  description,
  price,
  quantity,
  image,
  onUpdateQuantity,
  onRemove,
}: CartItemProps) => {
  return (
    <div className="flex items-center gap-4 p-4 border-b last:border-b-0">
      <img src={image} alt={name} className="w-24 h-24 object-cover rounded" />
      <div className="flex-grow">
        <h3 className="font-semibold">{name}</h3>
        <p className="text-gray-600 text-sm">{description}</p>
        <div className="flex items-center gap-4 mt-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => onUpdateQuantity(id, quantity - 1)}
          >
            <Minus className="w-4 h-4" />
          </Button>
          <span className="font-semibold">{quantity}</span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => onUpdateQuantity(id, quantity + 1)}
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>
      <div className="text-right">
        <p className="font-bold">${(price * quantity).toFixed(2)}</p>
        <button
          onClick={() => onRemove(id)}
          className="text-red-500 hover:text-red-600 mt-2"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
