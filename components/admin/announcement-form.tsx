"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface AnnouncementFormData {
  title: string
  content: string
  status: "DRAFT" | "PUBLISHED"
}

interface AnnouncementFormProps {
  initialData?: Partial<AnnouncementFormData>
  announcementId?: string
}

export function AnnouncementForm({ initialData, announcementId }: AnnouncementFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState<AnnouncementFormData>({
    title: initialData?.title || "",
    content: initialData?.content || "",
    status: initialData?.status || "DRAFT",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const url = announcementId
        ? `/api/admin/announcements/${announcementId}`
        : "/api/admin/announcements"
      const method = announcementId ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        router.push("/admin/announcements")
        router.refresh()
      } else {
        setError(data.error || "操作失败，请稍后重试")
      }
    } catch (error) {
      console.error("提交错误:", error)
      setError("操作失败，请稍后重试")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{announcementId ? "编辑公告" : "创建新公告"}</CardTitle>
        <CardDescription>填写公告信息</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="title">公告标题 *</Label>
            <Input
              id="title"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="请输入公告标题"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">公告内容 *</Label>
            <textarea
              id="content"
              required
              rows={12}
              className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="请输入公告内容..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">发布状态</Label>
            <select
              id="status"
              aria-label="发布状态"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value as "DRAFT" | "PUBLISHED" })
              }
            >
              <option value="DRAFT">草稿</option>
              <option value="PUBLISHED">立即发布</option>
            </select>
          </div>

          <div className="flex gap-4">
            <Button type="submit" disabled={loading}>
              {loading ? "保存中..." : announcementId ? "更新公告" : "创建公告"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={loading}
            >
              取消
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

