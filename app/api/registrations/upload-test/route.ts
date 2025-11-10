import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { writeFile, mkdir } from "fs/promises"
import { join } from "path"
import { existsSync } from "fs"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "请先登录" }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get("file") as File
    const conferenceId = formData.get("conferenceId") as string

    if (!file) {
      return NextResponse.json({ error: "请选择文件" }, { status: 400 })
    }

    if (!conferenceId) {
      return NextResponse.json({ error: "会议ID不能为空" }, { status: 400 })
    }

    // 检查会议是否存在且需要测试
    const conference = await prisma.conference.findUnique({
      where: { id: conferenceId },
    })

    if (!conference) {
      return NextResponse.json({ error: "会议不存在" }, { status: 404 })
    }

    if (!conference.testRequired) {
      return NextResponse.json({ error: "该会议不需要学术测试" }, { status: 400 })
    }

    // 检查报名是否存在
    const registration = await prisma.registration.findUnique({
      where: {
        userId_conferenceId: {
          userId: session.user.id,
          conferenceId: conferenceId,
        },
      },
    })

    if (!registration) {
      return NextResponse.json({ error: "您尚未报名该会议" }, { status: 400 })
    }

    // 验证文件类型
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "image/jpeg",
      "image/png",
    ]
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "不支持的文件类型，请上传 PDF、Word 或图片文件" },
        { status: 400 }
      )
    }

    // 验证文件大小（10MB）
    const maxSize = 10 * 1024 * 1024
    if (file.size > maxSize) {
      return NextResponse.json({ error: "文件大小不能超过 10MB" }, { status: 400 })
    }

    // 创建上传目录
    const uploadDir = join(process.cwd(), "public", "uploads", "tests")
    try {
      if (!existsSync(uploadDir)) {
        await mkdir(uploadDir, { recursive: true })
      }
    } catch (error) {
      console.error("创建上传目录失败:", error)
      return NextResponse.json({ error: "创建上传目录失败" }, { status: 500 })
    }

    // 生成文件名
    const timestamp = Date.now()
    const fileExtension = file.name.split(".").pop()
    const fileName = `${registration.id}-${timestamp}.${fileExtension}`
    const filePath = join(uploadDir, fileName)

    // 保存文件
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await writeFile(filePath, buffer)

    // 生成URL
    const fileUrl = `/uploads/tests/${fileName}`

    // 更新报名记录
    const updated = await prisma.registration.update({
      where: { id: registration.id },
      data: {
        academicTestUrl: fileUrl,
      },
    })

    return NextResponse.json({
      message: "文件上传成功",
      url: fileUrl,
      registration: updated,
    })
  } catch (error) {
    console.error("文件上传错误:", error)
    return NextResponse.json({ error: "上传失败，请稍后重试" }, { status: 500 })
  }
}

