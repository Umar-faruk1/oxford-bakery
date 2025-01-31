'use client';
import { Home, Heart, User, ShoppingCart } from 'lucide-react';
import Link from 'next/link';

export function TabNavigation() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-3 px-6 md:hidden z-50">
      <div className="flex justify-between items-center max-w-screen-xl mx-auto">
        <Link href='/' className="flex flex-col items-center text-gray-600 hover:text-red-500">
          <Home size={24} />
          <span className="text-xs mt-1">Home</span>
        </Link>
        <Link href='/user/favourites' className="flex flex-col items-center text-gray-600 hover:text-red-500">
          <Heart size={24} />
          <span className="text-xs mt-1">Favorites</span>
        </Link>
        <Link href='/cart' className="flex flex-col items-center text-gray-600 hover:text-red-500">
          <ShoppingCart size={24} />
          <span className="text-xs mt-1">Cart</span>
        </Link>

        <Link href='/user' className="flex flex-col items-center text-gray-600 hover:text-red-500">
          <User size={24} />
          <span className="text-xs mt-1">Profile</span>
        </Link>
      </div>
    </nav>
  );
}