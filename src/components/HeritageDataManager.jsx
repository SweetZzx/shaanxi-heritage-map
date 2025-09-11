
import React, { useState, useCallback, useMemo, createContext, useContext, useEffect } from 'react';

// 🗄️ 非遗数据上下文
const HeritageDataContext = createContext(null);

export const useHeritageData = () => {
  const context = useContext(HeritageDataContext);
  if (!context) {
    throw new Error('useHeritageData must be used within HeritageDataManager');
  }
  return context;
};

const HeritageDataManager = React.memo(({ 
  data = [],
  children,
  onSelectionChange
}) => {
  // 🎯 简化状态管理 - 移除layerVisible，只用selectedCategories控制一切
  const [selectedCategories, setSelectedCategories] = useState(new Set());
  const [selectedHeritage, setSelectedHeritage] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // 📊 派生状态计算
  const derivedData = useMemo(() => {
    let filteredData = data;

    // 搜索过滤
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filteredData = filteredData.filter(item =>
        item.name.toLowerCase().includes(query) ||
        item.city.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query)
      );
    }

    // 简化分类过滤逻辑：只用selectedCategories控制
    const isHidingAll = selectedCategories.has('__HIDE_ALL__');
    
    if (isHidingAll) {
      // 隐藏全部状态：返回空数组
      filteredData = [];
    } else if (selectedCategories.size > 0) {
      // 有选中的分类：只显示选中的分类
      filteredData = filteredData.filter(item =>
        selectedCategories.has(item.category)
      );
    }
    // 空选择：显示全部（filteredData保持不变）

    // 计算是否可见：只要不是隐藏全部状态就可见
    const isVisible = !isHidingAll;

    return {
      raw: data,
      filtered: filteredData,
      visible: isVisible,
      categories: [...new Set(data.map(item => item.category))],
      cities: [...new Set(data.map(item => item.city))],
      levels: [...new Set(data.map(item => item.level))],
      stats: {
        total: data.length,
        filtered: filteredData.length,
        selected: selectedCategories.size,
        isHidingAll,
        byCategory: data.reduce((acc, item) => {
          acc[item.category] = (acc[item.category] || 0) + 1;
          return acc;
        }, {}),
        byLevel: data.reduce((acc, item) => {
          acc[item.level] = (acc[item.level] || 0) + 1;
          return acc;
        }, {}),
        byCity: data.reduce((acc, item) => {
          acc[item.city] = (acc[item.city] || 0) + 1;
          return acc;
        }, {})
      }
    };
  }, [data, selectedCategories, searchQuery]);

  // 数据更新通知
  useEffect(() => {
    if (onSelectionChange) {
      onSelectionChange({
        categories: selectedCategories,
        data: derivedData.filtered,
        visible: derivedData.visible
      });
    }
  }, [selectedCategories, derivedData.filtered, derivedData.visible, onSelectionChange]);

  // 🎯 分类选择处理
  const handleCategoryChange = useCallback((newSelectedCategories) => {
    setSelectedCategories(newSelectedCategories);
  }, []);

  // 🏛️ 非遗项目选择
  const handleHeritageSelect = useCallback((heritage) => {
    setSelectedHeritage(heritage);
  }, []);

  // 🔍 搜索功能
  const handleSearch = useCallback((query) => {
    setSearchQuery(query);
  }, []);

  // 🎮 快速操作 - 简化版本
  const showAll = useCallback(() => {
    setSelectedCategories(new Set());
  }, []);

  const hideAll = useCallback(() => {
    setSelectedCategories(new Set(['__HIDE_ALL__']));
  }, []);

  const selectCategory = useCallback((category) => {
    setSelectedCategories(new Set([category]));
  }, []);

  const toggleCategory = useCallback((category) => {
    const newSelected = new Set(selectedCategories);
    if (newSelected.has(category)) {
      newSelected.delete(category);
    } else {
      newSelected.add(category);
    }
    handleCategoryChange(newSelected);
  }, [selectedCategories, handleCategoryChange]);

  // 🎯 上下文值
  const contextValue = useMemo(() => ({
    // 数据状态
    data: derivedData,
    selectedCategories,
    selectedHeritage,
    searchQuery,

    // 操作方法
    onCategoryChange: handleCategoryChange,
    onHeritageSelect: handleHeritageSelect,
    onSearch: handleSearch,

    // 快速操作
    showAll,
    hideAll,
    selectCategory,
    toggleCategory,

    // 工具方法
    resetSelection: () => setSelectedCategories(new Set()),
    resetSearch: () => setSearchQuery(''),
    reset: () => {
      setSelectedCategories(new Set());
      setSelectedHeritage(null);
      setSearchQuery('');
    }
  }), [
    derivedData, selectedCategories, selectedHeritage, searchQuery,
    handleCategoryChange, handleHeritageSelect, handleSearch,
    showAll, hideAll, selectCategory, toggleCategory
  ]);

  return (
    <HeritageDataContext.Provider value={contextValue}>
      {children}
    </HeritageDataContext.Provider>
  );
});

HeritageDataManager.displayName = 'HeritageDataManager';

export default HeritageDataManager;
