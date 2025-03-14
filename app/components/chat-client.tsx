"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageBubble } from "./ui/message-bubble";

type Message = {
  id: string;
  content: string;
  role: "user" | "assistant";
  complete?: boolean;
};

export function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: "user",
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Add empty assistant message that will be streamed
    const assistantMessageId = (Date.now() + 1).toString();
    setMessages((prev) => [
      ...prev,
      { id: assistantMessageId, content: "", role: "assistant" },
    ]);

    try {
      // Connect to SSE endpoint
      const eventSource = new EventSource("/api/chat");
      let assistantResponse = "";

      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          
          if (data.type === "content") {
            assistantResponse += data.content;
            
            // Update the assistant message with the streamed content
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === assistantMessageId
                  ? { ...msg, content: assistantResponse }
                  : msg
              )
            );
          }
          
          if (data.type === "done") {
            // Mark message as complete
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === assistantMessageId
                  ? { ...msg, complete: true }
                  : msg
              )
            );
            eventSource.close();
            setIsLoading(false);
            
            // Focus the input field after the bot message is complete
            if (inputRef.current) {
              inputRef.current.focus();
            }
          }
        } catch (error) {
          console.error("Error parsing SSE data:", error);
        }
      };

      eventSource.onerror = () => {
        eventSource.close();
        setIsLoading(false);
        
        // Mark message as complete even if there was an error
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMessageId
              ? { ...msg, complete: true, content: assistantResponse || "An error occurred. Please try again." }
              : msg
          )
        );
        
        // Focus the input field even if there was an error
        if (inputRef.current) {
          inputRef.current.focus();
        }
      };
    } catch (error) {
      console.error("Error sending message:", error);
      setIsLoading(false);
      
      // Focus the input field if there was an error
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  };

  return (
    <div className="flex flex-col w-1/2 h-2/3 mx-auto border rounded-lg shadow-md overflow-hidden" style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
      <ScrollArea className="flex-1 h-5/6" ref={scrollAreaRef}>
        <div className="p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-[calc(50vh*5/6-2rem)]">
              <p className="text-zinc-500">Start a conversation</p>
            </div>
          ) : (
            messages.map((message) => (
              <MessageBubble
                key={message.id}
                content={message.content}
                role={message.role}
                complete={message.complete}
              />
            ))
          )}
        </div>
      </ScrollArea>
      <div className="h-1/6 border-t p-4 items-center">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            ref={inputRef}
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
            className="flex-1"
          />
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Sending..." : "Send"}
          </Button>
        </form>
      </div>
    </div>
  );
} 