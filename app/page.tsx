import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { formatDate } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

async function getLatestAnnouncements() {
  const announcements = await prisma.announcement.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { publishedAt: "desc" },
    take: 3,
    include: { author: { select: { name: true } } },
  })
  return announcements
}

async function getUpcomingConferences() {
  const now = new Date()
  const conferences = await prisma.conference.findMany({
    where: {
      registrationCloseDate: { gte: now },
    },
    orderBy: { registrationOpenDate: "asc" },
    take: 3,
  })
  return conferences
}

export default async function HomePage() {
  const [announcements, conferences] = await Promise.all([
    getLatestAnnouncements(),
    getUpcomingConferences(),
  ])

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <section className="mb-16 text-center">
        <h1 className="mb-4 text-5xl font-bold text-gray-900">
          同济大学模拟联合国社团
        </h1>
        <p className="mx-auto mb-8 max-w-2xl text-xl text-gray-600">
          培养全球视野，提升领导力，体验外交魅力
        </p>
        <div className="flex justify-center gap-4">
          <Button asChild size="lg">
            <Link href="/conferences">查看会议</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/announcements">最新公告</Link>
          </Button>
        </div>
      </section>

      {/* 最新公告 */}
      <section className="mb-16">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-3xl font-bold">最新公告</h2>
          <Button asChild variant="ghost">
            <Link href="/announcements">查看全部 →</Link>
          </Button>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {announcements.map((announcement: { id: string; title: string; content: string; publishedAt: Date | null; author: { name: string } | null }) => (
            <Card key={announcement.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="line-clamp-2">{announcement.title}</CardTitle>
                <CardDescription>
                  {announcement.publishedAt && formatDate(announcement.publishedAt)}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="line-clamp-3 text-sm text-gray-600 mb-4">
                  {announcement.content.substring(0, 150)}...
                </p>
                <Button asChild variant="outline" size="sm">
                  <Link href={`/announcements/${announcement.id}`}>阅读更多</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* 近期会议 */}
      <section>
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-3xl font-bold">近期会议</h2>
          <Button asChild variant="ghost">
            <Link href="/conferences">查看全部 →</Link>
          </Button>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {conferences.map((conference: { id: string; name: string; description: string; startDate: Date; endDate: Date; registrationOpenDate: Date; registrationCloseDate: Date; slug: string }) => {
            const now = new Date()
            const isOpen = 
              now >= conference.registrationOpenDate && 
              now <= conference.registrationCloseDate

            return (
              <Card key={conference.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle>{conference.name}</CardTitle>
                  <CardDescription>
                    {formatDate(conference.startDate)} - {formatDate(conference.endDate)}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {conference.description.substring(0, 100)}...
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">
                      {isOpen ? (
                        <span className="text-green-600">报名中</span>
                      ) : now < conference.registrationOpenDate ? (
                        <span className="text-blue-600">即将开始</span>
                      ) : (
                        <span className="text-gray-500">已结束</span>
                      )}
                    </span>
                    <Button asChild size="sm">
                      <Link href={`/conferences/${conference.slug}`}>查看详情</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </section>
    </div>
  )
}

