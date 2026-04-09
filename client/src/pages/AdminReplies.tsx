import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

type ContactMessage = {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
};

type ContactReply = {
  id: number;
  contactId: number;
  replyText: string;
  createdAt: string;
};

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
}

function ChatThread({ contact }: { contact: ContactMessage }) {
  const qc = useQueryClient();
  const [text, setText] = useState("");

  const { data: replies = [] } = useQuery<ContactReply[]>({
    queryKey: ["/api/admin/contacts", contact.id, "replies"],
    queryFn: async () => {
      const res = await fetch(`/api/admin/contacts/${contact.id}/replies`);
      if (!res.ok) throw new Error("Failed to load replies");
      return res.json();
    },
    refetchInterval: 5000,
  });

  const sendReply = useMutation({
    mutationFn: async (replyText: string) => {
      const res = await fetch(`/api/admin/contacts/${contact.id}/replies`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ replyText }),
      });
      if (!res.ok) throw new Error("Failed to send reply");
      return res.json();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["/api/admin/contacts", contact.id, "replies"] });
      setText("");
    },
  });

  function handleSend() {
    const trimmed = text.trim();
    if (!trimmed) return;
    sendReply.mutate(trimmed);
  }

  return (
    <div className="flex flex-col h-full">
      <div className="border-b px-5 py-4 bg-white">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="font-semibold text-slate-800">{contact.name}</p>
            <p className="text-sm text-blue-600">{contact.email}</p>
            <p className="text-xs text-slate-400 mt-0.5">{formatDate(contact.createdAt)}</p>
          </div>
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap ${
            contact.subject === "Report an Issue"
              ? "bg-red-100 text-red-600"
              : contact.subject === "General Questions"
              ? "bg-blue-100 text-blue-600"
              : "bg-slate-100 text-slate-600"
          }`}>
            {contact.subject === "General Questions" ? "💬 " : contact.subject === "Report an Issue" ? "🐛 " : "✉️ "}
            {contact.subject}
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3 bg-slate-50">
        <div className="flex justify-start">
          <div className="max-w-[75%] bg-white border rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
            <p className="text-xs font-semibold text-blue-600 mb-1">{contact.name}</p>
            <p className="text-sm text-slate-700 whitespace-pre-wrap">{contact.message}</p>
            <p className="text-xs text-slate-400 mt-1.5">{formatDate(contact.createdAt)}</p>
          </div>
        </div>

        {replies.map((reply) => (
          <div key={reply.id} className="flex justify-end">
            <div className="max-w-[75%] bg-blue-600 rounded-2xl rounded-tr-sm px-4 py-3 shadow-sm">
              <p className="text-xs font-semibold text-blue-100 mb-1">You (Admin)</p>
              <p className="text-sm text-white whitespace-pre-wrap">{reply.replyText}</p>
              <p className="text-xs text-blue-200 mt-1.5">{formatDate(reply.createdAt)}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t bg-white px-4 py-3 flex gap-2">
        <textarea
          className="flex-1 border rounded-xl px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={2}
          placeholder="Type your reply..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
        />
        <button
          onClick={handleSend}
          disabled={sendReply.isPending || !text.trim()}
          className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-medium px-4 rounded-xl transition-colors"
        >
          {sendReply.isPending ? "..." : "Send"}
        </button>
      </div>
    </div>
  );
}

export function AdminReplies() {
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const { data: contacts = [], isLoading } = useQuery<ContactMessage[]>({
    queryKey: ["/api/admin/contacts"],
    queryFn: async () => {
      const res = await fetch("/api/admin/contacts");
      if (!res.ok) throw new Error("Failed to load contacts");
      return res.json();
    },
    refetchInterval: 10000,
  });

  const selected = contacts.find((c) => c.id === selectedId) ?? null;

  return (
    <div className="flex h-screen bg-slate-100">
      <div className="w-80 flex-shrink-0 border-r bg-white flex flex-col">
        <div className="px-5 py-4 border-b">
          <h1 className="text-lg font-bold text-slate-800">Admin Inbox</h1>
          <p className="text-xs text-slate-400">{contacts.length} message{contacts.length !== 1 ? "s" : ""}</p>
        </div>
        <div className="flex-1 overflow-y-auto">
          {isLoading && (
            <p className="text-sm text-slate-400 p-4">Loading...</p>
          )}
          {!isLoading && contacts.length === 0 && (
            <p className="text-sm text-slate-400 p-4">No messages yet.</p>
          )}
          {[...contacts].reverse().map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedId(c.id)}
              className={`w-full text-left px-5 py-4 border-b hover:bg-slate-50 transition-colors ${
                selectedId === c.id ? "bg-blue-50 border-l-4 border-l-blue-600" : ""
              }`}
            >
              <div className="flex items-center gap-2 mb-0.5">
                <p className="font-semibold text-sm text-slate-800 truncate">{c.name}</p>
                <span className={`text-xs px-1.5 py-0.5 rounded-full shrink-0 ${
                  c.subject === "Report an Issue"
                    ? "bg-red-100 text-red-600"
                    : c.subject === "General Questions"
                    ? "bg-blue-100 text-blue-600"
                    : "bg-slate-100 text-slate-600"
                }`}>
                  {c.subject === "General Questions" ? "💬" : c.subject === "Report an Issue" ? "🐛" : "✉️"}
                </span>
              </div>
              <p className="text-xs text-blue-600 truncate">{c.email}</p>
              <p className="text-xs text-slate-500 mt-1 truncate">{c.message}</p>
              <p className="text-xs text-slate-400 mt-1">{formatDate(c.createdAt)}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        {selected ? (
          <ChatThread contact={selected} />
        ) : (
          <div className="flex-1 flex items-center justify-center text-slate-400">
            <div className="text-center">
              <div className="text-5xl mb-3">💬</div>
              <p className="text-base font-medium">Select a message to reply</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
