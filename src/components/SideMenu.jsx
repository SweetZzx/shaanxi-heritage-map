
import React, { useState, useCallback } from 'react';
import HeritageControlWidget from './widgets/HeritageControlWidget';
import RegionDistributionWidget from './widgets/RegionDistributionWidget';
import StatisticsWidget from './widgets/StatisticsWidget';

const SideMenu = ({ onMenuItemClick }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeWidget, setActiveWidget] = useState('heritage-control');

  // Widget配置
  const widgetConfigs = [
    {
      id: 'heritage-control',
      label: '非遗标记控制',
      icon: '🏛️',
      description: '管理非遗标记的显示和筛选',
      component: HeritageControlWidget
    },
    {
      id: 'region-distribution',
      label: '区域分布',
      icon: '🗺️',
      description: '查看非遗项目的地理分布',
      component: RegionDistributionWidget
    },
    {
      id: 'statistics',
      label: '数据统计',
      icon: '📊',
      description: '查看详细的统计数据和分析',
      component: StatisticsWidget
    }
  ];

  const currentWidget = widgetConfigs.find(w => w.id === activeWidget);
  const WidgetComponent = currentWidget?.component;

  // 切换菜单显示状态
  const toggleMenu = useCallback(() => {
    setIsOpen(prev => !prev);
    console.log('菜单切换:', !isOpen);
  }, [isOpen]);

  // 组件切换
  const handleWidgetChange = useCallback((widgetId) => {
    setActiveWidget(widgetId);
    console.log('切换组件:', widgetId);
  }, []);

  // 点击菜单栏外关闭菜单
  const handleMenuOutsideClick = useCallback((e) => {
    if (e.target === e.currentTarget) {
      setIsOpen(false);
    }
  }, []);

  // 处理组件内的操作
  const handleWidgetAction = useCallback((action) => {
    console.log('Widget操作:', action);
    if (onMenuItemClick) {
      onMenuItemClick(action);
    }
  }, [onMenuItemClick]);

  return (
    <>
      {/* 悬浮触发球 */}
      {!isOpen && (
        <div className="fixed top-6 left-6 z-[9999] pointer-events-auto">
          <button
            onClick={toggleMenu}
            className="group relative w-14 h-14 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 bg-slate-800/80 border-2 border-cyan-400/60 hover:bg-slate-700/90 hover:border-cyan-300/80 backdrop-blur-md"
            aria-label="打开菜单"
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <svg className="w-6 h-6 text-cyan-300 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </div>
            <div className="absolute inset-0 rounded-full bg-cyan-400/20 scale-0 group-hover:scale-100 transition-transform duration-300"></div>
            <div className="absolute inset-0 rounded-full border border-cyan-400/30 scale-110 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>
        </div>
      )}

      {/* 侧边栏菜单 */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-[9998] pointer-events-auto"
          onClick={handleMenuOutsideClick}
        >
          <div className="absolute top-0 left-0 h-full w-80 pointer-events-auto transform transition-transform duration-300 ease-out translate-x-0">
            <div className="h-full bg-slate-900/95 backdrop-blur-xl shadow-2xl border-r border-cyan-500/20 relative flex flex-col">
              
              {/* 菜单头部 */}
              <div className="p-6 border-b border-slate-700/40 flex-shrink-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-cyan-400/80 to-blue-500/80 rounded-lg flex items-center justify-center backdrop-blur-sm border border-cyan-400/30">
                      <span className="text-white text-lg font-bold">陕</span>
                    </div>
                    <div>
                      <h2 className="text-white text-lg font-semibold">智慧非遗地图</h2>
                      <p className="text-cyan-200/80 text-sm">Shaanxi Heritage Map</p>
                    </div>
                  </div>
                  
                  {/* 收缩箭头 */}
                  <button
                    onClick={toggleMenu}
                    className="w-8 h-8 bg-slate-800/90 hover:bg-slate-700/95 rounded-lg border border-cyan-400/60 hover:border-cyan-300/80 transition-all duration-200 flex items-center justify-center group"
                    aria-label="收起菜单"
                  >
                    <svg className="w-4 h-4 text-cyan-300 group-hover:text-cyan-200 transition-all duration-200" 
                         fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* 组件选择下拉菜单 */}
              <div className="p-4 border-b border-slate-700/30 flex-shrink-0">
                <label className="block text-white text-sm font-medium mb-2">功能模块</label>
                <select
                  value={activeWidget}
                  onChange={(e) => handleWidgetChange(e.target.value)}
                  className="w-full bg-slate-800/50 border border-slate-600/50 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 transition-all"
                >
                  {widgetConfigs.map(widget => (
                    <option key={widget.id} value={widget.id}>
                      {widget.icon} {widget.label}
                    </option>
                  ))}
                </select>
                {currentWidget && (
                  <p className="text-slate-400 text-xs mt-1">{currentWidget.description}</p>
                )}
              </div>

              {/* 动态组件内容区域 - 移除底部边距，占满剩余空间 */}
              <div className="flex-1 overflow-y-auto p-4 pb-6">
                {WidgetComponent && (
                  <WidgetComponent onAction={handleWidgetAction} />
                )}
              </div>
              
              {/* 删除了底部信息区域 */}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SideMenu;
