import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface MessageAvatarProps {
  role: "user" | "assistant";
  className?: string;
}

export function MessageAvatar({ role, className }: MessageAvatarProps) {
  const src = role === "user" ? "/user-avatar.svg" : "/bot-avatar.svg";
  const alt = role === "user" ? "User" : "AI";
  const fallback = role === "user" ? "You" : "AI";
  
  return (
    <div className={cn("relative h-8 w-8 rounded-full overflow-hidden", className)}>
      <Image 
        src={src} 
        alt={alt} 
        fill 
        sizes="32px"
        className="object-cover"
      />
      <div className="absolute inset-0 flex items-center justify-center bg-zinc-300 opacity-0 transition-opacity group-hover:opacity-100">
        {fallback}
      </div>
    </div>
  );
} 