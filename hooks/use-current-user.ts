"use client"

import { useConvexAuth, useMutation, useQuery } from "convex/react"

import { api } from "@/convex/_generated/api"

export function useCurrentUser() {
  const { isAuthenticated, isLoading: isAuthLoading } = useConvexAuth()
  const user = useQuery(
    api.users.getCurrentUser,
    isAuthenticated ? {} : "skip",
  )
  return {
    user,
    isAuthenticated,
    isLoading: isAuthLoading || (isAuthenticated && user === undefined),
  }
}

export function useUsernameAvailability(username: string, shouldCheck: boolean) {
  const { isAuthenticated } = useConvexAuth()
  const shouldQuery = isAuthenticated && shouldCheck
  const isAvailable = useQuery(
    api.users.isUsernameAvailable,
    shouldQuery ? { username } : "skip",
  )
  return {
    isAvailable,
    isChecking: shouldQuery && isAvailable === undefined,
  }
}

export function useOnboardingActions() {
  const generateProfileUploadUrl = useMutation(api.users.generateProfileUploadUrl)
  const completeOnboarding = useMutation(api.users.completeOnboarding)

  return { generateProfileUploadUrl, completeOnboarding }
}
