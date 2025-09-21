import { defineField, defineType } from "sanity";
import { MessageCircle } from "lucide-react";

export const comment = defineType({
  name: "comment",
  title: "Comment",
  type: "document",
  icon: MessageCircle,
  fields: [
    defineField({
      name: "content",
      title: "Content",
      type: "text",
      validation: (Rule) => Rule.required().min(1).max(500),
    }),
    defineField({
      name: "author",
      title: "Author",
      type: "reference",
      to: { type: "author" },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "startup",
      title: "Startup",
      type: "reference",
      to: { type: "startup" },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "parentComment",
      title: "Parent Comment",
      type: "reference",
      to: { type: "comment" },
      description: "For replies to comments",
    }),
    defineField({
      name: "isApproved",
      title: "Is Approved",
      type: "boolean",
      initialValue: true,
    }),
  ],
  preview: {
    select: {
      title: "content",
      author: "author.name",
      startup: "startup.title",
    },
    prepare(selection) {
      const { title, author, startup } = selection;
      return {
        title: title?.substring(0, 50) + (title?.length > 50 ? "..." : ""),
        subtitle: `by ${author} on ${startup}`,
      };
    },
  },
  orderings: [
    {
      title: "Date Created, New",
      name: "createdAtDesc",
      by: [{ field: "_createdAt", direction: "desc" }],
    },
    {
      title: "Date Created, Old",
      name: "createdAtAsc",
      by: [{ field: "_createdAt", direction: "asc" }],
    },
  ],
});
