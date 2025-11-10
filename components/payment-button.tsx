"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

export function PaymentButton({ registrationId }: { registrationId: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handlePayment = async () => {
    if (!confirm("确认支付？这将更新您的缴费状态。")) {
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`/api/registrations/${registrationId}/payment`, {
        method: "POST",
      })

      if (response.ok) {
        router.refresh()
        alert("缴费成功")
      } else {
        const data = await response.json()
        alert(data.error || "缴费失败")
      }
    } catch (error) {
      alert("缴费失败，请稍后重试")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button onClick={handlePayment} disabled={loading}>
      {loading ? "处理中..." : "立即缴费"}
    </Button>
  )
}

