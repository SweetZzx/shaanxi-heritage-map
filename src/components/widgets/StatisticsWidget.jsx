
import React, { useState, useMemo } from 'react';
import { useHeritageData } from '../HeritageDataManager';
import { CATEGORY_COLORS, LEVEL_CONFIG } from '../../data';

const StatisticsWidget = ({ onAction }) => {
  const [activeTab, setActiveTab] = useState('overview');
  
  // 使用数据管理上下文
  const { data } = useHeritageData();

  // 全面统计计算
  const statistics = useMemo(() => {
    if (!data?.raw || data.raw.length === 0) {
      return {
        total: 0,
        byLevel: {},
        byCategory: {},
        byCity: {},
        trends: {}
      };
    }

    const byLevel = {};
    const byCategory = {};
    const byCity = {};

    data.raw.forEach(item => {
      // 级别统计
      byLevel[item.level] = (byLevel[item.level] || 0) + 1;
      // 分类统计
      byCategory[item.category] = (byCategory[item.category] || 0) + 1;
      // 城市统计
      byCity[item.city] = (byCity[item.city] || 0) + 1;
    });

    return {
      total: data.raw.length,
      byLevel,
      byCategory,
      byCity
    };
  }, [data]);

  const tabs = [
    { id: 'overview', label: '总览', icon: '📊' },
    { id: 'category', label: '分类', icon: '🏷️' },
    { id: 'level', label: '级别', icon: '⭐' },
    { id: 'region', label: '地区', icon: '🗺️' }
  ];

  // 渲染概览统计
  const renderOverview = () => (
    <div className="space-y-4">
      {/* 核心数据 */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-gradient-to-br from-cyan-900/30 to-blue-900/30 rounded-lg p-4 border border-cyan-500/30">
          <div className="text-cyan-300 font-bold text-2xl">{statistics.total}</div>
          <div className="text-slate-400 text-xs">非遗项目总数</div>
        </div>
        <div className="bg-gradient-to-br from-emerald-900/30 to-teal-900/30 rounded-lg p-4 border border-emerald-500/30">
          <div className="text-emerald-300 font-bold text-2xl">
            {Object.keys(statistics.byCity).length}
          </div>
          <div className="text-slate-400 text-xs">涉及城市数量</div>
        </div>
      </div>

      {/* 级别分布饼图风格 */}
      <div className="bg-slate-800/30 rounded-lg p-4 border border-slate-700/30">
        <h3 className="text-white text-sm font-medium mb-3">保护级别分布</h3>
        <div className="space-y-3">
          {Object.entries(LEVEL_CONFIG).map(([level, config]) => {
            const count = statistics.byLevel[level] || 0;
            const percentage = statistics.total > 0 ? (count / statistics.total) * 100 : 0;
            
            return (
              <div key={level} className="flex items-center space-x-3">
                <div className="w-12 text-right">
                  <span className={`text-sm font-bold ${config.textColor}`}>
                    {count}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-slate-300 text-xs">{level}</span>
                    <span className="text-slate-400 text-xs">{percentage.toFixed(1)}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-700/50 rounded-full">
                    <div 
                      className="h-full rounded-full transition-all duration-1000"
                      style={{ 
                        width: `${percentage}%`,
                        backgroundColor: config.color
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  // 渲染分类统计
  const renderCategory = () => (
    <div className="space-y-3">
      {Object.entries(statistics.byCategory)
        .sort(([,a], [,b]) => b - a)
        .map(([category, count]) => {
          const color = CATEGORY_COLORS[category];
          const percentage = (count / statistics.total) * 100;
          
          return (
            <div key={category} className="bg-slate-800/30 rounded-lg p-3 border border-slate-700/30">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: color }}
                  ></div>
                  <span className="text-white text-sm">{category}</span>
                </div>
                <span className="text-slate-300 font-bold">{count}</span>
              </div>
              <div className="w-full h-1.5 bg-slate-700/50 rounded-full">
                <div 
                  className="h-full rounded-full transition-all duration-1000"
                  style={{ 
                    width: `${percentage}%`,
                    backgroundColor: color
                  }}
                ></div>
              </div>
              <div className="text-right text-xs text-slate-400 mt-1">
                {percentage.toFixed(1)}%
              </div>
            </div>
          );
        })}
    </div>
  );

  // 渲染级别统计
  const renderLevel = () => (
    <div className="space-y-4">
      {Object.entries(LEVEL_CONFIG).map(([level, config]) => {
        const count = statistics.byLevel[level] || 0;
        const items = data?.raw?.filter(item => item.level === level) || [];
        
        return (
          <div key={level} className="bg-slate-800/30 rounded-lg p-4 border border-slate-700/30">
            <div className="flex items-center justify-between mb-3">
              <h3 className={`text-sm font-medium ${config.textColor}`}>{level}</h3>
              <span className={`px-2 py-1 rounded text-xs ${config.bgColor} ${config.textColor}`}>
                {count} 项
              </span>
            </div>
            
            {items.length > 0 && (
              <div className="space-y-2">
                <div className="text-xs text-slate-400 mb-2">代表项目:</div>
                {items.slice(0, 3).map((item, index) => (
                  <div key={index} className="text-xs text-slate-300 bg-slate-700/30 rounded px-2 py-1">
                    {item.name} · {item.city}
                  </div>
                ))}
                {items.length > 3 && (
                  <div className="text-xs text-slate-400 text-center">
                    还有 {items.length - 3} 项...
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );

  // 渲染地区统计
  const renderRegion = () => (
    <div className="space-y-3">
      {Object.entries(statistics.byCity)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 8)
        .map(([city, count]) => {
          const percentage = (count / statistics.total) * 100;
          
          return (
            <div key={city} className="bg-slate-800/30 rounded-lg p-3 border border-slate-700/30">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white text-sm">{city}</span>
                <span className="text-emerald-300 font-bold">{count}</span>
              </div>
              <div className="w-full h-1.5 bg-slate-700/50 rounded-full">
                <div 
                  className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-teal-400 transition-all duration-1000"
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
              <div className="text-right text-xs text-slate-400 mt-1">
                {percentage.toFixed(1)}%
              </div>
            </div>
          );
        })}
    </div>
  );

  return (
    <div className="space-y-4">
      {/* 选项卡切换 */}
      <div className="bg-slate-800/30 rounded-lg p-1 border border-slate-700/30">
        <div className="grid grid-cols-4 gap-1">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-2 py-2 text-xs rounded-md transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-cyan-600/30 text-cyan-300 border border-cyan-500/50'
                  : 'text-slate-400 hover:text-slate-300 hover:bg-slate-700/30'
              }`}
            >
              <div className="text-center">
                <div className="mb-1">{tab.icon}</div>
                <div>{tab.label}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 内容区域 */}
      <div className="min-h-[300px]">
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'category' && renderCategory()}
        {activeTab === 'level' && renderLevel()}
        {activeTab === 'region' && renderRegion()}
      </div>

      {/* 操作按钮 */}
      <div className="space-y-2">
        <button
          onClick={() => onAction?.({ id: 'export-stats', label: '导出统计数据' })}
          className="w-full px-4 py-2 bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 text-sm rounded-lg transition-all duration-200 border border-purple-600/30"
        >
          📋 导出统计报告
        </button>
        
        <button
          onClick={() => onAction?.({ id: 'detailed-analysis', label: '详细分析' })}
          className="w-full px-4 py-2 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 text-sm rounded-lg transition-all duration-200 border border-indigo-600/30"
        >
          📈 查看详细分析
        </button>
      </div>
    </div>
  );
};

export default StatisticsWidget;
