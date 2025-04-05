"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useCartStore, useAuthStore } from "@/lib/store"
import { PaystackButton } from "react-paystack"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import axios from "@/lib/axios"

const PAYSTACK_PUBLIC_KEY = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY as string

interface PromoCode {
  code: string
  discount: number
}

export default function CheckoutPage() {
  const navigate = useNavigate()
  const [mounted, setMounted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { items, getTotalPrice, clearCart } = useCartStore()
  const { user } = useAuthStore()

  const [customerInfo, setCustomerInfo] = useState({
    email: "",
    name: "",
    phone: "",
    address: "",
  })

  const [promoCode, setPromoCode] = useState("")
  const [activePromo, setActivePromo] = useState<PromoCode | null>(null)
  const [error, setError] = useState("")
  const DELIVERY_FEE = 20.00;  // Fixed delivery fee

  useEffect(() => {
    setMounted(true)
    if (user) {
      setCustomerInfo(prev => ({
        ...prev,
        email: user.email || "",
        name: user.name || ""
      }))
    }
  }, [user])

  useEffect(() => {
    console.log("Paystack Key:", PAYSTACK_PUBLIC_KEY)
  }, [])

  useEffect(() => {
    if (mounted && items.length === 0) {
      navigate("/cart");
    }
  }, [mounted, items, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setCustomerInfo(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const subtotal = getTotalPrice();
  const finalTotal = subtotal + DELIVERY_FEE - (activePromo?.discount ?? 0);

  const handlePaystackSuccess = async (reference: any) => {
    setIsSubmitting(true);
    try {
      const orderPayload = {
        amount: subtotal,
        delivery_fee: DELIVERY_FEE,
        final_amount: finalTotal,
        payment_reference: reference.reference,
        email: customerInfo.email,
        name: customerInfo.name,
        phone: customerInfo.phone,
        address: customerInfo.address,
        items: items.map(item => ({
          menu_item_id: item.id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          image: item.image
        }))
      };
      console.log('Order payload:', orderPayload);

      try {
        const orderResponse = await axios.post("/orders", orderPayload);
        console.log('Order response:', orderResponse.data);
      } catch (orderError: any) {
        console.error('Order creation error:', {
          data: orderError.response?.data,
          status: orderError.response?.status,
          error: orderError.message,
          details: orderError.response?.data?.detail
        });
        throw orderError;
      }

      try {
        await axios.post(`/verify-payment/${reference.reference}`);
        clearCart();
        navigate("/order-success");
        toast.success("Payment successful!");
      } catch (verifyError: any) {
        console.error('Payment verification error:', verifyError.response?.data);
        throw verifyError;
      }
    } catch (error: any) {
      console.error('Full error:', error);
      console.error('Error details:', error.response?.data?.detail);
      const errorMessage = Array.isArray(error.response?.data?.detail) 
        ? error.response?.data?.detail[0]?.msg 
        : error.response?.data?.detail || 'Payment verification failed';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePaystackClose = () => {
    toast.error("Payment cancelled")
  }

  const validatePromoCode = async () => {
    setError("");
    try {
      const response = await axios.post("/promo/validate", { code: promoCode });
      toast.success("Promo code applied successfully!");
      setActivePromo({
        code: response.data.code,
        discount: Number(response.data.discount)
      });
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || "Error validating promo code";
      toast.error(errorMessage);
      setError(errorMessage);
      setActivePromo(null);
    }
  };

  if (!mounted) {
    return <div className="container mx-auto px-4 py-12 min-h-[60vh] flex items-center justify-center">Loading...</div>
  }

  const total = getTotalPrice()
  
  const calculateDiscountedTotal = () => {
    if (!activePromo) return total + DELIVERY_FEE;
    return Math.max(0, total - activePromo.discount) + DELIVERY_FEE;
  }

  const amount = Math.round(finalTotal * 100) // Paystack expects amount in kobo/pesewas

  const validateForm = () => {
    if (!customerInfo.email || !customerInfo.email.includes('@')) {
      toast.error("Valid email is required")
      return false
    }
    if (!customerInfo.name || customerInfo.name.length < 3) {
      toast.error("Full name is required")
      return false
    }
    if (!customerInfo.phone || customerInfo.phone.length < 10) {
      toast.error("Valid phone number is required")
      return false
    }
    if (!customerInfo.address || customerInfo.address.length < 5) {
      toast.error("Delivery address is required")
      return false
    }
    return true
  }

  const getPaystackConfig = () => {
    if (!PAYSTACK_PUBLIC_KEY) {
      throw new Error("Paystack key not found");
    }

    return {
      email: customerInfo.email.trim(),
      amount: Math.round(amount),
      publicKey: PAYSTACK_PUBLIC_KEY,
      currency: "GHS",
      reference: `ref_${Date.now()}`,
      metadata: {
        custom_fields: [{
          display_name: "Delivery Address",
          variable_name: "address",
          value: customerInfo.address
        }],
        promo_code: promoCode
      }
    };
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <Card className="max-w-md mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Checkout</h1>

        <div className="space-y-4 mb-6">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={customerInfo.email}
              onChange={handleInputChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              name="name"
              value={customerInfo.name}
              onChange={handleInputChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              name="phone"
              value={customerInfo.phone}
              onChange={handleInputChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="address">Delivery Address</Label>
            <Input
              id="address"
              name="address"
              value={customerInfo.address}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>

        <div className="space-y-4 mb-6">
          <div className="flex gap-2">
            <Input
              placeholder="Enter promo code"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
            />
            <Button onClick={validatePromoCode}>Apply</Button>
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          {activePromo && (
            <p className="text-green-600 text-sm">
              Promo code applied! Discount: {activePromo.discount}
            </p>
          )}
        </div>

        <div className="space-y-3 mb-6 pt-4 border-t">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>GH₵{total.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Delivery Fee</span>
            <span>GH₵{DELIVERY_FEE.toFixed(2)}</span>
          </div>
          {activePromo && (
            <div className="flex justify-between text-green-600">
              <span>Discount</span>
              <span>-GH₵{(total - (finalTotal - DELIVERY_FEE)).toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between font-bold">
            <span>Total</span>
            <span>GH₵{finalTotal.toFixed(2)}</span>
          </div>
        </div>

        {isSubmitting ? (
          <Button disabled className="w-full">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </Button>
        ) : validateForm() && PAYSTACK_PUBLIC_KEY ? (
          <PaystackButton
            {...getPaystackConfig()}
            text="Pay with Paystack"
            onSuccess={handlePaystackSuccess}
            onClose={handlePaystackClose}
            className="w-full bg-[#0BA4DB] hover:bg-[#0BA4DB]/90 text-white py-2 px-4 rounded-md"
          />
        ) : (
          <Button 
            disabled 
            className="w-full"
            onClick={() => validateForm()}
          >
            {!PAYSTACK_PUBLIC_KEY ? "Payment Not Configured" : "Complete Form to Continue"}
          </Button>
        )}
      </Card>
    </div>
  )
}
