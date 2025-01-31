'use client';

import { useState, useEffect } from 'react';
import { Heart, Star, Minus, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Product } from '@/types';
import toast from 'react-hot-toast';
import { useRouter, useParams } from 'next/navigation';

// Size price multipliers
const sizePriceMultipliers = {
  Small: 1,
  Medium: 1.2,
  Large: 1.5
};

// Mock data (should be fetched from an API in production)
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
    sizes: ['Small', 'Medium', 'Large'],
    isBestSeller: true,
  },
  {
    id: '2',
    name: 'Margherita pasta',
    description: 'Fresh tomatoes, mozzarella, basil, and olive oil',
    price: 14.99,
    category: 'Pasta',
    image: '/images/img4.jpg',
    rating: 4.8,
    reviews: 245,
    tags: ['Popular', 'Vegetarian'],
    ingredients: ['Tomatoes', 'Mozzarella', 'Basil', 'Olive Oil'],
    sizes: ['Small', 'Medium', 'Large'],
    isBestSeller: true,
  },
  {
    id: '3',
    name: 'Margherita Salad',
    description: 'Fresh tomatoes, mozzarella, basil, and olive oil',
    price: 14.99,
    category: 'Salads',
    image: '/images/img9.jps',
    rating: 4.8,
    reviews: 245,
    tags: ['Popular', 'Vegetarian'],
    ingredients: ['Tomatoes', 'Mozzarella', 'Basil', 'Olive Oil'],
    sizes: ['Small', 'Medium', 'Large'],
    isBestSeller: true,
  },
  {
    id: '4',
    name: 'Margherita Salad',
    description: 'Fresh tomatoes, mozzarella, basil, and olive oil',
    price: 14.99,
    category: 'Salads',
    image: '/images/img9.jps',
    rating: 4.8,
    reviews: 245,
    tags: ['Popular', 'Vegetarian'],
    ingredients: ['Tomatoes', 'Mozzarella', 'Basil', 'Olive Oil'],
    sizes: ['Small', 'Medium', 'Large'],
    isBestSeller: true,
  },
  {
    id: '5',
    name: 'Margherita Salad',
    description: 'Fresh tomatoes, mozzarella, basil, and olive oil',
    price: 14.99,
    category: 'Salads',
    image: '/images/img9.jps',
    rating: 4.8,
    reviews: 245,
    tags: ['Popular', 'Vegetarian'],
    ingredients: ['Tomatoes', 'Mozzarella', 'Basil', 'Olive Oil'],
    sizes: ['Small', 'Medium', 'Large'],
    isBestSeller: true,
  },
  // Add other mock products...
];

export default function ProductDetails() {
  const { id } = useParams();
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  
  const product = products.find((p) => p.id === id);
  const [selectedSize, setSelectedSize] = useState(product?.sizes?.[0] || 'Small');

  useEffect(() => {
    if (!product) {
      toast({
        title: "Error",
        description: "Product not found",
        variant: "destructive"
      });
      router.push('/menu');
    }
  }, [product, router]);

  if (!product) {
    return null;
  }

  const calculatePrice = () => {
    const basePrice = product.price;
    const multiplier = sizePriceMultipliers[selectedSize as keyof typeof sizePriceMultipliers];
    return basePrice * multiplier;
  };

  const handleAddToCart = () => {
    toast({
      title: "Success",
      description: `Added ${quantity} ${selectedSize} ${product.name} to cart`,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="pt-20 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:w-1/2">
              <div className="relative w-full max-w-md mx-auto lg:max-w-none">
                <div className="aspect-square w-full max-h-[400px] overflow-hidden rounded-xl shadow-lg">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                  <button
                    className="absolute top-4 right-4 p-2.5 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
                    onClick={() => setIsFavorite(!isFavorite)}
                  >
                    <Heart
                      className={`w-5 h-5 ${
                        isFavorite ? 'text-red-500 fill-current' : 'text-gray-600'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* Product Details - Improved typography and spacing */}
            <div className="lg:w-1/2">
              <div className="bg-white rounded-xl p-6 md:p-8 shadow-lg">
                {product.isBestSeller && (
                  <span className="inline-block bg-red-500 text-white text-xs font-medium px-3 py-1 rounded-full mb-4">
                    Best Seller
                  </span>
                )}
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3 text-gray-900">{product.name}</h1>
                <div className="flex items-center mb-4">
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <span className="ml-1.5 text-lg font-semibold text-gray-900">{product.rating}</span>
                  <span className="ml-1.5 text-gray-500">({product.reviews} reviews)</span>
                </div>
                <p className="text-gray-600 text-lg mb-8">{product.description}</p>

                <div className="mb-8">
                  <h3 className="text-lg font-semibold mb-3 text-gray-900">Ingredients:</h3>
                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                    {product.ingredients.map((ingredient) => (
                      <li key={ingredient}>{ingredient}</li>
                    ))}
                  </ul>
                </div>

                {product.sizes && (
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold mb-3 text-gray-900">Size:</h3>
                    <div className="flex flex-wrap gap-3">
                      {product.sizes.map((size) => (
                        <Button
                          key={size}
                          variant={selectedSize === size ? 'default' : 'outline'}
                          onClick={() => setSelectedSize(size)}
                          className={`${
                            selectedSize === size ? 'bg-red-500 hover:bg-red-600' : ''
                          } min-w-[100px] h-12`}
                        >
                          <div className="flex flex-col items-center">
                            <span className="font-medium">{size}</span>
                            <span className="text-xs">
                              ${(product.price * sizePriceMultipliers[size as keyof typeof sizePriceMultipliers]).toFixed(2)}
                            </span>
                          </div>
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mb-8">
                  <h3 className="text-lg font-semibold mb-3 text-gray-900">Quantity:</h3>
                  <div className="flex items-center gap-4">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="h-12 w-12"
                    >
                      <Minus className="w-5 h-5" />
                    </Button>
                    <span className="text-2xl font-semibold text-gray-900 min-w-[2ch] text-center">{quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setQuantity(quantity + 1)}
                      className="h-12 w-12"
                    >
                      <Plus className="w-5 h-5" />
                    </Button>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
                  <div>
                    <span className="text-3xl font-bold text-gray-900">
                      ${calculatePrice().toFixed(2)}
                    </span>
                    <span className="text-gray-500 ml-2">per item</span>
                  </div>
                  <span className="text-2xl font-bold text-gray-900">
                    Total: ${(calculatePrice() * quantity).toFixed(2)}
                  </span>
                </div>

                <Button
                  className="w-full bg-red-500 hover:bg-red-600 text-lg h-14 font-medium"
                  onClick={handleAddToCart}
                >
                  Add to Cart
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}