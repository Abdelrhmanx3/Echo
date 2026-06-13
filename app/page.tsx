"use client";
import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import Chat from "@/components/Chat";
import ChatList from "@/components/ChatList";
import Navbar from "@/components/Navbar";

export default function Home() {
    const { isSignedIn, isLoaded } = useUser();
    const [selectedChatId, setSelectedChatId] = useState<string | null>(null);

    if (!isLoaded) return null;

    if (!isSignedIn) {
        return (
            <div className="flex flex-col h-full">
                <Navbar />
                <div className="flex items-center justify-center flex-1">
                    <p className="text-zinc-500">Sign in to start chatting</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full">
            <div className={selectedChatId ? "hidden md:block" : "block"}>
                <Navbar />
            </div>
            <div className="grid flex-1 min-h-0 overflow-hidden md:grid-cols-[400px_1fr]">
                <div
                    className={`h-full overflow-hidden ${selectedChatId ? "hidden md:block" : "block"}`}
                >
                    <ChatList onSelect={setSelectedChatId} />
                </div>
                <div
                    className={`h-full overflow-hidden ${selectedChatId ? "block" : "hidden md:block"}`}
                >
                    {selectedChatId ? (
                        <Chat
                            otherUserId={selectedChatId}
                            onBack={() => setSelectedChatId(null)}
                        />
                    ) : (
                        <div className="hidden md:flex items-center justify-center h-full text-zinc-500">
                            Select a chat to start messaging
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
