"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface RegistrationActionsProps {
  registrationId: string
  currentStatus: string
  paymentStatus: string
  conferenceFee: number
  academicTestUrl?: string | null
}

export function RegistrationActions({
  registrationId,
  currentStatus,
  paymentStatus,
  conferenceFee,
  academicTestUrl,
}: RegistrationActionsProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const updateStatus = async (status: string) => {
    setLoading(true)
    setError("")
    try {
      const response = await fetch(`/api/admin/registrations/${registrationId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      })

      const data = await response.json()

      if (response.ok) {
        router.refresh()
      } else {
        setError(data.error || "操作失败")
        setTimeout(() => setError(""), 3000)
      }
    } catch (error) {
      console.error("更新状态错误:", error)
      setError("操作失败，请稍后重试")
      setTimeout(() => setError(""), 3000)
    } finally {
      setLoading(false)
    }
  }

  const updatePayment = async (status: string) => {
    setLoading(true)
    setError("")
    try {
      const response = await fetch(`/api/admin/registrations/${registrationId}/payment`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      })

      const data = await response.json()

      if (response.ok) {
        router.refresh()
      } else {
        setError(data.error || "操作失败")
        setTimeout(() => setError(""), 3000)
      }
    } catch (error) {
      console.error("更新支付状态错误:", error)
      setError("操作失败，请稍后重试")
      setTimeout(() => setError(""), 3000)
    } finally {
      setLoading(false)
    }
  }

  const updateTestScore = async (score: number) => {
    setLoading(true)
    setError("")
    try {
      const response = await fetch(`/api/admin/registrations/${registrationId}/test-score`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ score }),
      })

      const data = await response.json()

      if (response.ok) {
        router.refresh()
      } else {
        setError(data.error || "操作失败")
        setTimeout(() => setError(""), 3000)
      }
    } catch (error) {
      console.error("更新测试成绩错误:", error)
      setError("操作失败，请稍后重试")
      setTimeout(() => setError(""), 3000)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-2">
      {error && (
        <div className="rounded-md bg-destructive/15 p-2 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="flex gap-2 flex-wrap">
        {/* 审核状态操作 */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" disabled={loading}>
              审核状态
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem
              onClick={() => updateStatus("APPROVED")}
              disabled={currentStatus === "APPROVED" || loading}
            >
              通过
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => updateStatus("REJECTED")}
              disabled={currentStatus === "REJECTED" || loading}
            >
              拒绝
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => updateStatus("WAITLISTED")}
              disabled={currentStatus === "WAITLISTED" || loading}
            >
              候补
            </DropdownMenuItem>
            {currentStatus !== "PENDING" && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => updateStatus("PENDING")}
                  disabled={loading}
                >
                  重置为待审核
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* 支付状态操作 */}
        {conferenceFee > 0 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" disabled={loading}>
                支付状态
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem
                onClick={() => updatePayment("PAID")}
                disabled={paymentStatus === "PAID" || loading}
              >
                标记为已支付
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => updatePayment("UNPAID")}
                disabled={paymentStatus === "UNPAID" || loading}
              >
                标记为未支付
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => updatePayment("REFUNDED")}
                disabled={paymentStatus === "REFUNDED" || loading}
              >
                标记为已退款
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        {/* 测试成绩输入 */}
        {academicTestUrl && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const score = prompt("请输入测试成绩（0-100）：")
              if (score !== null) {
                const numScore = parseInt(score, 10)
                if (!isNaN(numScore) && numScore >= 0 && numScore <= 100) {
                  updateTestScore(numScore)
                } else {
                  alert("请输入0-100之间的数字")
                }
              }
            }}
            disabled={loading}
          >
            录入成绩
          </Button>
        )}

        {/* 查看测试文件 */}
        {academicTestUrl && (
          <Button
            variant="outline"
            size="sm"
            asChild
          >
            <a href={academicTestUrl} target="_blank" rel="noopener noreferrer">
              查看测试
            </a>
          </Button>
        )}
      </div>
    </div>
  )
}

