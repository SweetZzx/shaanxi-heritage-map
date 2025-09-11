import { useCallback } from 'react';

export const useMapControls = (mapInstance, markerLayer) => {
  const fitToMarkers = useCallback(() => {
    if (markerLayer?.fitToMarkers) {
      markerLayer.fitToMarkers();
    }
  }, [markerLayer]);

  const zoomTo = useCallback((center, zoom = 10) => {
    if (mapInstance?.setZoomAndCenter) {
      mapInstance.setZoomAndCenter(zoom, center);
    }
  }, [mapInstance]);

  const resetView = useCallback(() => {
    if (mapInstance?.setZoomAndCenter) {
      mapInstance.setZoomAndCenter(7, [108.95, 34.27]);
    }
  }, [mapInstance]);

  return { fitToMarkers, zoomTo, resetView };
};