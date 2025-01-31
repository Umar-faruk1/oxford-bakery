import React from 'react';
import { Facebook, Twitter, Instagram } from 'lucide-react';
import Link from 'next/link';

export function Footer() {

  if(typeof window !== "undefined" && window.location.href.includes('dashboard')) {
    return null
  }
  
  return (
    <footer className="bg-gray-900 text-white pt-12 pb-24 md:pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Oxford Bakery</h3>
            <p className="text-gray-400">
              Experience the best Cake delivery service in town.
            </p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link href="/" className="text-gray-400 hover:text-white">Home</Link></li>
              <li><Link href="/menu" className="text-gray-400 hover:text-white">Menu</Link></li>
              <li><Link href="/about" className="text-gray-400 hover:text-white">About Us</Link></li>
              <li><Link href="/contact" className="text-gray-400 hover:text-white">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-2 text-gray-400">
              <li>Oxford Street</li>
              <li>oxfordbakery, FD 12345</li>
              <li>Phone: 055 719-0530</li>
              <li>Email: oxfordbakery.com</li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Follow Us</h4>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white">
                <Facebook size={24} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <Twitter size={24} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <Instagram size={24} />
              </a>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Oxford Bakery. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}