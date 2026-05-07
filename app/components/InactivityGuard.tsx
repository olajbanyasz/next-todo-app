"use client"

import { useEffect, useRef, useCallback } from "react"
import { signOut } from "next-auth/react"

const INACTIVITY_TIMEOUT_MS = 15 * 60 * 1000
const HEARTBEAT_INTERVAL_MS = 60 * 1000 // Send heartbeat every 60 seconds

export default function InactivityGuard() {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const heartbeatRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const sendHeartbeat = useCallback(() => {
    fetch("/api/heartbeat", { method: "POST" }).catch(() => {
      // Silently ignore heartbeat failures
    })
  }, [])

  const resetTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
    }
    timerRef.current = setTimeout(() => {
      signOut({ redirectTo: "/login" })
    }, INACTIVITY_TIMEOUT_MS)
  }, [])

  useEffect(() => {
    const events: (keyof WindowEventMap)[] = [
      "mousemove",
      "mousedown",
      "keydown",
      "touchstart",
      "scroll",
      "click",
    ]

    resetTimer()

    // Send initial heartbeat and start periodic heartbeats
    sendHeartbeat()
    heartbeatRef.current = setInterval(sendHeartbeat, HEARTBEAT_INTERVAL_MS)

    const handleActivity = () => resetTimer()
    events.forEach((event) => window.addEventListener(event, handleActivity, { passive: true }))

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
      if (heartbeatRef.current) {
        clearInterval(heartbeatRef.current)
      }
      events.forEach((event) => window.removeEventListener(event, handleActivity))
    }
  }, [resetTimer, sendHeartbeat])

  return null
}
