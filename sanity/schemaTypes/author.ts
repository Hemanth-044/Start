import { UserIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const author = defineType({
  name: "author",
  title: "Author",
  type: "document",
  icon: UserIcon,
  fields: [
    defineField({
      name: "id",
      type: "number",
      description: "GitHub ID (for GitHub OAuth users)",
    }),
    defineField({
      name: "name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "username",
      type: "string",
      description: "Username (GitHub username for OAuth users)",
    }),
    defineField({
      name: "email",
      type: "string",
      validation: (Rule) => Rule.required().email(),
    }),
    defineField({
      name: "password",
      type: "string",
      description: "Hashed password (for email/password users)",
      hidden: true,
    }),
    defineField({
      name: "image",
      type: "url",
    }),
    defineField({
      name: "bio",
      type: "text",
    }),
    defineField({
      name: "authProvider",
      type: "string",
      options: {
        list: [
          { title: "GitHub", value: "github" },
          { title: "Email/Password", value: "credentials" },
        ],
      },
      initialValue: "github",
    }),
    defineField({
      name: "resetPasswordToken",
      type: "string",
      description: "Password reset token",
      hidden: true,
    }),
    defineField({
      name: "resetPasswordExpires",
      type: "datetime",
      description: "Password reset token expiration",
      hidden: true,
    }),
    defineField({
      name: "securityQuestion",
      type: "string",
      description: "Security question for password reset",
      options: {
        list: [
          { title: "What was the name of your first pet?", value: "first_pet" },
          { title: "What city were you born in?", value: "birth_city" },
          { title: "What was your mother's maiden name?", value: "mother_maiden" },
          { title: "What was the name of your elementary school?", value: "elementary_school" },
          { title: "What was your childhood nickname?", value: "childhood_nickname" },
          { title: "What was the make of your first car?", value: "first_car" },
        ],
      },
    }),
    defineField({
      name: "securityAnswer",
      type: "string",
      description: "Answer to security question (hashed)",
      hidden: true,
    }),
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "email",
    },
  },
});
