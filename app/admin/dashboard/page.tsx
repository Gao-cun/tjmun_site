import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Button } from "@/components/ui/button"

async function getStats() {
  const [users, conferences, announcements, registrations] = await Promise.all([
    prisma.user.count(),
    prisma.conference.count(),
    prisma.announcement.count(),
    prisma.registration.count(),
  ])

  const pendingRegistrations = await prisma.registration.count({
    where: { registrationStatus: "PENDING" },
  })

  const approvedRegistrations = await prisma.registration.count({
    where: { registrationStatus: "APPROVED" },
  })

  return {
    users,
    conferences,
    announcements,
    registrations,
    pendingRegistrations,
    approvedRegistrations,
  }
}

export default async function AdminDashboardPage() {
  const stats = await getStats()

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">管理后台概览</h1>
        <p className="mt-2 text-gray-600">系统统计和快速操作</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>用户总数</CardTitle>
            <CardDescription>注册用户数量</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.users}</div>
            <Button asChild variant="outline" className="mt-4 w-full">
              <Link href="/admin/users">管理用户</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>会议总数</CardTitle>
            <CardDescription>已创建的会议</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.conferences}</div>
            <Button asChild variant="outline" className="mt-4 w-full">
              <Link href="/admin/conferences">管理会议</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>公告总数</CardTitle>
            <CardDescription>已发布的公告</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.announcements}</div>
            <Button asChild variant="outline" className="mt-4 w-full">
              <Link href="/admin/announcements">管理公告</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>报名总数</CardTitle>
            <CardDescription>所有报名记录</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.registrations}</div>
            <Button asChild variant="outline" className="mt-4 w-full">
              <Link href="/admin/registrations">管理报名</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>待审核</CardTitle>
            <CardDescription>需要处理的报名</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-600">
              {stats.pendingRegistrations}
            </div>
            <Button asChild variant="outline" className="mt-4 w-full">
              <Link href="/admin/registrations?status=PENDING">立即处理</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>已通过</CardTitle>
            <CardDescription>审核通过的报名</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {stats.approvedRegistrations}
            </div>
            <Button asChild variant="outline" className="mt-4 w-full">
              <Link href="/admin/registrations?status=APPROVED">查看详情</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

