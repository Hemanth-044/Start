"use client";

import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuthModal } from "@/contexts/AuthModalContext";

interface LikeButtonProps {
  startupId: string;
  initialLikesCount?: number;
  initialIsLiked?: boolean;
  size?: "sm" | "default" | "lg";
  showCount?: boolean;
}

const LikeButton = ({ 
  startupId, 
  initialLikesCount = 0, 
  initialIsLiked = false,
  size = "default",
  showCount = true
}: LikeButtonProps) => {
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [likesCount, setLikesCount] = useState(initialLikesCount);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { openModal } = useAuthModal();

  // Update state when props change (for page refreshes)
  useEffect(() => {
    setIsLiked(initialIsLiked);
    setLikesCount(initialLikesCount);
  }, [initialIsLiked, initialLikesCount]);

  const handleLike = async () => {
    if (isLoading) return;

    // Check if user is authenticated by making a test API call
    try {
      const testResponse = await fetch(`/api/startup/${startupId}/like`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const testData = await testResponse.json();

      // If user is not authenticated, show login modal
      if (testResponse.status === 401) {
        toast({
          title: "Login Required",
          description: "Please log in to like startups",
          variant: "destructive",
        });
        
        // Open login modal
        openModal("login");
        return;
      }

      // If authenticated, proceed with the like
      setIsLoading(true);
      
      // Optimistic update
      const newIsLiked = !isLiked;
      const newLikesCount = newIsLiked ? likesCount + 1 : Math.max(0, likesCount - 1);
      
      setIsLiked(newIsLiked);
      setLikesCount(newLikesCount);

      console.log("Like button clicked - optimistic update:", { newIsLiked, newLikesCount });

      if (testResponse.ok) {
        // Update with actual server response
        setIsLiked(testData.isLiked);
        setLikesCount(testData.likesCount);
        
        // Show success feedback
        toast({
          title: testData.isLiked ? "Liked!" : "Unliked",
          description: testData.isLiked ? "You liked this startup" : "You unliked this startup",
        });
      } else {
        // Revert optimistic update on error
        setIsLiked(!newIsLiked);
        setLikesCount(likesCount);
        
        toast({
          title: "Error",
          description: testData.error || "Failed to update like",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Like error:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant={isLiked ? "default" : "outline"}
      size={size}
      onClick={handleLike}
      disabled={isLoading}
      className={`flex items-center gap-2 transition-all duration-200 ${
        isLiked 
          ? "bg-red-500 hover:bg-red-600 text-white border-red-500" 
          : "hover:bg-red-50 hover:border-red-300 hover:text-red-600"
      } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      <Heart 
        className={`h-4 w-4 transition-all duration-200 ${
          isLiked ? "fill-current scale-110" : "hover:scale-110"
        }`} 
      />
      {showCount && (
        <span className="text-sm font-medium">
          {likesCount}
        </span>
      )}
      {isLoading && (
        <div className="h-3 w-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
      )}
    </Button>
  );
};

export default LikeButton;
