"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ProfileAvatarProps {
  sessionId?: string;
  userImage?: string;
  userName?: string;
  userEmail?: string;
}

const ProfileAvatar = ({ sessionId, userImage, userName, userEmail }: ProfileAvatarProps) => {
  const handleClick = async () => {
    console.log("ProfileAvatar clicked! Session ID:", sessionId);
    console.log("User Image:", userImage);
    console.log("User Name:", userName);
    console.log("User Email:", userEmail);
    
    if (sessionId) {
      const profileUrl = `/user/${sessionId}`;
      console.log("Redirecting to:", profileUrl);
      window.location.href = profileUrl;
    } else {
      console.log("No session ID available, trying to find user by email/name");
      
      // Try to find user by email or name as fallback
      try {
        const searchParam = userEmail ? `email=${encodeURIComponent(userEmail)}` : `name=${encodeURIComponent(userName || '')}`;
        const response = await fetch(`/api/user/by-email?${searchParam}`);
        
        if (response.ok) {
          const data = await response.json();
          const userId = data.user._id;
          console.log("Found user ID:", userId);
          
          const profileUrl = `/user/${userId}`;
          console.log("Redirecting to:", profileUrl);
          window.location.href = profileUrl;
        } else {
          console.log("Could not find user");
          alert("Profile not available. Please try logging out and logging back in.");
        }
      } catch (error) {
        console.error("Error finding user:", error);
        alert("Profile not available. Please try logging out and logging back in.");
      }
    }
  };

  return (
    <div 
      className="avatar cursor-pointer"
      onClick={handleClick}
      title={sessionId ? "View your profile" : "Profile not available"}
    >
      <Avatar className="size-10 cursor-pointer">
        <AvatarImage
          src={userImage || "/nature.jpg"}
          alt={userName || ""}
          className="cursor-pointer"
          style={{ width: 'auto', height: 'auto' }}
        />
        <AvatarFallback className="cursor-pointer">UN</AvatarFallback>
      </Avatar>
    </div>
  );
};

export default ProfileAvatar;
