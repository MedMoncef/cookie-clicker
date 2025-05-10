"use client"

import { useGameState } from "../lib/gameContext"
import { motion } from "framer-motion"

// Function to get an appropriate icon for each building type
const getBuildingIcon = (buildingId: string): string => {
  switch (buildingId) {
    case "cursor":
      return "👆"
    case "grandma":
      return "👵"
    case "farm":
      return "🚜"
    case "mine":
      return "⛏️"
    case "factory":
      return "🏭"
    case "bank":
      return "🏦"
    case "temple":
      return "🏛️"
    case "wizard_tower":
      return "🧙‍♂️"
    case "shipment":
      return "🚀"
    case "alchemy_lab":
      return "🧪"
    default:
      return "🍪"
  }
}

interface BuildingsPanelProps {
  darkMode: boolean
}

export default function BuildingsPanel({ darkMode }: BuildingsPanelProps) {
  const { cookies, buildings, cookiesPerSecond, buyBuilding, calculateBuildingCost } = useGameState()

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div
          className={`py-1.5 px-4 rounded-full text-sm font-medium shadow-sm flex items-center gap-1.5 ${
            darkMode ? "bg-gray-700 text-amber-400" : "bg-amber-200 text-amber-800"
          }`}
        >
          <span className="animate-pulse inline-block">⏱️</span>
          {cookiesPerSecond.toFixed(1)} cookies per second
        </div>
      </div>

      <div className="space-y-3 max-h-[45vh] overflow-y-auto pr-1 custom-scrollbar">
        {buildings.map((building, index) => {
          const cost = calculateBuildingCost(building)
          const canAfford = cookies >= cost
          const buildingIcon = getBuildingIcon(building.id)

          return (
            <motion.button
              key={building.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`w-full text-left rounded-lg flex items-center border transition-all ${
                canAfford
                  ? darkMode
                    ? "bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 border-gray-600 shadow-sm relative overflow-hidden"
                    : "bg-gradient-to-r from-amber-100 to-amber-50 hover:to-amber-200 border-amber-300 shadow-sm relative overflow-hidden"
                  : darkMode
                    ? "bg-gray-800 text-gray-500 border-gray-700 cursor-not-allowed"
                    : "bg-gray-100 bg-opacity-60 text-gray-500 border-gray-200 cursor-not-allowed"
              }`}
              onClick={() => canAfford && buyBuilding(building.id)}
              disabled={!canAfford}
            >
              {canAfford && <div className="absolute inset-0 shine-effect"></div>}
              <div
                className={`p-3 m-2 rounded-lg z-10 ${
                  canAfford
                    ? darkMode
                      ? "bg-amber-600 text-gray-900"
                      : "bg-amber-300 text-amber-800"
                    : darkMode
                      ? "bg-gray-700 text-gray-500"
                      : "bg-gray-200 text-gray-600"
                }`}
              >
                <div className="text-xl">{buildingIcon}</div>
              </div>

              <div className="flex-1 py-2 z-10">
                <div className="flex justify-between">
                  <span className={`font-bold ${darkMode ? "text-gray-200" : "text-amber-900"}`}>{building.name}</span>
                  <span
                    className={`font-mono font-bold px-2 py-0.5 rounded ${
                      building.owned > 0
                        ? darkMode
                          ? "bg-amber-600 text-gray-900"
                          : "bg-amber-300 text-amber-900"
                        : darkMode
                          ? "bg-gray-700 text-gray-500"
                          : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {building.owned}
                  </span>
                </div>
                <div className={`text-xs ${darkMode ? "text-gray-400" : "text-amber-700"}`}>{building.description}</div>
                <div className={`text-xs mt-1 ${darkMode ? "text-gray-500" : "text-amber-600"}`}>
                  {building.cookiesPerSecond} cookies/sec each
                  {building.owned > 0 && ` • ${(building.owned * building.cookiesPerSecond).toFixed(1)} total`}
                </div>
              </div>

              <div className="ml-2 mr-3 text-right whitespace-nowrap z-10">
                <div
                  className={`font-bold ${
                    canAfford ? (darkMode ? "text-amber-400" : "text-amber-700") : "text-gray-500"
                  }`}
                >
                  {cost.toLocaleString()}
                </div>
                <div className={`text-xs ${darkMode ? "text-gray-400" : "text-amber-600"}`}>cookies</div>
              </div>
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}