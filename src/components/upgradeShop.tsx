'use client';

import { useGameState } from '../lib/gameContext';

export default function UpgradeShop() {
  const { cookies, upgrades, buyUpgrade } = useGameState();

  // Filter for available upgrades (not purchased)
  const availableUpgrades = upgrades.filter(upgrade => !upgrade.purchased);

  return (
    <div className="bg-amber-100 p-4 rounded-lg shadow-md mb-4">
      <h2 className="text-xl font-bold mb-3 text-amber-800">Upgrades</h2>
      {availableUpgrades.length === 0 ? (
        <p className="text-gray-500 italic">No upgrades available yet</p>
      ) : (
        <div className="space-y-2">
          {availableUpgrades.map(upgrade => {
            const canAfford = cookies >= upgrade.cost;
            
            return (
              <button
                key={upgrade.id}
                className={`w-full text-left p-2 rounded flex justify-between items-center border ${
                  canAfford 
                    ? 'bg-amber-200 hover:bg-amber-300 border-amber-400' 
                    : 'bg-gray-100 text-gray-500 border-gray-300 cursor-not-allowed'
                }`}
                onClick={() => canAfford && buyUpgrade(upgrade.id)}
                disabled={!canAfford}
              >
                <div>
                  <div className="font-semibold">{upgrade.name}</div>
                  <div className="text-xs">{upgrade.description}</div>
                </div>
                <div className="text-amber-700 font-bold">
                  {upgrade.cost.toLocaleString()} cookies
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}