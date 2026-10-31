"use client"

import { ArrowDownLeft, ArrowUpRight } from "lucide-react"

import { Button } from "@/components/client/ui/button"
import type { TransactionWithBalance } from "@/hooks/use-transactions"
import { formatMinorUnits, formatSignedMinorUnits } from "@/lib/money"
import {
  formatTransactionDate,
  formatTransactionTime,
  transactionLabel,
} from "@/lib/transactions"

function HistorySkeleton() {
  return (
    <div
      className="divide-y divide-border-default overflow-hidden rounded-xl border border-border-default bg-bg-base"
      aria-busy="true"
    >
      <span className="sr-only">Loading transaction history</span>
      {[0, 1, 2].map((row) => (
        <div key={row} className="flex items-center gap-3 px-4 py-4 sm:px-5">
          <div className="size-8 shrink-0 animate-pulse rounded-full bg-bg-raised motion-reduce:animate-none" />
          <div className="flex flex-1 flex-col gap-2">
            <div className="h-3.5 w-32 animate-pulse rounded-sm bg-bg-raised motion-reduce:animate-none" />
            <div className="h-3 w-48 animate-pulse rounded-sm bg-bg-raised motion-reduce:animate-none" />
          </div>
          <div className="h-3.5 w-20 animate-pulse rounded-sm bg-bg-raised motion-reduce:animate-none" />
        </div>
      ))}
    </div>
  )
}

function TransactionRow({
  transaction,
}: {
  transaction: TransactionWithBalance
}) {
  const isDeposit = transaction.type === "deposit"
  const label = transactionLabel(transaction.type)
  const date = formatTransactionDate(transaction.createdAt)
  const time = formatTransactionTime(transaction.createdAt)
  const note = transaction.note?.trim()
  const Icon = isDeposit ? ArrowDownLeft : ArrowUpRight
  const meta = note ? `${label} on ${date} at ${time}` : `${date} at ${time}`

  return (
    <li className="flex items-start gap-3 px-4 py-3.5 sm:px-5">
      <span
        aria-hidden="true"
        className={
          isDeposit
            ? "mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-state-success/10 text-state-success"
            : "mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-bg-raised text-text-primary"
        }
      >
        <Icon className="size-4" />
      </span>

      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <div className="flex items-baseline justify-between gap-3">
          <p className="min-w-0 truncate text-sm font-medium text-text-primary">
            {note || label}
          </p>
          <p
            className={
              isDeposit
                ? "shrink-0 font-mono text-sm tabular-nums text-state-success"
                : "shrink-0 font-mono text-sm tabular-nums text-text-primary"
            }
          >
            {formatSignedMinorUnits(transaction.amount, transaction.type)}
          </p>
        </div>
        <div className="flex items-baseline justify-between gap-3">
          <p className="min-w-0 truncate text-xs text-text-muted">{meta}</p>
          <p className="shrink-0 font-mono text-xs tabular-nums text-text-muted">
            <span className="sr-only">Balance after: </span>
            {formatMinorUnits(transaction.balanceAfter)}
          </p>
        </div>
      </div>
    </li>
  )
}

export function TransactionHistory({
  transactions,
  isLoading,
  onDeposit,
}: {
  transactions: TransactionWithBalance[] | undefined
  isLoading: boolean
  onDeposit: () => void
}) {
  const count = transactions?.length ?? 0

  return (
    <section className="flex w-full flex-col gap-3">
      <div className="flex items-baseline justify-between gap-4">
        <h2 className="text-base font-semibold text-text-primary">History</h2>
        {count > 0 && (
          <span className="font-mono text-xs text-text-muted">
            {count} {count === 1 ? "entry" : "entries"}
          </span>
        )}
      </div>

      {isLoading ? (
        <HistorySkeleton />
      ) : count === 0 ? (
        <div className="flex flex-col items-center gap-1 rounded-xl border border-dashed border-border-default px-5 py-10 text-center">
          <p className="text-sm font-medium text-text-primary">No entries yet</p>
          <p className="max-w-xs text-sm text-text-muted">
            Make the first deposit to start this goal&apos;s history.
          </p>
          <Button
            type="button"
            className="mt-4 h-10 px-4"
            onClick={onDeposit}
          >
            <ArrowDownLeft aria-hidden="true" />
            Deposit
          </Button>
        </div>
      ) : (
        <ul className="divide-y divide-border-default overflow-hidden rounded-xl border border-border-default bg-bg-base">
          {transactions?.map((transaction) => (
            <TransactionRow key={transaction._id} transaction={transaction} />
          ))}
        </ul>
      )}
    </section>
  )
}
