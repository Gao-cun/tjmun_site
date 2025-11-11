import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import * as XLSX from "xlsx"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "未授权" },
        { status: 401 }
      )
    }

    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json(
        { error: "未选择文件" },
        { status: 400 }
      )
    }

    // 读取文件内容
    const arrayBuffer = await file.arrayBuffer()
    const workbook = XLSX.read(arrayBuffer, { type: "array" })
    const sheetName = workbook.SheetNames[0]
    const worksheet = workbook.Sheets[sheetName]

    // 转换为JSON
    const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][]

    if (data.length < 2) {
      return NextResponse.json(
        { error: "Excel文件至少需要包含表头和数据行" },
        { status: 400 }
      )
    }

    // 解析表头
    const headers = data[0].map((h: any) => String(h).trim())
    
    // 查找列索引
    const serialIndex = headers.findIndex((h) => 
      h.includes("序号") || h.toLowerCase().includes("serial")
    )
    const nameIndex = headers.findIndex((h) => 
      h.includes("姓名") || h.toLowerCase().includes("name")
    )
    const phoneIndex = headers.findIndex((h) => 
      h.includes("手机号") || h.toLowerCase().includes("phone")
    )
    const venueIndex = headers.findIndex((h) => 
      h.includes("会场") || h.toLowerCase().includes("venue")
    )
    const seatIndex = headers.findIndex((h) => 
      h.includes("席位") || h.toLowerCase().includes("seat")
    )
    const qqGroupIndex = headers.findIndex((h) => 
      h.includes("QQ群") || h.toLowerCase().includes("qq")
    )

    if (
      nameIndex === -1 ||
      phoneIndex === -1 ||
      venueIndex === -1 ||
      seatIndex === -1 ||
      qqGroupIndex === -1
    ) {
      return NextResponse.json(
        { error: "Excel表头格式不正确，必须包含：姓名、手机号、会场、席位、所属会场的QQ群号" },
        { status: 400 }
      )
    }

    // 解析数据行
    const assignments = []
    for (let i = 1; i < data.length; i++) {
      const row = data[i]
      if (!row || row.length === 0) continue

      const name = String(row[nameIndex] || "").trim()
      const phone = String(row[phoneIndex] || "").trim()
      const venue = String(row[venueIndex] || "").trim()
      const seat = String(row[seatIndex] || "").trim()
      const qqGroup = String(row[qqGroupIndex] || "").trim()
      const serialNumber = serialIndex !== -1 && row[serialIndex] 
        ? parseInt(String(row[serialIndex])) || null 
        : null

      if (!name || !phone || !venue || !seat || !qqGroup) {
        continue // 跳过不完整的行
      }

      assignments.push({
        serialNumber,
        name,
        phone,
        venue,
        seat,
        qqGroup,
      })
    }

    if (assignments.length === 0) {
      return NextResponse.json(
        { error: "未找到有效的数据行" },
        { status: 400 }
      )
    }

    // 清空现有数据（可选，根据需求决定是否保留历史数据）
    // await prisma.seatAssignment.deleteMany({})

    // 清空现有数据（每次上传替换所有数据）
    await prisma.seatAssignment.deleteMany({})

    // 批量插入数据
    const result = await prisma.seatAssignment.createMany({
      data: assignments,
      skipDuplicates: true,
    })

    const count = result.count

    return NextResponse.json({
      success: true,
      count,
      message: `成功导入 ${count} 条记录`,
    })
  } catch (error) {
    console.error("上传Excel失败:", error)
    return NextResponse.json(
      { error: "上传失败，请检查文件格式" },
      { status: 500 }
    )
  }
}

