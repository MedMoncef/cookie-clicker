'use client';

import { GameProvider } from '../lib/gameContext';
import CookieButton from '@/components/cookieButton';
import UpgradeShop from '@/components/upgradeShop';
import BuildingsPanel from '@/components/buildingsPanel';
import StatsPanel from '@/components/statsPanel';
import { useEffect, useState } from 'react';

export default function Home() {
  const [mounted, setMounted] = useState(false);

  // Only render the game after client-side hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  // Add CSS for animations to the document head
  useEffect(() => {
    const style = document.createElement('style');
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
        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent);
        background-size: 200% 100%;
        animation: shine 2s infinite;
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  if (!mounted) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <GameProvider>
      <main className="min-h-screen bg-gradient-to-b from-amber-50 to-amber-100">
        <div className="container mx-auto p-4">
          <div className="text-center py-4">
            <h1 className="text-4xl font-extrabold text-amber-900 tracking-tight mb-2">
              Cookie Clicker
            </h1>
            <div className="h-1 w-32 bg-amber-400 mx-auto rounded-full"></div>
          </div>
          
          {/* Stats Panel at the top */}
          <div className="bg-white bg-opacity-90 rounded-xl shadow-lg p-5 border border-amber-100 mb-8 max-w-4xl mx-auto">
            <StatsPanel />
          </div>
          
          <div className="flex flex-col lg:flex-row gap-6 max-w-6xl mx-auto">
            {/* Left column for cookie */}
            <div className="lg:w-1/2 flex flex-col items-center justify-center py-4">
              <CookieButton />
            </div>
            
            {/* Right column for upgrades and buildings */}
            <div className="lg:w-1/2 space-y-6">
              <div className="bg-white bg-opacity-90 rounded-xl shadow-lg p-5 border border-amber-100">
                <h2 className="text-xl font-bold text-amber-800 mb-4 border-b border-amber-200 pb-2 flex items-center">
                  <span className="mr-2">⚡</span>
                  Upgrades
                </h2>
                <UpgradeShop />
              </div>
              
              <div className="bg-white bg-opacity-90 rounded-xl shadow-lg p-5 border border-amber-100">
                <h2 className="text-xl font-bold text-amber-800 mb-4 border-b border-amber-200 pb-2 flex items-center">
                  <span className="mr-2">🏢</span>
                  Buildings
                </h2>
                <BuildingsPanel />
              </div>
            </div>
          </div>
          
          <footer className="mt-12 text-center text-amber-700 text-sm py-4">
            <p>Made with 🍪 • {new Date().getFullYear()}</p>
          </footer>
        </div>
      </main>
    </GameProvider>
  );
}