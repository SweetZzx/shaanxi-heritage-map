import React from 'react';
import HeritageMarkerLayer from './HeritageMarkerLayer';

const MapLayer = ({ 
  mapInstance, 
  isReady, 
  data, 
  selectedCategories, 
  onMarkerClick, 
  onLayerReady 
}) => {
  if (!mapInstance || !isReady) return null;

  return (
    <HeritageMarkerLayer
      mapInstance={mapInstance}
      data={data?.filtered || []}
      visible={data?.visible || false}
      selectedCategories={selectedCategories || new Set()}
      onMarkerClick={onMarkerClick}
      onLayerReady={onLayerReady}
      markerSize="small"
    />
  );
};

export default MapLayer;