import { z } from "zod";

export const formSchema = z.object({
  title: z.string().min(3, "Title is required").max(100, "Title is too long"),
  description: z
    .string()
    .min(20, "Description should be at least 20 characters")
    .max(500, "Description is too long. Max 500 characters at most"),
  category: z
    .string()
    .min(3, "Category should be at least 3 characters")
    .max(20, "Category is too long. Max 20 characters at most"),
  link: z
    .string()
    .url("Invalid URL")
    .min(1, "Link is required")
    .refine((url) => {
      // Check if URL ends with common image extensions or is from known image hosting services
      const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
      const imageHosts = ['imgur.com', 'unsplash.com', 'pexels.com', 'pixabay.com', 'images.unsplash.com'];
      
      const hasImageExtension = imageExtensions.some(ext => url.toLowerCase().includes(ext));
      const isImageHost = imageHosts.some(host => url.includes(host));
      
      return hasImageExtension || isImageHost;
    }, "Please provide a direct link to an image (e.g., .jpg, .png) or from image hosting services like Unsplash, Imgur, etc."),
  pitch: z.string().min(10, "Pitch should be at least 10 characters"),
});
