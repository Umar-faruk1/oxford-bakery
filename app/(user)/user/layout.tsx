import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { Navbar } from "@/app/components/Common/Navbar";
import { TabNavigation } from "@/app/components/Common/TabNavigation";
import { Sidebar } from "lucide-react";
const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    
      <div>
        <Navbar/>
        <Sidebar/>
        {children}
        <Toaster />
        
      </div>
   
  );
}