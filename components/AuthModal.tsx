"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { getSession } from "next-auth/react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import ForgotPasswordForm from "./ForgotPasswordForm";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: "login" | "register" | "forgot-password";
}

const AuthModal = ({ isOpen, onClose, initialMode = "login" }: AuthModalProps) => {
  const [mode, setMode] = useState<"login" | "register" | "forgot-password">(initialMode);

  const handleClose = async () => {
    onClose();
  };

  const handleLoginSuccess = async () => {
    // Close modal and force page refresh to update session
    onClose();
    window.location.reload();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="relative bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-10"
        >
          <X className="h-6 w-6" />
        </button>

        <div className="p-6">
          {mode === "login" && (
            <LoginForm
              onSwitchToRegister={() => setMode("register")}
              onSwitchToForgotPassword={() => setMode("forgot-password")}
              onSuccess={handleLoginSuccess}
            />
          )}

          {mode === "register" && (
            <RegisterForm
              onSwitchToLogin={() => setMode("login")}
              onSuccess={handleClose}
            />
          )}

          {mode === "forgot-password" && (
            <ForgotPasswordForm
              onBackToLogin={() => setMode("login")}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
