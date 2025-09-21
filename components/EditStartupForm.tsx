"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Send } from "lucide-react";
import MDEditor from "@uiw/react-md-editor";

import { formSchema } from "@/lib/validation";
import { useToast } from "@/hooks/use-toast";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface EditStartupFormProps {
  startup: {
    _id: string;
    title: string;
    description: string;
    category: string;
    image: string;
    pitch: string;
  };
}

const EditStartupForm = ({ startup }: EditStartupFormProps) => {
  const { toast } = useToast();
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: startup.title,
    description: startup.description,
    category: startup.category,
    image: startup.image,
  });
  const [pitch, setPitch] = useState(startup.pitch);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isPending, setIsPending] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  async function handleFormSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsPending(true);
    setErrors({});

    try {
      const formValues = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        link: formData.image,
        pitch,
      };

      // Validate form values
      await formSchema.parseAsync(formValues);

      // Update the startup
      const response = await fetch(`/api/startup/${startup._id}/edit`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          category: formData.category,
          image: formData.image,
          pitch,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Success",
          description: "Your startup has been updated successfully",
        });

        router.push(`/startup/${startup._id}`);
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to update startup",
          variant: "destructive",
        });
      }
    } catch (error) {
      if (error instanceof Error && error.name === 'ZodError') {
        const zodError = error as any;
        const fieldErrors = zodError.flatten().fieldErrors;
        setErrors(fieldErrors as unknown as Record<string, string>);

        toast({
          title: "Error",
          description: "Please check your input and try again",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: "An unexpected error occurred",
          variant: "destructive",
        });
      }
    } finally {
      setIsPending(false);
    }
  }

  return (
    <form onSubmit={handleFormSubmit} className="startup-form">
      <div>
        <label htmlFor="title" className="startup-form_label">
          Title
        </label>
        <Input
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className="startup-form_input"
          required
          placeholder="JSM Academy Masterclass"
        />

        {errors.title && <p className="startup-form_error">{errors.title}</p>}
      </div>

      <div>
        <label htmlFor="description" className="startup-form_label">
          Description
        </label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="startup-form_textarea"
          rows={5}
          required
          placeholder="Short description of your startup idea"
        />

        {errors.description && (
          <p className="startup-form_error">{errors.description}</p>
        )}
      </div>

      <div>
        <label htmlFor="category" className="startup-form_label">
          Category
        </label>
        <Input
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
          className="startup-form_input"
          placeholder="Choose a category (e.g., Tech, Health, Education, etc.)"
        />

        {errors.category && (
          <p className="startup-form_error">{errors.category}</p>
        )}
      </div>

      <div>
        <label htmlFor="image" className="startup-form_label">
          Image URL
        </label>
        <Input
          id="image"
          name="image"
          type="url"
          value={formData.image}
          onChange={handleChange}
          className="startup-form_input"
          required
          placeholder="https://example.com/image.jpg (direct image link)"
        />

        {errors.link && <p className="startup-form_error">{errors.link}</p>}
      </div>

      <div data-color-mode="light">
        <label htmlFor="pitch" className="startup-form_label">
          Pitch
        </label>

        <MDEditor
          id="pitch"
          value={pitch}
          preview="edit"
          height={300}
          onChange={(value) => setPitch(value as string)}
          className="startup-form_editor"
          style={{
            borderRadius: 20,
            overflow: "hidden",
          }}
          textareaProps={{
            placeholder:
              "Briefly describe your idea and what problem it solves ",
          }}
          previewOptions={{
            disallowedElements: ["style"],
          }}
        />

        {errors.pitch && <p className="startup-form_error">{errors.pitch}</p>}
      </div>

      <div className="flex gap-3">
        <Button type="submit" disabled={isPending} className="startup-form_btn">
          {isPending ? "Updating..." : "Update Startup"}
          <Send className="size-6 ml-2" />
        </Button>
        
        <Button 
          type="button" 
          variant="outline" 
          onClick={() => router.back()}
          disabled={isPending}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default EditStartupForm;
