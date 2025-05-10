"use client"

import { useGameState } from "../lib/gameContext"
import { motion } from "framer-motion"

interface UpgradeShopProps {
  darkMode: boolean
}

export default function UpgradeShop({ darkMode }: UpgradeShopProps) {
  const { cookies, upgrades, buyUpgrade } = useGameState()

  // Filter for available upgrades (not purchased)
  const availableUpgrades = upgrades.filter((upgrade) => !upgrade.purchased)

  return (
    <div>
      {availableUpgrades.length === 0 ? (
        <motion.div
          className="text-center py-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <motion.div
            className={`text-4xl mb-3 ${darkMode ? "text-amber-500" : "text-amber-600"}`}
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
          >
            🎁
          </motion.div>
          <p className={`italic ${darkMode ? "text-gray-400" : "text-amber-700"}`}>All upgrades purchased!</p>
        </motion.div>
      ) : (
        <div className="space-y-3 max-h-[45vh] overflow-y-auto pr-1 custom-scrollbar">
          {availableUpgrades.map((upgrade, index) => {
            const canAfford = cookies >= upgrade.cost

            return (
              <motion.button
                key={upgrade.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`w-full text-left p-3 rounded-lg flex items-center border transition-all ${
                  canAfford
                    ? darkMode
                      ? "bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 border-gray-600 shadow-sm relative overflow-hidden"
                      : "bg-gradient-to-r from-amber-100 to-amber-50 hover:to-amber-200 border-amber-300 shadow-sm relative overflow-hidden"
                    : darkMode
                      ? "bg-gray-800 text-gray-500 border-gray-700 cursor-not-allowed"
                      : "bg-gray-100 bg-opacity-60 text-gray-500 border-gray-200 cursor-not-allowed"
                }`}
                onClick={() => canAfford && buyUpgrade(upgrade.id)}
                disabled={!canAfford}
              >
                {canAfford && <div className="absolute inset-0 shine-effect"></div>}
                <div
                  className={`mr-4 p-2 rounded-full ${
                    canAfford
                      ? darkMode
                        ? "bg-amber-600 text-gray-900"
                        : "bg-amber-300 text-amber-800"
                      : darkMode
                        ? "bg-gray-700 text-gray-500"
                        : "bg-gray-200 text-gray-500"
                  }`}
                >
                  <div className="text-xl">⚡</div>
                </div>
                <div className="flex-1 z-10">
                  <div className={`font-bold ${darkMode ? "text-gray-200" : "text-amber-900"}`}>{upgrade.name}</div>
                  <div className={`text-xs ${darkMode ? "text-gray-400" : "text-amber-700"}`}>
                    {upgrade.description}
                  </div>
                </div>
                <div
                  className={`text-right z-10 ${
                    canAfford ? (darkMode ? "text-amber-400" : "text-amber-700") : "text-gray-500"
                  }`}
                >
                  <div className="font-bold">{upgrade.cost.toLocaleString()}</div>
                  <div className={`text-xs ${darkMode ? "text-gray-400" : "text-amber-600"}`}>cookies</div>
                </div>
              </motion.button>
            )
          })}
        </div>
      )}
    </div>
  )
}