import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

// 将 datetime-local 格式转换为 ISO 格式
function parseDateTime(dateTimeString: string): Date {
  // datetime-local 格式: YYYY-MM-DDTHH:mm
  // 转换为 ISO 格式: YYYY-MM-DDTHH:mm:00.000Z
  if (!dateTimeString) {
    throw new Error("日期时间不能为空")
  }

  // 如果已经是 ISO 格式，直接使用
  if (dateTimeString.includes('Z') || dateTimeString.includes('+')) {
    return new Date(dateTimeString)
  }

  // 如果是 datetime-local 格式，添加秒和时区
  const isoString = dateTimeString.length === 16
    ? `${dateTimeString}:00`
    : dateTimeString

  const date = new Date(isoString)
  if (isNaN(date.getTime())) {
    throw new Error(`无效的日期时间格式: ${dateTimeString}`)
  }

  return date
}

const conferenceSchema = z.object({
  name: z.string().min(1, "会议名称不能为空"),
  slug: z.string().min(1, "URL标识符不能为空").regex(/^[a-z0-9-]+$/, "URL标识符只能包含小写字母、数字和连字符"),
  description: z.string().min(1, "会议描述不能为空"),
  startDate: z.string().min(1, "会议开始时间不能为空"),
  endDate: z.string().min(1, "会议结束时间不能为空"),
  registrationOpenDate: z.string().min(1, "报名开始时间不能为空"),
  registrationCloseDate: z.string().min(1, "报名结束时间不能为空"),
  fee: z.number().min(0),
  testRequired: z.boolean(),
  testPromptUrl: z.string().url().optional().or(z.literal("")),
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
    const validatedData = conferenceSchema.parse({
      ...body,
      fee: parseFloat(body.fee) || 0,
    })

    // 解析日期时间
    let startDate: Date
    let endDate: Date
    let registrationOpenDate: Date
    let registrationCloseDate: Date

    try {
      startDate = parseDateTime(validatedData.startDate)
      endDate = parseDateTime(validatedData.endDate)
      registrationOpenDate = parseDateTime(validatedData.registrationOpenDate)
      registrationCloseDate = parseDateTime(validatedData.registrationCloseDate)
    } catch (error) {
      return NextResponse.json(
        { error: error instanceof Error ? error.message : "日期时间格式错误" },
        { status: 400 }
      )
    }

    // 检查会议是否存在
    const existingConference = await prisma.conference.findUnique({
      where: { id: params.id },
    })

    if (!existingConference) {
      return NextResponse.json({ error: "会议不存在" }, { status: 404 })
    }

    // 检查 slug 是否被其他会议使用
    if (validatedData.slug !== existingConference.slug) {
      const slugConflict = await prisma.conference.findUnique({
        where: { slug: validatedData.slug },
      })

      if (slugConflict) {
        return NextResponse.json({ error: "该URL标识符已被使用" }, { status: 400 })
      }
    }

    // 检查名称是否被其他会议使用
    if (validatedData.name !== existingConference.name) {
      const nameConflict = await prisma.conference.findUnique({
        where: { name: validatedData.name },
      })

      if (nameConflict) {
        return NextResponse.json({ error: "该会议名称已被使用" }, { status: 400 })
      }
    }

    const conference = await prisma.conference.update({
      where: { id: params.id },
      data: {
        name: validatedData.name,
        slug: validatedData.slug,
        description: validatedData.description,
        startDate,
        endDate,
        registrationOpenDate,
        registrationCloseDate,
        fee: validatedData.fee,
        testRequired: validatedData.testRequired,
        testPromptUrl: validatedData.testPromptUrl || null,
      },
    })

    return NextResponse.json({ message: "会议更新成功", conference })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 })
    }

    console.error("更新会议错误:", error)
    return NextResponse.json({ error: "更新失败，请稍后重试" }, { status: 500 })
  }
}

