import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const scoreSchema = z.object({
  score: z.number().int().min(0).max(100),
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
    const validatedData = scoreSchema.parse(body)

    // 检查报名是否存在
    const registration = await prisma.registration.findUnique({
      where: { id: params.id },
    })

    if (!registration) {
      return NextResponse.json({ error: "报名记录不存在" }, { status: 404 })
    }

    // 更新测试成绩
    const updated = await prisma.registration.update({
      where: { id: params.id },
      data: {
        testScore: validatedData.score,
      },
    })

    return NextResponse.json({ message: "测试成绩更新成功", registration: updated })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 })
    }

    console.error("更新测试成绩错误:", error)
    return NextResponse.json({ error: "更新失败，请稍后重试" }, { status: 500 })
  }
}

