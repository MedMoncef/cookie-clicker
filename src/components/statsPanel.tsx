'use client';

import { useGameState } from '../lib/gameContext';
import { useState, useEffect } from 'react';

export default function StatsPanel() {
  const { cookies, cookiesPerClick, cookiesPerSecond, totalCookiesBaked } = useGameState();
  const [timeElapsed, setTimeElapsed] = useState(0);
  
  // Update time elapsed
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeElapsed(prev => prev + 1);
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Format time as HH:MM:SS
  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    return [
      hours.toString().padStart(2, '0'),
      minutes.toString().padStart(2, '0'),
      secs.toString().padStart(2, '0')
    ].join(':');
  };
  
  // Calculate cookies per minute
  const cookiesPerMinute = cookiesPerSecond * 60;
  
  // Calculate time to next purchase (of most expensive affordable building)
  const timeToNextPurchase = () => {
    if (cookiesPerSecond <= 0) return 'Never';
    
    const cookiesNeeded = 100;
    const seconds = cookiesNeeded / cookiesPerSecond;
    
    if (seconds < 60) {
      return `${seconds.toFixed(1)} seconds`;
    } else if (seconds < 3600) {
      return `${(seconds / 60).toFixed(1)} minutes`;
    } else {
      return `${(seconds / 3600).toFixed(1)} hours`;
    }
  };

  return (
    <div className="flex flex-col md:flex-row">
      {/* Current cookies counter */}
      <div className="md:w-1/4 text-center p-3 flex flex-col justify-center">
        <div className="text-amber-800 text-sm font-medium mb-1">Current Cookies</div>
        <div className="font-bold text-2xl text-amber-600">{cookies.toLocaleString()}</div>
      </div>
      
      <div className="md:w-3/4 grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-amber-50 p-3 rounded-lg border border-amber-200 flex flex-col items-center justify-center">
          <div className="text-amber-800 text-xs uppercase tracking-wider mb-1">Time played</div>
          <div className="font-mono text-lg font-bold">{formatTime(timeElapsed)}</div>
        </div>
        
        <div className="bg-amber-50 p-3 rounded-lg border border-amber-200 flex flex-col items-center justify-center">
          <div className="text-amber-800 text-xs uppercase tracking-wider mb-1">Total baked</div>
          <div className="font-mono text-lg font-bold">{totalCookiesBaked.toLocaleString()}</div>
        </div>
        
        <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-3 rounded-lg border border-amber-200 flex flex-col items-center justify-center">
          <div className="text-amber-800 text-xs uppercase tracking-wider mb-1">Per click</div>
          <div className="font-mono text-lg font-bold flex items-center">
            <span className="text-amber-600 mr-1">🖱️</span>
            {cookiesPerClick.toFixed(1)}
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-3 rounded-lg border border-amber-200 flex flex-col items-center justify-center">
          <div className="text-amber-800 text-xs uppercase tracking-wider mb-1">Per second</div>
          <div className="font-mono text-lg font-bold flex items-center">
            <span className="text-amber-600 mr-1">⏱️</span>
            {cookiesPerSecond.toFixed(1)}
          </div>
        </div>
      </div>
    </div>
  );
}