"use client"

import { useSignUp } from "@clerk/nextjs"
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
  const { signUp, errors, fetchStatus } = useSignUp()
  const [password, setPassword] = useState("")
  const [verifyPassword, setVerifyPassword] = useState("")
  const [verificationSent, setVerificationSent] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const isSsoContinuation =
    signUp.status === "missing_requirements" &&
    signUp.id !== undefined &&
    (signUp.missingFields.length > 0 || signUp.unverifiedFields.length > 0)

  const passwordsMatch =
    verifyPassword.length === 0 || password === verifyPassword

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setErrorMessage(null)
    const formData = new FormData(event.currentTarget)

    if (isSsoContinuation) {
      const { error } = await signUp.update({
        ...(signUp.missingFields.includes("first_name")
          ? { firstName: String(formData.get("firstName")) }
          : {}),
        ...(signUp.missingFields.includes("last_name")
          ? { lastName: String(formData.get("lastName")) }
          : {}),
        ...(signUp.missingFields.includes("email_address")
          ? { emailAddress: String(formData.get("email")) }
          : {}),
      })
      if (error) {
        setErrorMessage(error.message)
        return
      }
      if ((signUp.status as string) === "complete") {
        await finalizeSignUp()
      } else if (
        signUp.missingFields.length === 0 &&
        signUp.unverifiedFields.includes("email_address")
      ) {
        const verification = await signUp.verifications.sendEmailCode()
        if (verification.error) setErrorMessage(verification.error.message)
        else setVerificationSent(true)
      } else {
        setErrorMessage("Complete the required account details to continue.")
      }
      return
    }

    if (!passwordsMatch) return
    const { error } = await signUp.password({
      emailAddress: String(formData.get("email")),
      password,
    })
    if (error) {
      setErrorMessage(error.message)
      return
    }

    const verification = await signUp.verifications.sendEmailCode()
    if (verification.error) {
      setErrorMessage(verification.error.message)
      return
    }
    setVerificationSent(true)
  }

  async function handleVerify(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setErrorMessage(null)
    const formData = new FormData(event.currentTarget)
    const { error } = await signUp.verifications.verifyEmailCode({
      code: String(formData.get("code")),
    })
    if (error) {
      setErrorMessage(error.message)
      return
    }

    if (signUp.status === "complete") await finalizeSignUp()
  }

  async function finalizeSignUp() {
    const result = await signUp.finalize({
      navigate: ({ decorateUrl }) => {
        const url = decorateUrl(ROUTES.onboarding)
        if (url.startsWith("http")) window.location.href = url
        else router.replace(url)
      },
    })
    if (result.error) setErrorMessage(result.error.message)
  }

  return (
    <AuthCard>
      <CardHeader>
        <CardTitle className="text-xl font-bold tracking-tight">
          {verificationSent
            ? "Verify your email"
            : isSsoContinuation
              ? "Finish your account"
              : "Create account"}
        </CardTitle>
        <CardDescription className="font-mono">
          {verificationSent
            ? "Enter the verification code we sent to your email."
            : isSsoContinuation
              ? "Add the details needed to finish signing in."
              : "Start tracking your savings goals."}
        </CardDescription>
      </CardHeader>

      <CardContent>
        {verificationSent ? (
          <form onSubmit={handleVerify}>
            <FieldGroup className="gap-4">
              <Field>
                <FieldLabel htmlFor="code">Email verification code</FieldLabel>
                <Input
                  id="code"
                  name="code"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  required
                />
              </Field>
              {errors.fields.code?.message && (
                <FieldError>{errors.fields.code.message}</FieldError>
              )}
              <Button
                type="submit"
                size="lg"
                className="w-full"
                disabled={fetchStatus === "fetching"}
              >
                Verify email
              </Button>
            </FieldGroup>
          </form>
        ) : isSsoContinuation ? (
          <form onSubmit={handleSubmit}>
            <FieldGroup className="gap-4">
              {signUp.missingFields.includes("first_name") && (
                <Field>
                  <FieldLabel htmlFor="firstName">First name</FieldLabel>
                  <Input id="firstName" name="firstName" autoComplete="given-name" required />
                  {errors.fields.firstName?.message && <FieldError>{errors.fields.firstName.message}</FieldError>}
                </Field>
              )}
              {signUp.missingFields.includes("last_name") && (
                <Field>
                  <FieldLabel htmlFor="lastName">Last name</FieldLabel>
                  <Input id="lastName" name="lastName" autoComplete="family-name" required />
                  {errors.fields.lastName?.message && <FieldError>{errors.fields.lastName.message}</FieldError>}
                </Field>
              )}
              {signUp.missingFields.includes("email_address") && (
                <Field>
                  <FieldLabel htmlFor="email">Email</FieldLabel>
                  <Input id="email" name="email" type="email" autoComplete="email" required />
                  {errors.fields.emailAddress?.message && <FieldError>{errors.fields.emailAddress.message}</FieldError>}
                </Field>
              )}
              {errorMessage && <FieldError>{errorMessage}</FieldError>}
              <Button type="submit" size="lg" className="w-full" disabled={fetchStatus === "fetching"}>
                Continue
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

              {errorMessage && <FieldError>{errorMessage}</FieldError>}
              {errors.fields.emailAddress?.message && (
                <FieldError>{errors.fields.emailAddress.message}</FieldError>
              )}
              {errors.fields.password?.message && (
                <FieldError>{errors.fields.password.message}</FieldError>
              )}

              <Button
                type="submit"
                size="lg"
                className="w-full"
                disabled={!passwordsMatch || fetchStatus === "fetching"}
              >
                Create account
              </Button>
            </FieldGroup>
          </form>
        )}
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
