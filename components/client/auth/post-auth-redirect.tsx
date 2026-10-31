"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"

import { ROUTES } from "@/constants/routes"
import { useCurrentUser } from "@/hooks/use-current-user"

export function PostAuthRedirect() {
  const router = useRouter()
  const { user, isLoading, isAuthenticated } = useCurrentUser()

  useEffect(() => {
    if (!isLoading && isAuthenticated && !user) {
      router.replace(ROUTES.onboarding)
    }
  }, [isAuthenticated, isLoading, router, user])

  return null
}
