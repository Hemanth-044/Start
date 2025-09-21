"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useAuthModal } from "@/contexts/AuthModalContext";

interface CommentFormProps {
  startupId: string;
  parentCommentId?: string;
  onCommentAdded?: () => void;
  placeholder?: string;
}

const CommentForm = ({ 
  startupId, 
  parentCommentId, 
  onCommentAdded,
  placeholder = "Write a comment..."
}: CommentFormProps) => {
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { openModal } = useAuthModal();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim()) {
      toast({
        title: "Error",
        description: "Please enter a comment",
        variant: "destructive",
      });
      return;
    }

    if (content.length > 500) {
      toast({
        title: "Error",
        description: "Comment must be less than 500 characters",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/startup/${startupId}/comment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: content.trim(),
          parentCommentId,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setContent("");
        toast({
          title: "Success",
          description: "Comment added successfully",
        });
        onCommentAdded?.();
      } else if (response.status === 401) {
        toast({
          title: "Login Required",
          description: "Please log in to comment on startups",
          variant: "destructive",
        });
        
        // Open login modal
        openModal("login");
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to add comment",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={placeholder}
        className="min-h-[100px] resize-none"
        maxLength={500}
      />
      
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-500">
          {content.length}/500 characters
        </span>
        
        <Button 
          type="submit" 
          disabled={isSubmitting || !content.trim()}
          size="sm"
        >
          {isSubmitting ? "Posting..." : "Post Comment"}
          <Send className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </form>
  );
};

export default CommentForm;
