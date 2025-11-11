import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { formatDate } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

// 强制动态渲染，确保数据实时更新
export const dynamic = 'force-dynamic'

async function getConferences() {
  const conferences = await prisma.conference.findMany({
    orderBy: { startDate: "desc" },
  })
  return conferences
}

export default async function ConferencesPage() {
  const conferences = await getConferences()
  const now = new Date()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">会议列表</h1>
        <p className="mt-2 text-gray-600">查看所有可报名的会议</p>
      </div>

      {conferences.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-500">暂无会议</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {conferences.map((conference) => {
            const isOpen =
              now >= conference.registrationOpenDate &&
              now <= conference.registrationCloseDate
            const isUpcoming = now < conference.registrationOpenDate
            const isClosed = now > conference.registrationCloseDate

            return (
              <Card key={conference.id} className="hover:shadow-lg transition-shadow flex flex-col">
                <CardHeader>
                  <CardTitle className="line-clamp-2">{conference.name}</CardTitle>
                  <CardDescription>
                    <div className="flex flex-col gap-1 mt-2">
                      <span>会议时间：{formatDate(conference.startDate)} - {formatDate(conference.endDate)}</span>
                      <span>报名时间：{formatDate(conference.registrationOpenDate)} - {formatDate(conference.registrationCloseDate)}</span>
                    </div>
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  <p className="line-clamp-3 text-sm text-gray-600 mb-4 flex-1">
                    {conference.description.length > 150
                      ? `${conference.description.substring(0, 150)}...`
                      : conference.description}
                  </p>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
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
                        <Badge variant="outline">需要测试</Badge>
                      )}
                    </div>
                    {conference.fee.toNumber() > 0 && (
                      <span className="text-sm font-semibold text-gray-700">
                        ¥{conference.fee.toString()}
                      </span>
                    )}
                  </div>
                  <Button asChild variant="outline" size="sm" className="w-full">
                    <Link href={`/conferences/${conference.slug}`}>查看详情</Link>
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}

