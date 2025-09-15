// src/components/Map.jsx
import React, { useEffect, useRef } from "react";
import AMapLoader from "@amap/amap-jsapi-loader"; // 确保您已安装该包

const Map = () => {
  const mapRef = useRef(null);

  useEffect(() => {
    let map; // 定义地图变量

    AMapLoader.load({
      key: "beed5a6b0db09b8b4f0c01d3b1b5a7d6", // 您的高德API密钥
      version: "2.0",
    })
      .then((AMap) => {
        try {
          // 初始化地图
          map = new AMap.Map(mapRef.current, {
            center: [108.95, 34.27], // 陕西省的坐标
            zoom: 8, // 基础缩放级别
            viewMode: "3D", // 使用3D视图
            pitch: 40, // 设置倾斜角度为40度
            rotation: 0, // 设置视图旋转角度
            mapStyle: "amap://styles/darkblue", // 地图样式设置为darkblue
            features: ["bg", "road", "point"], // 欲显示的地图要素（插件移除）
            showLabel: true, // 显示标签
            crs: "EPSG3857", // 坐标系统
          });
        } catch (err) {
          console.error("地图初始化失败:", err);
        }
      })
      .catch((error) => {
        console.error("高德地图加载失败:", error);
      });

    return () => {
      // 清理地图实例
      if (map) {
        map.destroy();
      }
    };
  }, []);

  return <div ref={mapRef} className="w-full h-full"></div>;
};

export default Map;
