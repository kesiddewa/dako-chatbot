import { Message } from "ai/react";
import { cn } from "@/lib/utils";
import { Bot, User } from "lucide-react";
import ReactMarkdown from "react-markdown";

interface ChatMessageProps {
  message: Message;
}

export default function MessageChat({
  message: { role, content },
}: ChatMessageProps) {
  const isAiMessage = role === "assistant";

  console.log("Message:", content); // Periksa nilai content
  console.log("Role:", role);

  return (
    <div
      className={cn(
        "mb-3 flex items-start",
        isAiMessage ? "justify-start" : "justify-end"
      )}
    >
      {isAiMessage ? (
        <div className="mr-2 rounded-lg border px-2 py-2 bg-white">
          <Bot className="flex-none" size={24} />
        </div>
      ) : (
        <div className="ml-2 rounded-lg border px-2 py-2 bg-white order-last">
          <User className="flex-none" size={24} />
        </div>
      )}
      <div
        className={cn(
          "rounded-lg border px-4 py-2",
          isAiMessage ? "bg-white text-black" : "bg-blue-500 text-white",
          "border border-t"
        )}
        style={{ maxWidth: "100%" }}
      >
        <ReactMarkdown>
        {content}
        </ReactMarkdown>
      </div>
    </div>
  );
}
