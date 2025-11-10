import { prisma } from "@/lib/prisma"
import { formatDate } from "@/lib/utils"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"

async function getAnnouncements() {
  const announcements = await prisma.announcement.findMany({
    include: {
      author: {
        select: {
          name: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  })
  return announcements
}

export default async function AdminAnnouncementsPage() {
  const announcements = await getAnnouncements()

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">公告管理</h1>
          <p className="mt-2 text-gray-600">管理所有公告和通知</p>
        </div>
        <Button asChild>
          <Link href="/admin/announcements/new">创建新公告</Link>
        </Button>
      </div>

      {announcements.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-500 mb-4">暂无公告</p>
            <Button asChild>
              <Link href="/admin/announcements/new">创建第一个公告</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {announcements.map((announcement) => (
            <Card key={announcement.id}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold">{announcement.title}</h3>
                      <Badge
                        variant={announcement.status === "PUBLISHED" ? "default" : "secondary"}
                      >
                        {announcement.status === "PUBLISHED" ? "已发布" : "草稿"}
                      </Badge>
                    </div>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p>
                        <span className="font-medium">作者：</span>
                        {announcement.author.name}
                      </p>
                      <p>
                        <span className="font-medium">创建时间：</span>
                        {formatDate(announcement.createdAt)}
                      </p>
                      {announcement.publishedAt && (
                        <p>
                          <span className="font-medium">发布时间：</span>
                          {formatDate(announcement.publishedAt)}
                        </p>
                      )}
                    </div>
                    <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                      {announcement.content.substring(0, 150)}...
                    </p>
                  </div>
                  <div className="ml-4 flex gap-2">
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/admin/announcements/${announcement.id}/edit`}>
                        编辑
                      </Link>
                    </Button>
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/announcements/${announcement.id}`}>查看</Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

