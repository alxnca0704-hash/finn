import type { Metadata } from "next"

import { OnboardingCard } from "@/components/client/auth/onboarding-card"

export const metadata: Metadata = {
  title: "Set up your profile · Finn",
}

export default function OnboardingPage() {
  return <OnboardingCard />
}
