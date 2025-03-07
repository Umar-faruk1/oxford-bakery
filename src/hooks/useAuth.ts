import { useAuthStore } from "@/lib/store"

interface UserData {
  email: string
  name: string
  image?: string
  role?: string
}

export function useAuth() {
  const { user, isAuthenticated, login, logout } = useAuthStore()

  return {
    user,
    isAuthenticated,
    login,
    logout
  }
} 