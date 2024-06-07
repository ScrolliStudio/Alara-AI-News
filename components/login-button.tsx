'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { SignedIn, SignedOut, useUser } from '@clerk/nextjs'
import Link from 'next/link'
import { Button } from './ui/button'

export default function LoginButton() {
  const { user } = useUser()
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000' // Default to localhost for local development

  // Log the environment variable to ensure it's correctly loaded
  console.log('Redirect URL:', baseUrl)

  // Construct the URLs
  const signInUrl = `https://accounts.scrolli.co/sign-in`
  const userUrl = `https://accounts.scrolli.co/user`

  // Log the constructed URLs
  console.log('Sign In URL:', signInUrl)
  console.log('User URL:', userUrl)

  return (
    <>
      <SignedOut>
        <Button asChild>
          <Link href={signInUrl}>
            Giriş yap
          </Link>
        </Button>
      </SignedOut>

      <SignedIn>
        <Link href={userUrl}>
          <Avatar>
            <AvatarImage src={user?.imageUrl} alt="user avatar" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </Link>
      </SignedIn>
    </>
  )
}
