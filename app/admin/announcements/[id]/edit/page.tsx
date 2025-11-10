import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { AnnouncementForm } from "@/components/admin/announcement-form"

async function getAnnouncement(id: string) {
  const announcement = await prisma.announcement.findUnique({
    where: { id },
  })
  return announcement
}

export default async function EditAnnouncementPage({
  params,
}: {
  params: { id: string }
}) {
  const announcement = await getAnnouncement(params.id)

  if (!announcement) {
    notFound()
  }

  const initialData = {
    title: announcement.title,
    content: announcement.content,
    status: announcement.status as "DRAFT" | "PUBLISHED",
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">编辑公告</h1>
        <p className="mt-2 text-gray-600">修改公告信息</p>
      </div>
      <AnnouncementForm initialData={initialData} announcementId={params.id} />
    </div>
  )
}

