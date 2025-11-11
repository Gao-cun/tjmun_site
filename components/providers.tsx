"use client"

import React from "react"
import { SessionProvider } from "next-auth/react"
import { LanguageProvider } from "./language-provider"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <LanguageProvider>{children}</LanguageProvider>
    </SessionProvider>
  )
}