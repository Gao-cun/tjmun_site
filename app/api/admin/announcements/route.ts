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

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "未授权" }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = announcementSchema.parse(body)

    const announcement = await prisma.announcement.create({
      data: {
        title: validatedData.title,
        content: validatedData.content,
        status: validatedData.status,
        authorId: session.user.id,
        publishedAt: validatedData.status === "PUBLISHED" ? new Date() : null,
      },
    })

    return NextResponse.json({ message: "公告创建成功", announcement }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 })
    }

    console.error("创建公告错误:", error)
    return NextResponse.json({ error: "创建失败，请稍后重试" }, { status: 500 })
  }
}

