"use client"

import { useState } from "react"
import { Ellipsis, Loader2, Pencil, Trash2 } from "lucide-react"

import { Button } from "@/components/client/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/client/ui/dialog"
import { EditGoalModal } from "@/components/client/goals/edit-goal-modal"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/client/ui/popover"
import type { GoalWithBalance } from "@/hooks/use-goals"
import { useGoalActions } from "@/hooks/use-goals"

export function GoalCardActions({ goal }: { goal: GoalWithBalance }) {
  const { deleteGoal } = useGoalActions()
  const [menuOpen, setMenuOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleDelete() {
    setIsDeleting(true)
    setError(null)
    try {
      await deleteGoal({ goalId: goal._id })
      setIsConfirmingDelete(false)
    } catch (deleteError) {
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : "Could not delete the goal.",
      )
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <>
      <Popover open={menuOpen} onOpenChange={setMenuOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon-lg"
            aria-label={`Manage ${goal.name}`}
            className="absolute right-2 top-2 z-10 rounded-full bg-bg-surface/90 text-text-muted shadow-none hover:bg-bg-raised hover:text-text-primary"
            onClick={(event) => event.stopPropagation()}
          >
            <Ellipsis aria-hidden="true" />
          </Button>
        </PopoverTrigger>
        <PopoverContent align="end" className="w-40 gap-1 p-1.5">
          <Button
            type="button"
            variant="ghost"
            className="w-full justify-start"
            onClick={() => {
              setMenuOpen(false)
              setIsEditing(true)
            }}
          >
            <Pencil aria-hidden="true" />
            Edit
          </Button>
          <Button
            type="button"
            variant="ghost"
            className="w-full justify-start text-state-error hover:text-state-error"
            onClick={() => {
              setMenuOpen(false)
              setError(null)
              setIsConfirmingDelete(true)
            }}
          >
            <Trash2 aria-hidden="true" />
            Delete
          </Button>
        </PopoverContent>
      </Popover>

      <EditGoalModal
        goal={goal}
        open={isEditing}
        onClose={() => setIsEditing(false)}
      />

      <Dialog
        open={isConfirmingDelete}
        onOpenChange={(open) => {
          if (!isDeleting) setIsConfirmingDelete(open)
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete “{goal.name}”?</DialogTitle>
            <DialogDescription>
              This permanently removes the goal and its transaction history
              from Finn. This tracker does not move real money.
            </DialogDescription>
          </DialogHeader>
          {error && (
            <p role="alert" className="text-sm text-state-error">
              {error}
            </p>
          )}
          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsConfirmingDelete(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <Loader2 className="animate-spin" aria-hidden="true" />
              ) : (
                <Trash2 aria-hidden="true" />
              )}
              Delete goal
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
