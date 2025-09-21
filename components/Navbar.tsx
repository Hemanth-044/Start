import Link from "next/link";
import Image from "next/image";
import { getServerSession } from "next-auth";
import { BadgePlus, Home } from "lucide-react";
import type { Session } from "next-auth";

import LogoutButton from "@/components/LogoutButton";
import LoginButton from "@/components/LoginButton";
import ProfileAvatar from "@/components/ProfileAvatar";
import authOptions from "@/auth";

const Navbar = async () => {
  const session = await getServerSession(authOptions) as Session | null;
  
  // Debug logging
  console.log("Navbar - Session:", session);
  console.log("Navbar - Session ID:", session?.id);
  console.log("Navbar - User:", session?.user);
  
  const profileUrl = session?.id ? `/user/${session.id}` : "#";
  console.log("Navbar - Profile URL:", profileUrl);

  return (
    <header className="px-5 py-3 bg-white shadow-sm font-work-sans">
      <nav className="flex justify-between items-center">
        <Link href="/">
          <Image src="/logo.png" alt="logo" width={143} height={30} />
        </Link>

        <div className="flex items-center gap-5">
          <Link 
            href="/" 
            className="flex items-center gap-1 text-gray-600 hover:text-gray-900 transition-colors"
            title="Home"
          >
            <Home className="size-5" />
            <span className="hidden sm:inline text-sm font-medium">Home</span>
          </Link>
          
          {session && session?.user ? (
            <>
              <Link
                href="/startup/create"
                className="font-semibold text-black-100"
              >
                <span className="max-sm:hidden">Create</span>
                <BadgePlus className="size-6 sm:hidden" />
              </Link>

              <LogoutButton />

              <ProfileAvatar 
                sessionId={session?.id}
                userImage={session?.user?.image || undefined}
                userName={session?.user?.name || undefined}
                userEmail={session?.user?.email || undefined}
              />
            </>
          ) : (
            <LoginButton />
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
