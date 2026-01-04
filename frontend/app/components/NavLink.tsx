'use client'

import Link from 'next/link'
import {usePathname} from 'next/navigation'
import {ReactNode} from 'react'

interface NavLinkProps {
  href: string
  children: ReactNode
  className?: string
  activeClassName?: string
}

export default function NavLink({
  href,
  children,
  className = 'nav-link',
  activeClassName = 'active',
}: NavLinkProps) {
  const pathname = usePathname()
  const isActive = pathname === href || (href !== '/' && pathname.startsWith(href))

  return (
    <Link
      href={href}
      className={isActive ? `${className} ${activeClassName}` : className}
    >
      {children}
    </Link>
  )
}
