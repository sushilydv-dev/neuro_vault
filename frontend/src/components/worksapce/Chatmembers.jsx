import React, { useEffect, useRef, useState } from "react";
import { Send, Hash, Users } from "lucide-react";
import { useParams } from "react-router-dom";

export const Chatmembers = () => {
  const { id: workspaceId } = useParams();
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "Alex",
      content: "Hey team, did we upload the new docs?",
      role: "member",
    },
    {
      id: 2,
      sender: "Sarah",
      content: "Yes, just finished! @AI should be able to index them now.",
      role: "member",
    },
    {
      id: 3,
      sender: "You",
      content: "Great, checking them out.",
      role: "user",
    },
  ]);
  const [input, setInput] = useState("");
  const scrollRef = useRef(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    const newMessage = {
      id: Date.now(),
      sender: "You",
      content: input,
      role: "user",
    };
    setMessages([...messages, newMessage]);
    setInput("");
  };

  return (
    <div className="flex flex-col h-full text-white w-full rounded-2xl nv-bento nv-bento-rim overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-white/10 flex justify-between items-center bg-white/[0.02]">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-500/10 rounded-lg">
            <Hash size={18} className="text-[#2D7FF9]" />
          </div>
          <div>
            <h3 className="text-sm font-semibold">Workspace Chat</h3>
            <p className="text-[10px] text-gray-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
              4 Members Online
            </p>
          </div>
        </div>
        <Users
          size={18}
          className="text-gray-400 hover:text-white cursor-pointer transition-colors"
        />
      </div>

      {/* Chat Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((msg) => {
          const isMe = msg.role === "user";
          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}
            >
              {/* Sender Name */}
              {!isMe && (
                <span className="text-[11px] text-gray-500 mb-1.5 ml-1 font-medium tracking-wide">
                  {msg.sender}
                </span>
              )}

              <div
                className={`max-w-[75%] px-4 py-2.5 rounded-2xl shadow-lg text-sm leading-relaxed ${
                  isMe
                    ? "rounded-tr-none bg-gradient-to-b from-[#2D7FF9] to-[#1B4FD1] shadow-[0_12px_30px_rgba(45,127,249,0.15)]"
                    : "rounded-tl-none bg-white/[0.05] border border-white/10 backdrop-blur-xl"
                }`}
              >
                {msg.content}
              </div>
            </div>
          );
        })}
      </div>

      {/* Input Area */}
      <div className="p-4 bg-black/20 border-t border-white/10">
        <div className="flex items-center gap-3 bg-white/[0.03] p-1.5 pl-4 rounded-xl border border-white/10 focus-within:border-[#2D7FF9]/40 transition-all">
          <input
            className="flex-1 bg-transparent py-2 outline-none text-sm"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Message workspace..."
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className={`p-2 rounded-lg transition-all ${
              !input.trim()
                ? "text-white/20"
                : "bg-[#2D7FF9] text-white shadow-lg hover:scale-105 active:scale-95"
            }`}
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};
