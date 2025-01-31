import React from "react";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FavoriteIconProps {
  onClick: () => void;
}

export const FavoriteIcon: React.FC<FavoriteIconProps> = ({ onClick }) => {
  return (
    <Button
      variant="outline"
      size="icon"
      onClick={onClick}
      className=" flex h-8 w-8 sm:h-9 sm:w-9"
    >
      <Heart className="h-4 w-4" />
    </Button>
  );
};
