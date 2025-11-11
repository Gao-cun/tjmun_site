"use client"

import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LanguageSwitcher } from "@/components/language-switcher"
import { useLanguage } from "@/components/language-provider"
import { getTranslation } from "@/lib/translations"

export function Navbar() {
  const { data: session } = useSession()
  const { language } = useLanguage()

  return (
    <nav className="border-b bg-white">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="text-xl font-bold text-gray-900">
              {getTranslation(language, "siteNameShort")}
            </Link>
            <div className="hidden md:flex gap-6">
              <Link href="/announcements" className="text-sm font-medium text-gray-700 hover:text-gray-900">
                {getTranslation(language, "announcements")}
              </Link>
              <Link href="/conferences" className="text-sm font-medium text-gray-700 hover:text-gray-900">
                {getTranslation(language, "conferences")}
              </Link>
              <Link href="/contact" className="text-sm font-medium text-gray-700 hover:text-gray-900">
                {getTranslation(language, "contact")}
              </Link>
              <Link href="/seat-query" className="text-sm font-medium text-gray-700 hover:text-gray-900">
                {getTranslation(language, "seatQuery")}
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            {session ? (
              <>
                {session.user.role === "ADMIN" && (
                  <Button asChild variant="outline" size="sm">
                    <Link href="/admin">{getTranslation(language, "admin")}</Link>
                  </Button>
                )}
                <Button asChild variant="outline" size="sm">
                  <Link href="/dashboard">{getTranslation(language, "dashboard")}</Link>
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      {session.user.name}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard">{getTranslation(language, "dashboard")}</Link>
                    </DropdownMenuItem>
                    {session.user.role === "ADMIN" && (
                      <DropdownMenuItem asChild>
                        <Link href="/admin">{getTranslation(language, "admin")}</Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => signOut()}>
                      {getTranslation(language, "logout")}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Button asChild variant="ghost" size="sm">
                  <Link href="/login">{getTranslation(language, "login")}</Link>
                </Button>
                <Button asChild size="sm">
                  <Link href="/register">{getTranslation(language, "register")}</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

