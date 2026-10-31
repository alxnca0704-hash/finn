import {
  CURRENCY_LOCALE,
  DEFAULT_CURRENCY,
} from "@/constants/money"
import type { TransactionType } from "@/constants/transactions"

export function toMinorUnits(amount: number) {
  return Math.round(amount * 100)
}

export function formatMinorUnits(
  amountInMinorUnits: number,
  currency = DEFAULT_CURRENCY,
) {
  return new Intl.NumberFormat(CURRENCY_LOCALE, {
    style: "currency",
    currency,
  }).format(amountInMinorUnits / 100)
}

export function formatSignedMinorUnits(
  amountInMinorUnits: number,
  type: TransactionType,
) {
  const sign = type === "deposit" ? "+" : "−"
  return `${sign}${formatMinorUnits(amountInMinorUnits)}`
}
