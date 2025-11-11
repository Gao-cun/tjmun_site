"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface SiteConfigFormData {
  contact_email: string
  contact_phone: string
  contact_address: string
  contact_wechat: string
  countdown_target: string
}

interface SiteConfigFormProps {
  initialData?: Partial<SiteConfigFormData>
}

export function SiteConfigForm({ initialData }: SiteConfigFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState<SiteConfigFormData>({
    contact_email: initialData?.contact_email || "",
    contact_phone: initialData?.contact_phone || "",
    contact_address: initialData?.contact_address || "",
    contact_wechat: initialData?.contact_wechat || "",
    countdown_target: initialData?.countdown_target || "",
  })

  // 将日期时间字符串转换为本地日期时间输入格式 (YYYY-MM-DDTHH:mm)
  const getDateTimeLocalValue = (dateString: string) => {
    if (!dateString) return ""
    try {
      const date = new Date(dateString)
      if (isNaN(date.getTime())) return ""
      // 转换为本地时间并格式化为 YYYY-MM-DDTHH:mm
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, "0")
      const day = String(date.getDate()).padStart(2, "0")
      const hours = String(date.getHours()).padStart(2, "0")
      const minutes = String(date.getMinutes()).padStart(2, "0")
      return `${year}-${month}-${day}T${hours}:${minutes}`
    } catch {
      return ""
    }
  }

  const [countdownDateTime, setCountdownDateTime] = useState(() => {
    if (initialData?.countdown_target) {
      return getDateTimeLocalValue(initialData.countdown_target)
    }
    return ""
  })

  // 当initialData变化时更新countdownDateTime
  React.useEffect(() => {
    if (initialData?.countdown_target) {
      setCountdownDateTime(getDateTimeLocalValue(initialData.countdown_target))
    }
  }, [initialData?.countdown_target])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const response = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        router.push("/admin/settings")
        router.refresh()
      } else {
        setError(data.error || "保存失败，请稍后重试")
      }
    } catch (error) {
      console.error("保存错误:", error)
      setError("保存失败，请稍后重试")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>编辑网站设置</CardTitle>
        <CardDescription>修改网站配置信息</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="contact_email">联系邮箱</Label>
            <Input
              id="contact_email"
              type="email"
              value={formData.contact_email}
              onChange={(e) =>
                setFormData({ ...formData, contact_email: e.target.value })
              }
              placeholder="contact@example.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contact_phone">联系电话</Label>
            <Input
              id="contact_phone"
              type="tel"
              value={formData.contact_phone}
              onChange={(e) =>
                setFormData({ ...formData, contact_phone: e.target.value })
              }
              placeholder="021-12345678"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contact_address">联系地址</Label>
            <Input
              id="contact_address"
              value={formData.contact_address}
              onChange={(e) =>
                setFormData({ ...formData, contact_address: e.target.value })
              }
              placeholder="上海市杨浦区四平路1239号同济大学"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contact_wechat">微信公众号</Label>
            <Input
              id="contact_wechat"
              value={formData.contact_wechat}
              onChange={(e) =>
                setFormData({ ...formData, contact_wechat: e.target.value })
              }
              placeholder="TJMUN_Official"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="countdown_target">倒计时目标时间</Label>
            <Input
              id="countdown_target"
              type="datetime-local"
              value={countdownDateTime}
              onChange={(e) => {
                setCountdownDateTime(e.target.value)
                // 将本地时间转换为ISO字符串
                if (e.target.value) {
                  const localDate = new Date(e.target.value)
                  setFormData({
                    ...formData,
                    countdown_target: localDate.toISOString(),
                  })
                } else {
                  setFormData({ ...formData, countdown_target: "" })
                }
              }}
            />
            <p className="text-sm text-gray-500">
              设置主页倒计时的目标时间（精确到分钟），留空则不显示倒计时
            </p>
          </div>

          <div className="flex gap-4">
            <Button type="submit" disabled={loading}>
              {loading ? "保存中..." : "保存设置"}
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

