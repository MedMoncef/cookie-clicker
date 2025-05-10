"use client"

import { useGameState } from "../lib/gameContext"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"

interface StatsPanelProps {
  darkMode: boolean
}

export default function StatsPanel({ darkMode }: StatsPanelProps) {
  const { cookies, cookiesPerClick, cookiesPerSecond, totalCookiesBaked } = useGameState()
  const [timeElapsed, setTimeElapsed] = useState(0)

  // Update time elapsed
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeElapsed((prev) => prev + 1)
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  // Format time as HH:MM:SS
  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    return [
      hours.toString().padStart(2, "0"),
      minutes.toString().padStart(2, "0"),
      secs.toString().padStart(2, "0"),
    ].join(":")
  }

  // Calculate cookies per minute
  const cookiesPerMinute = cookiesPerSecond * 60

  // Calculate time to next purchase (of most expensive affordable building)
  const timeToNextPurchase = () => {
    if (cookiesPerSecond <= 0) return "Never"

    const cookiesNeeded = 100
    const seconds = cookiesNeeded / cookiesPerSecond

    if (seconds < 60) {
      return `${seconds.toFixed(1)} seconds`
    } else if (seconds < 3600) {
      return `${(seconds / 60).toFixed(1)} minutes`
    } else {
      return `${(seconds / 3600).toFixed(1)} hours`
    }
  }

  return (
    <div className="flex flex-col md:flex-row">
      {/* Current cookies counter */}
      <div className="md:w-1/4 text-center p-3 flex flex-col justify-center">
        <div className={`text-sm font-medium mb-1 ${darkMode ? "text-gray-300" : "text-amber-800"}`}>
          Current Cookies
        </div>
        <motion.div
          className={`font-bold text-2xl ${darkMode ? "text-amber-400" : "text-amber-600"}`}
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
        >
          {cookies.toLocaleString()}
        </motion.div>
      </div>

      <div className="md:w-3/4 grid grid-cols-2 md:grid-cols-4 gap-3">
        <motion.div
          className={`p-3 rounded-lg border flex flex-col items-center justify-center ${
            darkMode ? "bg-gray-700 border-gray-600" : "bg-amber-50 border-amber-200"
          }`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className={`text-xs uppercase tracking-wider mb-1 ${darkMode ? "text-gray-400" : "text-amber-800"}`}>
            Time played
          </div>
          <div className={`font-mono text-lg font-bold ${darkMode ? "text-gray-200" : "text-gray-800"}`}>
            {formatTime(timeElapsed)}
          </div>
        </motion.div>

        <motion.div
          className={`p-3 rounded-lg border flex flex-col items-center justify-center ${
            darkMode ? "bg-gray-700 border-gray-600" : "bg-amber-50 border-amber-200"
          }`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className={`text-xs uppercase tracking-wider mb-1 ${darkMode ? "text-gray-400" : "text-amber-800"}`}>
            Total baked
          </div>
          <div className={`font-mono text-lg font-bold ${darkMode ? "text-gray-200" : "text-gray-800"}`}>
            {totalCookiesBaked.toLocaleString()}
          </div>
        </motion.div>

        <motion.div
          className={`p-3 rounded-lg border flex flex-col items-center justify-center ${
            darkMode
              ? "bg-gradient-to-br from-gray-700 to-gray-800 border-gray-600"
              : "bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200"
          }`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className={`text-xs uppercase tracking-wider mb-1 ${darkMode ? "text-gray-400" : "text-amber-800"}`}>
            Per click
          </div>
          <div
            className={`font-mono text-lg font-bold flex items-center ${
              darkMode ? "text-amber-400" : "text-amber-600"
            }`}
          >
            <span className="mr-1">🖱️</span>
            {cookiesPerClick.toFixed(1)}
          </div>
        </motion.div>

        <motion.div
          className={`p-3 rounded-lg border flex flex-col items-center justify-center ${
            darkMode
              ? "bg-gradient-to-br from-gray-700 to-gray-800 border-gray-600"
              : "bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200"
          }`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className={`text-xs uppercase tracking-wider mb-1 ${darkMode ? "text-gray-400" : "text-amber-800"}`}>
            Per second
          </div>
          <div
            className={`font-mono text-lg font-bold flex items-center ${
              darkMode ? "text-amber-400" : "text-amber-600"
            }`}
          >
            <span className="mr-1">⏱️</span>
            {cookiesPerSecond.toFixed(1)}
          </div>
        </motion.div>
      </div>
    </div>
  )
}