import React, { useState, useCallback, useMemo, createContext, useContext, useEffect } from 'react';

const HeritageDataContext = createContext(null);

export const useHeritageData = () => {
  const context = useContext(HeritageDataContext);
  if (!context) {
    throw new Error('useHeritageData must be used within HeritageDataManager');
  }
  return context;
};

const HeritageDataManager = ({ data = [], children, onSelectionChange }) => {
  const [selectedCategories, setSelectedCategories] = useState(new Set());
  const [selectedHeritage, setSelectedHeritage] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // 派生状态计算
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

    // 分类过滤逻辑
    const isHidingAll = selectedCategories.has('__HIDE_ALL__');
    
    if (isHidingAll) {
      filteredData = [];
    } else if (selectedCategories.size > 0) {
      filteredData = filteredData.filter(item =>
        selectedCategories.has(item.category)
      );
    }

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

  // 事件处理函数
  const handleCategoryChange = useCallback((newSelectedCategories) => {
    setSelectedCategories(newSelectedCategories);
  }, []);

  const handleHeritageSelect = useCallback((heritage) => {
    setSelectedHeritage(heritage);
  }, []);

  const handleSearch = useCallback((query) => {
    setSearchQuery(query);
  }, []);

  // 快速操作
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

  const reset = useCallback(() => {
    setSelectedCategories(new Set());
    setSelectedHeritage(null);
    setSearchQuery('');
  }, []);

  // 上下文值
  const contextValue = useMemo(() => ({
    data: derivedData,
    selectedCategories,
    selectedHeritage,
    searchQuery,
    onCategoryChange: handleCategoryChange,
    onHeritageSelect: handleHeritageSelect,
    onSearch: handleSearch,
    showAll,
    hideAll,
    selectCategory,
    toggleCategory,
    resetSelection: () => setSelectedCategories(new Set()),
    resetSearch: () => setSearchQuery(''),
    reset
  }), [
    derivedData, selectedCategories, selectedHeritage, searchQuery,
    handleCategoryChange, handleHeritageSelect, handleSearch,
    showAll, hideAll, selectCategory, toggleCategory, reset
  ]);

  return (
    <HeritageDataContext.Provider value={contextValue}>
      {children}
    </HeritageDataContext.Provider>
  );
};

export default HeritageDataManager;