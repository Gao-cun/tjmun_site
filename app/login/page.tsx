"use client"

<<<<<<< HEAD
import { useState, useEffect, Suspense } from "react"
=======
import { useState, useEffect } from "react"
>>>>>>> 5edc018894a634715c39e6a190c13ee7937c8999
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

<<<<<<< HEAD
function LoginForm() {
=======
export default function LoginPage() {
>>>>>>> 5edc018894a634715c39e6a190c13ee7937c8999
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  useEffect(() => {
    // 检查是否有注册成功的提示
    const registered = searchParams.get("registered")
    const message = searchParams.get("message")
    
    if (registered === "true") {
      setError(message || "注册成功！请使用您的账号登录。")
    }
    
    // 检查是否有 NextAuth 错误
    const errorParam = searchParams.get("error")
    if (errorParam) {
      if (errorParam === "CredentialsSignin") {
        setError("邮箱或密码错误，请重试")
      } else {
        setError("登录失败，请稍后重试")
      }
    }
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      })

      if (result?.error) {
        setError("邮箱或密码错误，请重试")
      } else if (result?.ok) {
        router.push("/dashboard")
        router.refresh()
      }
    } catch (error) {
      console.error("登录错误:", error)
      setError("登录失败，请稍后重试")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto flex min-h-screen items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">登录</CardTitle>
          <CardDescription>
            使用您的账号登录同济大学模联系统
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className={`rounded-md p-3 text-sm ${
                error.includes("成功") 
                  ? "bg-green-50 text-green-700" 
                  : "bg-destructive/15 text-destructive"
              }`}>
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">邮箱</Label>
              <Input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="example@example.com"
                autoComplete="email"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">密码</Label>
              <Input
                id="password"
                type="password"
                required
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                placeholder="请输入密码"
                autoComplete="current-password"
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "登录中..." : "登录"}
            </Button>
          </form>

          <div className="mt-4 text-center text-sm">
            <span className="text-gray-600">还没有账号？</span>{" "}
            <Link href="/register" className="text-primary hover:underline">
              立即注册
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

<<<<<<< HEAD
export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto flex min-h-screen items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl">登录</CardTitle>
            <CardDescription>
              使用您的账号登录同济大学模联系统
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">加载中...</div>
          </CardContent>
        </Card>
      </div>
    }>
      <LoginForm />
    </Suspense>
  )
}

=======
>>>>>>> 5edc018894a634715c39e6a190c13ee7937c8999
