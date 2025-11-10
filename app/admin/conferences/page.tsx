import { prisma } from "@/lib/prisma"
import { formatDate } from "@/lib/utils"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"

async function getConferences() {
  const conferences = await prisma.conference.findMany({
    include: {
      _count: {
        select: {
          registrations: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  })
  return conferences
}

export default async function AdminConferencesPage() {
  const conferences = await getConferences()

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">会议管理</h1>
          <p className="mt-2 text-gray-600">管理所有会议信息</p>
        </div>
        <Button asChild>
          <Link href="/admin/conferences/new">创建新会议</Link>
        </Button>
      </div>

      {conferences.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-500 mb-4">暂无会议</p>
            <Button asChild>
              <Link href="/admin/conferences/new">创建第一个会议</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {conferences.map((conference) => (
            <Card key={conference.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="line-clamp-2">{conference.name}</CardTitle>
                <CardDescription>
                  <div className="flex flex-col gap-1 mt-2">
                    <span>会议时间：{formatDate(conference.startDate)} - {formatDate(conference.endDate)}</span>
                    <span>报名人数：{conference._count.registrations}</span>
                  </div>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 mb-4">
                  {conference.testRequired && (
                    <Badge variant="outline">需要测试</Badge>
                  )}
<<<<<<< HEAD
                  {conference.fee.toNumber() > 0 && (
=======
                  {conference.fee > 0 && (
>>>>>>> 5edc018894a634715c39e6a190c13ee7937c8999
                    <Badge variant="outline">¥{conference.fee.toString()}</Badge>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button asChild variant="outline" size="sm" className="flex-1">
                    <Link href={`/admin/conferences/${conference.id}/edit`}>编辑</Link>
                  </Button>
                  <Button asChild variant="outline" size="sm" className="flex-1">
                    <Link href={`/conferences/${conference.slug}`}>查看</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

