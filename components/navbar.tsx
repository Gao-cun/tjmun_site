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

export function Navbar() {
  const { data: session } = useSession()

  return (
    <nav className="border-b bg-white">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="text-xl font-bold text-gray-900">
              同济大学模联
            </Link>
            <div className="hidden md:flex gap-6">
              <Link href="/announcements" className="text-sm font-medium text-gray-700 hover:text-gray-900">
                公告
              </Link>
              <Link href="/conferences" className="text-sm font-medium text-gray-700 hover:text-gray-900">
                会议
              </Link>
              <Link href="/contact" className="text-sm font-medium text-gray-700 hover:text-gray-900">
                联系我们
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {session ? (
              <>
                {session.user.role === "ADMIN" && (
                  <Button asChild variant="outline" size="sm">
                    <Link href="/admin">管理后台</Link>
                  </Button>
                )}
                <Button asChild variant="outline" size="sm">
                  <Link href="/dashboard">个人中心</Link>
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      {session.user.name}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard">个人中心</Link>
                    </DropdownMenuItem>
                    {session.user.role === "ADMIN" && (
                      <DropdownMenuItem asChild>
                        <Link href="/admin">管理后台</Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => signOut()}>
                      退出登录
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Button asChild variant="ghost" size="sm">
                  <Link href="/login">登录</Link>
                </Button>
                <Button asChild size="sm">
                  <Link href="/register">注册</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

