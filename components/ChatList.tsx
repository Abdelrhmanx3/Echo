// components/ChatList.tsx
"use client";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { ref, onValue } from "firebase/database";
import { useUser } from "@clerk/nextjs";
import UserAvatar from "@/components/UserAvatar";

type RawUser = {
    name: string;
    email: string;
    avatar: string;
    imageUrl: string;
};
type ChatMessage = {
    senderId: string;
    text: string;
    timestamp: number;
    read?: boolean;
};
type FirebaseUser = RawUser & { id: string };

function getChatId(uid1: string, uid2: string) {
    return [uid1, uid2].sort().join("_");
}

export default function ChatList({
    onSelect,
}: {
    onSelect: (userId: string) => void;
}) {
    const { user } = useUser();
    const [users, setUsers] = useState<FirebaseUser[]>([]);
    const [unreadCounts, setUnreadCounts] = useState<Record<string, number>>(
        {},
    );

    useEffect(() => {
        const usersRef = ref(db, "users");
        const unsubscribe = onValue(usersRef, (snapshot) => {
            const data: Record<string, RawUser> = snapshot.val() || {};
            const list = Object.entries(data)
                .map(([id, val]) => ({ id, ...val }))
                .filter((u) => u.id !== user?.id);
            setUsers(list);
        });

        return () => unsubscribe();
    }, [user?.id]);

    useEffect(() => {
        if (!user) return;

        const unsubscribes: (() => void)[] = [];

        users.forEach((u) => {
            const chatId = getChatId(user.id, u.id);
            const messagesRef = ref(db, `chats/${chatId}/messages`);

            const unsub = onValue(messagesRef, (snapshot) => {
                const data: Record<string, ChatMessage> = snapshot.val() || {};
                const count = Object.values(data).filter(
                    (m) => m.senderId === u.id && !m.read,
                ).length;

                setUnreadCounts((prev) => ({ ...prev, [u.id]: count }));
            });

            unsubscribes.push(unsub);
        });

        return () => unsubscribes.forEach((fn) => fn());
    }, [users, user]);

    return (
        <div className="overflow-y-auto h-full border-r rounded">
            {users.map((u) => (
                <div
                    key={u.id}
                    onClick={() => onSelect(u.id)}
                    className="flex items-center gap-3 p-3 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer border-b border-zinc-200 dark:border-zinc-800 relative"
                >
                    <div className="relative">
                        <UserAvatar src={u.imageUrl} alt={u.name} />
                        {unreadCounts[u.id] > 0 && (
                            <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] rounded-full w-5 h-5 flex items-center justify-center">
                                {unreadCounts[u.id]}
                            </span>
                        )}
                    </div>
                    <div>
                        <p className="font-medium">{u.name}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}
