
import React, { useEffect, useState, useCallback, useRef } from 'react';

const OpeningAnimation = ({ onComplete, minDuration = 2000 }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [shouldUnmount, setShouldUnmount] = useState(false);
  const completedRef = useRef(false); // 🎯 防止重复完成
  const timerRef = useRef(null);

  // 🎯 性能优化：使用useCallback避免重复创建函数
  const handleAnimationComplete = useCallback(() => {
    // 🚫 防止重复触发
    if (completedRef.current) {
      console.warn('⚠️ 动画完成处理被重复调用，忽略');
      return;
    }
    
    completedRef.current = true;
    console.log('🎬 开场动画完成，准备退场');
    setIsVisible(false);
    
    // 🚀 退场动画完成后完全卸载组件
    setTimeout(() => {
      if (!completedRef.current) return; // 双重检查
      
      setShouldUnmount(true);
      onComplete?.();
    }, 1000); // 退场动画1秒
  }, [onComplete]);

  // 🎯 最小显示时间，确保用户能看到动画
  useEffect(() => {
    // 清理之前的定时器
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    
    timerRef.current = setTimeout(() => {
      if (!completedRef.current) {
        handleAnimationComplete();
      }
    }, minDuration);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [handleAnimationComplete, minDuration]);

  // 🚀 阻止动画期间的所有交互
  useEffect(() => {
    if (isVisible && !completedRef.current) {
      // 禁用滚动
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      
      // 添加全局事件阻止
      const preventInteraction = (e) => {
        e.preventDefault();
        e.stopPropagation();
      };
      
      const events = ['click', 'keydown', 'touchstart', 'wheel'];
      events.forEach(event => {
        document.addEventListener(event, preventInteraction, { 
          capture: true, 
          passive: false 
        });
      });
      
      return () => {
        document.body.style.overflow = originalOverflow;
        events.forEach(event => {
          document.removeEventListener(event, preventInteraction, { capture: true });
        });
      };
    }
  }, [isVisible]);

  // 🚀 性能优化：动画完成后完全卸载，释放内存
  if (shouldUnmount || completedRef.current) {
    return null;
  }

  return (
    <div 
      className={`fixed inset-0 z-[10000] flex items-center justify-center transition-all duration-1000 ease-out pointer-events-auto ${
        isVisible ? 
        'opacity-100 scale-100' : 
        'opacity-0 scale-110'
      }`}
      style={{
        background: 'radial-gradient(ellipse at center, #0d47a1 0%, #1565c0 25%, #1976d2 50%, #0a1929 100%)',
        willChange: isVisible ? 'transform, opacity' : 'auto'
      }}
    >
      
      {/* 🌊 波纹扩散效果 */}
      <div className="absolute inset-0 flex items-center justify-center">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className={`absolute border-2 border-cyan-400 rounded-full ${isVisible ? 'animate-ping' : ''}`}
            style={{
              width: `${100 + i * 200}px`,
              height: `${100 + i * 200}px`,
              animationDelay: `${i * 0.3}s`,
              animationDuration: '2s',
              opacity: 0.6 - i * 0.1,
              willChange: isVisible ? 'transform, opacity' : 'auto'
            }}
          />
        ))}
      </div>

      {/* 🎯 主标题 */}
      <div className="relative z-10 text-center">
        <h1 className={`text-6xl md:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-300 to-indigo-300 mb-4 ${isVisible ? 'animate-pulse' : ''}`}
            style={{
              textShadow: '0 0 30px rgba(64, 224, 255, 0.5)',
              fontFamily: "'Microsoft YaHei', sans-serif",
              willChange: isVisible ? 'opacity' : 'auto'
            }}>
          陕西智慧
        </h1>
        <h2 className={`text-4xl md:text-6xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-200 via-cyan-200 to-blue-300 ${isVisible ? 'animate-pulse' : ''}`}
            style={{
              textShadow: '0 0 20px rgba(30, 144, 255, 0.4)',
              fontFamily: "'Microsoft YaHei', sans-serif",
              animationDelay: '0.5s',
              willChange: isVisible ? 'opacity' : 'auto'
            }}>
          非遗地图
        </h2>
        
        {/* 副标题装饰 */}
        <div className="mt-8 flex justify-center items-center space-x-4">
          <div className={`h-0.5 w-16 bg-gradient-to-r from-transparent to-cyan-400 ${isVisible ? 'animate-pulse' : ''}`}></div>
          <span className={`text-cyan-300 text-lg tracking-widest ${isVisible ? 'animate-pulse' : ''}`} 
                style={{animationDelay: '1s'}}>
            SHAANXI HERITAGE MAP
          </span>
          <div className={`h-0.5 w-16 bg-gradient-to-l from-transparent to-cyan-400 ${isVisible ? 'animate-pulse' : ''}`}></div>
        </div>

        {/* 🔄 加载提示 */}
        <div className="mt-8 flex justify-center">
          <div className="flex items-center space-x-2 text-cyan-200 text-sm">
            <div className="flex space-x-1">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className={`w-1.5 h-1.5 bg-cyan-400 rounded-full ${isVisible ? 'animate-bounce' : ''}`}
                  style={{
                    animationDelay: `${i * 0.2}s`,
                    willChange: isVisible ? 'transform' : 'auto'
                  }}
                />
              ))}
            </div>
            <span className="opacity-70">正在构建智慧地图...</span>
          </div>
        </div>
      </div>

      {/* ✨ 粒子装饰 */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-1 h-1 bg-cyan-400 rounded-full ${isVisible ? 'animate-ping' : ''}`}
            style={{
              left: `${10 + Math.random() * 80}%`,
              top: `${10 + Math.random() * 80}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${1 + Math.random() * 2}s`,
              willChange: isVisible ? 'transform, opacity' : 'auto'
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default OpeningAnimation;
