"use client"

import { useRouter } from "next/navigation"
import { Suspense, useState } from "react"

import { AuthCard } from "@/components/client/auth/auth-card"
import { Button } from "@/components/client/ui/button"
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/client/ui/card"
import { DatePicker } from "@/components/client/ui/date-picker"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldTitle,
} from "@/components/client/ui/field"
import { Input } from "@/components/client/ui/input"
import { Progress } from "@/components/client/ui/progress"
import { ProfilePhotoUpload } from "@/components/client/upload/ant-upload"
import {
  USERNAME_MAX_LENGTH,
  USERNAME_MIN_LENGTH,
} from "@/constants/profile"
import { ROUTES } from "@/constants/routes"
import { isValidUsername } from "@/lib/validation"

export function OnboardingCard() {
  const router = useRouter()
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [username, setUsername] = useState("")
  const [usernameTouched, setUsernameTouched] = useState(false)
  const [birthday, setBirthday] = useState<Date | undefined>()

  const usernameValid = isValidUsername(username)
  const requiredFields = [
    firstName.trim().length > 0,
    lastName.trim().length > 0,
    usernameValid,
    birthday !== undefined,
  ]
  const completedFields = requiredFields.filter(Boolean).length
  const isComplete = completedFields === requiredFields.length
  const progress = Math.round((completedFields / requiredFields.length) * 100)

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!isComplete) {
      return
    }

    router.replace(ROUTES.home)
  }

  return (
    <AuthCard className="max-w-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-bold tracking-tight">
          Tell us who&apos;s saving
        </CardTitle>
        <CardDescription>
          A few details before your first goal. You can change them later.
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col gap-6">
        <div className="flex items-center gap-3">
          <Progress
            value={progress}
            aria-label="Profile setup progress"
            className="min-w-0 flex-1"
          />
          <span
            aria-hidden="true"
            className="font-mono text-xs tabular-nums text-muted-foreground"
          >
            {completedFields}/{requiredFields.length}
          </span>
        </div>

        <form onSubmit={handleSubmit}>
          <FieldGroup className="gap-5">
            <div className="flex items-center gap-4 border-b border-border-default pb-5">
              <Suspense
                fallback={
                  <div className="size-20 rounded-full bg-muted sm:size-24" />
                }
              >
                <ProfilePhotoUpload />
              </Suspense>
              <div className="flex flex-col gap-1">
                <FieldTitle>Profile photo</FieldTitle>
                <FieldDescription>
                  Optional. Add a photo now or later.
                </FieldDescription>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="first-name">First name</FieldLabel>
                <Input
                  id="first-name"
                  name="firstName"
                  autoComplete="given-name"
                  className="h-10"
                  value={firstName}
                  onChange={(event) => setFirstName(event.target.value)}
                  required
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="last-name">Last name</FieldLabel>
                <Input
                  id="last-name"
                  name="lastName"
                  autoComplete="family-name"
                  className="h-10"
                  value={lastName}
                  onChange={(event) => setLastName(event.target.value)}
                  required
                />
              </Field>
            </div>

            <Field data-invalid={usernameTouched && !usernameValid}>
              <FieldLabel htmlFor="username">Username</FieldLabel>
              <div className="relative">
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-y-0 left-3 flex items-center font-mono text-sm text-muted-foreground"
                >
                  @
                </span>
                <Input
                  id="username"
                  name="username"
                  autoComplete="username"
                  className="h-10 pl-7 font-mono"
                  placeholder="yourname"
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  onBlur={() => setUsernameTouched(true)}
                  aria-invalid={usernameTouched && !usernameValid}
                  aria-describedby="username-help"
                  required
                />
              </div>
              {usernameTouched && !usernameValid ? (
                <FieldError id="username-help">
                  Use {USERNAME_MIN_LENGTH} to {USERNAME_MAX_LENGTH} letters,
                  numbers, or underscores.
                </FieldError>
              ) : (
                <FieldDescription id="username-help">
                  Use {USERNAME_MIN_LENGTH} to {USERNAME_MAX_LENGTH} letters,
                  numbers, or underscores.
                </FieldDescription>
              )}
            </Field>

            <Field>
              <FieldLabel htmlFor="birthday">Birthday</FieldLabel>
              <DatePicker
                id="birthday"
                value={birthday}
                onChange={setBirthday}
                placeholder="Select your birthday"
                className="h-10"
                disabled={(date) => date > new Date()}
              />
            </Field>

            <div className="flex flex-col gap-3">
              <p className="text-sm text-muted-foreground">
                {isComplete
                  ? "All set. Complete setup to start saving."
                  : "Add your name, username, and birthday to continue."}
              </p>
              <Button
                type="submit"
                size="lg"
                className="h-10 w-full"
                disabled={!isComplete}
              >
                Complete setup
              </Button>
            </div>
          </FieldGroup>
        </form>
      </CardContent>
    </AuthCard>
  )
}
