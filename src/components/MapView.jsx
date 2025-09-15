import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import AMapLoader from '@amap/amap-jsapi-loader';
import OpeningAnimation from './OpeningAnimation';
import MapStatusBar from './MapStatusBar';
import { MAP_CONFIG ,INITIAL_MAP_OPTIONS,SHAANXI_STYLES } from '../data/mapConfig';

// ✅ 使用默认参数替代 defaultProps
const MapView = ({ 
  onMapReady = null, 
  className = '', 
  style = {},
  enableClickLogging = false,
  showStatusBar = true  
}) => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const provinceLayers = useRef({});
  const initializationRef = useRef(false);
  
  const [showAnimation, setShowAnimation] = useState(true);
  const [mapReady, setMapReady] = useState(false);
  const [mapError, setMapError] = useState(null);

  // 🧹 清理地图资源的函数
  const cleanupMapResources = useCallback(() => {
    console.log('🧹 清理地图资源中...');

    // 清理图层
    Object.values(provinceLayers.current).forEach(layer => {
      try {
        if (layer && typeof layer.destroy === 'function') {
          layer.destroy();
        }
      } catch (e) {
        console.warn('图层清理警告:', e);
      }
    });
    provinceLayers.current = {};

    // 清理地图实例
    if (mapInstance.current) {
      try {
        mapInstance.current.destroy();
        console.log('✅ 地图实例已销毁');
      } catch (e) {
        console.warn('地图销毁警告:', e);
      }
      mapInstance.current = null;
    }

    initializationRef.current = false;
  }, []);

  // 🎯 创建地图实例的纯函数
  const createMapInstance = useCallback((AMap) => {
    if (!mapRef.current) {
      console.warn('地图容器不存在');
      return null;
    }

    if (mapInstance.current) {
      console.log('🔄 检测到现有地图实例，先清理...');
      cleanupMapResources();
    }

    try {
      const map = new AMap.Map(mapRef.current, INITIAL_MAP_OPTIONS);
      console.log('🗺️ 地图实例创建成功');
      return map;
    } catch (error) {
      console.error('地图实例创建失败:', error);
      setMapError(error);
      return null;
    }
  }, [cleanupMapResources]);

  // 🎨 添加省份轮廓图层
  const addProvinceLayer = useCallback((map, AMap) => {
    try {
      const provinceLayer = new AMap.DistrictLayer.Province(SHAANXI_STYLES.province);
      map.add(provinceLayer);
      provinceLayers.current.province = provinceLayer;

      const citiesLayer = new AMap.DistrictLayer.Province(SHAANXI_STYLES.cities);
      map.add(citiesLayer);
      provinceLayers.current.cities = citiesLayer;

      console.log('🎨 省份图层添加完成');
      return true;
    } catch (error) {
      console.error('省份图层添加失败:', error);
      return false;
    }
  }, []);

  // 🔧 地图事件处理
  const setupMapEvents = useCallback((map) => {
    map.on('complete', () => {
      console.log('🎉 地图瓦片加载完成');
      setMapReady(true);
      
      if (onMapReady && typeof onMapReady === 'function') {
        onMapReady(map);
      }
    });

    map.on('error', (error) => {
      console.error('地图运行时错误:', error);
      setMapError(error);
      setMapReady(true);
    });

    if (enableClickLogging) {
      map.on('click', (e) => {
        console.log('地图点击坐标:', e.lnglat.toString());
      });
    }

    console.log('📡 地图事件监听器设置完成');
  }, [onMapReady, enableClickLogging]);

  // 🚀 初始化地图的主函数
  const initializeMap = useCallback(async () => {
    if (initializationRef.current) {
      console.log('⏸️ 地图初始化已在进行中，跳过重复调用');
      return;
    }
    
    initializationRef.current = true;
    console.log('🚀 开始初始化地图系统...');

    try {
      let AMap;
      
      if (window.AMap) {
        console.log('✅ 使用已缓存的高德地图API');
        AMap = window.AMap;
      } else {
        console.log('📦 加载高德地图API中...');
        AMap = await AMapLoader.load(MAP_CONFIG);
        console.log('✅ 高德地图API加载完成');
      }

      const map = createMapInstance(AMap);
      if (!map) {
        throw new Error('地图实例创建失败');
      }
      
      mapInstance.current = map;
      setupMapEvents(map);
      addProvinceLayer(map, AMap);

      console.log('🎊 地图系统初始化完成');

    } catch (error) {
      console.error('💥 地图初始化失败:', error);
      setMapError(error);
      setMapReady(true);
      initializationRef.current = false;
    }
  }, [createMapInstance, setupMapEvents, addProvinceLayer]);

  // 🎬 动画完成回调
  const handleAnimationComplete = useCallback(() => {
    console.log('🎬 开场动画完成，切换到地图视图');
    setShowAnimation(false);
  }, []);

  // 🔄 重新加载地图
  const handleRetry = useCallback(() => {
    console.log('🔄 用户触发地图重新加载');
    setMapError(null);
    setMapReady(false);
    setShowAnimation(true);
    cleanupMapResources();
    setTimeout(() => {
      initializeMap();
    }, 500);
  }, [cleanupMapResources, initializeMap]);

  // 🎯 组件挂载时初始化地图
  useEffect(() => {
    initializeMap();
  }, [initializeMap]);

  // 🧹 组件卸载时清理资源
  useEffect(() => {
    return () => {
      console.log('🗑️ MapView组件卸载，清理资源');
      cleanupMapResources();
    };
  }, [cleanupMapResources]);

  // 🎨 动态样式计算
  const containerStyle = useMemo(() => ({
    minHeight: '100vh',
    backgroundColor: '#0a1929',
    ...style
  }), [style]);

  // 📊 错误状态显示
  if (mapError && !showAnimation) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-900 to-gray-900 text-white">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="mb-4 text-6xl">🗺️</div>
          <h3 className="text-xl mb-2 font-semibold">地图服务暂时不可用</h3>
          <p className="text-gray-300 text-sm mb-4 leading-relaxed">
            {mapError.message || '网络连接或服务异常'}
          </p>
          <button 
            onClick={handleRetry}
            className="px-6 py-3 bg-blue-600 rounded-lg hover:bg-blue-700 transition-all duration-200 transform hover:scale-105 font-medium"
          >
            🔄 重新加载地图
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full h-full relative ${className}`}>
      {/* 🗺️ 地图容器 */}
      <div 
        ref={mapRef} 
        className={`w-full h-full transition-opacity duration-500 ${
          showAnimation ? 'opacity-0' : 'opacity-100'
        }`}
        style={containerStyle}
      />

      {/* 📍 底部状态栏 - 只在地图加载完成且不显示动画时显示 */}
      {showStatusBar && !showAnimation && mapReady && mapInstance.current && (
        <MapStatusBar map={mapInstance.current} />
      )}

      {/* 🎬 开场动画组件 */}
      {showAnimation && (
        <OpeningAnimation 
          onComplete={handleAnimationComplete}
          minDuration={mapReady ? 1800 : 3000}
        />
      )}
    </div>
  );
};

export default MapView;
