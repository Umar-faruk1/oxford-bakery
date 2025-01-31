import React, { useState, useEffect, useRef } from "react";
import { PopularMenuModal } from "../Common/PopularMenuModal";

interface Menu {
  id: number;
  name: string;
  price: number;
  description: string;
  image: string;
  category: string;
}

const popularDishes: Menu[] = [
    
        {
          id: 1,
          name: "Pappardelle with Vegetable",
          price: 35.00,
          description: "Fresh pappardelle pasta with seasonal vegetables in a light cream sauce",
          image: "/images/img1.jpg",
          category: "Pasta"
        },
        {
          id: 2,
          name: "Ravioli Stuffed",
          price: 35.00,
          description: "Handmade ravioli stuffed with ricotta and spinach, served with pesto sauce",
          image: "/images/img2.jpg",
          category: "Pasta"
        },
        {
          id: 3,
          name: "Margherita Pizza",
          price: 28.00,
          description: "Classic pizza with fresh tomatoes, mozzarella, basil, and olive oil",
          image: "/images/img3.jpg",
          category: "Pizza"
        },
        {
          id: 4,
          name: "Truffle Risotto",
          price: 42.00,
          description: "Creamy Arborio rice with black truffle, parmesan, and wild mushrooms",
          image: "/images/img5.jpg",
          category: "Risotto"
        },
        {
          id: 5,
          name: "Grilled Salmon",
          price: 38.00,
          description: "Fresh Atlantic salmon with herbs, lemon, and seasonal vegetables",
          image: "/images/img4.jpg",
          category: "Seafood"
        },
        {
          id: 6,
          name: "Tiramisu",
          price: 15.00,
          description: "Classic Italian dessert with coffee-soaked ladyfingers and mascarpone cream",
          image: "/images/img6.jpg",
          category: "Dessert"
        }
      ];

const infiniteScrollDishes = [...popularDishes, ...popularDishes];

export const PopularMenuSection: React.FC = () => {
  const [selectedDish, setSelectedDish] = useState<Menu | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isScrolling, setIsScrolling] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleAddToCart = (dish: Menu) => {
    console.log("Added to cart:", dish);
    setSelectedDish(null);
  };

  const handleToggleFavorite = (dish: Menu) => {
    console.log("Toggled favorite:", dish);
  };

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    const handleScroll = () => {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainer;

      if (scrollLeft + clientWidth >= scrollWidth - 10) {
        scrollContainer.scrollLeft = scrollWidth / 4;
      } else if (scrollLeft <= 10) {
        scrollContainer.scrollLeft = (scrollWidth * 3) / 4;
      }
    };

    scrollContainer.addEventListener("scroll", handleScroll);
    return () => scrollContainer.removeEventListener("scroll", handleScroll);
  }, []);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsScrolling(true);
    setStartX(e.pageX - scrollRef.current!.offsetLeft);
    setScrollLeft(scrollRef.current!.scrollLeft);
  };

  const handleMouseUp = () => {
    setIsScrolling(false);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isScrolling) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current!.offsetLeft;
    const walk = (x - startX) * 2;
    scrollRef.current!.scrollLeft = scrollLeft - walk;
  };

  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold mb-8">Popular Menus</h2>
        <div
          ref={scrollRef}
          className="flex overflow-x-scroll no-scrollbar"
          style={{
            scrollBehavior: "smooth",
            WebkitOverflowScrolling: "touch",
          }}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onMouseMove={handleMouseMove}
        >
          <div className="flex gap-6 py-4">
            {infiniteScrollDishes.map((dish, index) => (
              <div
                key={`${dish.id}-${index}`}
                className="flex-none w-[260px] sm:w-[300px] cursor-pointer transform transition hover:scale-105"
                onClick={() => setSelectedDish(dish)}
              >
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                  <img
                    src={dish.image}
                    alt={dish.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-lg font-semibold">{dish.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {dish.description}
                    </p>
                    <p className="text-red-500 font-bold mt-2">
                      ${dish.price.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {selectedDish && (
        <PopularMenuModal
          dish={selectedDish}
          isOpen={!!selectedDish}
          onClose={() => setSelectedDish(null)}
          onAddToCart={handleAddToCart}
          onToggleFavorite={handleToggleFavorite}
        />
      )}
    </section>
  );
};
