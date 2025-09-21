"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import CommentForm from "./CommentForm";
import CommentList from "./CommentList";
import { useAuthModal } from "@/contexts/AuthModalContext";

interface CommentsSectionProps {
  startupId: string;
  session: any;
}

const CommentsSection = ({ startupId, session }: CommentsSectionProps) => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const { openModal } = useAuthModal();

  const handleCommentAdded = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="space-y-6">
      {session ? (
        <CommentForm 
          startupId={startupId} 
          onCommentAdded={handleCommentAdded}
        />
      ) : (
        <div className="text-center py-4 bg-gray-50 rounded-lg border">
          <p className="text-gray-600 mb-3">Please log in to comment on this startup</p>
          <Button onClick={() => openModal("login")}>
            Login
          </Button>
        </div>
      )}
      <CommentList 
        startupId={startupId} 
        refreshTrigger={refreshTrigger}
      />
    </div>
  );
};

export default CommentsSection;
