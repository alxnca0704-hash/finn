"use client"

import { useSignIn } from "@clerk/nextjs"
import type { OAuthStrategy } from "@clerk/nextjs/types"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

import { AuthCard } from "@/components/client/auth/auth-card"
import { PasswordInput } from "@/components/client/auth/password-input"
import { SocialAuthButtons } from "@/components/client/auth/social-auth-buttons"
import { Button } from "@/components/client/ui/button"
import {
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/client/ui/card"
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/client/ui/field"
import { Input } from "@/components/client/ui/input"
import { ROUTES } from "@/constants/routes"

export function SignInCard() {
  const router = useRouter()
  const { signIn, errors, fetchStatus } = useSignIn()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [needsEmailCode, setNeedsEmailCode] = useState(false)

  async function finalizeSignIn() {
    const { error } = await signIn.finalize({
      navigate: ({ decorateUrl }) => {
        const url = decorateUrl(ROUTES.home)
        if (url.startsWith("http")) window.location.href = url
        else router.replace(url)
      },
    })
    if (error) setErrorMessage(error.message)
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setErrorMessage(null)
    const formData = new FormData(event.currentTarget)
    const { error } = await signIn.password({
      emailAddress: String(formData.get("email")),
      password: String(formData.get("password")),
    })
    if (error) {
      setErrorMessage(error.message)
      return
    }

    if (signIn.status === "complete") {
      await finalizeSignIn()
      return
    }
    if (signIn.status === "needs_second_factor") {
      const emailFactor = signIn.supportedSecondFactors.find(
        (factor) => factor.strategy === "email_code",
      )
      if (emailFactor) {
        const result = await signIn.mfa.sendEmailCode()
        if (result.error) setErrorMessage(result.error.message)
        else setNeedsEmailCode(true)
      } else {
        setErrorMessage("This account needs another verification method to sign in.")
      }
      return
    }
    if (signIn.status === "needs_client_trust") {
      setErrorMessage("Verify this device in Clerk before continuing.")
    }
  }

  async function handleVerifyCode(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setErrorMessage(null)
    const formData = new FormData(event.currentTarget)
    const { error } = await signIn.mfa.verifyEmailCode({
      code: String(formData.get("code")),
    })
    if (error) {
      setErrorMessage(error.message)
      return
    }
    if (signIn.status === "complete") await finalizeSignIn()
  }

  async function handleProviderClick(strategy: OAuthStrategy) {
    setErrorMessage(null)
    const { error } = await signIn.sso({
      strategy,
      redirectCallbackUrl: ROUTES.ssoCallback,
      redirectUrl: ROUTES.home,
    })
    if (error) setErrorMessage(error.message)
  }

  return (
    <AuthCard>
      <CardHeader>
        <CardTitle className="text-xl font-bold tracking-tight">
          Sign in
        </CardTitle>
        <CardDescription className="font-mono">
          Welcome back. Continue to your savings goals.
        </CardDescription>
      </CardHeader>

      <CardContent>
        {needsEmailCode ? (
          <form onSubmit={handleVerifyCode}>
            <FieldGroup className="gap-4">
              <Field>
                <FieldLabel htmlFor="code">Verification code</FieldLabel>
                <Input id="code" name="code" inputMode="numeric" autoComplete="one-time-code" required />
              </Field>
              <Button type="submit" size="lg" className="w-full" disabled={fetchStatus === "fetching"}>
                Verify and sign in
              </Button>
            </FieldGroup>
          </form>
        ) : (
          <form onSubmit={handleSubmit}>
            <FieldGroup className="gap-4">
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  required
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <PasswordInput
                  id="password"
                  name="password"
                  autoComplete="current-password"
                  required
                />
              </Field>

              <Button type="submit" size="lg" className="w-full" disabled={fetchStatus === "fetching"}>
                Sign in
              </Button>
            </FieldGroup>
          </form>
        )}

        {(errorMessage || errors.global?.[0]?.message || errors.fields.identifier?.message || errors.fields.password?.message) && (
          <p role="alert" className="mt-3 text-sm text-state-error">
            {errorMessage ?? errors.global?.[0]?.message ?? errors.fields.identifier?.message ?? errors.fields.password?.message}
          </p>
        )}

        <FieldSeparator className="my-4 [&_[data-slot=field-separator-content]]:bg-background">
          or
        </FieldSeparator>

        <SocialAuthButtons
          onProviderClick={handleProviderClick}
          disabled={fetchStatus === "fetching" || needsEmailCode}
        />
      </CardContent>

      <CardFooter className="justify-center border-t-0 bg-transparent font-mono">
        <p className="text-sm text-muted-foreground">
          Doesn&apos;t have an account?{" "}
          <Link
            href={ROUTES.signUp}
            className="font-medium text-foreground underline underline-offset-4"
          >
            Sign up
          </Link>
        </p>
      </CardFooter>
    </AuthCard>
  )
}
