import { useEffect, useRef, useState } from "react";
import styled from "styled-components";

const ChatWrap = styled.div`
  display: grid;
  grid-template-rows: 1fr auto;
  height: 540px;
  width: 300px;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  overflow: hidden;
  margin-left: auto;
  justify-self: end;
`;

const Messages = styled.div`
  padding: 1rem;
  overflow-y: auto;
  background: #fafafa;
  font-size: 12px;
`;

const Bubble = styled.div`
  max-width: 72%;
  padding: 0.7rem 0.9rem;
  border-radius: 14px;
  line-height: 1.35;
  margin: 0.4rem 0;
  white-space: pre-wrap;
  word-wrap: break-word;

  ${({ role }) =>
    role === "user"
      ? `
        margin-left: auto;
        background: #111827;
        color: #fff;
        border-bottom-right-radius: 6px;
      `
      : `
        margin-right: auto;
        background: #f3f4f6;
        color: #111827;
        border-bottom-left-radius: 6px;
      `}
`;

const Meta = styled.div`
  font-size: 0.75rem;
  color: #6b7280;
  margin-top: 0.2rem;
`;

const Composer = styled.form`
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 0.6rem;
  padding: 0.75rem;
  border-top: 1px solid #e5e7eb;
  background: #fff;
`;

const Input = styled.textarea`
  resize: none;
  height: 48px;
  padding: 0.65rem 0.8rem;
  border: 1px solid #d1d5db;
  border-radius: 10px;
  outline: none;
  font-size: 12px;

  &:focus {
    border-color: #111827;
  }
`;

const Send = styled.button`
  height: 48px;
  padding: 0 1rem;
  border: 0;
  border-radius: 10px;
  background: #111827;
  color: #fff;
  font-weight: 600;
  cursor: pointer;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const HeaderBar = styled.div`
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.6rem 0.9rem;
  border-bottom: 1px solid #e5e7eb;
  background: #fff;
  color: black;
`;

const Dot = styled.span`
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: ${({ $ok }) => ($ok ? "#10b981" : "#f59e0b")};
`;

export default function Chat() {
  const [messages, setMessages] = useState([
    { role: "assistant", text: "Hi! Ask me anything." },
  ]);
  const [input, setInput] = useState("");
  const [threadId, setThreadId] = useState(null);
  const [loading, setLoading] = useState(false);
  const scrollerRef = useRef(null);

  useEffect(() => {
    scrollerRef.current?.scrollTo({
      top: scrollerRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  async function send(e) {
    e.preventDefault();
    const text = input.trim();
    if (!text || loading) return;

    setMessages((m) => [...m, { role: "user", text }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, thread_id: threadId }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      setThreadId(data.thread_id);
      setMessages((m) => [...m, { role: "assistant", text: data.reply }]);
    } catch (err) {
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          text:
            "Error.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <ChatWrap>
      <HeaderBar>
        <Dot $ok={!loading} />
        <strong>Chatbot</strong>
      </HeaderBar>

      <Messages ref={scrollerRef}>
        {messages.map((m, i) => (
          <div key={i}>
            <Bubble role={m.role}>{m.text}</Bubble>
            <Meta>{m.role === "user" ? "You" : "Assistant"}</Meta>
          </div>
        ))}
        {loading && <Meta>Thinking…</Meta>}
      </Messages>

      <Composer onSubmit={send}>
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message…"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              e.currentTarget.form.requestSubmit();
            }
          }}
        />
        <Send type="submit" disabled={loading}>
          Send
        </Send>
      </Composer>
    </ChatWrap>
  );
}
