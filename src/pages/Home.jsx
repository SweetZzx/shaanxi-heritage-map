import React, { useCallback } from 'react';
import MapContainer from '../components/MapContainer';
import SideMenu from '../components/SideMenu';
import HeritageDataManager, { useHeritageData } from '../components/HeritageDataManager';
import { useMapInstance } from '../hooks/useMapInstance';
import { useMenuActions } from '../hooks/useMenuActions';
import { heritageData } from '../data/heritageData';

const HomeContent = ({ isInteractive }) => {
  const { mapInstance, markerLayer } = useMapInstance();
  const { onHeritageSelect } = useHeritageData();
  const { handleMenuAction } = useMenuActions(mapInstance, markerLayer, isInteractive);

  // 处理标记点击
  const handleMarkerClick = useCallback((heritage) => {
    if (heritage && onHeritageSelect) {
      onHeritageSelect(heritage);
    }
  }, [onHeritageSelect]);

  // 处理菜单点击
  const handleMenuClick = useCallback((menuItem) => {
    handleMenuAction(menuItem.id);
  }, [handleMenuAction]);

  return (
    <div className="w-screen h-screen relative overflow-hidden bg-slate-900">
      <MapContainer onMarkerClick={handleMarkerClick} />
      
      <SideMenu 
        onMenuItemClick={handleMenuClick} 
        isInteractive={isInteractive}
      />
    </div>
  );
};

const Home = ({ isInteractive = true }) => {
  return (
    <HeritageDataManager data={heritageData}>
      <HomeContent isInteractive={isInteractive} />
    </HeritageDataManager>
  );
};

export default Home;