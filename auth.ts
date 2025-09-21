import NextAuth, { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

import { client } from "./sanity/lib/client";
import { writeClient } from "@/sanity/lib/write-client";
import { AUTHOR_BY_EMAIL_QUERY } from "@/sanity/lib/queries";


export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          // Find user by email
          const user = await client.fetch(AUTHOR_BY_EMAIL_QUERY, {
            email: credentials.email,
          });

          if (!user || user.authProvider !== "credentials") {
            return null;
          }

          // Verify password
          const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
          
          if (!isPasswordValid) {
            return null;
          }

          return {
            id: user._id,
            email: user.email,
            name: user.name,
            image: user.image,
          };
        } catch (error) {
          console.error("Error in credentials authorization:", error);
          return null;
        }
      }
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn({ user, account, profile }) {
      try {
        // Handle credentials authentication
        if (account?.provider === "credentials") {
          // User already exists and password was verified in authorize function
          return true;
        }

        // Return true to continue the sign-in process
        return true;
      } catch (error) {
        console.error("Error in signIn callback:", error);
        return true; // Allow sign-in even if Sanity operations fail
      }
    },
    async jwt({ token, account, profile, user }) {
      try {
        // Handle credentials authentication
        if (account?.provider === "credentials" && user) {
          // For credentials, the user.id is already the Sanity _id
          console.log("JWT callback - Credentials user ID:", user.id);
          token.id = user.id;
        }
        
        console.log("JWT callback - Final token ID:", token.id);
        return token;
      } catch (error) {
        console.error("Error in jwt callback:", error);
        return token;
      }
    },

    async session({ session, token }) {
      // Pass the profile id from the token to the session
      console.log("Session callback - Token ID:", token.id);
      console.log("Session callback - Session before:", session);
      
      Object.assign(session, { id: token.id });
      
      console.log("Session callback - Session after:", session);
      return session;
    },
  },
};

export default NextAuth(authOptions);
