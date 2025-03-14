"use client";

import React from "react";

export const TypingIndicator = () => (
  <div className="flex space-x-1 items-center justify-center">
    <div className="w-2 h-2 rounded-full bg-zinc-400 animate-bounce" style={{ animationDelay: "0ms" }}></div>
    <div className="w-2 h-2 rounded-full bg-zinc-400 animate-bounce" style={{ animationDelay: "150ms" }}></div>
    <div className="w-2 h-2 rounded-full bg-zinc-400 animate-bounce" style={{ animationDelay: "300ms" }}></div>
  </div>
); 