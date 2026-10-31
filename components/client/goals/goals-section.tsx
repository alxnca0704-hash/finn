"use client"

import { FinnAntProvider } from "@/components/client/antd/finn-provider"
import { AddGoalCard } from "@/components/client/goals/add-goal-card"
import { GoalCard } from "@/components/client/goals/goal-card"
import { useGoals } from "@/hooks/use-goals"

export function GoalsSection() {
  const { goals, isLoading, isAuthenticated } = useGoals()

  return (
    <FinnAntProvider>
      <section className="flex w-full max-w-5xl flex-col gap-4">
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="text-base font-semibold text-text-primary">
            Your goals
          </h2>
          {goals && goals.length > 0 && (
            <span className="font-mono text-xs text-text-muted">
              {goals.length}
            </span>
          )}
        </div>
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
          {goals?.map((goal) => <GoalCard key={goal._id} goal={goal} />)}
          <AddGoalCard />
        </div>
        {isLoading && (
          <p className="text-sm text-text-muted">Loading goals…</p>
        )}
        {!isLoading && isAuthenticated && goals?.length === 0 && (
          <p className="text-sm text-text-muted">
            No goals yet. Create your first goal to start saving.
          </p>
        )}
      </section>
    </FinnAntProvider>
  )
}
