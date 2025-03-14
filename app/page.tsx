import { ChatContainer } from "./components/chat-container";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "LLM Chat Interface",
  description: "A modern chat interface for interacting with LLMs",
  viewport: "width=device-width, initial-scale=1",
  icons: {
    icon: "/bot-avatar.svg",
  },
};

export default function Home() {
  return <ChatContainer />;
}
