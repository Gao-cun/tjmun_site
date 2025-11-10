"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface FileUploadFormProps {
  conferenceId: string
  conferenceName: string
  onUploadSuccess?: () => void
}

export function FileUploadForm({
  conferenceId,
  conferenceName,
  onUploadSuccess,
}: FileUploadFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [file, setFile] = useState<File | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess(false)

    if (!file) {
      setError("请选择文件")
      return
    }

    setLoading(true)

    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("conferenceId", conferenceId)

      const response = await fetch("/api/registrations/upload-test", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess(true)
        setFile(null)
        if (onUploadSuccess) {
          onUploadSuccess()
        }
        // 刷新页面以显示更新后的状态
        setTimeout(() => {
          router.refresh()
        }, 1000)
      } else {
        setError(data.error || "上传失败，请稍后重试")
      }
    } catch (error) {
      console.error("上传错误:", error)
      setError("上传失败，请稍后重试")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>提交学术测试</CardTitle>
        <CardDescription>
          为会议 "{conferenceName}" 提交您的学术测试文件
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          {success && (
            <div className="rounded-md bg-green-50 p-3 text-sm text-green-700">
              文件上传成功！
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="file">选择文件</Label>
            <Input
              id="file"
              type="file"
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              disabled={loading}
            />
            <p className="text-xs text-gray-500">
              支持格式：PDF、Word 文档、图片（JPG、PNG），文件大小不超过 10MB
            </p>
          </div>

          <Button type="submit" disabled={loading || !file}>
            {loading ? "上传中..." : "上传文件"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
