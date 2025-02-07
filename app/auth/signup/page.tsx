"use client";

import { useState } from "react";
import Link from "next/link";
import { Utensils } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle signup logic here
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-100 to-red-150 flex items-center justify-center p-4">
      <div className="w-full max-w-[400px] space-y-6">
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center">
            <Utensils className="h-10 w-10 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Create an account</h1>
          <p className="text-gray-500">Join Oxford Bakery today</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg space-y-6">
          <div className="space-y-4">
            <Button variant="outline" className="w-full" type="button">
              <img
                src="https://www.google.com/favicon.ico"
                alt="Google"
                className="w-5 h-5 mr-2"
              />
              Sign up with Google
            </Button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-2 text-gray-500">
                or sign up with email
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className="text-sm text-gray-500">
              By signing up, you agree to our{" "}
              <Link href="/terms" className="text-red-500 hover:text-red-600">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="text-red-500 hover:text-red-600">
                Privacy Policy
              </Link>
            </div>

            <Button type="submit" className="w-full bg-red-500 hover:bg-red-600">
              Create Account
            </Button>
          </form>
        </div>

        <div className="text-center text-sm">
          Already have an account?{" "}
          <Link
            href="/auth/login"
            className="text-red-500 hover:text-red-600 font-medium"
          >
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}