"use client"

import Image from "next/image"
import { useClerk } from "@clerk/nextjs"
import { useState } from "react"
import { ChevronDown, LogOut, UserRound } from "lucide-react"

import { Button } from "@/components/client/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/client/ui/popover"
import { ROUTES } from "@/constants/routes"
import { useCurrentUser } from "@/hooks/use-current-user"

export function HomeProfile() {
  const { signOut, openUserProfile } = useClerk()
  const { user, isLoading, isAuthenticated } = useCurrentUser()
  const [open, setOpen] = useState(false)

  if (isLoading || !isAuthenticated || !user) return null

  const initials = `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        aria-label="Open account menu"
        className="group relative flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-bg-raised text-sm font-medium text-text-muted outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
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
        <ChevronDown className="absolute bottom-0 right-0 size-3 rounded-full bg-bg-base opacity-0 transition-opacity group-hover:opacity-100" aria-hidden="true" />
      </PopoverTrigger>
      <PopoverContent align="start" className="w-52 gap-1 p-1.5">
        <Button
          type="button"
          variant="ghost"
          className="w-full justify-start"
          onClick={() => {
            setOpen(false)
            openUserProfile()
          }}
        >
          <UserRound aria-hidden="true" />
          Manage account
        </Button>
        <Button
          type="button"
          variant="ghost"
          className="w-full justify-start"
          onClick={() => signOut({ redirectUrl: ROUTES.signIn })}
        >
          <LogOut aria-hidden="true" />
          Sign out
        </Button>
      </PopoverContent>
    </Popover>
  )
}
