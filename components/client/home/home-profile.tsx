"use client"

import Image from "next/image"
import { useClerk } from "@clerk/nextjs"
import { LogOut } from "lucide-react"

import { Button } from "@/components/client/ui/button"
import { ROUTES } from "@/constants/routes"
import { useCurrentUser } from "@/hooks/use-current-user"

export function HomeProfile() {
  const { signOut } = useClerk()
  const { user, isLoading, isAuthenticated } = useCurrentUser()

  if (isLoading || !isAuthenticated || !user) return null

  const initials = `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-3 rounded-full border border-border-default bg-bg-base py-1 pl-4 pr-1">
        <span className="font-mono text-sm text-text-primary">
          @{user.username}
        </span>
        <div className="relative size-9 shrink-0 overflow-hidden rounded-full bg-bg-raised text-center font-medium leading-9 text-text-muted">
          {user.avatarUrl ? (
            <Image
              src={user.avatarUrl}
              alt=""
              fill
              sizes="36px"
              unoptimized
              className="object-cover"
            />
          ) : (
            initials
          )}
        </div>
      </div>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        aria-label="Sign out"
        onClick={() => signOut({ redirectUrl: ROUTES.signIn })}
      >
        <LogOut aria-hidden="true" />
        Sign out
      </Button>
    </div>
  )
}
