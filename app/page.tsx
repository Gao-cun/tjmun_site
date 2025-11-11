import { prisma } from "@/lib/prisma"
import { HomeContent } from "@/components/home-content"

// 强制动态渲染，确保数据实时更新
export const dynamic = 'force-dynamic'

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

async function getCountdownTarget() {
  const config = await prisma.siteConfig.findUnique({
    where: { key: "countdown_target" },
  })
  
  if (!config || !config.value) {
    return null
  }

  try {
    const date = new Date(config.value)
    if (isNaN(date.getTime())) {
      return null
    }
    return date
  } catch {
    return null
  }
}

export default async function HomePage() {
  const [announcements, conferences, countdownTarget] = await Promise.all([
    getLatestAnnouncements(),
    getUpcomingConferences(),
    getCountdownTarget(),
  ])

  return (
    <HomeContent
      announcements={announcements}
      conferences={conferences}
      countdownTarget={countdownTarget}
    />
  )
}

