"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface DeleteStartupButtonProps {
  startupId: string;
  startupTitle: string;
}

const DeleteStartupButton = ({ startupId, startupTitle }: DeleteStartupButtonProps) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleDelete = async () => {
    setIsDeleting(true);
    
    try {
      const response = await fetch(`/api/startup/${startupId}/delete`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Success",
          description: "Startup deleted successfully",
        });
        
        // Redirect to home page after successful deletion
        router.push("/");
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to delete startup",
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
      setIsDeleting(false);
      setShowConfirm(false);
    }
  };

  if (showConfirm) {
    return (
      <div className="flex gap-2">
        <Button
          onClick={handleDelete}
          disabled={isDeleting}
          variant="destructive"
          size="sm"
        >
          {isDeleting ? "Deleting..." : "Confirm Delete"}
        </Button>
        <Button
          onClick={() => setShowConfirm(false)}
          variant="outline"
          size="sm"
          disabled={isDeleting}
        >
          Cancel
        </Button>
      </div>
    );
  }

  return (
    <Button
      onClick={() => setShowConfirm(true)}
      variant="destructive"
      size="sm"
      className="flex items-center gap-2"
    >
      <Trash2 className="h-4 w-4" />
      Delete Startup
    </Button>
  );
};

export default DeleteStartupButton;
