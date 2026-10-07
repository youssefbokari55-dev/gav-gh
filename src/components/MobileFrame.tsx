import React, { useState, useEffect } from 'react';
import { Smartphone, Maximize2, Minimize2, Wifi, Battery, Volume2 } from 'lucide-react';

interface MobileFrameProps {
  children: React.ReactNode;
}

export const MobileFrame: React.FC<MobileFrameProps> = ({ children }) => {
  const [isPhoneView, setIsPhoneView] = useState(true);
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit', hour12: false })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-0 md:p-6 transition-all duration-300">
      {/* Top desktop helper toolbar (hidden on small screens) */}
      <div className="hidden md:flex items-center justify-between w-full max-w-md mb-3 px-2 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>تطبيق الهاتف الذكي للترجمة الفورية</span>
        </div>
        <button
          onClick={() => setIsPhoneView(!isPhoneView)}
          className="flex items-center gap-1.5 px-3 py-1 bg-slate-800/80 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium border border-slate-700/60 transition-colors"
          title={isPhoneView ? 'التبديل إلى الشاشة الكاملة' : 'التبديل إلى إطار الهاتف'}
        >
          {isPhoneView ? (
            <>
              <Maximize2 className="w-3.5 h-3.5 text-indigo-400" />
              <span>شاشة كاملة</span>
            </>
          ) : (
            <>
              <Minimize2 className="w-3.5 h-3.5 text-indigo-400" />
              <span>إطار الهاتف</span>
            </>
          )}
        </button>
      </div>

      {/* Main Container: either Phone Mockup Bezel or Full Screen */}
      <div
        className={`w-full transition-all duration-300 ${
          isPhoneView
            ? 'max-w-[430px] h-[100dvh] md:h-[890px] md:rounded-[48px] md:border-[10px] md:border-slate-800 md:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8),0_0_0_1px_rgba(255,255,255,0.08)] bg-slate-900 relative flex flex-col overflow-hidden'
            : 'max-w-4xl h-[100dvh] md:h-[92vh] md:rounded-3xl md:border border-slate-800/80 bg-slate-900 relative flex flex-col overflow-hidden shadow-2xl'
        }`}
      >
        {/* Dynamic Island / Mobile Status Bar (Visible on desktop mockup, hidden on real mobile phones) */}
        <div className="hidden md:flex flex-none pt-2.5 pb-1 px-6 items-center justify-between text-xs text-slate-400 select-none bg-slate-900/95 backdrop-blur z-30">
          <span className="font-semibold text-slate-200 text-xs tracking-tight">{currentTime || '09:41'}</span>

          {/* Dynamic Island Pill */}
          <div className="flex items-center gap-1.5 px-3 py-0.5 bg-black/60 rounded-full border border-slate-800/80">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></span>
            <span className="text-[10px] text-slate-300 font-medium">Polyglot</span>
          </div>

          <div className="flex items-center gap-2 text-slate-300">
            <span className="text-[11px] font-sans font-bold">5G</span>
            <Wifi className="w-3.5 h-3.5" />
            <Battery className="w-4 h-4 text-emerald-400" />
          </div>
        </div>

        {/* Content Viewport */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden relative flex flex-col">
          {children}
        </div>

        {/* Home Indicator Bar (Simulates mobile home swipe line on desktop mockup) */}
        <div className="hidden md:flex flex-none py-1.5 justify-center bg-slate-900/90 z-20">
          <div className="w-32 h-1 bg-slate-700/80 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};
