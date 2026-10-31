import { format } from "date-fns"

import type { TransactionType } from "@/constants/transactions"

export function formatTransactionDate(createdAt: number) {
  return format(createdAt, "MMM d, yyyy")
}

export function formatTransactionTime(createdAt: number) {
  return format(createdAt, "h:mm a")
}

export function transactionLabel(type: TransactionType) {
  return type === "deposit" ? "Deposit" : "Withdrawal"
}
