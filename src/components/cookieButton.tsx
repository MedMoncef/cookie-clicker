"use client"

import type React from "react"

import Image from "next/image"
import { useGameState } from "../lib/gameContext"
import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface CookieButtonProps {
  darkMode: boolean
}

export default function CookieButton({ darkMode }: CookieButtonProps) {
  const { cookies, cookiesPerClick, clickCookie } = useGameState()
  const [clickAnimation, setClickAnimation] = useState(false)
  const [floatingTexts, setFloatingTexts] = useState<{ id: number; x: number; y: number }[]>([])
  const [nextId, setNextId] = useState(0)
  const [cookieRotation, setCookieRotation] = useState(0)

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    clickCookie()
    setClickAnimation(true)

    // Create floating text showing cookies gained
    const rect = (e.target as HTMLElement).getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    setFloatingTexts((prev) => [...prev, { id: nextId, x, y }])
    setNextId((prev) => prev + 1)

    // Random rotation for cookie
    setCookieRotation(Math.random() * 10 - 5)
  }

  // Remove floating text after animation completes
  useEffect(() => {
    if (floatingTexts.length > 0) {
      const timer = setTimeout(() => {
        setFloatingTexts((prev) => prev.slice(1))
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [floatingTexts])

  // Reset click animation
  useEffect(() => {
    if (clickAnimation) {
      const timer = setTimeout(() => {
        setClickAnimation(false)
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [clickAnimation])

  return (
    <div className="flex flex-col items-center w-full">
      <motion.div
        className={`text-4xl font-extrabold mb-6 ${darkMode ? "text-amber-400" : "text-amber-700"}`}
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <span className={`font-mono ${darkMode ? "text-amber-300" : "text-amber-600"}`}>
          {cookies.toLocaleString()}
        </span>{" "}
        cookies
      </motion.div>

      <div className="relative mb-8">
        <div
          className={`absolute inset-0 rounded-full blur-md animate-pulse ${
            darkMode ? "bg-amber-700 opacity-30" : "bg-amber-200 opacity-50"
          }`}
        ></div>

        <motion.button
          className={`w-64 h-64 rounded-full transition-all duration-200 ${
            darkMode ? "shadow-[0_0_30px_rgba(217,119,6,0.3)]" : "shadow-lg"
          } ${clickAnimation ? "scale-95" : "scale-100 hover:scale-105"} pulse-glow`}
          onClick={handleClick}
          aria-label="Click the cookie"
          whileHover={{ rotate: 5 }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.div
            className="relative w-full h-full"
            animate={{ rotate: cookieRotation }}
            transition={{ type: "spring", stiffness: 300, damping: 10 }}
          >
            <Image
              src="/images/cookie.png"
              alt="Cookie"
              className="w-full h-full object-contain drop-shadow-lg transition-all"
              width={200}
              height={200}
              priority
              onError={(e) => {
                // Fallback if image doesn't exist yet
                ;(e.target as HTMLImageElement).src = "https://via.placeholder.com/200?text=Cookie"
              }}
            />
            <div
              className={`absolute inset-0 bg-white opacity-0 rounded-full ${clickAnimation ? "opacity-10" : ""}`}
            ></div>
          </motion.div>
        </motion.button>

        {/* Floating text animations */}
        <AnimatePresence>
          {floatingTexts.map((text) => (
            <motion.div
              key={text.id}
              className={`absolute pointer-events-none font-extrabold text-2xl`}
              style={{
                left: `${text.x}px`,
                top: `${text.y}px`,
                textShadow: "0 1px 3px rgba(0,0,0,0.2)",
              }}
              initial={{ opacity: 1, y: 0 }}
              animate={{ opacity: 0, y: -40 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
            >
              <span className={darkMode ? "text-amber-400" : "text-amber-600"}>+{cookiesPerClick}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <motion.div
        className={`mt-2 text-lg font-semibold py-2 px-4 rounded-full shadow-md ${
          darkMode ? "bg-gray-700 text-amber-400" : "bg-amber-200 text-amber-800"
        }`}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {cookiesPerClick} cookies per click
      </motion.div>
    </div>
  )
}