"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export default function SeatQueryPage() {
  const [name, setName] = useState("")
  const [phoneLastFour, setPhoneLastFour] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{
    venue: string
    seat: string
    qqGroup: string
  } | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [open, setOpen] = useState(false)

  const handleQuery = async () => {
    if (!name.trim() || !phoneLastFour.trim()) {
      setError("请输入姓名和手机尾号后四位")
      setOpen(true)
      return
    }

    if (!/^\d{4}$/.test(phoneLastFour)) {
      setError("手机尾号必须是4位数字")
      setOpen(true)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/seat-query", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          phoneLastFour: phoneLastFour.trim(),
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "查询失败")
        setResult(null)
        setOpen(true)
        return
      }

      if (data.success && data.data) {
        setResult(data.data)
        setError(null)
        setOpen(true)
      } else {
        setError("未找到相关信息，请检查姓名和手机尾号是否正确")
        setResult(null)
        setOpen(true)
      }
    } catch (err) {
      setError("查询失败，请稍后重试")
      setResult(null)
      setOpen(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mx-auto max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">席位查询</CardTitle>
            <CardDescription>
              请输入您的姓名和手机尾号后四位查询您的会场和席位信息
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">姓名</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="请输入您的姓名"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleQuery()
                    }
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">手机尾号后四位</Label>
                <Input
                  id="phone"
                  type="text"
                  placeholder="请输入手机尾号后四位"
                  value={phoneLastFour}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "").slice(0, 4)
                    setPhoneLastFour(value)
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleQuery()
                    }
                  }}
                />
              </div>
              <Button
                onClick={handleQuery}
                disabled={loading}
                className="w-full"
                size="lg"
              >
                {loading ? "查询中..." : "查询"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {result ? "查询结果" : "提示"}
            </DialogTitle>
            <DialogDescription>
              {result
                ? "您的席位信息如下："
                : error || "查询失败"}
            </DialogDescription>
          </DialogHeader>
          {result ? (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium">会场：</span>
                  <span>{result.venue}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">席位：</span>
                  <span>{result.seat}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">QQ群号：</span>
                  <span className="text-blue-600">{result.qqGroup}</span>
                </div>
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  )
}

