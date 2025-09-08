import { useEffect, useRef } from "react";
import AMapLoader from "@amap/amap-jsapi-loader";

export default function MapView({ items, visible, base, roadnet, center, zoom, onMarkerClick }) {
  const mapRef = useRef(null);
  const map = useRef(null);
  const layers = useRef({ satellite: null, roadnet: null });
  const markers = useRef([]);

  // 初始化地图
  useEffect(() => {
    let destroyed = false;
    
    AMapLoader.load({
      key: import.meta.env.VITE_AMAP_KEY,
      version: "2.0",
      plugins: ["AMap.Scale", "AMap.ToolBar"]
    })
      .then((AMap) => {
        if (destroyed) return;
        
        map.current = new AMap.Map(mapRef.current, {
          viewMode: "2D",
          zoom,
          center,
        });
        
        map.current.addControl(new AMap.Scale());
        map.current.addControl(new AMap.ToolBar());

        // 初始化图层
        layers.current.satellite = new AMap.TileLayer.Satellite();
        layers.current.roadnet = new AMap.TileLayer.RoadNet();

        // 初始图层设置
        if (base === "satellite") {
          layers.current.satellite.setMap(map.current);
        }
        if (roadnet) {
          layers.current.roadnet.setMap(map.current);
        }

        // 初次渲染标注
        renderMarkers(AMap, items, onMarkerClick);
      })
      .catch((e) => {
        console.error("AMap load failed:", e);
      });

    return () => {
      destroyed = true;
      if (map.current) {
        map.current.destroy();
        map.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 渲染标注点
  const renderMarkers = (AMap, data, onClick) => {
    // 清除旧标注
    markers.current.forEach((m) => m.setMap(null));
    markers.current = [];

    if (!visible || !map.current) return;

    data.forEach((project) => {
      const marker = new AMap.Marker({
        position: [project.coords.lng, project.coords.lat],
        title: project.name,
        anchor: "bottom-center",
      });
      
      marker.on("click", () => onClick?.(project));
      marker.setMap(map.current);
      markers.current.push(marker);
    });
  };

  // 数据或可见性变化时更新标注
  useEffect(() => {
    if (!map.current || !window.AMap) return;
    renderMarkers(window.AMap, items, onMarkerClick);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items, visible]);

  // 底图与路网切换
  useEffect(() => {
    const m = map.current;
    if (!m) return;
    
    const { satellite, roadnet: rn } = layers.current;

    if (base === "satellite") {
      satellite?.setMap(m);
    } else {
      satellite?.setMap(null);
    }

    if (roadnet) {
      rn?.setMap(m);
    } else {
      rn?.setMap(null);
    }
  }, [base, roadnet]);

  // 视图复位
  useEffect(() => {
    if (!map.current) return;
    map.current.setZoomAndCenter(zoom, center);
  }, [center, zoom]);

  return <div ref={mapRef} className="w-full h-full" />;
}
