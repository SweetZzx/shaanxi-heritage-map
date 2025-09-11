import { useCallback } from 'react';
import { useHeritageData } from '../components/HeritageDataManager';
import { useMapControls } from './useMapControls';

export const useMenuActions = (mapInstance, markerLayer, isInteractive) => {
  const { showAll, reset, selectedHeritage } = useHeritageData();
  const { fitToMarkers, zoomTo, resetView } = useMapControls(mapInstance, markerLayer);

  const handleMenuAction = useCallback((actionId) => {
    if (!isInteractive) {
      console.log('🚫 交互被禁用，忽略菜单操作:', actionId);
      return;
    }

    console.log('🎯 执行菜单操作:', actionId);

    const actions = {
      'heritage-sites': () => {
        showAll();
        setTimeout(fitToMarkers, 300);
      },
      'fit-to-view': fitToMarkers,
      'reset-view': resetView,
      'zoom-to-heritage': () => {
        if (selectedHeritage?.coords) {
          zoomTo([selectedHeritage.coords.lng, selectedHeritage.coords.lat], 12);
        }
      },
      'reset-all': () => {
        reset();
        resetView();
      }
    };

    const action = actions[actionId];
    if (action) {
      action();
    } else {
      console.warn('未知的菜单操作:', actionId);
    }
  }, [isInteractive, showAll, fitToMarkers, resetView, zoomTo, selectedHeritage, reset]);

  return { handleMenuAction };
};