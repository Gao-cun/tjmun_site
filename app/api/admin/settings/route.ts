import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const settingsSchema = z.object({
  contact_email: z.string().email().optional().or(z.literal("")),
  contact_phone: z.string().optional().or(z.literal("")),
  contact_address: z.string().optional().or(z.literal("")),
  contact_wechat: z.string().optional().or(z.literal("")),
})

const configKeys = ["contact_email", "contact_phone", "contact_address", "contact_wechat"]
const configLabels: Record<string, string> = {
  contact_email: "联系邮箱",
  contact_phone: "联系电话",
  contact_address: "联系地址",
  contact_wechat: "微信公众号",
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "未授权" }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = settingsSchema.parse(body)

    // 更新或创建每个配置项
    for (const key of configKeys) {
      const value = validatedData[key as keyof typeof validatedData] || ""

      await prisma.siteConfig.upsert({
        where: { key },
        update: { value, label: configLabels[key] },
        create: {
          key,
          value,
          label: configLabels[key],
        },
      })
    }

    return NextResponse.json({ message: "设置保存成功" })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 })
    }

    console.error("保存设置错误:", error)
    return NextResponse.json({ error: "保存失败，请稍后重试" }, { status: 500 })
  }
}

