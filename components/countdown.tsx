"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { useLanguage } from "./language-provider"
import { getTranslation } from "@/lib/translations"

interface CountdownProps {
  targetDate: Date | null
}

export function Countdown({ targetDate }: CountdownProps) {
  const { language } = useLanguage()
  const [timeLeft, setTimeLeft] = useState<{
    days: number
    hours: number
    minutes: number
    seconds: number
  } | null>(null)

  useEffect(() => {
    if (!targetDate) {
      setTimeLeft(null)
      return
    }

    const updateCountdown = () => {
      const now = new Date().getTime()
      const target = new Date(targetDate).getTime()
      const difference = target - now

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
        return
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24))
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((difference % (1000 * 60)) / 1000)

      setTimeLeft({ days, hours, minutes, seconds })
    }

    updateCountdown()
    const interval = setInterval(updateCountdown, 1000)

    return () => clearInterval(interval)
  }, [targetDate])

  if (!targetDate || !timeLeft) {
    return null
  }

  return (
    <Card className="mb-8 border-2 border-blue-500 bg-gradient-to-r from-blue-50 to-indigo-50">
      <CardContent className="py-6">
        <div className="text-center">
          <h2 className="mb-4 text-xl font-bold text-gray-900">
            {getTranslation(language, "countdownTitle")}
          </h2>
          <div className="flex justify-center gap-4">
            <div className="flex flex-col items-center">
              <div className="text-4xl font-bold text-blue-600">{timeLeft.days}</div>
              <div className="text-sm text-gray-600">{getTranslation(language, "days")}</div>
            </div>
            <div className="text-4xl font-bold text-gray-400">:</div>
            <div className="flex flex-col items-center">
              <div className="text-4xl font-bold text-blue-600">{String(timeLeft.hours).padStart(2, "0")}</div>
              <div className="text-sm text-gray-600">{getTranslation(language, "hours")}</div>
            </div>
            <div className="text-4xl font-bold text-gray-400">:</div>
            <div className="flex flex-col items-center">
              <div className="text-4xl font-bold text-blue-600">{String(timeLeft.minutes).padStart(2, "0")}</div>
              <div className="text-sm text-gray-600">{getTranslation(language, "minutes")}</div>
            </div>
            <div className="text-4xl font-bold text-gray-400">:</div>
            <div className="flex flex-col items-center">
              <div className="text-4xl font-bold text-blue-600">{String(timeLeft.seconds).padStart(2, "0")}</div>
              <div className="text-sm text-gray-600">{getTranslation(language, "seconds")}</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

