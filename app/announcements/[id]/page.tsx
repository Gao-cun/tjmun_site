import { notFound } from "next/navigation"
import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { formatDate, formatDateTime } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"

// 强制动态渲染，确保数据实时更新
export const dynamic = 'force-dynamic'

async function getAnnouncement(id: string) {
  const announcement = await prisma.announcement.findUnique({
    where: { id },
    include: {
      author: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  })

  // 只返回已发布的公告，或者如果不存在则返回 null
  if (!announcement || announcement.status !== "PUBLISHED") {
    return null
  }

  return announcement
}

export default async function AnnouncementDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const announcement = await getAnnouncement(params.id)

  if (!announcement) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-6">
        <Button asChild variant="ghost" size="sm">
          <Link href="/announcements" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            返回公告列表
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">{announcement.title}</CardTitle>
          <CardDescription>
            <div className="flex flex-col gap-2 mt-4">
              {announcement.publishedAt && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">
                    发布时间：{formatDateTime(announcement.publishedAt)}
                  </span>
                </div>
              )}
              {announcement.author && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">
                    发布者：{announcement.author.name}
                  </span>
                </div>
              )}
            </div>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="prose max-w-none">
            <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
              {announcement.content}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="mt-6 flex justify-center">
        <Button asChild variant="outline">
          <Link href="/announcements">返回公告列表</Link>
        </Button>
      </div>
    </div>
  )
}

