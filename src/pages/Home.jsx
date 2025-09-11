
import React, { useState, useCallback, useRef, useMemo } from 'react';
import MapView from '../components/MapView';
import HeritageMarkerLayer from '../components/HeritageMarkerLayer';
import HeritageDataManager, { useHeritageData } from '../components/HeritageDataManager';
import SideMenu from '../components/SideMenu';
import { heritageData } from '../data';

// 地图控制器钩子
const useMapController = () => {
  const mapInstanceRef = useRef(null);
  const markerLayerRef = useRef(null);
  const [mapReady, setMapReady] = useState(false);
  const [mapError, setMapError] = useState(null);
  const mapReadyRef = useRef(false); // 🎯 防止重复触发

  // 使用数据管理上下文
  const {
    data,
    selectedCategories,
    selectedHeritage,
    onHeritageSelect
  } = useHeritageData();

  // 地图就绪回调
  const handleMapReady = useCallback((map) => {
    // 🚫 防止重复触发
    if (mapReadyRef.current) {
      console.warn('⚠️ 地图就绪回调被重复调用，忽略');
      return;
    }
    
    mapReadyRef.current = true;
    mapInstanceRef.current = map;
    setMapReady(true);
    setMapError(null);
    console.log('✅ 地图初始化完成，防重复触发已启用');
  }, []);

  // 地图错误处理
  const handleMapError = useCallback((error) => {
    console.error('地图错误:', error);
    setMapError(error);
    setMapReady(false);
    mapReadyRef.current = false; // 重置状态
  }, []);

  // 标记层就绪回调
  const handleLayerReady = useCallback((layerInfo) => {
    if (layerInfo && typeof layerInfo === 'object') {
      markerLayerRef.current = layerInfo;
    }
  }, []);

  // 标记点击处理
  const handleMarkerClick = useCallback((heritage, marker) => {
    if (!heritage) return;
    
    if (onHeritageSelect && typeof onHeritageSelect === 'function') {
      onHeritageSelect(heritage);
    }
  }, [onHeritageSelect]);

  // 地图控制方法
  const fitToMarkers = useCallback(() => {
    if (markerLayerRef.current && typeof markerLayerRef.current.fitToMarkers === 'function') {
      markerLayerRef.current.fitToMarkers();
    }
  }, []);

  const zoomTo = useCallback((center, zoom = 10) => {
    if (mapInstanceRef.current && mapInstanceRef.current.setZoomAndCenter) {
      mapInstanceRef.current.setZoomAndCenter(zoom, center);
    }
  }, []);

  const resetView = useCallback(() => {
    if (mapInstanceRef.current && mapInstanceRef.current.setZoomAndCenter) {
      mapInstanceRef.current.setZoomAndCenter(7, [108.95, 34.27]);
    }
  }, []);

  const getMapStats = useCallback(() => {
    if (!mapInstanceRef.current) return null;
    
    try {
      const center = mapInstanceRef.current.getCenter();
      return {
        zoom: mapInstanceRef.current.getZoom(),
        center: center ? [center.getLng(), center.getLat()] : [0, 0],
        markersCount: markerLayerRef.current?.getStats?.()?.total || 0,
        isReady: mapReady
      };
    } catch (error) {
      console.warn('获取地图统计失败:', error);
      return null;
    }
  }, [mapReady]);

  return {
    mapInstance: mapInstanceRef.current,
    markerLayer: markerLayerRef.current,
    mapReady,
    mapError,
    handleMapReady,
    handleMapError,
    handleLayerReady,
    handleMarkerClick,
    fitToMarkers,
    zoomTo,
    resetView,
    getMapStats
  };
};

// 内部组件 - 添加isInteractive prop
const MapWithHeritage = React.memo(({ isInteractive }) => {
  const [activeFeature, setActiveFeature] = useState(null);
  
  // 使用地图控制器钩子
  const {
    mapInstance,
    mapReady,
    mapError,
    handleMapReady,
    handleLayerReady,
    handleMarkerClick,
    fitToMarkers,
    zoomTo,
    resetView
  } = useMapController();

  // 使用数据管理上下文
  const {
    data,
    selectedCategories,
    selectedHeritage,
    showAll,
    reset
  } = useHeritageData();

  // 🎯 使用useMemo缓存侧边栏菜单项点击处理逻辑，避免不必要的重新渲染
  const handleMenuItemClick = useCallback((menuItem) => {
    if (!isInteractive) {
      console.log('🚫 交互被禁用，忽略菜单操作:', menuItem);
      return;
    }
    
    console.log('🎯 处理菜单操作:', menuItem);
    setActiveFeature(menuItem.id);

    switch (menuItem.id) {
      case 'heritage-sites':
        showAll();
        setTimeout(() => {
          fitToMarkers();
        }, 300);
        break;
        
      case 'fit-to-view':
        fitToMarkers();
        break;
        
      case 'reset-view':
        resetView();
        break;
        
      case 'zoom-to-heritage':
        if (selectedHeritage && selectedHeritage.coords) {
          zoomTo([selectedHeritage.coords.lng, selectedHeritage.coords.lat], 12);
        }
        break;
        
      case 'reset-all':
        reset();
        resetView();
        break;
        
      default:
        break;
    }
  }, [isInteractive, showAll, fitToMarkers, resetView, zoomTo, selectedHeritage, reset]);

  // 🎯 优化：仅在交互状态变化时重新渲染
  console.log(`🔄 MapWithHeritage 渲染状态: isInteractive=${isInteractive}, mapReady=${mapReady}`);

  return (
    <div className="w-screen h-screen relative overflow-hidden bg-slate-900">
      
      {/* 地图组件 - 添加稳定的key */}
      <MapView 
        key="main-map"
        onMapReady={handleMapReady}
        enableClickLogging={false}
        showStatusBar={true}
      />

      {/* 标记渲染层 */}
      {mapInstance && mapReady && (
        <HeritageMarkerLayer
          key="heritage-markers"
          mapInstance={mapInstance}
          data={data?.filtered || []}
          visible={data?.visible || false}
          selectedCategories={selectedCategories || new Set()}
          onMarkerClick={handleMarkerClick}
          onLayerReady={handleLayerReady}
          markerSize="small"
        />
      )}
      
      {/* 侧边栏菜单 - 传递交互状态 */}
      <SideMenu 
        key="side-menu"
        onMenuItemClick={handleMenuItemClick} 
        isInteractive={isInteractive}
      />

      {/* 错误提示 */}
      {mapError && (
        <div className="fixed top-4 right-4 z-[1001] bg-red-900/90 text-white px-4 py-2 rounded-lg shadow-lg">
          地图加载失败: {mapError.message}
        </div>
      )}
    </div>
  );
});

// 键盘快捷键处理组件 - 添加isInteractive检查
const KeyboardShortcuts = React.memo(({ onShortcut, isInteractive }) => {
  React.useEffect(() => {
    if (!isInteractive) {
      console.log('🚫 键盘快捷键被禁用');
      return;
    }
    
    console.log('✅ 键盘快捷键已启用');
    
    const handleKeyPress = (event) => {
      switch (event.key) {
        case 'Escape':
          onShortcut('reset-view');
          break;
        case ' ':
          event.preventDefault();
          onShortcut('fit-to-view');
          break;
        case 'r':
          if (event.ctrlKey || event.metaKey) {
            event.preventDefault();
            onShortcut('reset-all');
          }
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [onShortcut, isInteractive]);

  return null;
});

// 主页组件 - 添加isInteractive prop和优化
const Home = ({ isInteractive = true }) => {
  const [shortcutHandler, setShortcutHandler] = useState(null);
  const interactiveRef = useRef(isInteractive);

  // 更新交互状态引用
  React.useEffect(() => {
    interactiveRef.current = isInteractive;
    console.log(`🎮 交互状态更新: ${isInteractive ? '启用' : '禁用'}`);
  }, [isInteractive]);

  // 快捷键处理
  const handleShortcut = useCallback((action) => {
    if (!interactiveRef.current) {
      console.log('🚫 快捷键被禁用:', action);
      return;
    }
    
    if (shortcutHandler) {
      shortcutHandler({ id: action, label: '快捷键操作' });
    }
  }, [shortcutHandler]);

  // 🎯 使用useMemo缓存HeritageDataManager的props
  const heritageDataProps = useMemo(() => ({
    data: heritageData,
    onSelectionChange: (selection) => {
      // 可以在这里添加额外的处理逻辑
      console.log('📊 数据选择变化:', selection);
    }
  }), []);

  return (
    <HeritageDataManager {...heritageDataProps}>
      <MapWithHeritage isInteractive={isInteractive} />
      
      {/* 键盘快捷键支持 */}
      <KeyboardShortcuts 
        onShortcut={handleShortcut} 
        isInteractive={isInteractive}
      />
      
      {/* 设置快捷键处理器的引用 */}
      <div style={{ display: 'none' }} ref={(el) => {
        if (el && el.parentElement) {
          const mapComponent = el.parentElement.querySelector('[data-map-controller]');
          if (mapComponent && mapComponent.handleMenuItemClick) {
            setShortcutHandler(() => mapComponent.handleMenuItemClick);
          }
        }
      }} />
    </HeritageDataManager>
  );
};

export default Home;
