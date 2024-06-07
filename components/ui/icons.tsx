'use client'

import { cn } from '@/lib/utils'

function IconLogo({ className, ...props }: React.ComponentProps<'svg'>) {
  return (
<svg
  fill="currentColor"
  viewBox="0 0 256 256"
  role="img"
  xmlns="http://www.w3.org/2000/svg"
  width="100" 
  height="100"
  className={cn('h-10 w-10', className)}
  {...props}
>
  <circle cx="128" cy="128" r="128" fill="blue"></circle>
  <text x="50%" y="50%" text-anchor="middle" dy=".3em" font-size="144" fill="white" font-family="Arial, sans-serif" font-weight="bold">A</text>
</svg>
  )
}

export { IconLogo }
