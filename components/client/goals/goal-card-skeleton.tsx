"use client"

import { Card } from "@/components/client/ui/card"
import { Skeleton } from "@/components/client/ui/skeleton"

export function GoalCardSkeleton() {
  return (
    <Card
      size="sm"
      aria-hidden="true"
      className="min-h-36 gap-0 rounded-xl border border-border-default bg-bg-surface p-0 shadow-none ring-0 sm:min-h-44"
    >
      <div className="flex flex-1 flex-col gap-3 p-4 sm:gap-4 sm:p-5">
        <div className="flex items-start justify-between gap-2">
          <div className="flex min-w-0 flex-1 flex-col gap-2">
            <Skeleton className="h-4 w-3/4 bg-border-default/60" />
            <Skeleton className="h-3 w-1/2 bg-border-default/60" />
          </div>
          <Skeleton className="size-10 shrink-0 rounded-full bg-border-default/60" />
        </div>
        <div className="mt-auto flex flex-col gap-2">
          <Skeleton className="h-7 w-24 bg-border-default/60 sm:h-8 sm:w-28" />
          <Skeleton className="h-3 w-16 bg-border-default/60" />
        </div>
      </div>
    </Card>
  )
}
