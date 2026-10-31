"use client"

import { useState } from "react"
import { Plus } from "lucide-react"

import { AddGoalModal } from "@/components/client/goals/add-goal-modal"
import { Button } from "@/components/client/ui/button"

export function AddGoalCard() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Button
        type="button"
        variant="outline"
        onClick={() => setIsOpen(true)}
        className="flex min-h-36 w-full flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-border-default bg-transparent px-3 py-6 text-center text-text-muted hover:border-text-muted hover:bg-bg-surface hover:text-text-primary sm:min-h-44 sm:gap-1.5 sm:px-5 sm:py-8"
      >
        <Plus className="size-4 sm:size-5" aria-hidden="true" />
        <span className="text-xs font-medium sm:text-sm">Add goal</span>
        <span className="hidden text-xs font-normal sm:inline">
          Set a target or keep it open-ended
        </span>
      </Button>
      <AddGoalModal open={isOpen} onClose={() => setIsOpen(false)} />
    </>
  )
}
