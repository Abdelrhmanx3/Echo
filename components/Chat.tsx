// components/Chat.tsx
"use client";
import { useEffect, useRef, useState } from "react";
import { db } from "@/lib/firebase";
import { ref, onValue, push, set, onDisconnect } from "firebase/database";
import { useUser } from "@clerk/nextjs";
import { CheckCheck, SendHorizontalIcon } from "lucide-react";

type Message = {
    id: string;
    senderId: string;
    text: string;
    timestamp: number;
    read?: boolean;
};

function getChatId(uid1: string, uid2: string) {
    return [uid1, uid2].sort().join("_");
}

export default function Chat({
    otherUserId,
    onBack,
}: {
    otherUserId: string;
    onBack: () => void;
}) {
    const { user } = useUser();
    const [messages, setMessages] = useState<Message[]>([]);
    const [text, setText] = useState("");
    const [otherTyping, setOtherTyping] = useState(false);
    const [otherUserName, setOtherUserName] = useState<string>("Chat");
    const bottomRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const chatId = user ? getChatId(user.id, otherUserId) : null;

    // Write my own profile info so others can see my name
    useEffect(() => {
        if (!user) return;
        set(ref(db, `users/${user.id}`), {
            name: user.fullName || user.username || "User",
            imageUrl: user.imageUrl,
        });
    }, [user]);

    // Get the other user's profile info
    useEffect(() => {
        const userRef = ref(db, `users/${otherUserId}`);
        const unsubscribe = onValue(userRef, (snapshot) => {
            const data = snapshot.val();
            if (data?.name) setOtherUserName(data.name);
        });

        return () => unsubscribe();
    }, [otherUserId]);

    // Listen for messages
    useEffect(() => {
        if (!chatId) return;

        const messagesRef = ref(db, `chats/${chatId}/messages`);
        const unsubscribe = onValue(messagesRef, (snapshot) => {
            const data = snapshot.val() || {};
            const list: Message[] = Object.entries(data).map(([id, val]) => {
                const m = val as Omit<Message, "id">;
                return { id, ...m };
            });
            list.sort((a, b) => a.timestamp - b.timestamp);
            setMessages(list);
        });

        return () => unsubscribe();
    }, [chatId]);

    // Listen for other user's typing status
    useEffect(() => {
        if (!chatId) return;

        const typingRef = ref(db, `chats/${chatId}/typing/${otherUserId}`);
        const unsubscribe = onValue(typingRef, (snapshot) => {
            setOtherTyping(!!snapshot.val());
        });

        return () => unsubscribe();
    }, [chatId, otherUserId]);

    // Mark messages from the other user as read when chat is open
    useEffect(() => {
        if (!chatId || !user) return;

        messages.forEach((m) => {
            if (m.senderId === otherUserId && !m.read) {
                set(ref(db, `chats/${chatId}/messages/${m.id}/read`), true);
            }
        });
    }, [messages, chatId, user, otherUserId]);

    // Auto-scroll
    useEffect(() => {
        const timer = setTimeout(() => {
            bottomRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 50);
        return () => clearTimeout(timer);
    }, [messages]);

    // Cleanup typing status when leaving
    useEffect(() => {
        if (!chatId || !user) return;
        const myTypingRef = ref(db, `chats/${chatId}/typing/${user.id}`);

        onDisconnect(myTypingRef).set(false);

        return () => {
            set(myTypingRef, false);
        };
    }, [chatId, user]);

    const handleTyping = (value: string) => {
        setText(value);
        if (!chatId || !user) return;

        const myTypingRef = ref(db, `chats/${chatId}/typing/${user.id}`);
        set(myTypingRef, true);

        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = setTimeout(() => {
            set(myTypingRef, false);
        }, 1500);
    };

    const sendMessage = () => {
        if (!text.trim() || !chatId || !user) return;

        const messagesRef = ref(db, `chats/${chatId}/messages`);
        const newMsgRef = push(messagesRef);
        set(newMsgRef, {
            senderId: user.id,
            text: text.trim(),
            timestamp: Date.now(),
            read: false,
        });

        set(ref(db, `chats/${chatId}/participants`), {
            [user.id]: true,
            [otherUserId]: true,
        });

        set(ref(db, `chats/${chatId}/typing/${user.id}`), false);
        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

        setText("");
        inputRef.current?.focus();
    };

    return (
        <div className="flex flex-col h-full min-h-0  text-center">
            {/* Header */}
            <div className="flex items-center gap-3 h-[64.5px] pl-4 border-b border-zinc-200 dark:border-zinc-800 w-full">
                <button onClick={onBack} className="md:hidden">
                    ←
                </button>
                <div>
                    <p className="font-medium">{otherUserName}</p>
                    {otherTyping && (
                        <p className="text-xs text-zinc-500">typing...</p>
                    )}
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 min-h-0 overflow-y-auto p-3 space-y-2 custom-scrollbar">
                {messages.map((m) => (
                    <div
                        key={m.id}
                        className={`flex items-end max-w-xs text-start p-1 rounded-lg w-fit gap-4 ${
                            m.senderId === user?.id
                                ? "bg-primary text-white ml-auto"
                                : "bg-zinc-200 dark:bg-zinc-700"
                        }`}
                        style={{ borderRadius: "5px" }}
                    >
                        <p>{m.text}</p>
                        {m.senderId === user?.id && (
                            <span className="text-[10px] block text-right opacity-70 mt-2.75">
                                {m.read ? (
                                    <CheckCheck className="w-4 h-3 text-blue-500" />
                                ) : (
                                    <CheckCheck className="w-4 h-3" />
                                )}
                            </span>
                        )}
                    </div>
                ))}
                <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="flex gap-2 p-3 border-t border-zinc-200 dark:border-zinc-800">
                <input
                    ref={inputRef}
                    value={text}
                    onChange={(e) => handleTyping(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                    className="flex-1 px-3 py-2 rounded-full border border-zinc-300 dark:border-zinc-700 bg-transparent"
                    placeholder="Type a message..."
                />
                <button
                    onClick={sendMessage}
                    className="px-4 py-2 bg-primary text-white rounded-full cursor-pointer"
                >
                    <SendHorizontalIcon />
                </button>
            </div>
        </div>
    );
}
