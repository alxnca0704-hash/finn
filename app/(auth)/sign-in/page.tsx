import type { Metadata } from "next"

import { SignInCard } from "@/components/client/auth/sign-in-card"

export const metadata: Metadata = {
  title: "Sign in · Finn",
}

export default function SignInPage() {
  return <SignInCard />
}
