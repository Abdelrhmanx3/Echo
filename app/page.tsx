"use client"
import { useState } from "react"
import { useUser } from "@clerk/nextjs"
import Chat from "@/components/Chat"
import ChatList from "@/components/ChatList"

export default function Home() {
  const { isSignedIn, isLoaded } = useUser()
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null)

  if (!isLoaded) return null

  if (!isSignedIn) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-zinc-500">Sign in to start chatting</p>
      </div>
    )
  }

  return (
    <div className="grid h-full overflow-hidden md:grid-cols-[400px_1fr]">
      <div className={`h-full overflow-hidden ${selectedChatId ? "hidden md:block" : "block"}`}>
        <ChatList onSelect={setSelectedChatId} />
      </div>
      <div className={`h-full overflow-hidden ${selectedChatId ? "block" : "hidden md:block"}`}>
        {selectedChatId ? (
          <Chat otherUserId={selectedChatId} onBack={() => setSelectedChatId(null)} />
        ) : (
          <div className="hidden md:flex items-center justify-center h-full text-zinc-500">
            Select a chat to start messaging
          </div>
        )}
      </div>
    </div>
  )
}