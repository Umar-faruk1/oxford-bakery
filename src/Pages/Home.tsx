import { useEffect, useState } from "react"
import { useAuthStore } from "@/lib/store"
import HeroSection from "@/components/hero-section"
import MenuSection from "@/components/menu-section"
import CategoriesSection from "@/components/categories-section"
import PromoSection from "@/components/promo-section"
import MobileNavigation from "@/components/mobile-navigation"
import Footer from "@/components/footer"

export default function HomePage() {
  const { isLoading } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const init = async () => {
      await useAuthStore.getState().hydrate();
      setMounted(true);
    };
    init();
  }, []);

  if (!mounted || isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 min-h-[60vh] flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="flex-1">
        <HeroSection />
        <CategoriesSection />
        <MenuSection />
        <PromoSection />
      </div>
      {mounted && <MobileNavigation />}
      <Footer/>
    </div>
  );
}

