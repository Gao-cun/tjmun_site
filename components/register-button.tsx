"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

export function RegisterButton({ conferenceId }: { conferenceId: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleRegister = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/registrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conferenceId }),
      })

      const data = await response.json()
      console.log("报名响应:", { status: response.status, ok: response.ok, data })

      if (response.ok) {
        router.push("/dashboard")
        router.refresh()
      } else {
        console.error("报名失败:", data)
        alert(data.error || "报名失败，请稍后重试")
      }
    } catch (error) {
      console.error("报名错误:", error)
      alert("报名失败，请稍后重试")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button onClick={handleRegister} disabled={loading} size="lg" className="w-full">
      {loading ? "报名中..." : "立即报名"}
    </Button>
  )
}

