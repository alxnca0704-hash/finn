"use client"

import { useState } from "react"
import { ArrowDownLeft, ArrowUpRight, Loader2 } from "lucide-react"

import { Button } from "@/components/client/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/client/ui/dialog"
import { Field, FieldError, FieldLabel } from "@/components/client/ui/field"
import { Input } from "@/components/client/ui/input"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
} from "@/components/client/ui/sheet"
import { toast } from "@/components/client/ui/toast"
import { CURRENCY_SYMBOL } from "@/constants/money"
import {
  TRANSACTION_NOTE_MAX_LENGTH,
  type TransactionType,
} from "@/constants/transactions"
import type { GoalWithBalance } from "@/hooks/use-goals"
import { useMediaQuery } from "@/hooks/use-media-query"
import { useTransactionActions } from "@/hooks/use-transactions"
import { formatMinorUnits, toMinorUnits } from "@/lib/money"

type TransactionDialogProps = {
  mode: TransactionType
  goal: GoalWithBalance
  open: boolean
  onOpenChange: (open: boolean) => void
}

function EntryForm({
  mode,
  goal,
  onClose,
}: {
  mode: TransactionType
  goal: GoalWithBalance
  onClose: () => void
}) {
  const { deposit, withdraw } = useTransactionActions()
  const [amount, setAmount] = useState("")
  const [note, setNote] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const isDeposit = mode === "deposit"
  const hintId = `${mode}-amount-hint`
  const errorId = `${mode}-amount-error`

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)

    const parsedAmount = Number(amount)
    if (!amount.trim() || !Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      setError("Enter an amount greater than zero.")
      return
    }

    const minorUnits = toMinorUnits(parsedAmount)
    if (minorUnits <= 0) {
      setError("Enter an amount greater than zero.")
      return
    }

    if (!Number.isSafeInteger(minorUnits)) {
      setError("Enter a smaller amount.")
      return
    }

    if (!isDeposit && minorUnits > goal.balance) {
      setError(
        `You can withdraw up to ${formatMinorUnits(goal.balance)} right now.`,
      )
      return
    }

    setIsSubmitting(true)
    try {
      const saveEntry = isDeposit ? deposit : withdraw
      await saveEntry({
        goalId: goal._id,
        amount: minorUnits,
        note: note.trim() || undefined,
      })

      const nextBalance = isDeposit
        ? goal.balance + minorUnits
        : goal.balance - minorUnits

      toast.add({
        type: "success",
        title: isDeposit ? "Deposit recorded" : "Withdrawal recorded",
        description: `${formatMinorUnits(minorUnits)} ${
          isDeposit ? "added" : "withdrawn"
        }. Balance is now ${formatMinorUnits(nextBalance)}.`,
      })
      onClose()
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Could not save this entry.",
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <Field data-invalid={Boolean(error)}>
        <FieldLabel
          htmlFor={`${mode}-amount`}
          className="text-xs font-medium text-text-muted"
        >
          Amount
        </FieldLabel>
        <div className="relative">
          <span
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 font-mono text-base text-text-muted"
          >
            {CURRENCY_SYMBOL}
          </span>
          <Input
            id={`${mode}-amount`}
            name="amount"
            type="text"
            inputMode="decimal"
            autoComplete="off"
            autoFocus
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            placeholder="0.00"
            aria-invalid={Boolean(error)}
            aria-describedby={error ? errorId : hintId}
            className="h-12 rounded-lg border-border-default bg-bg-base pl-8 font-mono text-lg text-text-primary tabular-nums"
          />
        </div>
        <p id={hintId} className="text-xs text-text-muted">
          {isDeposit
            ? `This goal holds ${formatMinorUnits(goal.balance)} now.`
            : `Available to withdraw: ${formatMinorUnits(goal.balance)}.`}
        </p>
        <FieldError id={errorId} className="text-xs text-state-error">
          {error}
        </FieldError>
      </Field>

      <Field>
        <FieldLabel
          htmlFor={`${mode}-note`}
          className="text-xs font-medium text-text-muted"
        >
          Note <span className="font-normal text-text-muted/70">(optional)</span>
        </FieldLabel>
        <Input
          id={`${mode}-note`}
          name="note"
          value={note}
          onChange={(event) => setNote(event.target.value)}
          maxLength={TRANSACTION_NOTE_MAX_LENGTH}
          placeholder={isDeposit ? "e.g. Birthday cash" : "e.g. Paid for rent"}
          className="h-10 rounded-lg border-border-default bg-bg-base"
        />
      </Field>

      <div className="flex flex-col-reverse gap-2 border-t border-border-default pt-5 sm:flex-row sm:justify-end">
        <Button
          type="button"
          variant="ghost"
          className="h-11 w-full sm:w-auto"
          onClick={onClose}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="h-11 w-full sm:w-auto"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <Loader2 className="animate-spin" aria-hidden="true" />
          ) : isDeposit ? (
            <ArrowDownLeft aria-hidden="true" />
          ) : (
            <ArrowUpRight aria-hidden="true" />
          )}
          {isSubmitting
            ? isDeposit
              ? "Depositing…"
              : "Withdrawing…"
            : isDeposit
              ? "Deposit"
              : "Withdraw"}
        </Button>
      </div>
    </form>
  )
}

export function TransactionDialog({
  mode,
  goal,
  open,
  onOpenChange,
}: TransactionDialogProps) {
  const isMobile = useMediaQuery("(max-width: 639px)")
  const isDeposit = mode === "deposit"
  const title = isDeposit ? "Deposit money" : "Withdraw money"
  const description = isDeposit
    ? `Add to ${goal.name}. The amount is recorded in this goal's history.`
    : `Take out of ${goal.name}. Withdrawals are recorded too, so the history stays complete.`

  const form = (
    <EntryForm
      key={`${mode}-${open}`}
      mode={mode}
      goal={goal}
      onClose={() => onOpenChange(false)}
    />
  )

  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent
          side="bottom"
          className="max-h-[85dvh] gap-0 overflow-y-auto rounded-t-2xl border-border-default bg-bg-base p-0"
        >
          <div className="flex flex-col gap-5 p-6 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
            <header className="flex flex-col gap-1 pr-8">
              <SheetTitle className="text-xl font-semibold text-text-primary">
                {title}
              </SheetTitle>
              <SheetDescription className="text-sm text-text-muted">
                {description}
              </SheetDescription>
            </header>
            {form}
          </div>
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-0 rounded-2xl border border-border-default bg-bg-base p-0 ring-0 sm:max-w-md">
        <div className="flex flex-col gap-5 p-6">
          <header className="flex flex-col gap-1 pr-8">
            <DialogTitle className="text-xl font-semibold text-text-primary">
              {title}
            </DialogTitle>
            <DialogDescription className="text-sm text-text-muted">
              {description}
            </DialogDescription>
          </header>
          {form}
        </div>
      </DialogContent>
    </Dialog>
  )
}
