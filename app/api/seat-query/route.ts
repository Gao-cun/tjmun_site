import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, phoneLastFour } = body

    if (!name || !phoneLastFour) {
      return NextResponse.json(
        { success: false, error: "姓名和手机尾号后四位不能为空" },
        { status: 400 }
      )
    }

    if (!/^\d{4}$/.test(phoneLastFour)) {
      return NextResponse.json(
        { success: false, error: "手机尾号必须是4位数字" },
        { status: 400 }
      )
    }

    // 查询匹配的席位分配
    // 使用 phone LIKE '%后四位' 来匹配手机尾号
    const assignments = await prisma.seatAssignment.findMany({
      where: {
        name: {
          equals: name.trim(),
          mode: "insensitive", // 不区分大小写
        },
        phone: {
          endsWith: phoneLastFour,
        },
      },
    })

    if (assignments.length === 0) {
      return NextResponse.json(
        { success: false, error: "未找到相关信息，请检查姓名和手机尾号是否正确" },
        { status: 404 }
      )
    }

    // 如果有多条记录，返回第一条
    const assignment = assignments[0]

    return NextResponse.json({
      success: true,
      data: {
        venue: assignment.venue,
        seat: assignment.seat,
        qqGroup: assignment.qqGroup,
      },
    })
  } catch (error) {
    console.error("查询席位失败:", error)
    return NextResponse.json(
      { success: false, error: "查询失败，请稍后重试" },
      { status: 500 }
    )
  }
}

