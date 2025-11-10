import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const registrationSchema = z.object({
  conferenceId: z.string().min(1, "会议ID不能为空"),
})

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "请先登录" }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = registrationSchema.parse(body)

    // 检查会议是否存在
    const conference = await prisma.conference.findUnique({
      where: { id: validatedData.conferenceId },
    })

    if (!conference) {
      return NextResponse.json({ error: "会议不存在" }, { status: 404 })
    }

    // 检查报名时间
    const now = new Date()
    if (now < conference.registrationOpenDate) {
      return NextResponse.json({ error: "报名尚未开始" }, { status: 400 })
    }

    if (now > conference.registrationCloseDate) {
      return NextResponse.json({ error: "报名已结束" }, { status: 400 })
    }

    // 检查是否已经报名
    const existingRegistration = await prisma.registration.findUnique({
      where: {
        userId_conferenceId: {
          userId: session.user.id,
          conferenceId: validatedData.conferenceId,
        },
      },
    })

    if (existingRegistration) {
      return NextResponse.json({ error: "您已经报名过本次会议" }, { status: 400 })
    }

    // 创建报名记录
    const registration = await prisma.registration.create({
      data: {
        userId: session.user.id,
        conferenceId: validatedData.conferenceId,
        registrationStatus: "PENDING",
        paymentStatus: "UNPAID",
      },
      include: {
        conference: {
          select: {
            name: true,
            slug: true,
          },
        },
      },
    })

    return NextResponse.json(
      { message: "报名成功", registration },
      { status: 201 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }

    console.error("报名错误:", error)
    if (error instanceof Error) {
      console.error("错误消息:", error.message)
    }
    return NextResponse.json(
      { error: "报名失败，请稍后重试" },
      { status: 500 }
    )
  }
}

