"use client";

import { useState } from "react";
import { Package, Settings, HelpCircle, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { UserProfile } from "@/types";
import { EditProfileModal } from "./EditProfileModal";
import { LanguageModal } from "./LanguageModal";
import Link from "next/link";

interface ProfileContentProps {
  initialUser: UserProfile;
}

export function ProfileContent({ initialUser }: ProfileContentProps) {
  const [user, setUser] = useState(initialUser);
  const [selectedImage, setSelectedImage] = useState<string | null>(user.profileImage || null);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showLanguageModal, setShowLanguageModal] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const fileReader = new FileReader();
      fileReader.onload = () => {
        if (fileReader.readyState === 2) {
          setSelectedImage(fileReader.result as string);
        }
      };
      fileReader.readAsDataURL(e.target.files[0]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Profile Details Section */}
      <div className="flex flex-col items-center text-center space-y-4">
        {/* Profile Image */}
        <div className="relative">
          <label htmlFor="profile-image" className="cursor-pointer">
            <img
              src={selectedImage || "/images/logo.png"} // Fallback to default image
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover border-2 border-gray-300"
            />
          </label>
          <input
            id="profile-image"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
          />
        </div>

        {/* User Details */}
        <h2 className="text-2xl font-bold">{user.name}</h2>
        <p className="text-gray-500 text-lg">{user.email}</p>

        {/* Edit Profile Button */}
        <Button className="bg-red-500 hover:bg-red-600" onClick={() => setShowEditProfile(true)}>Edit Profile</Button>
      </div>

      <Separator />

      {/* Content Section */}
      <div>
        <h2 className="text-2xl font-bold">Content</h2>
        <div className="mt-4 space-y-2">
          <Link href="/user/orders" className="block">
            <Button variant="ghost" className="w-full justify-start">
              <Package className="mr-2 h-4 w-4" />
              Orders
            </Button>
          </Link>
          <Link href="/user/favourites" className="block">
            <Button variant="ghost" className="w-full justify-start">
              <Heart className="mr-2 h-4 w-4" />
              Favorites
            </Button>
          </Link>
        </div>
      </div>

      <Separator />

      {/* Preferences Section */}
      <div>
        <h2 className="text-2xl font-bold">Preferences</h2>
        <div className="mt-4 space-y-2">
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={() => setShowLanguageModal(true)}
          >
            <Settings className="mr-2 h-4 w-4" />
            Language
          </Button>
          <Link href="/user/help" className="block">
            <Button variant="ghost" className="w-full justify-start">
              <HelpCircle className="mr-2 h-4 w-4" />
              Help Center
            </Button>
          </Link>
        </div>
      </div>

      {/* Modals */}
      <EditProfileModal
        user={user}
        open={showEditProfile}
        onOpenChange={setShowEditProfile}
        onUpdate={setUser}
      />

      <LanguageModal
        open={showLanguageModal}
        onOpenChange={setShowLanguageModal}
        currentLanguage={user.language || "en"}
        onLanguageChange={(language) => setUser({ ...user, language })}
      />
    </div>
  );
}
