"use client";

import { AuthModalProvider } from "@/contexts/AuthModalContext";
import AuthModal from "./AuthModal";
import { useAuthModal } from "@/contexts/AuthModalContext";

interface ProvidersProps {
  children: React.ReactNode;
}

const AuthModalWrapper = () => {
  const { isOpen, mode, closeModal, setMode } = useAuthModal();
  
  return (
    <AuthModal
      isOpen={isOpen}
      onClose={closeModal}
      initialMode={mode}
    />
  );
};

export const Providers = ({ children }: ProvidersProps) => {
  return (
    <AuthModalProvider>
      {children}
      <AuthModalWrapper />
    </AuthModalProvider>
  );
};
