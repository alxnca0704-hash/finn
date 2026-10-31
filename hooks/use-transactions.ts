"use client"

import type { Doc } from "@/convex/_generated/dataModel"
import type { TransactionType } from "@/constants/transactions"
import { useConvexAuth, useMutation, useQuery } from "convex/react"

import { api } from "@/convex/_generated/api"

export type TransactionWithBalance = Doc<"transactions"> & {
  balanceAfter: number
}

type EntryInput = {
  goalId: string
  amount: number
  note?: string
}

export function useTransactions(goalId: string) {
  const { isAuthenticated, isLoading: isAuthLoading } = useConvexAuth()
  const transactions = useQuery(
    api.transactions.listTransactions,
    isAuthenticated ? { goalId } : "skip",
  ) as TransactionWithBalance[] | undefined

  return {
    transactions,
    isAuthenticated,
    isLoading: isAuthLoading || (isAuthenticated && transactions === undefined),
  }
}

export function useTransactionActions() {
  const recordTransaction = useMutation(api.transactions.recordTransaction)

  function makeEntry(type: TransactionType) {
    return (input: EntryInput) => recordTransaction({ ...input, type })
  }

  return {
    deposit: makeEntry("deposit"),
    withdraw: makeEntry("withdraw"),
  }
}
