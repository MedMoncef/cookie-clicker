'use client';

import { useGameState } from '../lib/gameContext';

export default function BuildingsPanel() {
  const { cookies, buildings, cookiesPerSecond, buyBuilding, calculateBuildingCost } = useGameState();

  return (
    <div className="bg-amber-50 p-4 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-xl font-bold text-amber-800">Buildings</h2>
        <div className="text-amber-600 text-sm">
          {cookiesPerSecond.toFixed(1)} cookies per second
        </div>
      </div>
      
      <div className="space-y-2">
        {buildings.map(building => {
          const cost = calculateBuildingCost(building);
          const canAfford = cookies >= cost;
          
          return (
            <button
              key={building.id}
              className={`w-full text-left p-2 rounded flex justify-between items-center border ${
                canAfford 
                  ? 'bg-amber-100 hover:bg-amber-200 border-amber-300' 
                  : 'bg-gray-100 text-gray-500 border-gray-300 cursor-not-allowed'
              }`}
              onClick={() => canAfford && buyBuilding(building.id)}
              disabled={!canAfford}
            >
              <div className="flex-1">
                <div className="flex justify-between">
                  <span className="font-semibold">{building.name}</span>
                  <span className="text-amber-700">{building.owned}</span>
                </div>
                <div className="text-xs">{building.description}</div>
                <div className="text-xs text-amber-600">
                  Produces {building.cookiesPerSecond} cookies per second each
                </div>
              </div>
              <div className="ml-2 text-amber-700 font-bold whitespace-nowrap">
                {cost.toLocaleString()} cookies
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}