
import React, { useState, useEffect, useCallback } from 'react';

const MapStatusBar = ({ map, className = '' }) => {
  const [coordinates, setCoordinates] = useState({
    lng: 108.95,
    lat: 34.27
  });

  // 🎯 格式化经纬度显示
  const formatCoordinate = useCallback((value, type) => {
    if (!value) return type === 'lng' ? '0.000000°E' : '0.000000°N';
    
    const formatted = parseFloat(value).toFixed(6);
    const direction = type === 'lng' ? (value >= 0 ? 'E' : 'W') : (value >= 0 ? 'N' : 'S');
    return `${Math.abs(formatted)}°${direction}`;
  }, []);

  // 🖱️ 监听地图鼠标移动事件
  useEffect(() => {
    if (!map) return;

    const handleMouseMove = (e) => {
      if (e.lnglat) {
        setCoordinates({
          lng: e.lnglat.lng,
          lat: e.lnglat.lat
        });
      }
    };

    // 添加鼠标移动监听
    map.on('mousemove', handleMouseMove);

    // 清理监听器
    return () => {
      if (map && map.off) {
        map.off('mousemove', handleMouseMove);
      }
    };
  }, [map]);

  return (
    <div className={`absolute bottom-0 right-0 z-30 ${className}`}>
      <div className="flex items-center justify-end px-4 py-2 text-sm">
        
        {/* 📍 经纬度显示区域 */}
        <div className="flex items-center space-x-4 text-white">
          
          {/* 经度显示 */}
          <div className="flex items-center space-x-1">
            <span className="text-white/70 text-xs">经度:</span>
            <span className="text-white font-mono text-xs min-w-[90px] text-right">
              {formatCoordinate(coordinates.lng, 'lng')}
            </span>
          </div>

          {/* 分隔点 */}
          <div className="w-1 h-1 bg-white/50 rounded-full"></div>

          {/* 纬度显示 */}
          <div className="flex items-center space-x-1">
            <span className="text-white/70 text-xs">纬度:</span>
            <span className="text-white font-mono text-xs min-w-[90px] text-right">
              {formatCoordinate(coordinates.lat, 'lat')}
            </span>
          </div>

        </div>
      </div>
    </div>
  );
};

export default MapStatusBar;
