'use client';

import { useGameState } from '../lib/gameContext';

export default function UpgradeShop() {
  const { cookies, upgrades, buyUpgrade } = useGameState();

  // Filter for available upgrades (not purchased)
  const availableUpgrades = upgrades.filter(upgrade => !upgrade.purchased);
  return (
    <div>
      {availableUpgrades.length === 0 ? (
        <div className="text-center py-4">
          <div className="text-amber-600 mb-2">🎁</div>
          <p className="text-amber-700 italic">All upgrades purchased!</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-[45vh] overflow-y-auto pr-1">
          {availableUpgrades.map(upgrade => {
            const canAfford = cookies >= upgrade.cost;
            
            return (
              <button
                key={upgrade.id}
                className={`w-full text-left p-3 rounded-lg flex items-center border transition-all ${
                  canAfford 
                    ? 'bg-gradient-to-r from-amber-100 to-amber-50 hover:to-amber-200 border-amber-300 shadow-sm relative overflow-hidden' 
                    : 'bg-gray-100 bg-opacity-60 text-gray-500 border-gray-200 cursor-not-allowed'
                }`}
                onClick={() => canAfford && buyUpgrade(upgrade.id)}
                disabled={!canAfford}
              >
                {canAfford && <div className="absolute inset-0 shine-effect"></div>}
                <div className={`mr-4 p-2 rounded-full ${
                  canAfford ? 'bg-amber-300 text-amber-800' : 'bg-gray-200 text-gray-500'
                }`}>
                  <div className="text-xl">⚡</div>
                </div>
                <div className="flex-1 z-10">
                  <div className="font-bold text-amber-900">{upgrade.name}</div>
                  <div className="text-xs text-amber-700">{upgrade.description}</div>
                </div>
                <div className={`text-right z-10 ${canAfford ? 'text-amber-700' : 'text-gray-500'}`}>
                  <div className="font-bold">{upgrade.cost.toLocaleString()}</div>
                  <div className="text-xs">cookies</div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}