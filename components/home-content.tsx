"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Countdown } from "./countdown"
import { useLanguage } from "./language-provider"
import { getTranslation } from "@/lib/translations"
import { formatDate } from "@/lib/utils"

interface HomeContentProps {
  announcements: Array<{
    id: string
    title: string
    content: string
    publishedAt: Date | null
    author: { name: string } | null
  }>
  conferences: Array<{
    id: string
    name: string
    description: string
    startDate: Date
    endDate: Date
    registrationOpenDate: Date
    registrationCloseDate: Date
    slug: string
  }>
  countdownTarget: Date | null
}

export function HomeContent({ announcements, conferences, countdownTarget }: HomeContentProps) {
  const { language } = useLanguage()

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <section className="mb-16 text-center">
        <h1 className="mb-4 text-5xl font-bold text-gray-900">
          {getTranslation(language, "siteName")}
        </h1>
        <p className="mx-auto mb-8 max-w-2xl text-xl text-gray-600">
          {getTranslation(language, "tagline")}
        </p>
        {countdownTarget && <Countdown targetDate={countdownTarget} />}
        <div className="flex justify-center gap-4">
          <Button asChild size="lg">
            <Link href="/conferences">{getTranslation(language, "conferences")}</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/announcements">{getTranslation(language, "latestAnnouncements")}</Link>
          </Button>
        </div>
      </section>

      {/* 最新公告 */}
      <section className="mb-16">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-3xl font-bold">{getTranslation(language, "latestAnnouncements")}</h2>
          <Button asChild variant="ghost">
            <Link href="/announcements">{getTranslation(language, "viewAll")} →</Link>
          </Button>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {announcements.map((announcement) => (
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
                  <Link href={`/announcements/${announcement.id}`}>
                    {getTranslation(language, "readMore")}
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* 近期会议 */}
      <section>
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-3xl font-bold">{getTranslation(language, "upcomingConferences")}</h2>
          <Button asChild variant="ghost">
            <Link href="/conferences">{getTranslation(language, "viewAll")} →</Link>
          </Button>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {conferences.map((conference) => {
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
                        <span className="text-green-600">
                          {getTranslation(language, "registrationOpen")}
                        </span>
                      ) : now < conference.registrationOpenDate ? (
                        <span className="text-blue-600">
                          {getTranslation(language, "registrationUpcoming")}
                        </span>
                      ) : (
                        <span className="text-gray-500">
                          {getTranslation(language, "registrationClosed")}
                        </span>
                      )}
                    </span>
                    <Button asChild size="sm">
                      <Link href={`/conferences/${conference.slug}`}>
                        {getTranslation(language, "viewDetails")}
                      </Link>
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

