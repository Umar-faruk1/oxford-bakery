export interface CartItem {
    id: string;
    name: string;
    description: string;
    price: number;
    quantity: number;
    image: string;
  }
  export interface Address {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  }
  
  export interface OrderItem {
    id: string;
    name: string;
    quantity: number;
    price: number;
  }
  
  export interface Order {
    id: string;
    createdAt: string;
    status: 'pending' | 'processing' | 'delivered' | 'cancelled';
    items: OrderItem[];
    total: number;
  }
  
  export interface UserProfile {
    profileImage: null | string;
    id: string;
    name: string;
    email: string;
    phone: string;
    language?: string;
    addresses: Address[];
    orders: Order[];
  }

  export interface FavoriteItem {
    id: string
    name: string
    category: string
    price: number
    image: string
  }


  export interface OrderItem {
    id: string
    name: string
    quantity: number
    price: number
    image: string
  }
  
  export interface Recipient {
    name: string
    image: string
    address: string
  }
  
  export interface Order {
    id: string;
    items: OrderItem[];
    statuses: "delivered" | "on_the_way";
    deliveredAt?: string;
    estimatedDelivery?: string;
    discount: number;
    serviceFee: number;
    deliveryFee: number;
    total: number;
    deliveryAddress: string;
    deliveryNote?: string;
    chef?: {
      name: string;
      phone: string;
    };
    tracking?: {
      currentLocation: {
        lat: number;
        lng: number;
      };
      destination: {
        lat: number;
        lng: number;
      };
    };
    recipient?: Recipient;
  }
  
  export interface OrderItem {
    id: string;
    name: string;
    quantity: number;
    price: number;
    image: string;
  }
  
  export interface Recipient {
    name: string;
    image: string;
    address: string;
  }


  export interface HelpQuery {
    category: string
    description: string
  }
  
  export type HelpCategory = {
    value: string
    label: string
  }

  export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    image: string;
    rating: number;
    reviews: number;
    tags: string[];
    ingredients: string[];
    sizes?: string[];
    isNewArrival?: boolean;
    isBestSeller?: boolean;
  }




//Admin Section
export interface NavItem {
  title: string;
  href: string;
  icon: React.ElementType;
}

  
  export interface SidebarProps {
    isOpen: boolean;
    onToggle: () => void;
  }
  
  export interface DashboardLayoutProps {
    children: React.ReactNode;
  }
  
  export interface StatCardProps {
    title: string;
    value: string;
    change: string;
    isIncrease: boolean;
    icon: React.ElementType; // ✅ Use React.ElementType for components
  }
  
  
  export interface User {
    id: string;
    avatar: string;
    name: string;
    email: string;
    role: 'ADMIN' | 'USER' | 'DELIVERY';
  }
  

  export interface MenuItem {
    id: string;
    image: string;
    title: string;
    category: 'breakfast' | 'meals' | 'beverages';
    price: number;
  }
  
  export interface MenuModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    menuItem?: MenuItem;
    onSave: (item: Omit<MenuItem, 'id'>) => void;
  }