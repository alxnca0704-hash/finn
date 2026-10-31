"use client"

import type { ReactNode } from "react"

import { Card } from "@/components/client/ui/card"

export function AuthCard({ children }: { children: ReactNode }) {
  return (
    <Card className="w-full max-w-sm rounded-2xl bg-background shadow-xl shadow-foreground/10 ring-0 [--card-spacing:--spacing(6)]">
      {children}
    </Card>
  )
}
