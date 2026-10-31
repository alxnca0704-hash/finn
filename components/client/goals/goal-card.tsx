"use client"

import Link from "next/link"
import { Check } from "lucide-react"
import { Progress } from "antd"

import { Card } from "@/components/client/ui/card"
import { ROUTES } from "@/constants/routes"
import type { GoalWithBalance } from "@/hooks/use-goals"
import {
  calculateProgressPercent,
  describeDeadline,
  isGoalReached,
} from "@/lib/goals"
import { formatMinorUnits } from "@/lib/money"

export function GoalCard({ goal }: { goal: GoalWithBalance }) {
  const progress = calculateProgressPercent(goal.balance, goal.targetAmount)
  const isReached = isGoalReached(goal.balance, goal.targetAmount)

  return (
    <Link
      href={ROUTES.goalDetail(goal._id)}
      className="group block rounded-xl outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
    >
      <Card
        size="sm"
        className="min-h-36 gap-0 rounded-xl border border-border-default bg-bg-surface p-0 shadow-none ring-0 transition-colors group-hover:border-text-muted/50 sm:min-h-44"
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
                  {describeDeadline(goal.targetDate)}
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
    </Link>
  )
}
