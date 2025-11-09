import { prisma } from "@/lib/prisma"
import { formatDate, formatDateTime } from "@/lib/utils"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { RegistrationActions } from "@/components/admin/registration-actions"

async function getRegistrations(status?: string) {
  const where: any = {}
  if (status && status !== "ALL") {
    where.registrationStatus = status
  }

  const registrations = await prisma.registration.findMany({
    where,
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          school: true,
        },
      },
      conference: {
        select: {
          id: true,
          name: true,
          slug: true,
          fee: true,
        },
      },
    },
    orderBy: { registeredAt: "desc" },
  })
  return registrations
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

export default async function AdminRegistrationsPage({
  searchParams,
}: {
  searchParams: { status?: string }
}) {
  const registrations = await getRegistrations(searchParams.status)

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">报名管理</h1>
        <p className="mt-2 text-gray-600">审核和管理所有报名记录</p>
      </div>

      <div className="mb-6 flex gap-2">
        <Button asChild variant={!searchParams.status ? "default" : "outline"}>
          <Link href="/admin/registrations">全部</Link>
        </Button>
        <Button asChild variant={searchParams.status === "PENDING" ? "default" : "outline"}>
          <Link href="/admin/registrations?status=PENDING">待审核</Link>
        </Button>
        <Button asChild variant={searchParams.status === "APPROVED" ? "default" : "outline"}>
          <Link href="/admin/registrations?status=APPROVED">已通过</Link>
        </Button>
        <Button asChild variant={searchParams.status === "REJECTED" ? "default" : "outline"}>
          <Link href="/admin/registrations?status=REJECTED">已拒绝</Link>
        </Button>
      </div>

      {registrations.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-500">暂无报名记录</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {registrations.map((registration) => {
            const statusBadge = getStatusBadge(registration.registrationStatus)
            const paymentBadge = getPaymentBadge(registration.paymentStatus)

            return (
              <Card key={registration.id}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
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
                      <div className="space-y-1 text-sm text-gray-600">
                        <p>
                          <span className="font-medium">报名人：</span>
                          {registration.user.name} ({registration.user.email})
                        </p>
                        {registration.user.school && (
                          <p>
                            <span className="font-medium">学校：</span>
                            {registration.user.school}
                          </p>
                        )}
                        <p>
                          <span className="font-medium">报名时间：</span>
                          {formatDateTime(registration.registeredAt)}
                        </p>
                        {registration.testScore !== null && (
                          <p>
                            <span className="font-medium">测试成绩：</span>
                            {registration.testScore} 分
                          </p>
                        )}
                        {registration.academicTestUrl && (
                          <p>
                            <span className="font-medium">测试文件：</span>
                            <a
                              href={registration.academicTestUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary hover:underline"
                            >
                              查看文件
                            </a>
                          </p>
                        )}
                        {registration.conference.fee > 0 && (
                          <p>
                            <span className="font-medium">会议费用：</span>
                            ¥{registration.conference.fee.toString()}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="ml-4 flex flex-col gap-2">
                      <Button asChild variant="outline" size="sm">
                        <Link href={`/conferences/${registration.conference.slug}`}>
                          查看会议
                        </Link>
                      </Button>
                      <RegistrationActions
                        registrationId={registration.id}
                        currentStatus={registration.registrationStatus}
                        paymentStatus={registration.paymentStatus}
                        conferenceFee={Number(registration.conference.fee)}
                        academicTestUrl={registration.academicTestUrl}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}

