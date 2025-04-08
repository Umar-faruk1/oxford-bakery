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
  discount: string  // Changed to string to handle both percentage and fixed amounts
  type: 'percentage' | 'fixed'
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

  const total = getTotalPrice()
  
  const calculateDiscountedTotal = (): number => {
    if (!activePromo) return total + DELIVERY_FEE;
    
    let discountAmount = 0;
    if (activePromo.type === 'percentage') {
      const percentage = parseFloat(activePromo.discount.replace('%', ''));
      discountAmount = (total * percentage) / 100;
    } else {
      discountAmount = parseFloat(activePromo.discount);
    }
    
    return Math.max(0, total - discountAmount) + DELIVERY_FEE;
  }

  const calculateDiscountAmount = (): number => {
    if (!activePromo) return 0;
    
    if (activePromo.type === 'percentage') {
      const percentage = parseFloat(activePromo.discount.replace('%', ''));
      return (total * percentage) / 100;
    } else {
      return parseFloat(activePromo.discount);
    }
  }

  const subtotal = getTotalPrice();
  const finalTotal: number = calculateDiscountedTotal();
  const amount = Math.round(finalTotal * 100); // Paystack expects amount in kobo/pesewas

  const handlePaystackSuccess = async (reference: any) => {
    setIsSubmitting(true);
    try {
      // First create the order
      const orderPayload = {
        amount: subtotal,
        delivery_fee: DELIVERY_FEE,
        final_amount: finalTotal,
        payment_reference: reference.reference,
        email: customerInfo.email,
        name: customerInfo.name,
        phone: customerInfo.phone,
        address: customerInfo.address,
        promo_code: activePromo?.code || null,
        items: items.map(item => ({
          menu_item_id: item.id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          image: item.image
        }))
      };

      // Create order first
      const orderResponse = await axios.post("/orders", orderPayload);
      console.log('Order created:', orderResponse.data);

      // Then verify payment
      await axios.post(`/verify-payment/${reference.reference}`);
      
      // Clear cart and show success
      clearCart();
      toast.success("Payment successful! Your order is being processed.");
      navigate("/order-success");
    } catch (error: any) {
      console.error('Payment error:', error);
      const errorMessage = error.response?.data?.detail || 'Payment verification failed';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePaystackClose = () => {
    toast.error("Payment cancelled. Please try again.");
  }

  const validatePromoCode = async () => {
    setError("");
    try {
      const response = await axios.post("/promo/validate", { code: promoCode });
      const discountValue = response.data.discount;
      const isPercentage = discountValue.includes('%');
      const numericValue = parseFloat(discountValue.replace('%', ''));
      
      setActivePromo({
        code: response.data.code,
        discount: discountValue,
        type: isPercentage ? 'percentage' : 'fixed'
      });
      toast.success("Promo code applied successfully!");
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

        {isSubmitting ? (
          <div className="flex flex-col items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin mb-4" />
            <p className="text-center">Processing your payment...</p>
          </div>
        ) : (
          <>
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

            <div className="space-y-4 mb-6">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>GH₵ {subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Fee:</span>
                <span>GH₵ {DELIVERY_FEE.toFixed(2)}</span>
              </div>
              {activePromo && (
                <div className="flex justify-between text-green-600">
                  <span>Discount:</span>
                  <span>-GH₵ {calculateDiscountAmount().toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-lg border-t pt-2">
                <span>Total:</span>
                <span>GH₵ {finalTotal.toFixed(2)}</span>
              </div>
            </div>

            {validateForm() && PAYSTACK_PUBLIC_KEY ? (
              <PaystackButton
                {...getPaystackConfig()}
                text={isSubmitting ? "Processing..." : "Pay with Paystack"}
                onSuccess={handlePaystackSuccess}
                onClose={handlePaystackClose}
                className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-primary/90 disabled:opacity-50"
                disabled={isSubmitting}
              />
            ) : (
              <Button
                className="w-full"
                disabled={true}
              >
                {!PAYSTACK_PUBLIC_KEY ? "Payment Not Configured" : "Complete Form to Continue"}
              </Button>
            )}
          </>
        )}
      </Card>
    </div>
  )
}
