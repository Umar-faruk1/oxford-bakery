"use client";

import { useState } from "react";
import Link from "next/link";
import { Utensils, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    // Handle password reset logic here
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-100 to-red-150 flex items-center justify-center p-4">
      <div className="w-full max-w-[400px] space-y-6">
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center">
            <Utensils className="h-10 w-10 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Reset your password</h1>
          <p className="text-gray-500">
            Enter your email address and we'll send you instructions to reset your password
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg space-y-6">
          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <Button type="submit" className="w-full bg-red-500 hover:bg-red-600">
                Send Reset Instructions
              </Button>
            </form>
          ) : (
            <div className="text-center space-y-4">
              <div className="text-green-600 font-medium">
                Check your email
              </div>
              <p className="text-gray-500 text-sm">
                We've sent password reset instructions to {email}. Please check your inbox.
              </p>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setIsSubmitted(false)}
              >
                Try another email
              </Button>
            </div>
          )}
        </div>

        <div className="flex justify-center">
          <Link
            href="/auth/login"
            className="text-sm text-gray-500 hover:text-gray-700 inline-flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to login</span>
          </Link>
        </div>
      </div>
    </div>
  );
}