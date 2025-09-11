
import React, { useRef, useCallback, useEffect, useMemo } from 'react';
import { CATEGORY_COLORS, LEVEL_CONFIG, MARKER_SIZE_CONFIG } from '../data';

const HeritageMarkerLayer = React.memo(({
  mapInstance,
  data = [],
  visible = true,
  selectedCategories = new Set(),
  onMarkerClick,
  onLayerReady,
  markerSize = 'small'
}) => {
  const markersRef = useRef(new Map());
  const layerReadyRef = useRef(false);

  // 📏 获取当前标记尺寸配置
  const currentSize = MARKER_SIZE_CONFIG[markerSize] || MARKER_SIZE_CONFIG.small;

  // 🎯 简化数据过滤逻辑
  const visibleData = useMemo(() => {
    // 基础安全检查
    if (!Array.isArray(data) || data.length === 0) {
      return [];
    }

    // 简化逻辑：直接使用传入的data和visible
    // HeritageDataManager已经处理了所有过滤逻辑，这里只需要根据visible显示或隐藏
    return visible ? data : [];
  }, [data, visible, selectedCategories]);

  // 🔺 创建三角形标记HTML
  const createTriangleMarkerHTML = useCallback((heritage) => {
    // 基础安全检查
    if (!heritage || typeof heritage !== 'object') {
      return '<div class="error-marker">❌</div>';
    }

    const { name = '未知', category = '未分类', city = '未知', level = '未知' } = heritage;
    const color = CATEGORY_COLORS[category] || '#6366F1';
    const { width, height } = currentSize;
    const levelConfig = LEVEL_CONFIG[level] || LEVEL_CONFIG['市级'];
    
    return `
      <div class="heritage-triangle-marker group relative cursor-pointer transition-all duration-200 hover:scale-125 hover:z-50"
           data-heritage-id="${heritage.id || 'unknown'}"
           data-category="${category}">
        
        <!-- 三角形主体 -->
        <div class="triangle-body relative transition-all duration-200"
             style="
               width: 0;
               height: 0;
               border-left: ${width/2}px solid transparent;
               border-right: ${width/2}px solid transparent;
               border-bottom: ${height}px solid ${color};
               opacity: ${levelConfig.opacity};
               filter: drop-shadow(${levelConfig.shadow});
               border-radius: 1px;
             ">
        </div>
        
        <!-- 悬停信息卡 -->
        <div class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
          <div class="bg-slate-900/95 backdrop-blur-sm text-white px-3 py-2 rounded-md shadow-xl border border-cyan-400/30 min-w-max text-xs">
            <div class="font-medium text-cyan-300">${name}</div>
            <div class="text-slate-300 mt-1">${city} · ${level}</div>
          </div>
          <div class="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-4 border-transparent border-t-slate-900/95"></div>
        </div>
        
        <!-- 选中状态指示器 -->
        <div class="selected-indicator absolute -inset-2 rounded-full border-2 border-cyan-400 opacity-0 scale-75 transition-all duration-300"></div>
      </div>
    `;
  }, [currentSize]);

  // 📍 创建单个标记
  const createMarker = useCallback((heritage) => {
    if (!mapInstance || !window.AMap || !heritage) {
      return null;
    }

    // 检查坐标
    if (!heritage.coords || typeof heritage.coords.lng !== 'number' || typeof heritage.coords.lat !== 'number') {
      return null;
    }

    try {
      const levelConfig = LEVEL_CONFIG[heritage.level] || LEVEL_CONFIG['市级'];
      
      const marker = new window.AMap.Marker({
        position: [heritage.coords.lng, heritage.coords.lat],
        content: createTriangleMarkerHTML(heritage),
        anchor: 'bottom-center',
        zIndex: levelConfig.zIndex
      });

      // 标记点击事件
      marker.on('click', (e) => {
        const markerElement = e.target.getContent();
        
        // 清除其他选中状态
        document.querySelectorAll('.selected-indicator').forEach(el => {
          el.classList.remove('opacity-100', 'scale-100');
          el.classList.add('opacity-0', 'scale-75');
        });
        
        // 设置当前选中状态
        if (markerElement) {
          const indicator = markerElement.querySelector('.selected-indicator');
          if (indicator) {
            indicator.classList.remove('opacity-0', 'scale-75');
            indicator.classList.add('opacity-100', 'scale-100');
          }
        }

        if (onMarkerClick && typeof onMarkerClick === 'function') {
          onMarkerClick(heritage, marker);
        }
      });

      return marker;
    } catch (error) {
      console.error('创建标记时出错:', error);
      return null;
    }
  }, [mapInstance, createTriangleMarkerHTML, onMarkerClick]);

  // 🗺️ 更新标记显示
  const updateMarkers = useCallback(() => {
    if (!mapInstance) return;

    try {
      // 获取当前需要显示的ID集合
      const currentIds = new Set(visibleData.map(item => item.id).filter(Boolean));
      const existingIds = new Set(markersRef.current.keys());

      // 移除不需要的标记
      for (const [id, marker] of markersRef.current.entries()) {
        if (!currentIds.has(id)) {
          try {
            mapInstance.remove(marker);
            markersRef.current.delete(id);
          } catch (error) {
            console.warn('移除标记时出错:', error);
          }
        }
      }

      // 添加新标记
      visibleData.forEach(heritage => {
        if (!heritage.id || existingIds.has(heritage.id)) {
          return;
        }
        
        const marker = createMarker(heritage);
        if (marker) {
          try {
            mapInstance.add(marker);
            markersRef.current.set(heritage.id, marker);
          } catch (error) {
            console.warn('添加标记到地图时出错:', error);
          }
        }
      });

      // 通知父组件层级就绪
      if (!layerReadyRef.current && markersRef.current.size > 0) {
        layerReadyRef.current = true;
        if (onLayerReady && typeof onLayerReady === 'function') {
          const layerInfo = {
            markers: Array.from(markersRef.current.values()),
            count: markersRef.current.size,
            fitToMarkers: () => {
              if (mapInstance && markersRef.current.size > 0) {
                const markers = Array.from(markersRef.current.values());
                mapInstance.setFitView(markers, false, [30, 30, 30, 30]);
              }
            },
            clearAll: () => {
              markersRef.current.forEach(marker => {
                try {
                  mapInstance.remove(marker);
                } catch (error) {
                  console.warn('清理标记时出错:', error);
                }
              });
              markersRef.current.clear();
            },
            getStats: () => ({
              total: markersRef.current.size,
              byCategory: visibleData.reduce((acc, item) => {
                if (item && item.category) {
                  acc[item.category] = (acc[item.category] || 0) + 1;
                }
                return acc;
              }, {})
            })
          };
          
          onLayerReady(layerInfo);
        }
      }
    } catch (error) {
      console.error('更新标记时发生严重错误:', error);
    }
  }, [mapInstance, visibleData, createMarker, onLayerReady]);

  // 📍 监听数据变化并更新
  useEffect(() => {
    updateMarkers();
  }, [updateMarkers]);

  // 🧹 组件卸载清理
  useEffect(() => {
    return () => {
      if (markersRef.current.size > 0) {
        markersRef.current.forEach(marker => {
          try {
            mapInstance?.remove(marker);
          } catch (error) {
            console.warn('卸载时清理标记出错:', error);
          }
        });
        markersRef.current.clear();
      }
    };
  }, [mapInstance]);

  // 这是一个纯逻辑组件，不渲染DOM
  return null;
});

HeritageMarkerLayer.displayName = 'HeritageMarkerLayer';

export default HeritageMarkerLayer;
