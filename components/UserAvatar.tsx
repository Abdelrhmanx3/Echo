// components/UserAvatar.tsx
"use client"
import { useState } from "react"
import Image from "next/image"
import { GuestIcon } from "./GuestIcon";


export default function UserAvatar({ src, alt }: { src?: string; alt: string }) {
  const [imgError, setImgError] = useState(false)

  if (!src || imgError) {
    
    return <GuestIcon className="w-10 h-10 rounded-full" />
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={40}
      height={40}
      className="w-10 h-10 rounded-full object-cover"
      onError={() => setImgError(true)}
    />
  )
}