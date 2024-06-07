'use client'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { SignedIn, SignedOut, useUser } from '@clerk/nextjs'
import Link from 'next/link'
import { Button } from './ui/button'

export default function LoginButton() {
  const { user } = useUser()

  return (
    <>
      <SignedOut>
        <Button asChild>
          <Link
            href={`https://communal-urchin-47.accounts.dev/sign-in?redirect_url=${process.env.NEXT_PUBLIC_BASE_URL}`}
          >
            Login
          </Link>
        </Button>
      </SignedOut>

      <SignedIn>
        <Link
          href={`https://communal-urchin-47.accounts.dev/user?redirect_url=${process.env.NEXT_PUBLIC_BASE_URL}`}
        >
          <Avatar>
            <AvatarImage src={user?.imageUrl} alt="user avatar" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </Link>
      </SignedIn>
    </>
  )
}
