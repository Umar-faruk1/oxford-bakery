'use client';

import { Button } from "@/components/ui/button";

export const DeliveryAddress = () => {
  const handleShowAddress = () => {
    alert('Delivery address details will be shown here.');
  };

  return (
    <Button
      className="bg-red-500 hover:bg-red-600 mt-4"
      onClick={handleShowAddress}
    >
      Show Delivery Address
    </Button>
  );
};
