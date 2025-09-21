"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";
import Link from "next/link";

const LogoutButton = () => {
  const handleLogout = async () => {
    try {
      // Use NextAuth signOut with redirect: false to clear session
      await signOut({ 
        redirect: false 
      });
      
      // Simply redirect to home page - keep GitHub session for easier re-login
      window.location.href = "/";
    } catch (error) {
      console.error("Logout error:", error);
      // Fallback: just redirect to home
      window.location.href = "/";
    }
  };

  return (
    <button 
      onClick={handleLogout}
      className="font-semibold text-red-500 cursor-pointer hover:text-red-600 transition-colors"
    >
      <span className="max-sm:hidden">Logout</span>
      <LogOut className="size-6 sm:hidden text-red-500" />
    </button>
  );
};

export default LogoutButton;
