'use client'
import { TabNavigation } from "@/app/components/Common/TabNavigation";
import { ProfileContent } from "./ProfileContent";
import { mockUser } from "@/lib/mock-data";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 pt-16 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <ProfileContent initialUser={mockUser} />
          <TabNavigation/>
        </div>
      </div>
    </main>
  );
}