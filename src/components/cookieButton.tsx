'use client';

import Image from 'next/image';
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
    <div className="flex flex-col items-center w-full">
      <div className="text-4xl font-extrabold mb-6 text-amber-700">
        <span className="text-amber-600 font-mono">{cookies.toLocaleString()}</span> cookies
      </div>
      <div className="relative mb-8">
        <div className="absolute inset-0 rounded-full bg-amber-200 opacity-50 blur-md animate-pulse"></div>
        <button
          className={`w-64 h-64 rounded-full transition-all duration-200 shadow-lg ${
            clickAnimation ? 'scale-95' : 'scale-100 hover:scale-105'
          }`}
          onClick={handleClick}
          aria-label="Click the cookie"
        >
          <div className="relative w-full h-full">
            <Image
              src="/images/cookie.png"
              alt="Cookie"
              className={`w-full h-full object-contain drop-shadow-lg transition-all ${
                clickAnimation ? '' : 'hover:rotate-3'
              }`}
              width={200}
              height={200}
              priority
              onError={(e) => {
                // Fallback if image doesn't exist yet
                (e.target as HTMLImageElement).src = "https://via.placeholder.com/200?text=Cookie";
              }}
            />
            <div className={`absolute inset-0 bg-white opacity-0 rounded-full ${
              clickAnimation ? 'opacity-10' : ''
            }`}></div>
          </div>
        </button>
        
        {/* Floating text animations */}
        {floatingTexts.map(text => (
          <div
            key={text.id}
            className="absolute pointer-events-none font-extrabold text-2xl animate-float"
            style={{ 
              left: `${text.x}px`, 
              top: `${text.y}px`,
              color: cookiesPerClick >= 10 ? 'var(--amber-700)' : 'var(--amber-600)',
              textShadow: '0 1px 3px rgba(0,0,0,0.2)'
            }}
          >
            +{cookiesPerClick}
          </div>
        ))}
      </div>
      <div className="mt-2 text-lg text-amber-800 font-semibold bg-amber-200 py-2 px-4 rounded-full shadow-md">
        {cookiesPerClick} cookies per click
      </div>
    </div>
  );
}