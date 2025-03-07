import HeroSection from "@/components/hero-section"
import MenuSection from "@/components/menu-section"
import CategoriesSection from "@/components/categories-section"
import PromoSection from "@/components/promo-section"
import MobileNavigation from "@/components/mobile-navigation"
import Footer from "@/components/footer"

export default function HomePage() {
  return (
    <div className="flex flex-col">
      <div className="flex-1">
        <HeroSection />
        <CategoriesSection />
        <MenuSection />
        <PromoSection />
      </div>
      <MobileNavigation />
      <Footer/>
    </div>
  )
}

