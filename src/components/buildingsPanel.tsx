'use client';

import { useGameState } from '../lib/gameContext';

// Function to get an appropriate icon for each building type
const getBuildingIcon = (buildingId: string): string => {
  switch (buildingId) {
    case 'cursor':
      return '👆';
    case 'grandma':
      return '👵';
    case 'farm':
      return '🚜';
    case 'mine':
      return '⛏️';
    case 'factory':
      return '🏭';
    case 'bank':
      return '🏦';
    case 'temple':
      return '🏛️';
    case 'wizard_tower':
      return '🧙‍♂️';
    case 'shipment':
      return '🚀';
    case 'alchemy_lab':
      return '🧪';
    default:
      return '🍪';
  }
};

export default function BuildingsPanel() {
  const { cookies, buildings, cookiesPerSecond, buyBuilding, calculateBuildingCost } = useGameState();
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div className="py-1.5 px-4 bg-amber-200 rounded-full text-amber-800 text-sm font-medium shadow-sm flex items-center gap-1.5">
          <span className="animate-pulse inline-block">⏱️</span>
          {cookiesPerSecond.toFixed(1)} cookies per second
        </div>
      </div>
      
      <div className="space-y-3 max-h-[45vh] overflow-y-auto pr-1">
        {buildings.map(building => {
          const cost = calculateBuildingCost(building);
          const canAfford = cookies >= cost;
          const buildingIcon = getBuildingIcon(building.id);
          
          return (
            <button
              key={building.id}
              className={`w-full text-left rounded-lg flex items-center border transition-all ${
                canAfford 
                  ? 'bg-gradient-to-r from-amber-100 to-amber-50 hover:to-amber-200 border-amber-300 shadow-sm relative overflow-hidden' 
                  : 'bg-gray-100 bg-opacity-60 text-gray-500 border-gray-200 cursor-not-allowed'
              }`}
              onClick={() => canAfford && buyBuilding(building.id)}
              disabled={!canAfford}
            >
              {canAfford && <div className="absolute inset-0 shine-effect"></div>}
              <div className={`p-3 m-2 rounded-lg z-10 ${
                canAfford ? 'bg-amber-300 text-amber-800' : 'bg-gray-200 text-gray-600'
              }`}>
                <div className="text-xl">{buildingIcon}</div>
              </div>
              
              <div className="flex-1 py-2 z-10">
                <div className="flex justify-between">
                  <span className="font-bold text-amber-900">{building.name}</span>
                  <span className={`font-mono font-bold px-2 py-0.5 rounded ${
                    building.owned > 0 
                      ? 'bg-amber-300 text-amber-900' 
                      : 'bg-gray-200 text-gray-500'
                  }`}>{building.owned}</span>
                </div>
                <div className="text-xs text-amber-700">{building.description}</div>
                <div className="text-xs text-amber-600 mt-1">
                  {building.cookiesPerSecond} cookies/sec each 
                  {building.owned > 0 && ` • ${(building.owned * building.cookiesPerSecond).toFixed(1)} total`}
                </div>
              </div>
              
              <div className="ml-2 mr-3 text-right whitespace-nowrap z-10">
                <div className={`font-bold ${canAfford ? 'text-amber-700' : 'text-gray-500'}`}>
                  {cost.toLocaleString()}
                </div>
                <div className="text-xs text-amber-600">cookies</div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}