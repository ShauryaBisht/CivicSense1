import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Clock, CheckCircle, Split } from 'lucide-react';

export default function BeforeAfterSlider({ beforeUrl, afterUrl, title = "Issue Comparison" }) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [viewMode, setViewMode] = useState('slider'); // 'slider' | 'side-by-side'
  const containerRef = useRef(null);

  const FALLBACK_BEFORE = 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80';
  const FALLBACK_AFTER = 'https://images.unsplash.com/photo-1528323273322-d81458248d40?auto=format&fit=crop&w=800&q=80';

  const defaultBefore = beforeUrl || FALLBACK_BEFORE;
  const hasAfter = Boolean(afterUrl);
  const defaultAfter = afterUrl || FALLBACK_AFTER;

  const handleMove = useCallback((clientX) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    let percentage = (x / rect.width) * 100;
    if (percentage < 2) percentage = 2;
    if (percentage > 98) percentage = 98;
    setSliderPosition(percentage);
  }, []);

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    handleMove(e.touches[0].clientX);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchend', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [isDragging]);

  // If no resolution photo uploaded yet
  if (!hasAfter) {
    return (
      <div className="space-y-1.5">
        <div className="relative rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 aspect-video shadow-xs">
          <img
            src={defaultBefore}
            alt="Reported Issue Evidence"
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = FALLBACK_BEFORE;
            }}
          />
          <div className="absolute top-3 left-3 bg-rose-600/90 text-white text-[11px] font-bold px-2.5 py-1 rounded-md shadow-sm backdrop-blur-xs">
            Reported Issue Photo
          </div>
          <div className="absolute bottom-3 left-3 right-3 bg-slate-900/80 backdrop-blur-md text-white text-xs px-3.5 py-2 rounded-lg flex items-center justify-between border border-white/10">
            <span className="flex items-center gap-1.5 text-amber-300 font-semibold">
              <Clock className="w-3.5 h-3.5" />
              <span>Resolution photo pending</span>
            </span>
            <span className="text-slate-300 text-[11px] hidden sm:inline">
              Field crew will upload proof upon work order sign-off
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2.5">
      {/* View Switcher between Slider and Side-by-Side */}
      <div className="flex items-center justify-between text-xs">
        <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
          <Split className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
          <span>Before & After Repair Audit</span>
        </span>
        <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-lg p-0.5 bg-slate-50 dark:bg-slate-900/60">
          <button
            type="button"
            onClick={() => setViewMode('slider')}
            className={`px-2.5 py-1 text-xs rounded-md font-semibold transition-colors ${viewMode === 'slider' ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-white shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'}`}
          >
            Interactive Slider
          </button>
          <button
            type="button"
            onClick={() => setViewMode('side-by-side')}
            className={`px-2.5 py-1 text-xs rounded-md font-semibold transition-colors ${viewMode === 'side-by-side' ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-white shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'}`}
          >
            Side by Side
          </button>
        </div>
      </div>

      {viewMode === 'side-by-side' ? (
        <div className="grid grid-cols-2 gap-2 sm:gap-3">
          <div className="relative rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden aspect-video bg-slate-100 dark:bg-slate-900">
            <img
              src={defaultBefore}
              alt="Before"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = FALLBACK_BEFORE;
              }}
            />
            <div className="absolute top-2.5 left-2.5 bg-rose-600/90 text-white text-[10px] font-bold px-2 py-0.5 rounded backdrop-blur-xs">
              BEFORE (Reported)
            </div>
          </div>
          <div className="relative rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden aspect-video bg-slate-100 dark:bg-slate-900">
            <img
              src={defaultAfter}
              alt="After"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = FALLBACK_AFTER;
              }}
            />
            <div className="absolute top-2.5 right-2.5 bg-emerald-600/90 text-white text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1 backdrop-blur-xs">
              <CheckCircle className="w-3 h-3" />
              <span>AFTER (Fixed)</span>
            </div>
          </div>
        </div>
      ) : (
        <div
          ref={containerRef}
          className="relative w-full aspect-video rounded-xl overflow-hidden select-none cursor-ew-resize border border-slate-200 dark:border-slate-700 shadow-md bg-slate-900"
          onMouseDown={(e) => {
            setIsDragging(true);
            handleMove(e.clientX);
          }}
          onTouchStart={(e) => {
            setIsDragging(true);
            handleMove(e.touches[0].clientX);
          }}
          onMouseMove={handleMouseMove}
          onTouchMove={handleTouchMove}
        >
          {/* "After" Image underneath */}
          <img
            src={defaultAfter}
            alt="After Resolution"
            className="absolute inset-0 w-full h-full object-cover pointer-events-none"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = FALLBACK_AFTER;
            }}
          />

          {/* "Before" Image clipped on top */}
          <div
            className="absolute inset-0 overflow-hidden pointer-events-none"
            style={{ clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)` }}
          >
            <img
              src={defaultBefore}
              alt="Before"
              className="absolute inset-0 w-full h-full object-cover pointer-events-none"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = FALLBACK_BEFORE;
              }}
            />
            <div className="absolute top-3 left-3 bg-rose-600/90 text-white text-[10px] sm:text-[11px] font-bold px-2.5 py-1 rounded-md shadow-sm backdrop-blur-xs">
              BEFORE (Reported)
            </div>
          </div>

          <div className="absolute top-3 right-3 bg-emerald-600/90 text-white text-[10px] sm:text-[11px] font-bold px-2.5 py-1 rounded-md shadow-sm backdrop-blur-xs flex items-center gap-1 pointer-events-none">
            <CheckCircle className="w-3 h-3" />
            <span>AFTER (Verified Fix)</span>
          </div>

          {/* Slider Divider Line & Thumb */}
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-white shadow-[0_0_10px_rgba(0,0,0,0.5)] pointer-events-none"
            style={{ left: `${sliderPosition}%` }}
          >
            <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white dark:bg-slate-900 border-2 border-blue-600 shadow-lg flex items-center justify-center text-blue-600 text-[10px] font-black">
              ⇄
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
