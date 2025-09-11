
import { useState, useCallback, useRef, useEffect } from 'react';
import { useHeritageData } from './HeritageDataManager';

// 🎮 地图控制器钩子
export const useMapController = () => {
  const mapInstanceRef = useRef(null);
  const markerLayerRef = useRef(null);
  const [mapReady, setMapReady] = useState(false);
  const [mapError, setMapError] = useState(null);

  // 📡 使用数据管理上下文
  const {
    data,
    selectedCategories,
    selectedHeritage,
    layerVisible,
    onHeritageSelect
  } = useHeritageData();

  // 🗺️ 地图就绪回调
  const handleMapReady = useCallback((map) => {
    console.log('🎉 MapController: 地图初始化完成');
    mapInstanceRef.current = map;
    setMapReady(true);
    setMapError(null);
  }, []);

  // ❌ 地图错误处理
  const handleMapError = useCallback((error) => {
    console.error('💥 MapController: 地图错误', error);
    setMapError(error);
    setMapReady(false);
  }, []);

  // 📍 标记层就绪回调
  const handleLayerReady = useCallback((layerInfo) => {
    if (layerInfo && typeof layerInfo === 'object') {
      console.log('🔺 MapController: 标记层就绪', layerInfo.count || 0);
      markerLayerRef.current = layerInfo;
    } else {
      console.warn('⚠️ MapController: 标记层信息无效', layerInfo);
    }
  }, []);

  // 🎯 标记点击处理
  const handleMarkerClick = useCallback((heritage, marker) => {
    if (!heritage) {
      console.warn('⚠️ MapController: 标记数据为空');
      return;
    }
    
    console.log('🔺 MapController: 标记点击', heritage.name);
    onHeritageSelect(heritage);
  }, [onHeritageSelect]);

  // 🎮 地图控制方法
  const mapControls = {
    // 适配所有标记到视图
    fitToMarkers: useCallback(() => {
      if (markerLayerRef.current?.fitToMarkers) {
        console.log('🎯 MapController: 适配标记到视图');
        markerLayerRef.current.fitToMarkers();
      } else {
        console.warn('⚠️ MapController: 标记层未就绪，无法适配视图');
      }
    }, []),

    // 缩放到指定位置
    zoomTo: useCallback((center, zoom = 10) => {
      if (mapInstanceRef.current) {
        console.log('📍 MapController: 缩放到位置', center, zoom);
        mapInstanceRef.current.setZoomAndCenter(zoom, center);
      }
    }, []),

    // 重置地图视角
    resetView: useCallback(() => {
      if (mapInstanceRef.current) {
        console.log('🔄 MapController: 重置地图视角');
        mapInstanceRef.current.setZoomAndCenter(7, [108.95, 34.27]);
      }
    }, []),

    // 获取地图统计信息
    getMapStats: useCallback(() => {
      if (!mapInstanceRef.current) return null;
      
      const center = mapInstanceRef.current.getCenter();
      return {
        zoom: mapInstanceRef.current.getZoom(),
        center: [center.getLng(), center.getLat()],
        markersCount: markerLayerRef.current?.getStats?.()?.total || 0,
        isReady: mapReady
      };
    }, [mapReady]),

    // 清理标记
    clearMarkers: useCallback(() => {
      if (markerLayerRef.current?.clearAll) {
        console.log('🧹 MapController: 清理所有标记');
        markerLayerRef.current.clearAll();
      }
    }, [])
  };

  // 📊 控制器状态
  const controllerState = {
    mapInstance: mapInstanceRef.current,
    markerLayer: markerLayerRef.current,
    mapReady,
    mapError,
    hasMarkers: markerLayerRef.current?.getStats?.()?.total > 0
  };

  // 🔧 调试信息
  const debugInfo = {
    mapInstanceExists: !!mapInstanceRef.current,
    markerLayerExists: !!markerLayerRef.current,
    dataCount: data?.filtered?.length || 0,
    selectedCount: selectedCategories?.size || 0,
    selectedHeritage: selectedHeritage?.name || null
  };

  return {
    // 基础状态
    ...controllerState,
    
    // 事件处理器
    handleMapReady,
    handleMapError,
    handleLayerReady,
    handleMarkerClick,
    
    // 控制方法
    ...mapControls,
    
    // 调试信息
    debugInfo
  };
};

// 🎮 地图控制器组件（如果需要渲染UI）
const MapController = ({ 
  children, 
  showDebugPanel = false,
  className = '' 
}) => {
  const controller = useMapController();

  return (
    <div className={`relative ${className}`}>
      {children}
      
      {/* 🔧 调试面板 */}
      {showDebugPanel && (
        <div className="fixed bottom-4 right-4 z-[9999] bg-black/90 text-white p-4 rounded-lg text-xs max-w-xs">
          <div className="mb-2 font-bold text-cyan-300">MapController 调试</div>
          <div className="space-y-1">
            <div>地图实例: {controller.debugInfo.mapInstanceExists ? '✅' : '❌'}</div>
            <div>标记层: {controller.debugInfo.markerLayerExists ? '✅' : '❌'}</div>
            <div>地图就绪: {controller.mapReady ? '✅' : '❌'}</div>
            <div>数据数量: {controller.debugInfo.dataCount}</div>
            <div>选中分类: {controller.debugInfo.selectedCount}</div>
            <div>选中项目: {controller.debugInfo.selectedHeritage || '无'}</div>
            {controller.mapError && (
              <div className="text-red-300 mt-2">
                错误: {controller.mapError.message}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MapController;
