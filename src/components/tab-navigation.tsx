import { Link, useLocation } from "react-router-dom"
import { Home, Cake, User, ShoppingCart, Info } from "lucide-react"

const TabNavigation = () => {
  const location = useLocation()

  const tabs = [
    { path: "/", label: "Home", icon: Home },
    { path: "/menu", label: "Menu", icon: Cake },
    { path: "/profile", label: "Profile", icon: User },
    { path: "/cart", label: "Cart", icon: ShoppingCart },
    { path: "/about", label: "About", icon: Info },
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t z-50 md:hidden">
      <nav className="flex justify-around items-center h-16">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = location.pathname === tab.path
          return (
            <Link
              key={tab.path}
              to={tab.path}
              className={`flex flex-col items-center justify-center w-full h-full ${
                isActive ? "text-[#FF7F00]" : "text-gray-500"
              }`}
            >
              <Icon className="h-6 w-6" />
              <span className="text-xs mt-1">{tab.label}</span>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}

export default TabNavigation 