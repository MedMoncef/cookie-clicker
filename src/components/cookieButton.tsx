'use client';

import { useGameState } from '../lib/gameContext';
import { useEffect, useState } from 'react';

export default function CookieButton() {
  const { cookies, cookiesPerClick, clickCookie } = useGameState();
  const [clickAnimation, setClickAnimation] = useState(false);
  const [floatingTexts, setFloatingTexts] = useState<{ id: number; x: number; y: number }[]>([]);
  const [nextId, setNextId] = useState(0);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    clickCookie();
    setClickAnimation(true);
    
    // Create floating text showing cookies gained
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setFloatingTexts(prev => [...prev, { id: nextId, x, y }]);
    setNextId(prev => prev + 1);
  };

  // Remove floating text after animation completes
  useEffect(() => {
    if (floatingTexts.length > 0) {
      const timer = setTimeout(() => {
        setFloatingTexts(prev => prev.slice(1));
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [floatingTexts]);

  // Reset click animation
  useEffect(() => {
    if (clickAnimation) {
      const timer = setTimeout(() => {
        setClickAnimation(false);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [clickAnimation]);

  return (
    <div className="flex flex-col items-center mb-8">
      <div className="text-2xl font-bold mb-4">
        {cookies.toLocaleString()} cookies
      </div>
      <div className="relative">
        <button
          className={`w-40 h-40 rounded-full transition-transform ${
            clickAnimation ? 'scale-95' : 'scale-100 hover:scale-105'
          }`}
          onClick={handleClick}
          aria-label="Click the cookie"
        >
          <img
            src="/images/cookie.png"
            alt="Cookie"
            className="w-full h-full object-contain"
            onError={(e) => {
              // Fallback if image doesn't exist yet
              (e.target as HTMLImageElement).src = "https://via.placeholder.com/160?text=Cookie";
            }}
          />
        </button>
        
        {/* Floating text animations */}
        {floatingTexts.map(text => (
          <div
            key={text.id}
            className="absolute pointer-events-none text-yellow-500 font-bold text-xl animate-float"
            style={{ left: `${text.x}px`, top: `${text.y}px` }}
          >
            +{cookiesPerClick}
          </div>
        ))}
      </div>
      <div className="mt-2 text-sm text-gray-600">
        {cookiesPerClick} cookies per click
      </div>
    </div>
  );
}