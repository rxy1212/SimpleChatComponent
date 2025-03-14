import React from "react";
import { Chat } from "./chat-client";
import Image from "next/image";

export function ChatContainer() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <Chat />
    </main>
  );
} 