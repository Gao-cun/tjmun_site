"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function RegisterPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    school: "同济大学",
    major: "",
    phone: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // 验证密码匹配
    if (formData.password !== formData.confirmPassword) {
      setError("两次输入的密码不一致")
      return
    }

    // 验证密码长度
    if (formData.password.length < 6) {
      setError("密码至少需要6个字符")
      return
    }

    setLoading(true)

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          name: formData.name,
          school: formData.school,
          major: formData.major,
          phone: formData.phone,
        }),
      })

      const data = await response.json()
      console.log("注册响应:", { status: response.status, ok: response.ok, data })

      if (response.ok) {
        console.log("注册成功，准备自动登录")
        // 注册成功后，等待一小段时间确保数据库同步
        await new Promise(resolve => setTimeout(resolve, 1000))

        // 尝试自动登录
        try {
          console.log("尝试自动登录...")
          const signInResult = await signIn("credentials", {
            email: formData.email,
            password: formData.password,
            redirect: false,
          })

          console.log("登录结果:", signInResult)

          if (signInResult?.ok) {
            console.log("自动登录成功，跳转到dashboard")
            router.push("/dashboard")
            router.refresh()
          } else {
            // 登录失败，跳转到登录页面（可能是数据库同步延迟）
            console.log("自动登录失败，跳转到登录页")
            router.push("/login?registered=true&message=注册成功，请登录")
          }
        } catch (signInError) {
          // 登录出错，跳转到登录页面
          console.error("自动登录出错:", signInError)
          router.push("/login?registered=true&message=注册成功，请登录")
        }
      } else {
        console.error("注册失败:", data)
        setError(data.error || data.details || "注册失败，请稍后重试")
      }
    } catch (error) {
      console.error("注册错误:", error)
      setError("注册失败，请稍后重试")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto flex min-h-screen items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">注册账号</CardTitle>
          <CardDescription>
            创建您的账号以开始使用同济大学模联系统
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="name">姓名 *</Label>
              <Input
                id="name"
                type="text"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="请输入您的姓名"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">邮箱 *</Label>
              <Input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="example@example.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">密码 *</Label>
              <Input
                id="password"
                type="password"
                required
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                placeholder="至少6个字符"
                minLength={6}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">确认密码 *</Label>
              <Input
                id="confirmPassword"
                type="password"
                required
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({ ...formData, confirmPassword: e.target.value })
                }
                placeholder="请再次输入密码"
                minLength={6}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="school">学校</Label>
              <Input
                id="school"
                type="text"
                value={formData.school}
                onChange={(e) =>
                  setFormData({ ...formData, school: e.target.value })
                }
                placeholder="同济大学"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="major">专业</Label>
              <Input
                id="major"
                type="text"
                value={formData.major}
                onChange={(e) =>
                  setFormData({ ...formData, major: e.target.value })
                }
                placeholder="请输入您的专业"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">手机号</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                placeholder="请输入手机号"
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "注册中..." : "注册"}
            </Button>
          </form>

          <div className="mt-4 text-center text-sm">
            <span className="text-gray-600">已有账号？</span>{" "}
            <Link href="/login" className="text-primary hover:underline">
              立即登录
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

