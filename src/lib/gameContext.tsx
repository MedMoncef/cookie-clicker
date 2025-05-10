"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

// Define the game state types
interface Upgrade {
  id: string
  name: string
  description: string
  cost: number
  multiplier: number
  purchased: boolean
}

interface Building {
  id: string
  name: string
  description: string
  baseCost: number
  cookiesPerSecond: number
  owned: number
}

interface GameState {
  cookies: number
  cookiesPerClick: number
  cookiesPerSecond: number
  totalCookiesBaked: number
  upgrades: Upgrade[]
  buildings: Building[]
  lastSaved: number
  addCookies: (amount: number) => void
  clickCookie: () => void
  buyUpgrade: (id: string) => void
  buyBuilding: (id: string) => void
  calculateBuildingCost: (building: Building) => number
}

// Create the initial game state
const initialUpgrades: Upgrade[] = [
  {
    id: "cursor1",
    name: "Reinforced Index Finger",
    description: "Doubles the cookies per click",
    cost: 100,
    multiplier: 2,
    purchased: false,
  },
  {
    id: "cursor2",
    name: "Carpal Tunnel Prevention Cream",
    description: "Doubles the cookies per click again",
    cost: 500,
    multiplier: 2,
    purchased: false,
  },
  {
    id: "cursor3",
    name: "Ambidextrous Clicking",
    description: "Doubles the cookies per click again",
    cost: 2000,
    multiplier: 2,
    purchased: false,
  },
]

const initialBuildings: Building[] = [
  {
    id: "cursor",
    name: "Cursor",
    description: "Automatically clicks the cookie once every 10 seconds",
    baseCost: 15,
    cookiesPerSecond: 0.1,
    owned: 0,
  },
  {
    id: "grandma",
    name: "Grandma",
    description: "A nice grandma to bake more cookies",
    baseCost: 100,
    cookiesPerSecond: 1,
    owned: 0,
  },
  {
    id: "farm",
    name: "Farm",
    description: "Grows cookie plants from cookie seeds",
    baseCost: 1100,
    cookiesPerSecond: 8,
    owned: 0,
  },
  {
    id: "mine",
    name: "Mine",
    description: "Mines out cookie dough and chocolate chips",
    baseCost: 12000,
    cookiesPerSecond: 47,
    owned: 0,
  },
]

const initialState: GameState = {
  cookies: 0,
  cookiesPerClick: 1,
  cookiesPerSecond: 0,
  totalCookiesBaked: 0,
  upgrades: initialUpgrades,
  buildings: initialBuildings,
  lastSaved: Date.now(),
  addCookies: () => {},
  clickCookie: () => {},
  buyUpgrade: () => {},
  buyBuilding: () => {},
  calculateBuildingCost: () => 0,
}

// Create the context
const GameContext = createContext<GameState>(initialState)

// Create a hook for using the context
export const useGameState = () => useContext(GameContext)

// Create a provider component
export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [gameState, setGameState] =
    useState<Omit<GameState, "addCookies" | "clickCookie" | "buyUpgrade" | "buyBuilding" | "calculateBuildingCost">>(
      initialState,
    )

  // Calculate building cost based on the number owned
  const calculateBuildingCost = (building: Building): number => {
    return Math.floor(building.baseCost * Math.pow(1.15, building.owned))
  }

  // Add cookies to the total
  const addCookies = (amount: number) => {
    setGameState((prev) => ({
      ...prev,
      cookies: prev.cookies + amount,
      totalCookiesBaked: prev.totalCookiesBaked + amount,
    }))
  }

  // Handle cookie click
  const clickCookie = () => {
    addCookies(gameState.cookiesPerClick)
  }

  // Buy an upgrade
  const buyUpgrade = (id: string) => {
    const upgrade = gameState.upgrades.find((u) => u.id === id)
    if (!upgrade || upgrade.purchased || gameState.cookies < upgrade.cost) return

    setGameState((prev) => {
      // Calculate new cookiesPerClick
      const newCookiesPerClick = prev.cookiesPerClick * upgrade.multiplier

      // Mark the upgrade as purchased
      const updatedUpgrades = prev.upgrades.map((u) => (u.id === id ? { ...u, purchased: true } : u))

      return {
        ...prev,
        cookies: prev.cookies - upgrade.cost,
        cookiesPerClick: newCookiesPerClick,
        upgrades: updatedUpgrades,
      }
    })
  }

  // Buy a building
  const buyBuilding = (id: string) => {
    const building = gameState.buildings.find((b) => b.id === id)
    if (!building) return

    const cost = calculateBuildingCost(building)
    if (gameState.cookies < cost) return

    setGameState((prev) => {
      // Update the building count
      const updatedBuildings = prev.buildings.map((b) => (b.id === id ? { ...b, owned: b.owned + 1 } : b))

      // Recalculate cookies per second
      const newCookiesPerSecond = updatedBuildings.reduce(
        (total, building) => total + building.cookiesPerSecond * building.owned,
        0,
      )

      return {
        ...prev,
        cookies: prev.cookies - cost,
        buildings: updatedBuildings,
        cookiesPerSecond: newCookiesPerSecond,
      }
    })
  }

  // Load game from localStorage
  useEffect(() => {
    const savedGame = localStorage.getItem("cookieClickerSave")
    if (savedGame) {
      try {
        const parsedSave = JSON.parse(savedGame)
        setGameState((prev) => ({
          ...prev,
          ...parsedSave,
          lastSaved: Date.now(),
        }))
      } catch (e) {
        console.error("Failed to load saved game:", e)
      }
    }
  }, [])

  // Save game to localStorage periodically
  useEffect(() => {
    const saveInterval = setInterval(() => {
      const saveData = {
        cookies: gameState.cookies,
        cookiesPerClick: gameState.cookiesPerClick,
        cookiesPerSecond: gameState.cookiesPerSecond,
        totalCookiesBaked: gameState.totalCookiesBaked,
        upgrades: gameState.upgrades,
        buildings: gameState.buildings,
        lastSaved: Date.now(),
      }
      localStorage.setItem("cookieClickerSave", JSON.stringify(saveData))
    }, 60000) // Save every minute

    return () => clearInterval(saveInterval)
  }, [gameState])

  // Process idle production
  useEffect(() => {
    const now = Date.now()
    const timeSinceLastSave = now - gameState.lastSaved

    if (timeSinceLastSave > 1000 && gameState.cookiesPerSecond > 0) {
      const cookiesEarned = (gameState.cookiesPerSecond * timeSinceLastSave) / 1000
      addCookies(cookiesEarned)
    }

    // Set up the production interval
    const productionInterval = setInterval(() => {
      if (gameState.cookiesPerSecond > 0) {
        addCookies(gameState.cookiesPerSecond / 10) // Update 10 times per second
      }
    }, 100)

    return () => clearInterval(productionInterval)
  }, [gameState.cookiesPerSecond, gameState.lastSaved])

  // Combine state with actions
  const value = {
    ...gameState,
    addCookies,
    clickCookie,
    buyUpgrade,
    buyBuilding,
    calculateBuildingCost,
  }

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>
}