import { Link } from "react-router-dom"
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-black text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">OxfordBakery</h3>
            <p className="text-gray-300 mb-4">Delivering delicious moments to your doorstep since 2010.</p>
            <div className="flex space-x-4">
              <Link to="#" className="text-gray-300 hover:text-[#FF7F00]">
                <Facebook size={20} />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link to="#" className="text-gray-300 hover:text-[#FF7F00]">
                <Instagram size={20} />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link to="#" className="text-gray-300 hover:text-[#FF7F00]">
                <Twitter size={20} />
                <span className="sr-only">Twitter</span>
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="flex flex-wrap gap-x-4 gap-y-2 md:flex-col md:gap-y-2 md:gap-x-0">
              <li>
                <Link to="/" className="text-gray-300 hover:text-[#FF7F00] transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/menu" className="text-gray-300 hover:text-[#FF7F00] transition-colors">
                  Menu
                </Link>
              </li>
              <li>
                <Link to="/categories" className="text-gray-300 hover:text-[#FF7F00] transition-colors">
                  Categories
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-300 hover:text-[#FF7F00] transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-[#FF7F00] transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="mr-2 h-5 w-5 text-[#FF7F00]" />
                <span className="text-gray-300">123 Bakery Street, Sweet City, SC 12345</span>
              </li>
              <li className="flex items-center">
                <Phone className="mr-2 h-5 w-5 text-[#FF7F00]" />
                <span className="text-gray-300">(123) 456-7890</span>
              </li>
              <li className="flex items-center">
                <Mail className="mr-2 h-5 w-5 text-[#FF7F00]" />
                <span className="text-gray-300">info@cakedelight.com</span>
              </li>
            </ul>
          </div>

          {/* Opening Hours */}
          <div>
            <h3 className="text-xl font-bold mb-4">Opening Hours</h3>
            <ul className="space-y-2">
              <li className="text-gray-300">Monday - Friday: 8am - 8pm</li>
              <li className="text-gray-300">Saturday: 9am - 7pm</li>
              <li className="text-gray-300">Sunday: 10am - 6pm</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-6 text-center text-gray-400 text-sm">
          <p>&copy; {new Date().getFullYear()} CakeDelight. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

