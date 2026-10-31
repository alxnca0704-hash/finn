import type { Metadata } from "next"
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { Suspense } from "react"

import { OnboardingCard } from "@/components/client/auth/onboarding-card"
import { ROUTES } from "@/constants/routes"

export const metadata: Metadata = {
  title: "Set up your profile · Finn",
}

async function AuthenticatedOnboarding() {
  const { userId } = await auth()
  if (!userId) redirect(ROUTES.signIn)

  if (!process.env.NEXT_PUBLIC_CONVEX_URL) {
    return (
      <div role="alert" className="max-w-lg rounded-xl border border-border-default bg-bg-base p-6 text-sm text-text-muted">
        Add NEXT_PUBLIC_CONVEX_URL to your local environment and configure Clerk as an auth provider in Convex to finish profile setup.
      </div>
    )
  }

  return <OnboardingCard />
}

export default function OnboardingPage() {
  return (
    <Suspense fallback={null}>
      <AuthenticatedOnboarding />
    </Suspense>
  )
}
