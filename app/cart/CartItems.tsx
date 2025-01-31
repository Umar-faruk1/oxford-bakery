'use client';

import { CartItem } from "./CartItem";
import { DeliveryAddress } from "./DeliveryAddress";

interface CartItemsProps {
  items: {
    id: string;
    name: string;
    description: string;
    price: number;
    quantity: number;
    image: string;
  }[];
  onUpdateQuantity: (id: string, newQuantity: number) => void;
  onRemove: (id: string) => void;
}

export const CartItems = ({ items, onUpdateQuantity, onRemove }: CartItemsProps) => {
  return (
    <div className="bg-white rounded-lg shadow-md">
      {items.map(item => (
        <CartItem
          key={item.id}
          {...item}
          onUpdateQuantity={onUpdateQuantity}
          onRemove={onRemove}
        />
      ))}
    </div>
    
  );
};
