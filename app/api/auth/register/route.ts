import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { z } from "zod"

const registerSchema = z.object({
  email: z.string().email("请输入有效的邮箱地址"),
  password: z.string().min(6, "密码至少需要6个字符"),
  name: z.string().min(1, "请输入姓名"),
  school: z.string().optional(),
  major: z.string().optional(),
  phone: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log("收到注册请求:", { email: body.email, name: body.name })

    const validatedData = registerSchema.parse(body)
    console.log("数据验证通过")

    // 检查邮箱是否已存在
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    })

    if (existingUser) {
      console.log("邮箱已存在:", validatedData.email)
      return NextResponse.json(
        { error: "该邮箱已被注册" },
        { status: 400 }
      )
    }

    // 加密密码
    console.log("开始加密密码")
    const hashedPassword = await bcrypt.hash(validatedData.password, 10)
    console.log("密码加密完成")

    // 创建用户
    console.log("开始创建用户")
    const user = await prisma.user.create({
      data: {
        email: validatedData.email,
        hashedPassword,
        name: validatedData.name,
        school: validatedData.school || "同济大学",
        major: validatedData.major,
        phone: validatedData.phone,
        role: "STUDENT",
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    })

    console.log("用户创建成功:", user.id)
    return NextResponse.json(
      { message: "注册成功", user },
      { status: 201 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("数据验证错误:", error.errors)
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }

    console.error("注册错误详情:", error)
    if (error instanceof Error) {
      console.error("错误消息:", error.message)
      console.error("错误堆栈:", error.stack)
    }
    return NextResponse.json(
      { error: "注册失败，请稍后重试", details: process.env.NODE_ENV === "development" ? (error instanceof Error ? error.message : String(error)) : undefined },
      { status: 500 }
    )
  }
}

