"use client"

import { useEffect, useState } from "react"
import dynamic from "next/dynamic"

const Scene = dynamic(() => import("./components/Scene"), {
  ssr: false,
  loading: () => (
    <div className="h-screen w-screen flex items-center justify-center bg-black text-white">
      Loading cosmic journey...
    </div>
  ),
})

export default function CosmicStorytellingPage() {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null
  }

  return (
    <main className="relative h-screen w-screen overflow-hidden bg-black">
      <Scene />
    </main>
  )
}
