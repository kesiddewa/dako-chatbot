"use client";

import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { useChat } from "ai/react";
import MessageChat from "@/components/message-chat";

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit, setMessages, isLoading, error } = useChat();
  const [textAreaHeight, setTextAreaHeight] = useState("60px");
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

  return (
    <div className="flex justify-center mt-20 mb-24">
      <div className="space-y-4 px-4 py-2 md:py-4 w-1/2 overflow-y-auto">
        {messages.map((message) => (
          <div className="py-1 w-full">
            <MessageChat key={message.id} message={message} />
          </div>
        ))}
        {isLoading && lastMessageIsUser && (
          <MessageChat 
            message={{
              id: "loading",
              role: "assistant",
              content: "Thinking...",
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
        <div className="bg-background space-y-4 border-t px-4 py-2 shadow-lg sm:rounded-t-xl sm:border md:py-4 w-1/2">
          <form onSubmit={handleSubmit}>
            <div className="bg-background relative flex max-h-60 w-full grow flex-col overflow-hidden px-8 sm:rounded-md sm:border">
              <input
                id="chat-textarea"
                tabIndex={0}
                className="min-h-[60px] w-100 resize-none bg-transparent pr-16 py-[1.3rem] focus-within:outline-none sm:text-sm"
                style={{ height: textAreaHeight }}
                value={input}
                onChange={handleInputChange}
                placeholder="Say something"
                autoComplete="off"
                autoCorrect="off"
              ></input>
              <div className="absolute right-0 top-[13px] sm:right-4">
                <Button type="submit" disabled={isLoading || input.length === 0}>
                  Send
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
