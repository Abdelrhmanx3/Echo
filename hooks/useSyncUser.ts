"use client"
import { useUser } from "@clerk/nextjs"
import { useEffect } from "react"
import { db } from "@/lib/firebase"
import { ref, set } from "firebase/database"

export function useSyncUser() {
  const { user, isLoaded } = useUser()

  useEffect(() => {
    if (!isLoaded || !user) return

    set(ref(db, `users/${user.id}`), {
      name: user.fullName,
      email: user.primaryEmailAddress?.emailAddress,
      avatar: user.imageUrl,
    })
  }, [isLoaded, user])
}