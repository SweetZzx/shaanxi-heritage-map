
import React, { useCallback, useMemo } from 'react';
import { CATEGORY_COLORS } from '../../data';
import { useHeritageData } from '../HeritageDataManager';

const HeritageControlWidget = ({ onAction }) => {
  // 使用数据管理上下文
  const {
    data,
    selectedCategories,
    selectedHeritage,
    onCategoryChange,
    showAll,
    hideAll
  } = useHeritageData();

  // 统计数据计算
  const stats = useMemo(() => {
    if (!data?.raw || data.raw.length === 0) {
      return {
        total: 0,
        selected: 0,
        categoryStats: {},
        isHidingAll: false
      };
    }

    const categoryStats = {};
    data.raw.forEach(item => {
      categoryStats[item.category] = (categoryStats[item.category] || 0) + 1;
    });

    // 检查是否是隐藏全部状态
    const isHidingAll = selectedCategories?.has('__HIDE_ALL__') || false;
    
    const selected = isHidingAll ? 0 : 
      (selectedCategories?.size === 0 ? 
        data.raw.length : // 空选择 = 显示全部
        data.raw.filter(item => selectedCategories.has(item.category)).length);

    return {
      total: data.raw.length,
      selected,
      categoryStats,
      isHidingAll
    };
  }, [data, selectedCategories]);

  // 获取所有分类
  const allCategories = Object.keys(stats.categoryStats);
  
  // 判断是否显示全部
  const isShowingAll = !stats.isHidingAll && (
    selectedCategories?.size === 0 || 
    (allCategories.length > 0 && 
     selectedCategories?.size === allCategories.length && 
     allCategories.every(category => selectedCategories.has(category)))
  );

  // 处理显示全部按钮点击
  const handleToggleAll = useCallback(() => {
    if (!onCategoryChange) return;

    try {
      if (isShowingAll) {
        // 当前是显示全部，点击后隐藏全部
        hideAll?.();
        onCategoryChange(new Set(['__HIDE_ALL__']));
      } else {
        // 当前不是显示全部，点击后显示全部
        showAll?.();
        onCategoryChange(new Set()); // 空集合 = 显示全部
      }
    } catch (error) {
      console.error('显示全部按钮处理错误:', error);
    }
  }, [isShowingAll, hideAll, showAll, onCategoryChange]);

  // 处理分类选择
  const handleCategoryToggle = useCallback((category) => {
    if (!onCategoryChange || !selectedCategories) return;

    try {
      // 如果当前是隐藏全部状态，清除这个状态，然后只选中点击的分类
      if (stats.isHidingAll) {
        onCategoryChange(new Set([category]));
        return;
      }
      
      // 如果当前是显示全部状态（空集合或所有分类都选中）
      if (selectedCategories.size === 0 || 
          (selectedCategories.size === allCategories.length && 
           allCategories.every(cat => selectedCategories.has(cat)))) {
        // 从显示全部变为取消点击的分类
        const newSelected = new Set(allCategories.filter(cat => cat !== category));
        onCategoryChange(newSelected);
        return;
      }
      
      // 普通的切换逻辑
      const newSelected = new Set(selectedCategories);
      
      if (newSelected.has(category)) {
        // 取消选中该分类
        newSelected.delete(category);
        // 如果取消后没有任何选中，变为隐藏全部状态
        if (newSelected.size === 0) {
          onCategoryChange(new Set(['__HIDE_ALL__']));
        } else {
          onCategoryChange(newSelected);
        }
      } else {
        // 添加该分类到选中列表
        newSelected.add(category);
        // 检查是否选中了所有分类
        if (newSelected.size === allCategories.length && 
            allCategories.every(cat => newSelected.has(cat))) {
          // 所有分类都选中了，变为显示全部状态（空集合）
          onCategoryChange(new Set());
        } else {
          onCategoryChange(newSelected);
        }
      }
    } catch (error) {
      console.error('分类切换处理错误:', error);
    }
  }, [selectedCategories, onCategoryChange, allCategories, stats.isHidingAll]);

  // 计算分类列表
  const categoryList = Object.entries(stats.categoryStats).sort(([,a], [,b]) => b - a);

  // 渲染前检查
  if (!data || !selectedCategories) {
    return (
      <div className="flex items-center justify-center h-32 text-slate-400">
        <div className="text-center">
          <div className="text-sm">数据加载中...</div>
          <div className="text-xs mt-1">请稍候</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* 分类筛选区域 */}
      <div className="bg-slate-800/30 rounded-lg border border-slate-700/30 flex flex-col flex-1">
        {/* 标题区域 */}
        <div className="flex-shrink-0 p-3 border-b border-slate-700/30">
          <div className="flex items-center space-x-2">
            <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse"></div>
            <span className="text-white text-xs font-medium">非遗标记控制</span>
            <span className="text-slate-400 text-xs">
              ({stats.selected} / {stats.total})
            </span>
          </div>
        </div>

        {/* 按钮区域 */}
        <div className="flex-1 p-3 flex flex-col">
          {/* 显示全部按钮 */}
          <div className="flex-shrink-0 mb-3">
            <button
              onClick={handleToggleAll}
              className={`w-full px-2.5 py-2.5 rounded-md text-xs transition-all duration-300 border text-left group relative overflow-hidden ${
                isShowingAll
                  ? 'bg-green-600/25 text-white border-green-500/60 shadow-md'
                  : 'bg-slate-800/40 text-slate-300 hover:bg-slate-700/50 border-slate-600/30 hover:transform hover:scale-101'
              }`}
            >
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-15 transition-opacity duration-300"
                style={{
                  background: isShowingAll 
                    ? 'linear-gradient(135deg, #10b98140, transparent)' 
                    : 'linear-gradient(135deg, #64748b40, transparent)'
                }}
              ></div>
              
              <div className="relative flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full transition-all duration-300 bg-green-400 ${
                    isShowingAll ? 'scale-110 shadow-sm animate-pulse' : 'group-hover:scale-105'
                  }`}></div>
                  
                  <span className={`font-medium transition-colors duration-300 text-xs ${
                    isShowingAll ? 'text-white' : 'group-hover:text-slate-200'
                  }`}>
                    显示全部标记
                  </span>
                </div>
                
                <div className={`px-2 py-0.5 rounded-full text-xs font-bold transition-all duration-300 ${
                  isShowingAll 
                    ? 'bg-white/20 text-white shadow-sm' 
                    : 'bg-slate-700/50 text-slate-400 group-hover:bg-slate-600/60 group-hover:text-slate-300'
                }`}>
                  {stats.selected}
                </div>
              </div>

              {isShowingAll && (
                <>
                  <div className="absolute left-0 top-0 w-0.5 h-full rounded-r-full bg-green-400"></div>
                  <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-cyan-400 rounded-full flex items-center justify-center animate-pulse">
                    <div className="w-1 h-1 bg-white rounded-full"></div>
                  </div>
                </>
              )}
            </button>
          </div>

          {/* 分隔线 */}
          <div className="border-t border-slate-600/30 mb-3 flex-shrink-0"></div>

          {/* 分类按钮列表 */}
          <div className="flex-1 flex flex-col" style={{ gap: '0.375rem' }}>
            {categoryList.map(([category, count]) => {
              // 分类是否被选中
              const isSelected = stats.isHidingAll ? false : 
                (selectedCategories.size === 0 || selectedCategories.has(category));
              const color = CATEGORY_COLORS[category];
              
              // 动态计算每个按钮的高度
              const buttonHeight = `calc((100% - ${(categoryList.length - 1) * 0.375}rem) / ${categoryList.length})`;
              
              return (
                <button
                  key={category}
                  onClick={() => handleCategoryToggle(category)}
                  className={`w-full px-2.5 rounded-md text-xs transition-all duration-300 border text-left group relative overflow-hidden ${
                    isSelected
                      ? 'bg-opacity-25 text-white border-opacity-60 shadow-md'
                      : 'bg-slate-800/40 text-slate-300 hover:bg-slate-700/50 border-slate-600/30 hover:transform hover:scale-101'
                  }`}
                  style={{
                    height: buttonHeight,
                    minHeight: '2rem',
                    backgroundColor: isSelected ? `${color}25` : undefined,
                    borderColor: isSelected ? `${color}60` : undefined,
                    boxShadow: isSelected ? `0 0 8px ${color}30` : undefined
                  }}
                >
                  <div 
                    className="absolute inset-0 opacity-0 group-hover:opacity-15 transition-opacity duration-300"
                    style={{
                      background: `linear-gradient(135deg, ${color}40, transparent)`
                    }}
                  ></div>
                  
                  <div className="relative flex items-center justify-between h-full">
                    <div className="flex items-center space-x-2">
                      <div
                        className={`w-3 h-3 rounded-full transition-all duration-300 flex-shrink-0 ${
                          isSelected ? 'scale-110 shadow-sm' : 'group-hover:scale-105'
                        }`}
                        style={{ 
                          backgroundColor: color,
                          boxShadow: isSelected ? `0 0 4px ${color}60` : undefined
                        }}
                      ></div>
                      
                      <span className={`font-medium transition-colors duration-300 text-xs leading-tight ${
                        isSelected ? 'text-white' : 'group-hover:text-slate-200'
                      }`}>
                        {category.replace('传统', '')}
                      </span>
                    </div>
                    
                    <div className={`px-2 py-0.5 rounded-full text-xs font-bold transition-all duration-300 flex-shrink-0 ${
                      isSelected 
                        ? 'bg-white/20 text-white shadow-sm' 
                        : 'bg-slate-700/50 text-slate-400 group-hover:bg-slate-600/60 group-hover:text-slate-300'
                    }`}>
                      {count}
                    </div>
                  </div>

                  {isSelected && (
                    <>
                      <div 
                        className="absolute left-0 top-0 w-0.5 h-full rounded-r-full"
                        style={{ backgroundColor: color }}
                      ></div>
                      <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-cyan-400 rounded-full flex items-center justify-center animate-pulse">
                        <div className="w-1 h-1 bg-white rounded-full"></div>
                      </div>
                    </>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 当前选中信息 */}
      {selectedHeritage && (
        <div className="flex-shrink-0 mt-3 bg-gradient-to-r from-purple-900/20 to-blue-900/20 rounded-lg p-3 border border-purple-500/30">
          <div className="flex items-center space-x-1.5 mb-2">
            <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-ping"></div>
            <span className="text-purple-300 text-xs font-medium">当前选中</span>
          </div>
          
          <div className="space-y-1.5">
            <div className="text-white font-medium text-xs">
              {selectedHeritage.name}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-300 text-xs">{selectedHeritage.city}</span>
              <span className="px-1.5 py-0.5 bg-purple-600/20 text-purple-300 text-xs rounded border border-purple-500/30">
                {selectedHeritage.level}
              </span>
            </div>
            {selectedHeritage.summary && (
              <div className="text-slate-400 text-xs leading-relaxed pt-1.5 border-t border-slate-700/30 line-clamp-2">
                {selectedHeritage.summary}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default HeritageControlWidget;
