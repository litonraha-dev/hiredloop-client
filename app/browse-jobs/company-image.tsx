"use client"

import Image from "next/image"
import { useState, type ReactNode } from "react"

export function CompanyImage({
  url,
  alt,
  fallback,
}: {
  url?: string
  alt: string
  fallback: ReactNode
}) {
  const [failedUrl, setFailedUrl] = useState<string>()

  const source = url?.trim()
  const supportedImage = /^(?:https?:\/\/|data:image\/(?:jpeg|png|gif|webp|avif);base64,)/i
  if (!source || !supportedImage.test(source) || failedUrl === source) return fallback

  return (
    <Image
      unoptimized
      fill
      src={source}
      alt={alt}
      className="object-cover"
      onError={() => setFailedUrl(source)}
    />
  )
}
