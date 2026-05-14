import { useCallback, useEffect, useRef, useState } from "react";
import { Send, Loader2, Mic } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useParams, useNavigate, useOutletContext } from "react-router-dom";
import { API_BASE } from "../../utils/api";

export default function ChatArea() {
  const { sessionId, id: workspaceId } = useParams();
  const navigate = useNavigate();

  // When routed to `/chatbot` without an explicit `:sessionId`,
  // treat it as a new conversation.
  const effectiveSessionId = sessionId ?? "new";

  // Get the refresh function from Workspacearea context to update sidebar titles
  const { refreshSessions } = useOutletContext();

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);

  const scrollRef = useRef(null);
  const recognitionRef = useRef(null);

  const fetchHistory = useCallback(async () => {
    // If it's a "new" chat, don't call the API, just show welcome
    if (effectiveSessionId === "new") {
      setMessages([
        {
          id: "welcome",
          role: "assistant",
          content:
            "This is a new conversation. Ask me anything about your documents!",
        },
      ]);
      setIsLoadingHistory(false);
      return;
    }

    try {
      setIsLoadingHistory(true);
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE}/chat/history`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session_id: effectiveSessionId === "new" ? null : effectiveSessionId,
          token,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessages(data.history);
      }
    } catch (err) {
      console.error("History Load Error:", err);
    } finally {
      setIsLoadingHistory(false);
    }
  }, [effectiveSessionId]);

  // Re-fetch whenever the sessionId in the URL changes
  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, isTyping]);

  // Voice Recognition Setup
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.lang = "en-US";
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (e) => {
      const transcript = e.results[0][0].transcript;
      setInput((prev) => (prev ? `${prev} ${transcript}` : transcript));
    };
    recognitionRef.current = recognition;
  }, []);

  const toggleVoice = () => {
    if (!recognitionRef.current) return;
    isListening
      ? recognitionRef.current.stop()
      : recognitionRef.current.start();
  };

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMsg = { id: Date.now().toString(), role: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);

    const currentInput = input;
    setInput("");
    setIsTyping(true);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE}/chat/query`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: currentInput,
          workspace_id: workspaceId,
          token,
         
          session_id:
            effectiveSessionId === "new" ? null : effectiveSessionId,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

    
      if (effectiveSessionId === "new" && data.session_id) {
        refreshSessions(); 
        navigate(
          `/dashboard/workspacearea/${workspaceId}/chatbot/${data.session_id}`,
          { replace: true }
        );
      }

      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, role: "assistant", content: data.answer },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          id: "err",
          role: "assistant",
          content: "Engine error. Please try again.",
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="relative flex flex-col h-full text-white w-full rounded-2xl nv-bento nv-bento-rim overflow-hidden bg-[#1a1c23]">
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar"
      >
        {isLoadingHistory ? (
          <div className="flex justify-center items-center h-full">
            <Loader2 className="animate-spin text-blue-400" />
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] px-5 py-3 rounded-2xl shadow-lg ${
                  msg.role === "user"
                    ? "bg-gradient-to-br from-[#2D7FF9] to-[#1B4FD1] text-white"
                    : "bg-white/[0.05] border border-white/10 backdrop-blur-xl text-gray-200"
                }`}
              >
                <div className="prose prose-invert max-w-none text-sm leading-relaxed">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {msg.content}
                  </ReactMarkdown>
                </div>
              </div>
            </div>
          ))
        )}
        {isTyping && (
          <div className="flex gap-3 items-center text-gray-400 animate-pulse ml-2">
            <div className="flex gap-1">
              <span
                className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce"
                style={{ animationDelay: "0ms" }}
              ></span>
              <span
                className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce"
                style={{ animationDelay: "150ms" }}
              ></span>
              <span
                className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce"
                style={{ animationDelay: "300ms" }}
              ></span>
            </div>
            <span className="text-xs font-medium tracking-tight">
              NeuroVault is thinking...
            </span>
          </div>
        )}
      </div>

      <div className="p-4 bg-black/20 border-t border-white/5">
        <div className="flex items-end gap-3 bg-white/[0.03] p-2 rounded-2xl border border-white/10 focus-within:border-blue-500/50 focus-within:bg-white/[0.05] transition-all">
          <textarea
            className="flex-1 bg-transparent p-2 outline-none resize-none text-sm max-h-32 min-h-[40px]"
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Ask anything..."
          />
          <div className="flex gap-1 pb-1">
            <button
              onClick={toggleVoice}
              className={`p-2 rounded-xl transition-colors ${
                isListening
                  ? "bg-red-500/20 text-red-500 animate-pulse"
                  : "hover:bg-white/5 text-gray-400"
              }`}
            >
              <Mic size={20} />
            </button>
            <button
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
              className={`p-2 rounded-xl transition-all ${
                !input.trim() || isTyping
                  ? "text-gray-600 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-500 shadow-lg shadow-blue-600/20 active:scale-95"
              }`}
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
