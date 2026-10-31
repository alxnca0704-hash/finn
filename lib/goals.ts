import { format, parseISO } from "date-fns"

export function calculateProgressPercent(
  balance: number,
  targetAmount?: number,
) {
  if (!targetAmount || targetAmount <= 0) return null

  return Math.min(100, Math.round((balance / targetAmount) * 100))
}

export function isGoalReached(balance: number, targetAmount?: number) {
  return targetAmount !== undefined && targetAmount > 0 && balance >= targetAmount
}

export function formatTargetDate(targetDate: string) {
  return format(parseISO(targetDate), "PPP")
}

export function getDaysUntil(targetDate: string) {
  const target = parseISO(targetDate)
  const now = new Date()
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate())

  return Math.round(
    (target.getTime() - startOfToday.getTime()) / (24 * 60 * 60 * 1000),
  )
}
