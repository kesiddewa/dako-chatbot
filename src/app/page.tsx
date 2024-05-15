"use client";

import React, { useState, useEffect, useRef, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { useChat } from "ai/react";
import MessageChat from "@/components/message-chat";
import { CornerDownLeft } from 'lucide-react';
import ScrollButton from "@/components/scroll-button";
import WelcomeScreen from "@/components/welcome-screen";

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit: originalHandleSubmit, isLoading, error } = useChat();
  const [textAreaHeight, setTextAreaHeight] = useState("60px");
  const [isVisible, setIsVisible] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);

  const lastMessageIsUser = messages[messages.length - 1]?.role === "user";

  useEffect(() => {
    adjustTextAreaHeight();
  }, [input]);

  const adjustTextAreaHeight = () => {
    const textArea = document.getElementById("chat-textarea");
    if (textArea) {
      textArea.style.height = "auto";
      textArea.style.height = textArea.scrollHeight + "px";
      setTextAreaHeight(textArea.style.height);
    }
  };

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isVisible) {
      toggleVisibility();
    }
    originalHandleSubmit(event);
  };

  return (
    <div className="flex justify-center mt-20 mb-32">
      <div className="space-y-4 px-4 py-2 md:py-4 xl:w-1/2 md:w-full sm:w-full overflow-y-auto">
        {isVisible && <WelcomeScreen />}
        {messages.map((message) => (
          <div className="py-1 w-full" key={message.id}>
            <MessageChat message={message} />
          </div>
        ))}
        {isLoading && lastMessageIsUser && (
          <MessageChat 
            message={{
              id: "loading",
              role: "assistant",
              content: "....",
            }}
          />
        )}
        {error && (
          <MessageChat
            message={{
              id: "error",
              role: "assistant",
              content: "Something went wrong. Please try again"
            }}
          />
        )}
      </div>
      <div className="grid w-full fixed bottom-0 place-items-center">
        <ScrollButton />
        <div className="bg-background space-y-4 border-t px-4 py-4 shadow-lg xl:rounded-t-xl border xl:w-1/2 sm:w-full">
          <form onSubmit={handleSubmit}>
            <div className="bg-background relative flex max-h-60 w-full grow flex-col overflow-hidden px-8 rounded-md border">
              <input
                id="chat-textarea"
                tabIndex={0}
                className="min-h-[60px] w-100 resize-none bg-transparent pr-16 py-[1.3rem] focus-within:outline-none sm:text-sm"
                style={{ height: textAreaHeight }}
                value={input}
                onChange={handleInputChange}
                placeholder="Kirim sebuah pesan."
                autoComplete="off"
                autoCorrect="off"
              />
              <div className="absolute top-[13px] right-4">
                <Button type="submit" disabled={isLoading || input.length === 0}>
                  <CornerDownLeft size={16} />
                </Button>
              </div>
            </div>
          </form>
          <div>
            <h6 className="text-xs text-center text-gray-500">© Dako Brand & Communication 2024</h6>
          </div>
        </div>
      </div>
    </div>
  );
}
