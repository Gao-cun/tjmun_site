"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface ConferenceFormData {
  name: string
  slug: string
  description: string
  startDate: string
  endDate: string
  registrationOpenDate: string
  registrationCloseDate: string
  fee: string
  testRequired: boolean
  testPromptUrl: string
}

interface ConferenceFormProps {
  initialData?: Partial<ConferenceFormData>
  conferenceId?: string
}

export function ConferenceForm({ initialData, conferenceId }: ConferenceFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState<ConferenceFormData>({
    name: initialData?.name || "",
    slug: initialData?.slug || "",
    description: initialData?.description || "",
    startDate: initialData?.startDate || "",
    endDate: initialData?.endDate || "",
    registrationOpenDate: initialData?.registrationOpenDate || "",
    registrationCloseDate: initialData?.registrationCloseDate || "",
    fee: initialData?.fee || "0",
    testRequired: initialData?.testRequired || false,
    testPromptUrl: initialData?.testPromptUrl || "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const url = conferenceId
        ? `/api/admin/conferences/${conferenceId}`
        : "/api/admin/conferences"
      const method = conferenceId ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          fee: parseFloat(formData.fee) || 0,
        }),
      })

      const data = await response.json()
      console.log("会议操作响应:", { status: response.status, ok: response.ok, data })

      if (response.ok) {
        router.push("/admin/conferences")
        router.refresh()
      } else {
        console.error("操作失败:", data)
        setError(data.error || data.details || "操作失败，请稍后重试")
      }
    } catch (error) {
      console.error("提交错误:", error)
      setError("操作失败，请稍后重试")
    } finally {
      setLoading(false)
    }
  }

  // 自动生成 slug
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value
    setFormData({
      ...formData,
      name,
      slug: formData.slug || name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{conferenceId ? "编辑会议" : "创建新会议"}</CardTitle>
        <CardDescription>填写会议信息</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="name">会议名称 *</Label>
            <Input
              id="name"
              required
              value={formData.name}
              onChange={handleNameChange}
              placeholder="例如：2024年春季模拟联合国大会"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">URL标识符 *</Label>
            <Input
              id="slug"
              required
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              placeholder="例如：2024-spring-mun"
            />
            <p className="text-xs text-gray-500">
              用于生成URL，只能包含小写字母、数字和连字符
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">会议描述 *</Label>
            <textarea
              id="description"
              required
              rows={6}
              className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="详细描述会议内容、主题、议程等..."
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="startDate">会议开始时间 *</Label>
              <Input
                id="startDate"
                type="datetime-local"
                required
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">会议结束时间 *</Label>
              <Input
                id="endDate"
                type="datetime-local"
                required
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="registrationOpenDate">报名开始时间 *</Label>
              <Input
                id="registrationOpenDate"
                type="datetime-local"
                required
                value={formData.registrationOpenDate}
                onChange={(e) =>
                  setFormData({ ...formData, registrationOpenDate: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="registrationCloseDate">报名结束时间 *</Label>
              <Input
                id="registrationCloseDate"
                type="datetime-local"
                required
                value={formData.registrationCloseDate}
                onChange={(e) =>
                  setFormData({ ...formData, registrationCloseDate: e.target.value })
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="fee">会议费用（元）</Label>
            <Input
              id="fee"
              type="number"
              min="0"
              step="0.01"
              value={formData.fee}
              onChange={(e) => setFormData({ ...formData, fee: e.target.value })}
              placeholder="0"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="testRequired"
                checked={formData.testRequired}
                onChange={(e) =>
                  setFormData({ ...formData, testRequired: e.target.checked })
                }
                className="h-4 w-4 rounded border-gray-300"
                aria-label="需要学术测试"
              />
              <Label htmlFor="testRequired">需要学术测试</Label>
            </div>
          </div>

          {formData.testRequired && (
            <div className="space-y-2">
              <Label htmlFor="testPromptUrl">测试题目URL</Label>
              <Input
                id="testPromptUrl"
                type="url"
                value={formData.testPromptUrl}
                onChange={(e) => setFormData({ ...formData, testPromptUrl: e.target.value })}
                placeholder="https://example.com/test.pdf"
              />
            </div>
          )}

          <div className="flex gap-4">
            <Button type="submit" disabled={loading}>
              {loading ? "保存中..." : conferenceId ? "更新会议" : "创建会议"}
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

