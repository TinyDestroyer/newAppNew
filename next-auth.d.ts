import { UserRole } from "@prisma/client";
import NextAuth, { type DefaultSession } from "next-auth";

export type ExtendedUser = DefaultSession["user"] & {
  role: UserRole;
  isTwoFactorEnabled: boolean;
  isOAuth: boolean;
};

declare module "next-auth" {
  interface Session {
    user: {
      id: string;  // Add the 'id' field to user
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: string; // or UserRole type if applicable
      isTwoFactorEnabled?: boolean;
      isOAuth?: boolean;
    } & DefaultSession["user"];
    user: ExtendedUser;
  }
}
