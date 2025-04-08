import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { CheckCircle2 } from "lucide-react"

export default function OrderSuccessPage() {
  const navigate = useNavigate()

  useEffect(() => {
    // Clear any cart data from localStorage if needed
    localStorage.removeItem("cart")
  }, [])

  return (
    <div className="container mx-auto px-4 py-12">
      <Card className="max-w-md mx-auto p-6 text-center">
        <div className="flex flex-col items-center justify-center space-y-4">
          <CheckCircle2 className="h-16 w-16 text-green-500" />
          <h1 className="text-2xl font-bold">Order Placed Successfully!</h1>
          <p className="text-gray-600">
            Thank you for your order. We'll send you an email with your order details and tracking information.
          </p>
          <div className="pt-4 space-x-4">
            <Button
              onClick={() => navigate("/orders")}
              variant="outline"
            >
              View Orders
            </Button>
            <Button
              onClick={() => navigate("/")}
            >
              Continue Shopping
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
} 