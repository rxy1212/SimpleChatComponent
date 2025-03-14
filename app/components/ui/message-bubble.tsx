"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { TypingIndicator } from "./typing-indicator";
import { MessageAvatar } from "./message-avatar";

interface MessageBubbleProps {
  content: string;
  role: "user" | "assistant";
  complete?: boolean;
}

export const MessageBubble = ({ content, role, complete }: MessageBubbleProps) => {
  // 用户消息：头像在右侧，气泡在左侧，整体靠右对齐
  if (role === "user") {
    return (
      <div className="flex justify-end w-full">
        <div className="flex items-start gap-3 max-w-[80%]">
          <div className={cn("rounded-lg px-3 py-2 text-sm bg-zinc-900 text-zinc-50 break-words")}>
            {content || <div className="h-5 w-5 animate-pulse bg-zinc-400 rounded-full" />}
          </div>
          <MessageAvatar role="user" />
        </div>
      </div>
    );
  }

  // AI消息：头像在左侧，气泡在右侧
  return (
    <div className="flex justify-start w-full">
      <div className="flex items-start gap-3 max-w-[80%]">
        <div className="flex-shrink-0">
          <MessageAvatar role="assistant" />
        </div>
        <div className={cn("rounded-lg px-3 py-2 text-sm bg-zinc-200 text-zinc-900 break-words")}>
          {content || (!complete ? <TypingIndicator /> : <div className="h-5 w-5 animate-pulse bg-zinc-400 rounded-full" />)}
        </div>
      </div>

    </div>
  );
}; 