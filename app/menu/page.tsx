'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Heart, Star, Filter, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Product } from '@/types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Navbar } from '../components/Common/Navbar';
import { TabNavigation } from '../components/Common/TabNavigation';

const categories = ['All', 'Pizza', 'Pasta', 'Salads', 'Desserts', 'Beverages'];
const sortOptions = ['Popular', 'Price: Low to High', 'Price: High to Low', 'Rating'];

const products: Product[] = [
  {
    id: '1',
    name: 'Margherita Pizza',
    description: 'Fresh tomatoes, mozzarella, basil, and olive oil',
    price: 14.99,
    category: 'Pizza',
    image: 'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca',
    rating: 4.8,
    reviews: 245,
    tags: ['Popular', 'Vegetarian'],
    ingredients: ['Tomatoes', 'Mozzarella', 'Basil', 'Olive Oil'],
    isBestSeller: true
  },
  {
    id: '2',
    name: 'Margherita Pizza',
    description: 'Fresh tomatoes, mozzarella, basil, and olive oil',
    price: 14.99,
    category: 'Pizza',
    image: 'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca',
    rating: 3.8,
    reviews: 245,
    tags: ['Popular', 'Vegetarian'],
    ingredients: ['Tomatoes', 'Mozzarella', 'Basil', 'Olive Oil'],
    isBestSeller: true
  },
  {
    id: '3',
    name: 'Margherita Pizza',
    description: 'Fresh tomatoes, mozzarella, basil, and olive oil',
    price: 6.99,
    category: 'Pizza',
    image: 'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca',
    rating: 5.00,
    reviews: 245,
    tags: ['Popular', 'Vegetarian'],
    ingredients: ['Tomatoes', 'Mozzarella', 'Basil', 'Olive Oil'],
    isBestSeller: true
  },
  {
    id: '4',
    name: 'Margherita Pizza',
    description: 'Fresh tomatoes, mozzarella, basil, and olive oil',
    price: 10.99,
    category: 'Pizza',
    image: 'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca',
    rating: 4.8,
    reviews: 245,
    tags: ['Popular', 'Vegetarian'],
    ingredients: ['Tomatoes', 'Mozzarella', 'Basil', 'Olive Oil'],
    isBestSeller: true
  },
  {
    id: '5',
    name: 'Margherita Pizza',
    description: 'Fresh tomatoes, mozzarella, basil, and olive oil',
    price: 9.99,
    category: 'Pizza',
    image: 'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca',
    rating: 4.8,
    reviews: 245,
    tags: ['Popular', 'Vegetarian'],
    ingredients: ['Tomatoes', 'Mozzarella', 'Basil', 'Olive Oil'],
    isBestSeller: true
  },
  // Add more products...
];

export default function Menu() {
  const router = useRouter(); // Use `useRouter` instead of `useNavigate`
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [priceRange, setPriceRange] = useState([0, 100]);
  const [sortBy, setSortBy] = useState('Popular');
  const [showFilters, setShowFilters] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products;

    // Apply category filter
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Apply price filter
    filtered = filtered.filter(
      product => product.price >= priceRange[0] && product.price <= priceRange[1]
    );

    // Apply sorting
    return [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'Price: Low to High':
          return a.price - b.price;
        case 'Price: High to Low':
          return b.price - a.price;
        case 'Rating':
          return b.rating - a.rating;
        default: // Popular
          return b.reviews - a.reviews;
      }
    });
  }, [selectedCategory, priceRange, sortBy]);

  const toggleFavorite = (productId: string) => {
    setFavorites(prev => 
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const handleProductClick = (productId: string) => {
    router.push(`/menu/${productId}`);
  };

  return (
    <main className="min-h-screen bg-gray-50 pt-16 pb-16">
      <Navbar/>
      {/* Hero Section */}
      <section className="relative h-[200px] bg-gray-900 text-white">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1504674900247-0877df9cc836"
            alt="Menu hero"
            className="w-full h-full object-cover opacity-50"
          />
        </div>
        <div className="relative h-full flex items-center justify-center">
          <h1 className="text-4xl font-bold">Our Menu</h1>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters and Sort */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div className="flex flex-wrap gap-2 mb-4 md:mb-0">
            {categories.map((category) => (
              <Button
              
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                onClick={() => setSelectedCategory(category)}
                className={selectedCategory === category ? 'bg-red-500 hover:bg-red-600' : ''}
              >
                {category}
              </Button>
            ))}
          </div>
          <div className="flex gap-4">
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <Filter className="w-4 h-4" />
              Filters
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  Sort by: {sortBy}
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {sortOptions.map((option) => (
                  <DropdownMenuItem
                    key={option}
                    onClick={() => setSortBy(option)}
                  >
                    {option}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredAndSortedProducts.map((product) => (
            <div 
              key={product.id} 
              className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transition-transform hover:scale-105"
              onClick={() => handleProductClick(product.id)}
            >
              <div className="relative">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
                <button 
                  className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-100"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(product.id);
                  }}
                >
                  <Heart 
                    className={`w-5 h-5 ${
                      favorites.includes(product.id) 
                        ? 'text-red-500 fill-current' 
                        : 'text-gray-600'
                    }`} 
                  />
                </button>
                {product.isBestSeller && (
                  <span className="absolute top-2 left-2 bg-red-500 text-white text-sm px-2 py-1 rounded">
                    Best Seller
                  </span>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-1">{product.name}</h3>
                <p className="text-gray-600 text-sm mb-2">{product.description}</p>
                <div className="flex items-center mb-2">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="text-sm text-gray-600 ml-1">
                    {product.rating} ({product.reviews} reviews)
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-lg">${product.price}</span>
                  <Button 
                    className="bg-red-500 hover:bg-red-600"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Add to cart logic here
                    }}
                  >
                    Add to Cart
                  </Button>
                </div>
              </div>
            </div>
          ))}
          <TabNavigation/>
        </div>
      </div>
    </main>
  );
}
