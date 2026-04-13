import { useRef, useEffect, useState } from "react";
import { PaperPlaneRight, Robot, UserCircle, CircleNotch } from "@phosphor-icons/react";

const TOTAL_STEPS = 11;

export default function ChatInterface({ messages, onSendMessage, currentStepIndex, completed, loading }) {
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!loading) inputRef.current?.focus();
  }, [loading]);

  const handleSend = () => {
    if (!input.trim() || loading) return;
    onSendMessage(input.trim());
    setInput("");
  };

  const progress = Math.min(((currentStepIndex || 0) / TOTAL_STEPS) * 100, 100);

  return (
    <div className="flex flex-col h-full" data-testid="chat-interface">
      {/* Progress bar */}
      <div className="px-4 py-3 border-b-2 border-[#09090B] bg-[#FFFFFF]">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-[#52525B] uppercase tracking-wider">Progress</span>
          <span className="text-xs font-bold text-[#09090B]">{completed ? "Complete" : `${currentStepIndex || 0}/${TOTAL_STEPS}`}</span>
        </div>
        <div className="w-full h-3 bg-[#E4E4E7] rounded-full border-2 border-[#09090B] overflow-hidden">
          <div
            className="h-full bg-[#FDE047] transition-all duration-500 ease-out rounded-full"
            style={{ width: `${completed ? 100 : progress}%` }}
            data-testid="chat-progress-bar"
          />
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3" data-testid="chat-messages">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} animate-scale-in`}>
            <div className={`flex items-start gap-2 max-w-[85%] ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 border-2 border-[#09090B] ${msg.role === "user" ? "bg-[#A7F3D0]" : "bg-[#C4B5FD]"}`}>
                {msg.role === "user" ? <UserCircle size={18} weight="bold" /> : <Robot size={18} weight="bold" />}
              </div>
              <div className={`px-4 py-3 ${msg.role === "user"
                ? "bg-[#A7F3D0] border-2 border-[#09090B] rounded-2xl rounded-tr-sm shadow-[3px_3px_0px_0px_rgba(9,9,11,1)]"
                : "bg-[#FFFFFF] border-2 border-[#09090B] rounded-2xl rounded-tl-sm shadow-[3px_3px_0px_0px_rgba(9,9,11,1)]"
              }`}>
                <p className="text-sm font-medium text-[#09090B] whitespace-pre-wrap">{msg.content}</p>
              </div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start animate-scale-in">
            <div className="flex items-start gap-2">
              <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 border-2 border-[#09090B] bg-[#C4B5FD]">
                <Robot size={18} weight="bold" />
              </div>
              <div className="px-4 py-3 bg-[#FFFFFF] border-2 border-[#09090B] rounded-2xl rounded-tl-sm shadow-[3px_3px_0px_0px_rgba(9,9,11,1)]">
                <div className="flex gap-1 py-1">
                  <span className="typing-dot" />
                  <span className="typing-dot" />
                  <span className="typing-dot" />
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      {!completed && (
        <div className="p-4 border-t-2 border-[#09090B] bg-[#FFFFFF]" data-testid="chat-input-area">
          <div className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder={loading ? "AI is thinking..." : "Type your answer..."}
              disabled={loading}
              className="flex-1 bg-[#FAFAFA] border-2 border-[#09090B] rounded-xl px-4 py-3 text-sm font-medium text-[#09090B] placeholder:text-[#A1A1AA] focus:outline-none focus:ring-2 focus:ring-[#C4B5FD] shadow-[3px_3px_0px_0px_rgba(9,9,11,1)] disabled:opacity-50"
              data-testid="chat-input"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || loading}
              className="neo-btn px-4 py-3 bg-[#FDE047] border-2 border-[#09090B] rounded-xl shadow-[3px_3px_0px_0px_rgba(9,9,11,1)] disabled:opacity-50 disabled:cursor-not-allowed"
              data-testid="chat-send-btn"
            >
              {loading ? <CircleNotch size={20} weight="bold" className="animate-spin" /> : <PaperPlaneRight size={20} weight="bold" />}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
