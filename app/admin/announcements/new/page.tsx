import { AnnouncementForm } from "@/components/admin/announcement-form"

export default function NewAnnouncementPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">创建新公告</h1>
        <p className="mt-2 text-gray-600">填写公告信息以创建新公告</p>
      </div>
      <AnnouncementForm />
    </div>
  )
}

