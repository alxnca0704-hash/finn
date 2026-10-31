import type { Metadata } from "next"

import { SignUpCard } from "@/components/client/auth/sign-up-card"

export const metadata: Metadata = {
  title: "Sign up · Finn",
}

export default function SignUpPage() {
  return <SignUpCard />
}
