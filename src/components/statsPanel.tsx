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
    
    // For simplicity, let's assume we want to know time to 100 more cookies
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
    <div className="bg-gray-100 p-4 rounded-lg shadow-md">
      <h2 className="text-lg font-bold mb-2">Statistics</h2>
      
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div>Time played:</div>
        <div className="text-right font-medium">{formatTime(timeElapsed)}</div>
        
        <div>Total cookies baked:</div>
        <div className="text-right font-medium">{totalCookiesBaked.toLocaleString()}</div>
        
        <div>Cookies per click:</div>
        <div className="text-right font-medium">{cookiesPerClick.toFixed(1)}</div>
        
        <div>Cookies per second:</div>
        <div className="text-right font-medium">{cookiesPerSecond.toFixed(1)}</div>
        
        <div>Cookies per minute:</div>
        <div className="text-right font-medium">{cookiesPerMinute.toFixed(1)}</div>
        
        {cookiesPerSecond > 0 && (
          <>
            <div>Time to +100 cookies:</div>
            <div className="text-right font-medium">{timeToNextPurchase()}</div>
          </>
        )}
      </div>
    </div>
  );
}