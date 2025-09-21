"use client";

import { useState } from "react";
import { Star, StarOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface EditorsChoiceToggleProps {
  startupId: string;
  initialEditorsChoice: boolean;
  onToggle?: (newValue: boolean) => void;
}

const EditorsChoiceToggle = ({ 
  startupId, 
  initialEditorsChoice, 
  onToggle 
}: EditorsChoiceToggleProps) => {
  const [isEditorsChoice, setIsEditorsChoice] = useState(initialEditorsChoice);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleToggle = async () => {
    setIsLoading(true);

    try {
      const response = await fetch(`/api/startup/${startupId}/editors-choice`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (response.ok) {
        const newValue = data.editorsChoice;
        setIsEditorsChoice(newValue);
        onToggle?.(newValue);
        
        toast({
          title: "Success",
          description: data.message,
        });
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to update editor's choice status",
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
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleToggle}
      disabled={isLoading}
      variant={isEditorsChoice ? "default" : "outline"}
      size="sm"
      className="flex items-center gap-2"
    >
      {isEditorsChoice ? (
        <>
          <Star className="h-4 w-4 fill-current" />
          Editor's Choice
        </>
      ) : (
        <>
          <StarOff className="h-4 w-4" />
          Mark as Editor's Choice
        </>
      )}
    </Button>
  );
};

export default EditorsChoiceToggle;
