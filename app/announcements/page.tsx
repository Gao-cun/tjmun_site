import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { formatDate } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

async function getAnnouncements() {
  const announcements = await prisma.announcement.findMany({
    where: { status: "PUBLISHED" },
    include: {
      author: {
        select: {
          name: true,
        },
      },
    },
    orderBy: { publishedAt: "desc" },
  })
  return announcements
}

export default async function AnnouncementsPage() {
  const announcements = await getAnnouncements()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">公告列表</h1>
        <p className="mt-2 text-gray-600">查看所有发布的公告和通知</p>
      </div>

      {announcements.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-500">暂无公告</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {announcements.map((announcement) => (
            <Card key={announcement.id} className="hover:shadow-lg transition-shadow flex flex-col">
              <CardHeader>
                <CardTitle className="line-clamp-2">{announcement.title}</CardTitle>
                <CardDescription>
                  <div className="flex items-center gap-2 mt-2">
                    <span>
                      {announcement.publishedAt && formatDate(announcement.publishedAt)}
                    </span>
                    {announcement.author && (
                      <>
                        <span>•</span>
                        <span>发布者：{announcement.author.name}</span>
                      </>
                    )}
                  </div>
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <p className="line-clamp-4 text-sm text-gray-600 mb-4 flex-1">
                  {announcement.content.length > 200
                    ? `${announcement.content.substring(0, 200)}...`
                    : announcement.content}
                </p>
                <Button asChild variant="outline" size="sm" className="w-full">
                  <Link href={`/announcements/${announcement.id}`}>阅读全文</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

