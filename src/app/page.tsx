"use client"

import { GameProvider } from "../lib/gameContext"
import { useEffect, useState } from "react"
import { MoonIcon, SunIcon } from "lucide-react"
import StatsPanel from "@/components/statsPanel"
import CookieButton from "@/components/cookieButton"
import UpgradeShop from "@/components/upgradeShop"
import BuildingsPanel from "@/components/buildingsPanel"

export default function Home() {
  const [mounted, setMounted] = useState(false)
  const [darkMode, setDarkMode] = useState(false)

  // Only render the game after client-side hydration
  useEffect(() => {
    setMounted(true)
    // Check user preference for dark mode
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
    setDarkMode(prefersDark)
  }, [])

  // Add CSS for animations to the document head
  useEffect(() => {
    const style = document.createElement("style")
    style.innerHTML = `
      @keyframes float-up {
        0% {
          opacity: 1;
          transform: translateY(0);
        }
        100% {
          opacity: 0;
          transform: translateY(-40px);
        }
      }
      .animate-float {
        animation: float-up 1s forwards;
      }
      @keyframes shine {
        0% { background-position: -100% 0; }
        100% { background-position: 200% 0; }
      }
      .shine-effect {
        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
        background-size: 200% 100%;
        animation: shine 2s infinite;
      }
      @keyframes pulse-glow {
        0%, 100% { box-shadow: 0 0 15px rgba(251, 191, 36, 0.4); }
        50% { box-shadow: 0 0 30px rgba(251, 191, 36, 0.7); }
      }
      .pulse-glow {
        animation: pulse-glow 2s infinite;
      }
      @keyframes bounce-subtle {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-5px); }
      }
      .bounce-subtle {
        animation: bounce-subtle 2s infinite;
      }
    `
    document.head.appendChild(style)
    return () => {
      document.head.removeChild(style)
    }
  }, [])

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
  }

  if (!mounted) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  return (
    <GameProvider>
      <main
        className={`min-h-screen transition-colors duration-300 ${
          darkMode
            ? "bg-gradient-to-b from-gray-900 to-gray-800 text-gray-100"
            : "bg-gradient-to-b from-amber-50 to-amber-100 text-gray-800"
        }`}
      >
        <div className="container mx-auto p-4">
          <div className="flex justify-between items-center py-4">
            <h1
              className={`text-4xl font-extrabold tracking-tight mb-2 ${
                darkMode ? "text-amber-400" : "text-amber-900"
              }`}
            >
              Cookie Clicker
            </h1>
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-full ${
                darkMode
                  ? "bg-gray-700 text-amber-400 hover:bg-gray-600"
                  : "bg-amber-200 text-amber-900 hover:bg-amber-300"
              } transition-colors`}
              aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {darkMode ? <SunIcon size={20} /> : <MoonIcon size={20} />}
            </button>
          </div>

          {/* Stats Panel at the top */}
          <div
            className={`rounded-xl shadow-lg p-5 mb-8 max-w-4xl mx-auto transition-colors ${
              darkMode ? "bg-gray-800 border border-gray-700" : "bg-white bg-opacity-90 border border-amber-100"
            }`}
          >
            <StatsPanel darkMode={darkMode} />
          </div>

          <div className="flex flex-col lg:flex-row gap-6 max-w-6xl mx-auto">
            {/* Left column for cookie */}
            <div className="lg:w-1/2 flex flex-col items-center justify-center py-4">
              <CookieButton darkMode={darkMode} />
            </div>

            {/* Right column for upgrades and buildings */}
            <div className="lg:w-1/2 space-y-6">
              <div
                className={`rounded-xl shadow-lg p-5 transition-colors ${
                  darkMode ? "bg-gray-800 border border-gray-700" : "bg-white bg-opacity-90 border border-amber-100"
                }`}
              >
                <h2
                  className={`text-xl font-bold mb-4 border-b pb-2 flex items-center ${
                    darkMode ? "text-amber-400 border-gray-700" : "text-amber-800 border-amber-200"
                  }`}
                >
                  <span className="mr-2">⚡</span>
                  Upgrades
                </h2>
                <UpgradeShop darkMode={darkMode} />
              </div>

              <div
                className={`rounded-xl shadow-lg p-5 transition-colors ${
                  darkMode ? "bg-gray-800 border border-gray-700" : "bg-white bg-opacity-90 border border-amber-100"
                }`}
              >
                <h2
                  className={`text-xl font-bold mb-4 border-b pb-2 flex items-center ${
                    darkMode ? "text-amber-400 border-gray-700" : "text-amber-800 border-amber-200"
                  }`}
                >
                  <span className="mr-2">🏢</span>
                  Buildings
                </h2>
                <BuildingsPanel darkMode={darkMode} />
              </div>
            </div>
          </div>

          <footer className={`mt-12 text-center text-sm py-4 ${darkMode ? "text-gray-400" : "text-amber-700"}`}>
            <p>Made with 🍪 • {new Date().getFullYear()}</p>
          </footer>
        </div>
      </main>
    </GameProvider>
  )
}