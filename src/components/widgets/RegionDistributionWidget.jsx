
import React, { useState, useMemo } from 'react';
import { useHeritageData } from '../HeritageDataManager';

const RegionDistributionWidget = ({ onAction }) => {
  const [selectedCity, setSelectedCity] = useState(null);
  
  // 使用数据管理上下文
  const { data } = useHeritageData();

  // 城市分布统计
  const cityStats = useMemo(() => {
    if (!data?.raw || data.raw.length === 0) return {};
    
    const stats = {};
    data.raw.forEach(item => {
      if (!stats[item.city]) {
        stats[item.city] = {
          total: 0,
          byLevel: { '国家级': 0, '省级': 0, '市级': 0 },
          byCategory: {}
        };
      }
      
      stats[item.city].total += 1;
      stats[item.city].byLevel[item.level] = (stats[item.city].byLevel[item.level] || 0) + 1;
      stats[item.city].byCategory[item.category] = (stats[item.city].byCategory[item.category] || 0) + 1;
    });
    
    return stats;
  }, [data]);

  // 城市按数量排序
  const sortedCities = useMemo(() => {
    return Object.entries(cityStats)
      .sort(([,a], [,b]) => b.total - a.total)
      .slice(0, 10); // 显示前10个城市
  }, [cityStats]);

  const handleCityClick = (city) => {
    setSelectedCity(city === selectedCity ? null : city);
    // 可以通知父组件进行地图缩放等操作
    onAction?.({ 
      id: 'focus-city', 
      label: '聚焦城市',
      data: { city }
    });
  };

  const maxCount = Math.max(...Object.values(cityStats).map(stat => stat.total), 1);

  return (
    <div className="space-y-4">
      {/* 概览统计 */}
      <div className="bg-slate-800/30 rounded-lg p-4 border border-slate-700/30">
        <div className="flex items-center space-x-2 mb-3">
          <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
          <span className="text-white text-sm font-medium">区域分布</span>
        </div>
        
        <div className="grid grid-cols-2 gap-3 text-center">
          <div className="bg-slate-700/30 rounded-lg p-3">
            <div className="text-emerald-300 font-bold text-lg">
              {Object.keys(cityStats).length}
            </div>
            <div className="text-slate-400 text-xs">涉及城市</div>
          </div>
          <div className="bg-slate-700/30 rounded-lg p-3">
            <div className="text-blue-300 font-bold text-lg">
              {data?.raw?.length || 0}
            </div>
            <div className="text-slate-400 text-xs">非遗项目</div>
          </div>
        </div>
      </div>

      {/* 城市分布列表 */}
      <div className="bg-slate-800/30 rounded-lg border border-slate-700/30">
        <div className="p-4 border-b border-slate-700/30">
          <span className="text-white text-sm font-medium">城市排行</span>
          <span className="text-slate-400 text-xs ml-2">(按非遗数量)</span>
        </div>
        
        <div className="max-h-80 overflow-y-auto">
          {sortedCities.map(([city, stats], index) => (
            <button
              key={city}
              onClick={() => handleCityClick(city)}
              className={`w-full p-4 text-left transition-all duration-200 border-b border-slate-700/20 hover:bg-slate-700/30 ${
                selectedCity === city ? 'bg-emerald-900/20 border-emerald-500/30' : ''
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-gradient-to-br from-emerald-500/80 to-blue-500/80 rounded-full flex items-center justify-center text-white text-xs font-bold">
                    {index + 1}
                  </div>
                  <span className="text-white text-sm font-medium">{city}</span>
                </div>
                <span className="text-emerald-300 font-bold">{stats.total}</span>
              </div>
              
              {/* 进度条 */}
              <div className="w-full h-2 bg-slate-700/50 rounded-full overflow-hidden mb-2">
                <div 
                  className="h-full bg-gradient-to-r from-emerald-400 to-blue-400 transition-all duration-500"
                  style={{ width: `${(stats.total / maxCount) * 100}%` }}
                ></div>
              </div>
              
              {/* 级别分布 */}
              <div className="flex space-x-2 text-xs">
                <span className="text-yellow-400">国: {stats.byLevel['国家级'] || 0}</span>
                <span className="text-blue-400">省: {stats.byLevel['省级'] || 0}</span>
                <span className="text-slate-400">市: {stats.byLevel['市级'] || 0}</span>
              </div>
              
              {/* 展开详情 */}
              {selectedCity === city && (
                <div className="mt-3 pt-3 border-t border-slate-700/30">
                  <div className="text-xs text-slate-400 mb-2">分类分布:</div>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(stats.byCategory).map(([category, count]) => (
                      <div key={category} className="bg-slate-700/30 rounded px-2 py-1">
                        <span className="text-slate-300 text-xs">
                          {category.replace('传统', '')}: {count}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* 操作按钮 */}
      <div className="space-y-2">
        <button
          onClick={() => onAction?.({ id: 'show-all-cities', label: '显示所有城市' })}
          className="w-full px-4 py-2 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 text-sm rounded-lg transition-all duration-200 border border-emerald-600/30"
        >
          🗺️ 显示所有城市分布
        </button>
        
        {selectedCity && (
          <button
            onClick={() => onAction?.({ 
              id: 'zoom-to-city', 
              label: '缩放到城市',
              data: { city: selectedCity }
            })}
            className="w-full px-4 py-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 text-sm rounded-lg transition-all duration-200 border border-blue-600/30"
          >
            🎯 缩放到 {selectedCity}
          </button>
        )}
      </div>
    </div>
  );
};

export default RegionDistributionWidget;
