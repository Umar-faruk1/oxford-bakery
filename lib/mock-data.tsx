import { FavoriteItem, UserProfile } from "@/types";

export const mockUser: UserProfile = {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    phone: "+1234567890",
    language: "en",
    addresses: [
        {
            street: "123 Food Street",
            city: "Foodville",
            state: "FD",
            zipCode: "12345",
            country: "USA",
        },
    ],
    orders: [
        
    ],
    profileImage: null
};




export const mockFavorites: FavoriteItem[] = [
    {
      id: "1",
      name: "Chain Burger",
      category: "Burger",
      price: 20,
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%20(39)-FmA41jqkZOHvObIurx241muCxEwfET.png",
    },
    {
      id: "2",
      name: "Chicken Fillet",
      category: "Chicken",
      price: 25,
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%20(39)-FmA41jqkZOHvObIurx241muCxEwfET.png",
    },
    {
      id: "3",
      name: "Bockshandy",
      category: "Drinks",
      price: 5,
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%20(39)-FmA41jqkZOHvObIurx241muCxEwfET.png",
    },
    {
      id: "4",
      name: "Big Steak",
      category: "Steak",
      price: 35,
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%20(39)-FmA41jqkZOHvObIurx241muCxEwfET.png",
    },
    {
      id: "5",
      name: "Louis Steak",
      category: "Rice",
      price: 25,
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%20(39)-FmA41jqkZOHvObIurx241muCxEwfET.png",
    },
    {
      id: "6",
      name: "Sandwich",
      category: "Breakfast",
      price: 15,
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%20(39)-FmA41jqkZOHvObIurx241muCxEwfET.png",
    },
    {
      id: "7",
      name: "Salmoned",
      category: "Fish",
      price: 30,
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%20(39)-FmA41jqkZOHvObIurx241muCxEwfET.png",
    },
    {
      id: "8",
      name: "Mojito",
      category: "Drinks",
      price: 8,
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%20(39)-FmA41jqkZOHvObIurx241muCxEwfET.png",
    },
  ]
  
  