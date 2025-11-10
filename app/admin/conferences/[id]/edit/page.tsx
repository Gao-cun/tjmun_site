import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { ConferenceForm } from "@/components/admin/conference-form"

async function getConference(id: string) {
  const conference = await prisma.conference.findUnique({
    where: { id },
  })
  return conference
}

export default async function EditConferencePage({
  params,
}: {
  params: { id: string }
}) {
  const conference = await getConference(params.id)

  if (!conference) {
    notFound()
  }

  // 将UTC时间转换为本地时间格式 (YYYY-MM-DDTHH:mm)
  const formatLocalDateTime = (date: Date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    return `${year}-${month}-${day}T${hours}:${minutes}`
  }

  const initialData = {
    name: conference.name,
    slug: conference.slug,
    description: conference.description,
    startDate: formatLocalDateTime(new Date(conference.startDate)),
    endDate: formatLocalDateTime(new Date(conference.endDate)),
    registrationOpenDate: formatLocalDateTime(new Date(conference.registrationOpenDate)),
    registrationCloseDate: formatLocalDateTime(new Date(conference.registrationCloseDate)),
    fee: conference.fee.toString(),
    testRequired: conference.testRequired,
    testPromptUrl: conference.testPromptUrl || "",
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">编辑会议</h1>
        <p className="mt-2 text-gray-600">修改会议信息</p>
      </div>
      <ConferenceForm initialData={initialData} conferenceId={params.id} />
    </div>
  )
}

