
import { HashRouter, Routes, Route } from "react-router-dom";
import React, { useState, useCallback, useRef } from 'react';
import Home from "./pages/Home.jsx";
import OpeningAnimation from './components/OpeningAnimation.jsx';

export default function App() {
  const [isAnimationComplete, setIsAnimationComplete] = useState(false);
  const animationCompleteRef = useRef(false); // 🎯 防止重复触发

  const handleAnimationComplete = useCallback(() => {
    // 🚫 防止重复触发
    if (animationCompleteRef.current) {
      console.warn('⚠️ 动画完成回调被重复调用，忽略');
      return;
    }
    
    animationCompleteRef.current = true;
    console.log('🎬 开场动画完成');
    setIsAnimationComplete(true);
  }, []);

  return (
    <div className="w-screen h-screen overflow-hidden">
      {/* 路由结构保持不变 */}
      <HashRouter>
        <Routes>
          <Route 
            path="/" 
            element={
              <Home 
                isInteractive={isAnimationComplete}
                key="home-page" // 🎯 确保组件稳定性
              />
            } 
          />
        </Routes>
      </HashRouter>
      
      {/* 开场动画覆盖层 - 只在未完成时渲染 */}
      {!animationCompleteRef.current && (
        <OpeningAnimation 
          onComplete={handleAnimationComplete}
          minDuration={2000}
          key="opening-animation" // 🎯 确保组件稳定性
        />
      )}
    </div>
  );
}
