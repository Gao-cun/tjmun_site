import { notFound } from "next/navigation"
import Link from "next/link"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { formatDate, formatDateTime } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { RegisterButton } from "@/components/register-button"
import { FileUploadForm } from "@/components/file-upload-form"
import { ArrowLeft } from "lucide-react"

<<<<<<< HEAD
// 强制动态渲染，确保数据实时更新
export const dynamic = 'force-dynamic'

=======
>>>>>>> 5edc018894a634715c39e6a190c13ee7937c8999
async function getConference(slug: string) {
  const conference = await prisma.conference.findUnique({
    where: { slug },
    include: {
      registrations: {
        select: {
          id: true,
          userId: true,
          registrationStatus: true,
          paymentStatus: true,
        },
      },
    },
  })
  return conference
}

async function getUserRegistration(userId: string, conferenceId: string) {
  const registration = await prisma.registration.findUnique({
    where: {
      userId_conferenceId: {
        userId,
        conferenceId,
      },
    },
  })
  return registration
}

export default async function ConferenceDetailPage({
  params,
}: {
  params: { slug: string }
}) {
  const session = await getServerSession(authOptions)
  const conference = await getConference(params.slug)

  if (!conference) {
    notFound()
  }

  const now = new Date()
  const isOpen =
    now >= conference.registrationOpenDate &&
    now <= conference.registrationCloseDate
  const isUpcoming = now < conference.registrationOpenDate
  const isClosed = now > conference.registrationCloseDate

  let userRegistration = null
  if (session?.user?.id) {
    userRegistration = await getUserRegistration(session.user.id, conference.id)
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-6">
        <Button asChild variant="ghost" size="sm">
          <Link href="/conferences" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            返回会议列表
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-3xl mb-4">{conference.name}</CardTitle>
              <div className="flex items-center gap-2 mb-2">
                {isOpen ? (
                  <Badge variant="default" className="bg-green-600">
                    报名中
                  </Badge>
                ) : isUpcoming ? (
                  <Badge variant="outline" className="border-blue-600 text-blue-600">
                    即将开始
                  </Badge>
                ) : (
                  <Badge variant="secondary">已结束</Badge>
                )}
                {conference.testRequired && (
                  <Badge variant="outline">需要学术测试</Badge>
                )}
<<<<<<< HEAD
                {conference.fee.toNumber() > 0 && (
=======
                {conference.fee > 0 && (
>>>>>>> 5edc018894a634715c39e6a190c13ee7937c8999
                  <Badge variant="outline">费用：¥{conference.fee.toString()}</Badge>
                )}
              </div>
            </div>
          </div>
          <CardDescription>
            <div className="space-y-2 mt-4">
              <div>
                <span className="font-medium">会议时间：</span>
                {formatDate(conference.startDate)} - {formatDate(conference.endDate)}
              </div>
              <div>
                <span className="font-medium">报名时间：</span>
                {formatDate(conference.registrationOpenDate)} - {formatDate(conference.registrationCloseDate)}
              </div>
              <div>
                <span className="font-medium">创建时间：</span>
                {formatDateTime(conference.createdAt)}
              </div>
            </div>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="prose max-w-none mb-6">
            <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
              {conference.description}
            </div>
          </div>

          {conference.testRequired && conference.testPromptUrl && (
            <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h3 className="font-semibold text-blue-900 mb-2">学术测试要求</h3>
              <p className="text-sm text-blue-800 mb-3">
                本次会议需要提交学术测试，请下载测试题目并按要求完成。
              </p>
              <Button asChild variant="outline" size="sm">
                <a href={conference.testPromptUrl} target="_blank" rel="noopener noreferrer">
                  下载测试题目
                </a>
              </Button>
            </div>
          )}

          {session?.user ? (
            userRegistration ? (
              <div className="mt-6 space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg border">
                  <h3 className="font-semibold mb-2">您的报名状态</h3>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge
                      variant={
                        userRegistration.registrationStatus === "APPROVED"
                          ? "default"
                          : userRegistration.registrationStatus === "REJECTED"
                            ? "destructive"
                            : "secondary"
                      }
                    >
                      {userRegistration.registrationStatus === "PENDING"
                        ? "待审核"
                        : userRegistration.registrationStatus === "APPROVED"
                          ? "已通过"
                          : userRegistration.registrationStatus === "REJECTED"
                            ? "已拒绝"
                            : "候补"}
                    </Badge>
                    <Badge
                      variant={
                        userRegistration.paymentStatus === "PAID"
                          ? "default"
                          : "destructive"
                      }
                    >
                      {userRegistration.paymentStatus === "PAID"
                        ? "已支付"
                        : "未支付"}
                    </Badge>
                  </div>
<<<<<<< HEAD
                  {conference.fee.toNumber() > 0 && userRegistration.paymentStatus === "UNPAID" && (
=======
                  {conference.fee > 0 && userRegistration.paymentStatus === "UNPAID" && (
>>>>>>> 5edc018894a634715c39e6a190c13ee7937c8999
                    <div className="mt-3 p-3 bg-yellow-50 rounded border border-yellow-200">
                      <p className="text-sm text-yellow-800 mb-2">
                        会议费用：¥{conference.fee.toString()}
                      </p>
                      <p className="text-xs text-yellow-700">
                        审核通过后，请按照管理员提供的支付方式进行缴费
                      </p>
                    </div>
                  )}
                  <Button asChild variant="outline" className="mt-3">
                    <Link href="/dashboard">查看详情</Link>
                  </Button>
                </div>

                {/* 学测提交 */}
                {conference.testRequired && (
                  <div id="upload-test">
                    {userRegistration.academicTestUrl ? (
                      <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                        <h3 className="font-semibold text-green-900 mb-2">学术测试已提交</h3>
                        <p className="text-sm text-green-800 mb-2">
                          您已提交测试文件，等待管理员审核评分。
                        </p>
                        <Button asChild variant="outline" size="sm">
                          <a
                            href={userRegistration.academicTestUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            查看已提交的文件
                          </a>
                        </Button>
                      </div>
                    ) : (
                      <FileUploadForm
                        conferenceId={conference.id}
                        conferenceName={conference.name}
                      />
                    )}
                  </div>
                )}
              </div>
            ) : isOpen ? (
              <div className="mt-6">
                <RegisterButton conferenceId={conference.id} />
              </div>
            ) : (
              <div className="mt-6 p-4 bg-gray-50 rounded-lg border">
                <p className="text-gray-600">
                  {isUpcoming
                    ? "报名尚未开始"
                    : "报名已结束"}
                </p>
              </div>
            )
          ) : (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-blue-800 mb-3">
                请先登录以报名参加本次会议
              </p>
              <Button asChild>
                <Link href="/login">立即登录</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="mt-6 flex justify-center">
        <Button asChild variant="outline">
          <Link href="/conferences">返回会议列表</Link>
        </Button>
      </div>
    </div>
  )
}

