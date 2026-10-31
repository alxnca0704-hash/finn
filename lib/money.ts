import {
  CURRENCY_LOCALE,
  DEFAULT_CURRENCY,
} from "@/constants/money"

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
