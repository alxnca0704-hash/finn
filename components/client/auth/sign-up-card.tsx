"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

import { AuthCard } from "@/components/client/auth/auth-card"
import { PasswordInput } from "@/components/client/auth/password-input"
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
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/client/ui/field"
import { Input } from "@/components/client/ui/input"
import { ROUTES } from "@/constants/routes"

export function SignUpCard() {
  const router = useRouter()
  const [password, setPassword] = useState("")
  const [verifyPassword, setVerifyPassword] = useState("")

  const passwordsMatch =
    verifyPassword.length === 0 || password === verifyPassword

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!passwordsMatch) {
      return
    }

    router.push(ROUTES.onboarding)
  }

  return (
    <AuthCard>
      <CardHeader>
        <CardTitle className="text-xl font-bold tracking-tight">
          Create account
        </CardTitle>
        <CardDescription className="font-mono">
          Start tracking your savings goals.
        </CardDescription>
      </CardHeader>

      <CardContent>
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
                autoComplete="new-password"
                onChange={(event) => setPassword(event.target.value)}
                required
              />
            </Field>

            <Field data-invalid={!passwordsMatch}>
              <FieldLabel htmlFor="verify-password">Verify password</FieldLabel>
              <PasswordInput
                id="verify-password"
                name="verify-password"
                autoComplete="new-password"
                aria-invalid={!passwordsMatch}
                onChange={(event) => setVerifyPassword(event.target.value)}
                required
              />
              {!passwordsMatch && (
                <FieldError>Passwords do not match.</FieldError>
              )}
            </Field>

            <Button
              type="submit"
              size="lg"
              className="w-full"
              disabled={!passwordsMatch}
            >
              Create account
            </Button>
          </FieldGroup>
        </form>
      </CardContent>

      <CardFooter className="justify-center border-t-0 bg-transparent font-mono">
        <p className="text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            href={ROUTES.signIn}
            className="font-medium text-foreground underline underline-offset-4"
          >
            Sign in
          </Link>
        </p>
      </CardFooter>
    </AuthCard>
  )
}
