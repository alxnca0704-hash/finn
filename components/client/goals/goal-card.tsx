"use client"

import { Check } from "lucide-react"
import { Progress } from "antd"

import { Card } from "@/components/client/ui/card"
import type { GoalWithBalance } from "@/hooks/use-goals"
import {
  calculateProgressPercent,
  getDaysUntil,
  isGoalReached,
} from "@/lib/goals"
import { formatMinorUnits } from "@/lib/money"

function deadlineLabel(targetDate: string) {
  const daysLeft = getDaysUntil(targetDate)

  if (daysLeft < 0) return "Target date passed"
  if (daysLeft === 0) return "Due today"

  return `${daysLeft} day${daysLeft === 1 ? "" : "s"} left`
}

export function GoalCard({ goal }: { goal: GoalWithBalance }) {
  const progress = calculateProgressPercent(goal.balance, goal.targetAmount)
  const isReached = isGoalReached(goal.balance, goal.targetAmount)

  return (
    <Card
      size="sm"
      className="min-h-36 gap-0 rounded-xl border border-border-default bg-bg-surface p-0 shadow-none ring-0 sm:min-h-44"
    >
      <div className="flex flex-1 flex-col gap-3 p-4 sm:gap-4 sm:p-5">
        <div className="flex items-start justify-between gap-2">
          <div className="flex min-w-0 flex-col gap-1">
            <div className="flex min-w-0 items-center gap-2">
              <h3 className="min-w-0 truncate text-sm font-medium leading-snug text-text-primary sm:text-[0.9375rem]">
                {goal.name}
              </h3>
              {isReached && (
                <span className="inline-flex shrink-0 items-center gap-0.5 text-[0.6875rem] font-medium text-state-success sm:gap-1 sm:text-xs">
                  <Check className="size-3 sm:size-3.5" aria-hidden="true" />
                  Reached
                </span>
              )}
            </div>
            {goal.targetDate && (
              <span className="truncate font-mono text-[0.6875rem] text-text-muted sm:text-xs">
                {deadlineLabel(goal.targetDate)}
              </span>
            )}
          </div>

          {progress !== null ? (
            <Progress
              type="circle"
              percent={progress}
              size={40}
              strokeWidth={6}
              strokeColor="var(--state-progress)"
              railColor="var(--border-default)"
              aria-label={`${goal.name} progress`}
              className="shrink-0 [&_.ant-progress-text]:font-mono"
              format={(percent) => (
                <span
                  className={
                    isReached
                      ? "font-mono! text-[0.625rem] text-state-success!"
                      : "font-mono! text-[0.625rem] text-text-muted!"
                  }
                >
                  {percent}%
                </span>
              )}
            />
          ) : (
            <span className="shrink-0 text-[0.6875rem] text-text-muted sm:text-xs">
              Open-ended
            </span>
          )}
        </div>

        <div className="mt-auto flex min-w-0 flex-col gap-0.5">
          <span className="truncate font-mono text-lg leading-none tracking-tight tabular-nums text-text-primary sm:text-[1.75rem]">
            {formatMinorUnits(goal.balance)}
          </span>
          <span className="truncate font-mono text-[0.6875rem] text-text-muted sm:text-xs">
            {goal.targetAmount !== undefined
              ? `of ${formatMinorUnits(goal.targetAmount)}`
              : "No target set"}
          </span>
        </div>
      </div>
    </Card>
  )
}
