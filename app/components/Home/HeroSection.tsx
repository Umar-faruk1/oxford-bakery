import React from 'react'
import { useRouter } from 'next/navigation';

const HeroSection = () => {
  const router = useRouter();

  const handleNavigation = () =>{
    router.push('/menu')
  }
  return (
    <section className="relative h-[500px] bg-gray-900 text-white">
          <div className="absolute inset-0">
            <img
              src="/images/background.jpg"
              alt="Hero background"
              className="w-full h-full object-cover opacity-50"
            />
          </div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
            <div className="max-w-2xl">
              <h1 className="text-5xl font-bold mb-4">
                It's not just Food, It's an Experience
              </h1>
              <p className="text-xl mb-8">
                Discover the best food and drinks in your area
              </p>
              <div className="flex space-x-4">
                <button onClick={handleNavigation} className="bg-red-500 text-white px-8 py-3 rounded-lg hover:bg-red-600">
                  View Menu
                </button>
                <button className="bg-white text-gray-900 px-8 py-3 rounded-lg hover:bg-gray-100">
                  Book a Table
                </button>
              </div>
            </div>
          </div>
        </section>
  )
}

export default HeroSection