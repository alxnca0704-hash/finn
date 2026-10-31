import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { Suspense } from "react"

import { ROUTES } from "@/constants/routes"

async function SignedInLayout({ children }: { children: React.ReactNode }) {
  const { userId } = await auth()
  if (!userId) redirect(ROUTES.signIn)

  return children
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={null}>
      <SignedInLayout>{children}</SignedInLayout>
    </Suspense>
  )
}
