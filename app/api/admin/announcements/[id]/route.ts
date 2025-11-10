import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const announcementSchema = z.object({
  title: z.string().min(1, "公告标题不能为空"),
  content: z.string().min(1, "公告内容不能为空"),
  status: z.enum(["DRAFT", "PUBLISHED"]),
})

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "未授权" }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = announcementSchema.parse(body)

    // 检查公告是否存在
    const existingAnnouncement = await prisma.announcement.findUnique({
      where: { id: params.id },
    })

    if (!existingAnnouncement) {
      return NextResponse.json({ error: "公告不存在" }, { status: 404 })
    }

    const announcement = await prisma.announcement.update({
      where: { id: params.id },
      data: {
        title: validatedData.title,
        content: validatedData.content,
        status: validatedData.status,
        publishedAt:
          validatedData.status === "PUBLISHED" && !existingAnnouncement.publishedAt
            ? new Date()
            : existingAnnouncement.publishedAt,
      },
    })

    return NextResponse.json({ message: "公告更新成功", announcement })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 })
    }

    console.error("更新公告错误:", error)
    return NextResponse.json({ error: "更新失败，请稍后重试" }, { status: 500 })
  }
}

