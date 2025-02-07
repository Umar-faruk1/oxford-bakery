'use client';

const categories = [
  {
    id: 1,
    name: "Cakes",
    image: "/images/img1.jpg"
  },
  {
    id: 2,
    name: "Cookies & Donuts",
    image: "/images/pizza1.jpg"
  },
  {
    id: 3,
    name: "Savory Pastries & Pies",
    image: "/images/img11.jpg"
  },
  {
    id: 4,
    name: "Bread & Baked Goods",
    image: "/images/img10.jpg"
  },
  {
    id: 5,
    name: "Pizza & Flatbreads",
    image: "/images/img12.jpg"
  },
  {
    id: 6,
    name: "Ice Cream & Frozen Desserts",
    image: "/images/img6.jpg"
  },
  {
    id: 7,
    name: "Beverages",
    image: "/images/img7.jpg"
  },
  {
    id: 8,
    name: "Other Desserts",
    image: "/images/img3.jpg"
  },
];

export function Categories() {
  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold mb-8">Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {categories.map((category) => (
            <div
              key={category.id}
              className="relative overflow-hidden rounded-lg cursor-pointer group"
            >
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                <h3 className="text-white text-xl font-bold">{category.name}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}