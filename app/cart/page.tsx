'use client';

import { useState } from 'react';
import { CartHeader } from './CartHeader';
import { CartItems } from './CartItems';
import { OrderSummary } from './OrderSummary';
import { DeliveryAddress } from './DeliveryAddress';
import { Navbar } from '../components/Common/Navbar';
import SideBar from '../components/Common/Sidebar';
import { TabNavigation } from '../components/Common/TabNavigation';

const initialCartItems = [
  {
    id: '1',
    name: 'Chocolate Cake',
    description: 'Rich and moist chocolate cake topped with ganache.',
    price: 12.99,
    quantity: 1,
    image: '/images/img7.jpg',
  },
  {
    id: '2',
    name: 'Vanilla Ice Cream',
    description: 'Creamy vanilla ice cream with a hint of Madagascar vanilla.',
    price: 4.99,
    quantity: 2,
    image: '/images/img3.jpg',
  },
  {
    id: '3',
    name: 'Strawberry Milkshake',
    description: 'Refreshing strawberry milkshake made with fresh strawberries.',
    price: 6.49,
    quantity: 1,
    image: '/images/img1.jpg',
  },
  {
    id: '4',
    name: 'Strawberry Milkshake',
    description: 'Refreshing strawberry milkshake made with fresh strawberries.',
    price: 6.49,
    quantity: 1,
    image: '/images/img8.jpg',
  },
];

export default function Cart() {
  const [items, setItems] = useState(initialCartItems);
  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const deliveryCharge = 5.99;
  const total = subtotal + deliveryCharge;

  const updateQuantity = (id: string, newQuantity: number) => {
    setItems(items.map(item =>
      item.id === id ? { ...item, quantity: Math.max(1, newQuantity) } : item
    ));
  };

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  return (
    <main className="min-h-screen bg-gray-50 pt-16 pb-16">
      <Navbar/>
      <SideBar/>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <CartHeader />
        {items.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold mb-4">Your cart is empty</h2>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:w-2/3">
              <CartItems items={items} onUpdateQuantity={updateQuantity} onRemove={removeItem} />
            </div>
            <div className="lg:w-1/3">
              <OrderSummary subtotal={subtotal} deliveryCharge={deliveryCharge} total={total} />
              
            </div>
          </div>
        )}
        <TabNavigation />
      </div>
    </main>
  );
}
