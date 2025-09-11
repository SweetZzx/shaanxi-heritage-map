
import React, { useState, useCallback, useRef } from 'react';
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

  // 使用数据管理上下文
  const {
    data,
    selectedCategories,
    selectedHeritage,
    onHeritageSelect
  } = useHeritageData();

  // 地图就绪回调
  const handleMapReady = useCallback((map) => {
    mapInstanceRef.current = map;
    setMapReady(true);
    setMapError(null);
  }, []);

  // 地图错误处理
  const handleMapError = useCallback((error) => {
    console.error('地图错误:', error);
    setMapError(error);
    setMapReady(false);
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

// 内部组件 - 使用数据管理上下文
const MapWithHeritage = React.memo(() => {
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

  // 侧边栏菜单项点击处理
  const handleMenuItemClick = useCallback((menuItem) => {
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
  }, [showAll, fitToMarkers, resetView, zoomTo, selectedHeritage, reset]);

  return (
    <div className="w-screen h-screen relative overflow-hidden bg-slate-900">
      
      {/* 地图组件 */}
      <MapView 
        onMapReady={handleMapReady}
        enableClickLogging={false}
        showStatusBar={true}
      />

      {/* 标记渲染层 */}
      {mapInstance && mapReady && (
        <HeritageMarkerLayer
          mapInstance={mapInstance}
          data={data?.filtered || []}
          visible={data?.visible || false}
          selectedCategories={selectedCategories || new Set()}
          onMarkerClick={handleMarkerClick}
          onLayerReady={handleLayerReady}
          markerSize="small"
        />
      )}
      
      {/* 侧边栏菜单 */}
      <SideMenu onMenuItemClick={handleMenuItemClick} />

      {/* 错误提示 */}
      {mapError && (
        <div className="fixed top-4 right-4 z-[9999] bg-red-900/90 text-white px-4 py-2 rounded-lg shadow-lg">
          地图加载失败: {mapError.message}
        </div>
      )}
    </div>
  );
});

// 键盘快捷键处理组件
const KeyboardShortcuts = ({ onShortcut }) => {
  React.useEffect(() => {
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
  }, [onShortcut]);

  return null;
};

// 主页组件
const Home = () => {
  const [shortcutHandler, setShortcutHandler] = useState(null);

  // 快捷键处理
  const handleShortcut = useCallback((action) => {
    if (shortcutHandler) {
      shortcutHandler({ id: action, label: '快捷键操作' });
    }
  }, [shortcutHandler]);

  return (
    <HeritageDataManager 
      data={heritageData}
      onSelectionChange={(selection) => {
        // 可以在这里添加额外的处理逻辑
      }}
    >
      <MapWithHeritage />
      
      {/* 键盘快捷键支持 */}
      <KeyboardShortcuts onShortcut={handleShortcut} />
      
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
