"use client"

import type { ReactNode } from "react"

import { Card } from "@/components/client/ui/card"
import { cn } from "@/lib/utils"

export function AuthCard({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <Card
      className={cn(
        "w-full max-w-sm rounded-2xl bg-background shadow-xl shadow-foreground/10 ring-0 [--card-spacing:--spacing(6)]",
        className
      )}
    >
      {children}
    </Card>
  )
}
