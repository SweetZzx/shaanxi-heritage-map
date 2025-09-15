import { HashRouter, Routes, Route } from "react-router-dom";
import React, { useState, useCallback } from 'react';
import Home2 from "./pages/Home2.jsx";
import OpeningAnimation from './components/OpeningAnimation.jsx';

export default function App() {
  const [isAnimationComplete, setIsAnimationComplete] = useState(false);

  const handleAnimationComplete = useCallback(() => {
    console.log('🎬 开场动画完成');
    setIsAnimationComplete(true);
  }, []);

  return (
    <div className="w-screen h-screen overflow-hidden">
      <HashRouter>
        <Routes>
          <Route 
            path="/" 
            element={<Home2 isInteractive={isAnimationComplete} />} 
          />
        </Routes>
      </HashRouter>
      
      {!isAnimationComplete && (
        <OpeningAnimation 
          onComplete={handleAnimationComplete}
          minDuration={2000}
        />
      )}
    </div>
  );
}