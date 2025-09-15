// 🎯 配置常量提取
export const MAP_CONFIG = {
    key: "beed5a6b0db09b8b4f0c01d3b1b5a7d6",
    version: "2.0",
    plugins: [
      "AMap.DistrictLayer", 
      "AMap.TileLayer",
      "AMap.Marker",
      "AMap.InfoWindow",
      "AMap.Geolocation",
      "AMap.ToolBar",
      "AMap.Scale"
    ]
  };
  
  export   const INITIAL_MAP_OPTIONS = {
    center: [108.95, 34.27],
    zoom: 7,
    viewMode: "3D",
    pitch: 40,
    mapStyle: "amap://styles/darkblue",
    dragEnable: true,
    zoomEnable: true,
    scrollWheel: true,
    rotateEnable: true,
    pitchEnable: true,
    showBuildingBlock: true,
    showLabel: true
  };
  
  // 🎨 陕西省样式配置
  export  const SHAANXI_STYLES = {
    province: {
      zIndex: 8,
      adcode: ["610000"],
      depth: 0,
      styles: {
        fill: "rgba(64, 224, 255, 0.08)",
        stroke: "#40E0FF",
        "stroke-width": 3,
      },
    },
    cities: {
      zIndex: 10,
      adcode: ["610000"],
      depth: 1,
      styles: {
        fill: "rgba(30, 144, 255, 0.06)",
        "city-stroke": "#1E90FF",
        "stroke-width": 2,
        "county-stroke": "#4682B4",
        "county-stroke-width": 1,
      },
    }
  };