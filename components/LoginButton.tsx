"use client";

import { useState } from "react";
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import AuthModal from "./AuthModal";

const LoginButton = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const handleEmailLogin = () => {
    setIsAuthModalOpen(true);
  };

  return (
    <>
      <Button onClick={handleEmailLogin} className="login">
        <Mail className="size-5 mr-2" />
        Login
      </Button>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode="login"
      />
    </>
  );
};

export default LoginButton;
