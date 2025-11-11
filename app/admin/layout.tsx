import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/dashboard")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="border-b bg-white">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-8">
              <Link href="/admin" className="text-xl font-bold text-gray-900">
                管理后台
              </Link>
              <nav className="hidden md:flex gap-6">
                <Link
                  href="/admin/dashboard"
                  className="text-sm font-medium text-gray-700 hover:text-gray-900"
                >
                  概览
                </Link>
                <Link
                  href="/admin/registrations"
                  className="text-sm font-medium text-gray-700 hover:text-gray-900"
                >
                  报名管理
                </Link>
                <Link
                  href="/admin/conferences"
                  className="text-sm font-medium text-gray-700 hover:text-gray-900"
                >
                  会议管理
                </Link>
                <Link
                  href="/admin/announcements"
                  className="text-sm font-medium text-gray-700 hover:text-gray-900"
                >
                  公告管理
                </Link>
                <Link
                  href="/admin/users"
                  className="text-sm font-medium text-gray-700 hover:text-gray-900"
                >
                  用户管理
                </Link>
                <Link
                  href="/admin/settings"
                  className="text-sm font-medium text-gray-700 hover:text-gray-900"
                >
                  网站设置
                </Link>
                <Link
                  href="/admin/seat-assignments"
                  className="text-sm font-medium text-gray-700 hover:text-gray-900"
                >
                  席位分配
                </Link>
              </nav>
            </div>
            <div className="flex items-center gap-4">
              <Button asChild variant="ghost" size="sm">
                <Link href="/dashboard">返回前台</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 py-8">{children}</div>
    </div>
  )
}

