"use client";
import { useEffect } from "react";
import { SignInButton, UserButton, useUser } from "@clerk/nextjs";
import { ref, set } from "firebase/database";
import { signInWithCustomToken, signOut } from "firebase/auth";
import { db, auth } from "@/lib/firebase";
import Themes from "./Themes";
import { Button } from "./ui/button";
import { LogIn } from "lucide-react";
import { GuestIcon } from "./GuestIcon";

function Navbar() {
    const { isSignedIn, user } = useUser();

    useEffect(() => {
        if (!user) {
            signOut(auth);
            return;
        }

        // Write profile
        set(ref(db, `users/${user.id}`), {
            name: user.fullName || user.username || "User",
            imageUrl: user.imageUrl,
        });

        // Sign into Firebase using a custom token minted from Clerk's userId
        const signInToFirebase = async () => {
            try {
                const res = await fetch("/api/firebase-token");
                const data = await res.json();
                if (data.token) {
                    await signInWithCustomToken(auth, data.token);
                }
            } catch (err) {
                console.error("Firebase sign-in failed:", err);
            }
        };

        signInToFirebase();
    }, [user]);
    return (
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm bg-background ">
            <div className="flex flex-row justify-between mx-auto my-8 max-w-7xl px-5 sm:px-0">
                {isSignedIn ? (
                    <UserButton
                        appearance={{
                            elements: {
                                avatarBox: {
                                    width: "2.5rem",
                                    height: "2.5rem",
                                },
                                userButtonPopoverCard: {
                                    boxShadow: "0 10px 15px rgba(0,0,0,0.1)",
                                },
                                userButtonPopoverActionButton: {
                                    borderRadius: "0.5rem",
                                },
                            },
                        }}
                    />
                ) : (
                    <GuestIcon className="w-10 h-10" />
                )}
                <div className="flex items-center gap-4">
                    {!isSignedIn && (
                        <SignInButton mode="modal">
                            <Button className="relative overflow-hidden flex items-center gap-2 px-4 py-4 text-sm  rounded-full   bg-foreground text-background before:absolute before:inset-y-0 before:-left-10 before:w-8 before:-skew-x-12 before:bg-white/15 hover:before:translate-x-[200%] before:transition-transform before:duration-500 cursor-pointer">
                                <LogIn />
                                Sign In
                            </Button>
                        </SignInButton>
                    )}
                    <Themes />
                </div>
            </div>
        </div>
    );
}

export default Navbar;
