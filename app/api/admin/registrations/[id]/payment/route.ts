import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const paymentSchema = z.object({
  status: z.enum(["UNPAID", "PAID", "REFUNDED"]),
  transactionId: z.string().optional(),
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
    const validatedData = paymentSchema.parse(body)

    // 检查报名是否存在
    const registration = await prisma.registration.findUnique({
      where: { id: params.id },
    })

    if (!registration) {
      return NextResponse.json({ error: "报名记录不存在" }, { status: 404 })
    }

    // 更新支付状态
    const updated = await prisma.registration.update({
      where: { id: params.id },
      data: {
        paymentStatus: validatedData.status,
        paymentTransactionId: validatedData.transactionId || null,
      },
    })

    return NextResponse.json({ message: "支付状态更新成功", registration: updated })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 })
    }

    console.error("更新支付状态错误:", error)
    return NextResponse.json({ error: "更新失败，请稍后重试" }, { status: 500 })
  }
}

