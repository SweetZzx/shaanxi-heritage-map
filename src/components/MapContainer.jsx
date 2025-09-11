import React from 'react';
import MapView from './MapView';
import HeritageMarkerLayer from './HeritageMarkerLayer';
import { useMapInstance } from '../hooks/useMapInstance';
import { useHeritageData } from './HeritageDataManager';

const MapContainer = ({ onMarkerClick }) => {
  const { mapInstance, markerLayer, isReady, error, onMapReady, onMapError, onLayerReady } = useMapInstance();
  const { data, selectedCategories } = useHeritageData();

  if (error) {
    return (
      <div className="fixed top-4 right-4 z-[1001] bg-red-900/90 text-white px-4 py-2 rounded-lg shadow-lg">
        地图加载失败: {error.message}
      </div>
    );
  }

  return (
    <>
      <MapView 
        onMapReady={onMapReady}
        enableClickLogging={false}
        showStatusBar={true}
      />
      
      {mapInstance && isReady && (
        <HeritageMarkerLayer
          mapInstance={mapInstance}
          data={data?.filtered || []}
          visible={data?.visible || false}
          selectedCategories={selectedCategories || new Set()}
          onMarkerClick={onMarkerClick}
          onLayerReady={onLayerReady}
          markerSize="small"
        />
      )}
    </>
  );
};

export default MapContainer;