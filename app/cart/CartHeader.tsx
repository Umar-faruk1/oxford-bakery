'use client';

import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { DeliveryAddress } from "./DeliveryAddress";

export const CartHeader = () => {
  return (
    <div className="flex flex-col items-center mb-8">
      <img
        src="/images/logo.png"
        alt="Logo"
        className="w-32 h-32 mb-4"
      />
      <Link href="/menu">
        <Button
          variant="outline"
          className="flex items-center gap-2 text-white hover:text-white hover:bg-red-600 bg-red-500"
        >
          <ArrowLeft className="w-4 h-4" />
          Continue Shopping
        </Button>
      </Link>

      <div className="mt-6">
      <DeliveryAddress/>
      </div>
    </div>
  );
};
