"use client"

import Link from "next/link"

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
        <form onSubmit={(event) => event.preventDefault()}>
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

            <Button type="submit" size="lg" className="w-full">
              Sign in
            </Button>
          </FieldGroup>
        </form>

        <FieldSeparator className="my-4 [&_[data-slot=field-separator-content]]:bg-background">
          or
        </FieldSeparator>

        <SocialAuthButtons />
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
