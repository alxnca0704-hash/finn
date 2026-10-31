"use client"

import type { Doc } from "@/convex/_generated/dataModel"
import { useConvexAuth, useMutation, useQuery } from "convex/react"

import { api } from "@/convex/_generated/api"

export type GoalWithBalance = Doc<"goals"> & { balance: number }

export function useGoals() {
  const { isAuthenticated, isLoading: isAuthLoading } = useConvexAuth()
  const goals = useQuery(
    api.goals.listGoals,
    isAuthenticated ? {} : "skip",
  ) as GoalWithBalance[] | undefined

  return {
    goals,
    isAuthenticated,
    isLoading: isAuthLoading || (isAuthenticated && goals === undefined),
  }
}

export function useGoal(goalId: string) {
  const { isAuthenticated, isLoading: isAuthLoading } = useConvexAuth()
  const goal = useQuery(
    api.goals.getGoal,
    isAuthenticated ? { goalId } : "skip",
  ) as GoalWithBalance | null | undefined

  return {
    goal,
    isAuthenticated,
    isLoading: isAuthLoading || (isAuthenticated && goal === undefined),
  }
}

export function useGoalActions() {
  const createGoal = useMutation(api.goals.createGoal)

  return { createGoal }
}
