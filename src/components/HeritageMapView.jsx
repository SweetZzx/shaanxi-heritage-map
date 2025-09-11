
import React, { useEffect, useRef, useState, useCallback } from 'react';

const HeritageMapView = ({ 
  onMapReady, 
  onHeritageClick,
  activeFilter = null,
  heritageData = [],
  className = '' 
}) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef(new Map());
  const [selectedHeritage, setSelectedHeritage] = useState(null);

  // 🎨 不同类别的标记样式配置
  const categoryStyles = {
    '传统戏剧': { color: '#06b6d4', bgColor: 'bg-cyan-500', icon: '🎭' },
    '传统音乐': { color: '#3b82f6', bgColor: 'bg-blue-500', icon: '🎵' },
    '传统舞蹈': { color: '#8b5cf6', bgColor: 'bg-violet-500', icon: '💃' },
    '曲艺': { color: '#ec4899', bgColor: 'bg-pink-500', icon: '🎤' },
    '传统体育': { color: '#f59e0b', bgColor: 'bg-amber-500', icon: '🥋' },
    '传统美术': { color: '#10b981', bgColor: 'bg-emerald-500', icon: '🎨' },
    '传统技艺': { color: '#f97316', bgColor: 'bg-orange-500', icon: '⚒️' },
    '传统医药': { color: '#84cc16', bgColor: 'bg-lime-500', icon: '🌿' },
    '民俗': { color: '#ef4444', bgColor: 'bg-red-500', icon: '🏮' },
    '民间文学': { color: '#6366f1', bgColor: 'bg-indigo-500', icon: '📚' }
  };

  // 🏅 保护级别样式
  const levelStyles = {
    '国家级': { ring: 'ring-4 ring-yellow-400/50', shadow: 'shadow-yellow-400/30' },
    '省级': { ring: 'ring-2 ring-blue-400/50', shadow: 'shadow-blue-400/20' },
    '市级': { ring: 'ring-1 ring-gray-400/50', shadow: 'shadow-gray-400/10' }
  };

  // 🗺️ 初始化地图
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // 创建地图实例
    const map = new window.AMap.Map(mapRef.current, {
      zoom: 7,
      center: [108.94, 34.34], // 陕西省西安市中心
      mapStyle: 'amap://styles/dark',
      viewMode: '3D',
      pitch: 0,
      rotation: 0,
      showLabel: true,
      features: ['bg', 'road', 'building', 'point'],
    });

    mapInstanceRef.current = map;
    
    // 通知父组件地图已就绪
    if (onMapReady) {
      onMapReady(map);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.destroy();
        mapInstanceRef.current = null;
      }
    };
  }, [onMapReady]);

  // 🎯 创建自定义标记HTML
  const createMarkerHTML = useCallback((heritage) => {
    const categoryStyle = categoryStyles[heritage.category] || categoryStyles['民俗'];
    const levelStyle = levelStyles[heritage.level] || levelStyles['市级'];
    
    return `
      <div class="heritage-marker group cursor-pointer transform transition-all duration-200 hover:scale-110" 
           data-heritage-id="${heritage.id}">
        <!-- 外圈装饰 -->
        <div class="absolute inset-0 ${levelStyle.ring} ${levelStyle.shadow} rounded-full shadow-lg"></div>
        
        <!-- 主体标记 -->
        <div class="relative w-10 h-10 ${categoryStyle.bgColor} rounded-full flex items-center justify-center shadow-lg backdrop-blur-sm border border-white/20">
          <span class="text-lg">${categoryStyle.icon}</span>
        </div>
        
        <!-- 悬停信息提示 -->
        <div class="absolute bottom-12 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
          <div class="bg-slate-900/95 backdrop-blur-sm text-white px-3 py-2 rounded-lg shadow-xl border border-cyan-400/30 min-w-max">
            <div class="text-sm font-medium text-cyan-300">${heritage.name}</div>
            <div class="text-xs text-slate-300">${heritage.city} · ${heritage.level}</div>
          </div>
          <div class="w-2 h-2 bg-slate-900/95 transform rotate-45 mx-auto -mt-1"></div>
        </div>
      </div>
    `;
  }, []);

  // 📍 添加地图标记
  const addMarkersToMap = useCallback(() => {
    if (!mapInstanceRef.current || !heritageData.length) return;

    // 清除现有标记
    markersRef.current.forEach(marker => {
      mapInstanceRef.current.remove(marker);
    });
    markersRef.current.clear();

    // 筛选数据
    const filteredData = activeFilter 
      ? heritageData.filter(item => item.category === activeFilter)
      : heritageData;

    // 添加新标记
    filteredData.forEach(heritage => {
      const marker = new window.AMap.Marker({
        position: [heritage.coords.lng, heritage.coords.lat],
        content: createMarkerHTML(heritage),
        anchor: 'center',
      });

      // 添加点击事件
      marker.on('click', () => {
        console.log('🎯 非遗点击:', heritage.name);
        setSelectedHeritage(heritage);
        if (onHeritageClick) {
          onHeritageClick(heritage);
        }
      });

      mapInstanceRef.current.add(marker);
      markersRef.current.set(heritage.id, marker);
    });

    console.log(`🗺️ 已添加 ${filteredData.length} 个非遗标记`);
  }, [heritageData, activeFilter, createMarkerHTML, onHeritageClick]);

  // 📍 当数据或筛选条件变化时更新标记
  useEffect(() => {
    addMarkersToMap();
  }, [addMarkersToMap]);

  // 🎯 自动调整地图视角以显示所有标记
  const fitToMarkers = useCallback(() => {
    if (!mapInstanceRef.current || markersRef.current.size === 0) return;

    const markers = Array.from(markersRef.current.values());
    mapInstanceRef.current.setFitView(markers, false, [50, 50, 50, 50]);
  }, []);

  // 📊 统计信息计算
  const getStatistics = useCallback(() => {
    if (!heritageData.length) return null;

    const stats = {
      total: heritageData.length,
      byCategory: {},
      byLevel: {},
      byCity: {}
    };

    heritageData.forEach(item => {
      // 按类别统计
      stats.byCategory[item.category] = (stats.byCategory[item.category] || 0) + 1;
      // 按级别统计
      stats.byLevel[item.level] = (stats.byLevel[item.level] || 0) + 1;
      // 按城市统计
      stats.byCity[item.city] = (stats.byCity[item.city] || 0) + 1;
    });

    return stats;
  }, [heritageData]);

  return (
    <div className={`relative w-full h-full ${className}`}>
      {/* 🗺️ 地图容器 */}
      <div ref={mapRef} className="w-full h-full" />

      {/* 🎯 右上角控制面板 */}
      <div className="absolute top-4 right-4 z-10 space-y-2">
        {/* 筛选信息显示 */}
        {activeFilter && (
          <div className="bg-slate-900/80 backdrop-blur-sm text-white px-4 py-2 rounded-lg border border-cyan-400/30">
            <div className="text-sm">
              <span className="text-slate-300">当前筛选:</span>
              <span className="text-cyan-300 font-medium ml-2">{activeFilter}</span>
            </div>
          </div>
        )}

        {/* 工具按钮组 */}
        <div className="flex flex-col space-y-2">
          <button
            onClick={fitToMarkers}
            className="bg-slate-800/80 hover:bg-slate-700/90 text-cyan-300 p-3 rounded-lg transition-colors duration-200 backdrop-blur-sm border border-cyan-400/30"
            title="显示所有标记"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
            </svg>
          </button>
        </div>
      </div>

      {/* 📊 底部统计信息条 */}
      <div className="absolute bottom-4 left-4 right-4 z-10">
        <div className="bg-slate-900/70 backdrop-blur-sm text-white px-4 py-2 rounded-lg border border-slate-700/50 flex items-center justify-between">
          <div className="flex items-center space-x-4 text-sm">
            <span className="text-slate-300">
              共有 <span className="text-cyan-300 font-medium">{heritageData.length}</span> 项非遗
            </span>
            {activeFilter && (
              <span className="text-slate-300">
                筛选显示 <span className="text-cyan-300 font-medium">
                  {heritageData.filter(item => item.category === activeFilter).length}
                </span> 项
              </span>
            )}
          </div>
          
          {selectedHeritage && (
            <div className="text-sm">
              <span className="text-cyan-300 font-medium">{selectedHeritage.name}</span>
              <span className="text-slate-400 ml-2">{selectedHeritage.city}</span>
            </div>
          )}
        </div>
      </div>

      {/* 🎨 样式注入 */}
      <style jsx>{`
        .heritage-marker:hover .absolute {
          transform: scale(1.05);
        }
      `}</style>
    </div>
  );
};

export default HeritageMapView;
