"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function SeatAssignmentsPage() {
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]
      if (
        !selectedFile.name.endsWith(".xlsx") &&
        !selectedFile.name.endsWith(".xls")
      ) {
        setMessage({ type: "error", text: "请上传Excel文件（.xlsx或.xls格式）" })
        return
      }
      setFile(selectedFile)
      setMessage(null)
    }
  }

  const handleUpload = async () => {
    if (!file) {
      setMessage({ type: "error", text: "请选择要上传的文件" })
      return
    }

    setLoading(true)
    setMessage(null)

    const formData = new FormData()
    formData.append("file", file)

    try {
      const response = await fetch("/api/admin/seat-assignments/upload", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        setMessage({ type: "error", text: data.error || "上传失败" })
        return
      }

      setMessage({
        type: "success",
        text: `上传成功！共导入 ${data.count} 条记录`,
      })
      setFile(null)
      // 重置文件输入
      const fileInput = document.getElementById("file-input") as HTMLInputElement
      if (fileInput) {
        fileInput.value = ""
      }
    } catch (error) {
      setMessage({ type: "error", text: "上传失败，请稍后重试" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">席位分配管理</h1>
        <p className="mt-2 text-gray-600">上传Excel文件导入席位分配数据</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>上传Excel文件</CardTitle>
          <CardDescription>
            Excel表头格式：序号、姓名、手机号、会场、席位、所属会场的QQ群号
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="file-input">选择Excel文件</Label>
              <Input
                id="file-input"
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileChange}
                disabled={loading}
              />
            </div>
            {file && (
              <div className="text-sm text-gray-600">
                已选择文件: {file.name}
              </div>
            )}
            <Button
              onClick={handleUpload}
              disabled={loading || !file}
              className="w-full"
            >
              {loading ? "上传中..." : "上传并导入"}
            </Button>
            {message && (
              <div
                className={`rounded-md p-4 ${
                  message.type === "success"
                    ? "bg-green-50 text-green-800"
                    : "bg-red-50 text-red-800"
                }`}
              >
                {message.text}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

