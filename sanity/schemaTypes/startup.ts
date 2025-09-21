import { defineField, defineType } from "sanity";

export const startup = defineType({
  name: "startup",
  title: "Startup",
  type: "document",
  fields: [
    defineField({
      name: "title",
      type: "string",
    }),
    defineField({
      name: "slug",
      type: "slug",
      options: {
        source: "title",
      },
    }),
    defineField({
      name: "author",
      type: "reference",
      to: { type: "author" },
    }),
    defineField({
      name: "views",
      type: "number",
    }),
    defineField({
      name: "uniqueViews",
      title: "Unique Views",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "user",
              type: "reference",
              to: { type: "author" },
            },
            {
              name: "viewedAt",
              type: "datetime",
            },
          ],
        },
      ],
    }),
    defineField({
      name: "uniqueViewsCount",
      title: "Unique Views Count",
      type: "number",
      initialValue: 0,
    }),
    defineField({
      name: "description",
      type: "text",
    }),
    defineField({
      name: "category",
      type: "string",
      validation: (Rule) =>
        Rule.min(1)
          .max(20)
          .required()
          .error("Must have at least 1 and at most 20 characters"),
    }),
    defineField({
      name: "image",
      type: "url",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "pitch",
      type: "markdown",
    }),
    defineField({
      name: "likes",
      title: "Likes",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "user",
              type: "reference",
              to: { type: "author" },
            },
            {
              name: "likedAt",
              type: "datetime",
            },
          ],
        },
      ],
    }),
    defineField({
      name: "likesCount",
      title: "Likes Count",
      type: "number",
      initialValue: 0,
    }),
    defineField({
      name: "editorsChoice",
      title: "Editor's Choice",
      type: "boolean",
      description: "Mark this startup as an editor's choice",
      initialValue: false,
    }),
  ],
});
