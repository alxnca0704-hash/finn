"use client"

import { HandleSSOCallback } from "@clerk/nextjs"
import { useRouter } from "next/navigation"

import { ROUTES } from "@/constants/routes"

export default function SSOCallbackPage() {
  const router = useRouter()

  return (
    <HandleSSOCallback
      navigateToApp={({ session, decorateUrl }) => {
        if (session?.currentTask) return
        const url = decorateUrl(ROUTES.home)
        if (url.startsWith("http")) window.location.href = url
        else router.replace(url)
      }}
      navigateToSignIn={() => router.replace(ROUTES.signIn)}
      navigateToSignUp={() => router.replace(ROUTES.signUp)}
    />
  )
}
