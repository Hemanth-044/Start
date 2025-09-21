"use client";

import Link from "next/link";
import Image from "next/image";
import { EyeIcon } from "lucide-react";
import { useState } from "react";

import { Author, Startup } from "@/sanity/types";
import { cn, formatDate, formatNumber } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import LikeButton from "./LikeButton";

export type StartupCardType = Omit<Startup, "author"> & { 
  author?: Author;
  likes?: Array<{
    user: {
      _ref: string;
    };
    likedAt: string;
  }>;
  likesCount?: number;
  uniqueViewsCount?: number;
  editorsChoice?: boolean;
};

interface StartupCardProps {
  post: StartupCardType;
  session?: any;
}

const StartupCard = ({ post, session }: StartupCardProps) => {
  const [imageError, setImageError] = useState(false);
  const [authorImageError, setAuthorImageError] = useState(false);

  // Check if current user has liked this startup
  const isLiked = session?.id ? 
    post.likes?.some((like: any) => like.user._ref === session.id) : false;

  return (
    <li className="startup-card group">
      <div className="flex-between">
        <p className="startup-card_date">{formatDate(post._createdAt)}</p>
        <div className="flex flex-col gap-1 items-end">
          <div className="flex items-center gap-1.5">
            <EyeIcon className="size-5 text-primary" />
            <span className="text-16-medium">{formatNumber(post.uniqueViewsCount || 0)}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-14-medium text-gray-500">{formatNumber(post.views || 0)} total visits</span>
          </div>
        </div>
      </div>

      <div className="flex-between mt-5 gap-5">
        <div className="flex-1">
          <Link href={`/user/${post.author?._id!}`}>
            <p className="text-16-medium line-clamp-1">{post.author?.name}</p>
          </Link>
          <div className="flex items-center gap-2">
            <Link href={`/startup/${post._id}`}>
              <h3 className="text-26-semibold line-clamp-1">{post.title}</h3>
            </Link>
            {post.editorsChoice && (
              <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                Editor's Choice
              </span>
            )}
          </div>
        </div>
        <Link href={`/user/${post.author?._id}`}>
          <Image
            src={(!post.author?.image || authorImageError) ? "/nature.jpg" : post.author.image}
            alt="author avatar"
            width={48}
            height={48}
            className="rounded-full"
            onError={() => setAuthorImageError(true)}
          />
        </Link>
      </div>

      <Link href={`/startup/${post._id}`}>
        <p className="startup-card_desc">{post.description}</p>

        <Image 
          src={(!post.image || imageError) ? "/nature.jpg" : post.image} 
          alt="startup image" 
          width={400}
          height={200}
          className="startup-card_img"
          onError={() => setImageError(true)}
        />
      </Link>

      <div className="flex-between gap-3 mt-5">
        <Link href={`/?query=${post.category?.toLowerCase()}`}>
          <p className="text-16-medium">{post.category}</p>
        </Link>
        <div className="flex items-center gap-2">
          <LikeButton
            startupId={post._id}
            initialLikesCount={post.likesCount || 0}
            initialIsLiked={isLiked}
            size="sm"
            showCount={true}
          />
          <Button className="startup-card_btn" asChild>
            <Link href={`/startup/${post._id}`}>Details</Link>
          </Button>
        </div>
      </div>
    </li>
  );
};

export const StartupCardSkeleton = () => (
  <>
    {[0, 1, 2, 3, 4].map((_, index: number) => (
      <li key={cn("skeleton", index)}>
        <Skeleton className="startup-card_skeleton" />
      </li>
    ))}
  </>
);

export default StartupCard;
