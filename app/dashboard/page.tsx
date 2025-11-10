import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { formatDate, formatDateTime } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { FileUploadForm } from "@/components/file-upload-form"

async function getUserRegistrations(userId: string) {
  const registrations = await prisma.registration.findMany({
    where: { userId },
    include: {
      conference: {
        select: {
          id: true,
          name: true,
          slug: true,
          startDate: true,
          endDate: true,
          fee: true,
          testRequired: true,
        },
      },
    },
    orderBy: { registeredAt: "desc" },
  })
  return registrations
}

async function getUserInfo(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      school: true,
      major: true,
      phone: true,
      role: true,
      createdAt: true,
    },
  })
  return user
}

function getStatusBadge(status: string) {
  const statusMap: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
    PENDING: { label: "待审核", variant: "secondary" },
    APPROVED: { label: "已通过", variant: "default" },
    REJECTED: { label: "已拒绝", variant: "destructive" },
    WAITLISTED: { label: "候补", variant: "outline" },
  }
  return statusMap[status] || { label: status, variant: "secondary" }
}

function getPaymentBadge(status: string) {
  const statusMap: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
    UNPAID: { label: "未支付", variant: "destructive" },
    PAID: { label: "已支付", variant: "default" },
    REFUNDED: { label: "已退款", variant: "outline" },
  }
  return statusMap[status] || { label: status, variant: "secondary" }
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect("/login")
  }

  const [user, registrations] = await Promise.all([
    getUserInfo(session.user.id),
    getUserRegistrations(session.user.id),
  ])

  if (!user) {
    redirect("/login")
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">个人中心</h1>
        <p className="mt-2 text-gray-600">管理您的个人信息和报名记录</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* 个人信息卡片 */}
        <Card>
          <CardHeader>
            <CardTitle>个人信息</CardTitle>
            <CardDescription>您的基本信息</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-500">姓名</label>
              <p className="mt-1 text-lg">{user.name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">邮箱</label>
              <p className="mt-1 text-lg">{user.email}</p>
            </div>
            {user.school && (
              <div>
                <label className="text-sm font-medium text-gray-500">学校</label>
                <p className="mt-1 text-lg">{user.school}</p>
              </div>
            )}
            {user.major && (
              <div>
                <label className="text-sm font-medium text-gray-500">专业</label>
                <p className="mt-1 text-lg">{user.major}</p>
              </div>
            )}
            {user.phone && (
              <div>
                <label className="text-sm font-medium text-gray-500">手机号</label>
                <p className="mt-1 text-lg">{user.phone}</p>
              </div>
            )}
            <div>
              <label className="text-sm font-medium text-gray-500">注册时间</label>
              <p className="mt-1 text-sm text-gray-600">
                {formatDateTime(user.createdAt)}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* 统计信息卡片 */}
        <Card>
          <CardHeader>
            <CardTitle>报名统计</CardTitle>
            <CardDescription>您的报名情况概览</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-500">总报名数</label>
              <p className="mt-1 text-3xl font-bold">{registrations.length}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">已通过</label>
              <p className="mt-1 text-2xl font-semibold text-green-600">
                {registrations.filter((r) => r.registrationStatus === "APPROVED").length}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">待审核</label>
              <p className="mt-1 text-2xl font-semibold text-yellow-600">
                {registrations.filter((r) => r.registrationStatus === "PENDING").length}
              </p>
            </div>
            <div className="pt-4">
              <Button asChild variant="outline" className="w-full">
                <Link href="/conferences">查看所有会议</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 报名记录 */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>报名记录</CardTitle>
          <CardDescription>您参加的所有会议报名记录</CardDescription>
        </CardHeader>
        <CardContent>
          {registrations.length === 0 ? (
            <div className="py-12 text-center">
              <p className="mb-4 text-gray-500">您还没有报名任何会议</p>
              <Button asChild>
                <Link href="/conferences">浏览会议</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {registrations.map((registration) => {
                const statusBadge = getStatusBadge(registration.registrationStatus)
                const paymentBadge = getPaymentBadge(registration.paymentStatus)

                return (
                  <div
                    key={registration.id}
                    className="rounded-lg border p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold">
                            {registration.conference.name}
                          </h3>
                          <Badge variant={statusBadge.variant}>
                            {statusBadge.label}
                          </Badge>
                          <Badge variant={paymentBadge.variant}>
                            {paymentBadge.label}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                          会议时间：{formatDate(registration.conference.startDate)} - {formatDate(registration.conference.endDate)}
                        </p>
                        <p className="text-sm text-gray-600 mb-2">
                          报名时间：{formatDateTime(registration.registeredAt)}
                        </p>
                        {registration.testScore !== null && (
                          <p className="text-sm text-gray-600 mb-2">
                            测试成绩：{registration.testScore} 分
                          </p>
                        )}
<<<<<<< HEAD
                        {registration.conference.fee.toNumber() > 0 && (
=======
                        {registration.conference.fee > 0 && (
>>>>>>> 5edc018894a634715c39e6a190c13ee7937c8999
                          <p className="text-sm font-medium text-gray-700">
                            费用：¥{registration.conference.fee.toString()}
                          </p>
                        )}
                        {registration.academicTestUrl && (
                          <p className="text-sm text-gray-600 mb-2">
                            <span className="font-medium">测试文件：</span>
                            <a
                              href={registration.academicTestUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary hover:underline"
                            >
                              查看已提交的文件
                            </a>
                          </p>
                        )}
                      </div>
                      <div className="ml-4 flex flex-col gap-2">
                        <Button asChild variant="outline" size="sm">
                          <Link href={`/conferences/${registration.conference.slug}`}>
                            查看详情
                          </Link>
                        </Button>
                        {registration.conference.testRequired && !registration.academicTestUrl && (
                          <Button asChild variant="outline" size="sm">
                            <Link href={`/conferences/${registration.conference.slug}#upload-test`}>
                              提交测试
                            </Link>
                          </Button>
                        )}
                      </div>
                    </div>
                    {registration.conference.testRequired && !registration.academicTestUrl && (
                      <div className="mt-4 pt-4 border-t">
                        <FileUploadForm
                          conferenceId={registration.conference.id}
                          conferenceName={registration.conference.name}
                        />
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}


