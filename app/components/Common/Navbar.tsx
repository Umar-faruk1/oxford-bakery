'use client';

import { Menu, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useSideBarDrawer } from '@/lib/store';


export function Navbar() {
    const {onSidebarOpen} = useSideBarDrawer()
    return (
        <nav className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={onSidebarOpen}
                            className="md:hidden block"
                        >
                            <Menu className="h-10 w-5" />
                        </Button>
                        <span className="text-2xl font-bold text-red-500 ml-2">Oxford Bakery</span>
                    </div>
                    <div className="hidden md:flex items-center space-x-8">
                        <Link href="/" className="text-gray-600 hover:text-red-500">Home</Link>
                        <Link href="/menu" className="text-gray-600 hover:text-red-500">Menu</Link>
                        {/* <Link href="/categories" className="text-gray-600 hover:text-red-500">Categories</Link> */}
                        <Link href="/about" className="text-gray-600 hover:text-red-500">About</Link>
                        <Link href="/contact" className="text-gray-600 hover:text-red-500">Contact</Link>
                    </div>
                    <div className="flex items-center space-x-4">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="text-gray-600 hover:text-red-500 relative"
                        >
                            <ShoppingCart className="h-5 w-5" />
                            <Link href='/cart' className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                                0
                            </Link>
                        </Button>
                        <Button variant="default" className="bg-red-500 hover:bg-red-600">
                            Sign Up
                        </Button>
                    </div>
                </div>
            </div>
        </nav>
    );
}