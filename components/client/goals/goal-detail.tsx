"use client"

import { useState } from "react"
import Link from "next/link"
import {
  ArrowDownLeft,
  ArrowLeft,
  ArrowUpRight,
  Check,
} from "lucide-react"

import { TransactionDialog } from "@/components/client/transactions/transaction-dialog"
import { TransactionHistory } from "@/components/client/transactions/transaction-history"
import { Button } from "@/components/client/ui/button"
import { Progress } from "@/components/client/ui/progress"
import { Skeleton } from "@/components/client/ui/skeleton"
import { ROUTES } from "@/constants/routes"
import type { TransactionType } from "@/constants/transactions"
import { useGoal } from "@/hooks/use-goals"
import { useTransactions } from "@/hooks/use-transactions"
import {
  calculateProgressPercent,
  describeDeadline,
  formatTargetDate,
  isGoalReached,
} from "@/lib/goals"
import { formatMinorUnits } from "@/lib/money"

function BackToGoals() {
  return (
    <Button
      asChild
      variant="ghost"
      size="sm"
      className="-ml-2 text-text-muted"
    >
      <Link href={ROUTES.home}>
        <ArrowLeft aria-hidden="true" />
        All goals
      </Link>
    </Button>
  )
}

export function GoalDetailSkeleton() {
  return (
    <main className="flex flex-1 flex-col items-center gap-8 px-4 py-8 sm:px-6 sm:py-12">
      <div className="w-full max-w-3xl">
        <BackToGoals />
      </div>
      <div
        className="flex w-full max-w-3xl flex-col gap-8"
        aria-busy="true"
      >
        <span className="sr-only">Loading goal</span>
        <div className="flex flex-col gap-2">
          <Skeleton className="h-8 w-52 bg-border-default/60" />
          <Skeleton className="h-3 w-32 bg-border-default/60" />
        </div>
        <div className="flex flex-col gap-5 rounded-xl border border-border-default bg-bg-surface p-5 sm:p-7">
          <div className="flex items-end justify-between gap-4">
            <div className="flex flex-col gap-2">
              <Skeleton className="h-4 w-16 bg-border-default/60" />
              <Skeleton className="h-10 w-44 bg-border-default/60" />
            </div>
            <Skeleton className="h-4 w-24 bg-border-default/60" />
          </div>
          <Skeleton className="h-1.5 w-full rounded-full bg-border-default/60" />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Skeleton className="h-11 rounded-lg bg-border-default/60" />
          <Skeleton className="h-11 rounded-lg bg-border-default/60" />
        </div>
        <div className="flex flex-col gap-3">
          <Skeleton className="h-5 w-24 bg-border-default/60" />
          <div className="flex flex-col gap-4 rounded-xl border border-border-default bg-bg-base p-4 sm:p-5">
            {[0, 1, 2].map((row) => (
              <div key={row} className="flex items-center gap-3">
                <Skeleton className="size-8 shrink-0 rounded-full bg-border-default/60" />
                <div className="flex flex-1 flex-col gap-2">
                  <Skeleton className="h-3.5 w-32 bg-border-default/60" />
                  <Skeleton className="h-3 w-48 bg-border-default/60" />
                </div>
                <Skeleton className="h-3.5 w-20 bg-border-default/60" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}

function GoalNotFound() {
  return (
    <main className="flex flex-1 flex-col items-center gap-8 px-4 py-8 sm:px-6 sm:py-12">
      <div className="w-full max-w-3xl">
        <BackToGoals />
      </div>
      <div className="flex w-full max-w-3xl flex-col items-center gap-1 rounded-xl border border-border-default bg-bg-surface px-6 py-12 text-center">
        <h1 className="text-lg font-semibold text-text-primary">
          This goal isn&apos;t available
        </h1>
        <p className="max-w-sm text-sm text-text-muted">
          Check the link, or head back to your goals.
        </p>
        <Button asChild className="mt-5 h-10 px-4">
          <Link href={ROUTES.home}>Back to goals</Link>
        </Button>
      </div>
    </main>
  )
}

export function GoalDetail({ goalId }: { goalId: string }) {
  const { goal, isLoading } = useGoal(goalId)
  const { transactions, isLoading: isTransactionsLoading } =
    useTransactions(goalId)
  const [entry, setEntry] = useState<TransactionType | null>(null)

  if (isLoading) return <GoalDetailSkeleton />
  if (!goal) return <GoalNotFound />

  const progress = calculateProgressPercent(goal.balance, goal.targetAmount)
  const isReached = isGoalReached(goal.balance, goal.targetAmount)
  const remaining =
    goal.targetAmount !== undefined
      ? Math.max(0, goal.targetAmount - goal.balance)
      : 0

  return (
    <main className="flex flex-1 flex-col items-center gap-8 px-4 py-8 sm:px-6 sm:py-12">
      <div className="w-full max-w-3xl">
        <BackToGoals />
      </div>

      <div className="flex w-full max-w-3xl flex-col gap-8">
        <header className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold tracking-tight text-text-primary sm:text-3xl">
            {goal.name}
          </h1>
          {goal.targetDate && (
            <p className="font-mono text-xs text-text-muted">
              {formatTargetDate(goal.targetDate)}.{" "}
              {describeDeadline(goal.targetDate)}.
            </p>
          )}
        </header>

        <section
          aria-label={`${goal.name} balance`}
          className="overflow-hidden rounded-xl border border-border-default bg-bg-surface"
        >
          <div className="flex flex-col gap-5 p-5 sm:flex-row sm:items-end sm:justify-between sm:p-7">
            <div className="flex flex-col gap-1.5">
              <p className="text-sm text-text-muted">Balance</p>
              <p className="font-mono text-4xl leading-none tracking-tight text-text-primary tabular-nums sm:text-5xl">
                {formatMinorUnits(goal.balance)}
              </p>
            </div>

            {goal.targetAmount !== undefined && (
              <div className="flex flex-col gap-0.5 sm:items-end">
                <p className="font-mono text-sm text-text-muted tabular-nums">
                  of {formatMinorUnits(goal.targetAmount)}
                </p>
                <p className="text-sm text-text-primary">
                  {isReached
                    ? "Target reached"
                    : `${formatMinorUnits(remaining)} to go`}
                </p>
              </div>
            )}
          </div>

          <div className="border-t border-border-default px-5 py-4 sm:px-7">
            {goal.targetAmount !== undefined && progress !== null ? (
              <div className="flex flex-col gap-2">
                <Progress
                  value={progress}
                  className="h-1.5 bg-border-default"
                  aria-label={`${goal.name} progress`}
                />
                <div className="flex items-center justify-between gap-4">
                  <span className="font-mono text-xs text-text-muted tabular-nums">
                    {progress}% of target
                  </span>
                  {isReached && (
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-state-success">
                      <Check className="size-3.5" aria-hidden="true" />
                      Reached
                    </span>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-xs text-text-muted">
                Open-ended goal. The balance grows with each deposit.
              </p>
            )}
          </div>
        </section>

        <div className="grid grid-cols-2 gap-2">
          <Button
            type="button"
            className="h-11"
            onClick={() => setEntry("deposit")}
          >
            <ArrowDownLeft aria-hidden="true" />
            Deposit
          </Button>
          <Button
            type="button"
            variant="outline"
            className="h-11"
            onClick={() => setEntry("withdraw")}
            disabled={goal.balance <= 0}
          >
            <ArrowUpRight aria-hidden="true" />
            Withdraw
          </Button>
        </div>

        <TransactionHistory
          transactions={transactions}
          isLoading={isTransactionsLoading}
          onDeposit={() => setEntry("deposit")}
        />
      </div>

      <TransactionDialog
        mode={entry ?? "deposit"}
        goal={goal}
        open={entry !== null}
        onOpenChange={(open) => {
          if (!open) setEntry(null)
        }}
      />
    </main>
  )
}
