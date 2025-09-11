import { useRef, useState, useCallback } from 'react';

export const useMapInstance = () => {
  const mapRef = useRef(null);
  const markerLayerRef = useRef(null);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState(null);

  const handleMapReady = useCallback((map) => {
    if (!map || mapRef.current) return;
    
    mapRef.current = map;
    setIsReady(true);
    setError(null);
    console.log('✅ 地图初始化完成');
  }, []);

  const handleMapError = useCallback((error) => {
    console.error('地图错误:', error);
    setError(error);
    setIsReady(false);
  }, []);

  const handleLayerReady = useCallback((layerInfo) => {
    markerLayerRef.current = layerInfo;
  }, []);

  return {
    mapInstance: mapRef.current,
    markerLayer: markerLayerRef.current,
    isReady,
    error,
    onMapReady: handleMapReady,
    onMapError: handleMapError,
    onLayerReady: handleLayerReady
  };
};