import React, { useEffect, useState, useCallback } from 'react';

const OpeningAnimation = ({ onComplete, minDuration = 2000 }) => {
  const [isVisible, setIsVisible] = useState(true);

  const handleComplete = useCallback(() => {
    console.log('🎬 动画完成，准备退场');
    setIsVisible(false);
    
    setTimeout(() => {
      onComplete?.();
    }, 1000);
  }, [onComplete]);

  useEffect(() => {
    const timer = setTimeout(handleComplete, minDuration);
    return () => clearTimeout(timer);
  }, [handleComplete, minDuration]);

  // 阻止交互
  useEffect(() => {
    if (isVisible) {
      const preventInteraction = (e) => {
        e.preventDefault();
        e.stopPropagation();
      };
      
      document.body.style.overflow = 'hidden';
      const events = ['click', 'keydown', 'touchstart', 'wheel'];
      events.forEach(event => {
        document.addEventListener(event, preventInteraction, { 
          capture: true, 
          passive: false 
        });
      });
      
      return () => {
        document.body.style.overflow = '';
        events.forEach(event => {
          document.removeEventListener(event, preventInteraction, { capture: true });
        });
      };
    }
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div 
      className={`fixed inset-0 z-[10000] flex items-center justify-center transition-all duration-1000 ease-out ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      style={{
        background: 'radial-gradient(ellipse at center, #0d47a1 0%, #1565c0 25%, #1976d2 50%, #0a1929 100%)'
      }}
    >
      {/* 动画内容保持原样，但移除了复杂的性能优化 */}
      <div className="relative z-10 text-center">
        <h1 className="text-6xl md:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-300 to-indigo-300 mb-4 animate-pulse">
          陕西智慧
        </h1>
        <h2 className="text-4xl md:text-6xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-200 via-cyan-200 to-blue-300 animate-pulse">
          非遗地图
        </h2>
        
        <div className="mt-8 flex justify-center items-center space-x-4">
          <div className="h-0.5 w-16 bg-gradient-to-r from-transparent to-cyan-400 animate-pulse"></div>
          <span className="text-cyan-300 text-lg tracking-widest animate-pulse">
            SHAANXI HERITAGE MAP
          </span>
          <div className="h-0.5 w-16 bg-gradient-to-l from-transparent to-cyan-400 animate-pulse"></div>
        </div>

        <div className="mt-8 flex justify-center">
          <div className="flex items-center space-x-2 text-cyan-200 text-sm">
            <div className="flex space-x-1">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce"
                  style={{ animationDelay: `${i * 0.2}s` }}
                />
              ))}
            </div>
            <span className="opacity-70">正在构建智慧地图...</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OpeningAnimation;