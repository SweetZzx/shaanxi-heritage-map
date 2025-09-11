
// 🎨 非遗配置数据
// 包含颜色、样式、级别等配置信息

// 🎨 分类颜色映射
export const CATEGORY_COLORS = {
    '传统戏剧': '#00D9FF',    // 青色
    '传统音乐': '#3B82F6',    // 蓝色  
    '传统舞蹈': '#8B5CF6',    // 紫色
    '曲艺': '#F59E0B',        // 橙色
    '传统体育': '#10B981',    // 绿色
    '传统美术': '#EF4444',    // 红色
    '传统技艺': '#F97316',    // 深橙
    '传统医药': '#84CC16',    // 黄绿
    '民俗': '#EC4899',        // 粉色
    '民间文学': '#6366F1'     // 靛色
  };
  
  // 🏅 保护级别配置
  export const LEVEL_CONFIG = {
    '国家级': { 
      priority: 3, 
      color: '#FFD700',
      bgColor: 'bg-yellow-500/20',
      textColor: 'text-yellow-300',
      borderColor: 'border-yellow-500/30',
      opacity: 1, 
      border: '1px solid rgba(255,215,0,0.8)', 
      shadow: '0 0 8px rgba(255,215,0,0.4)',
      zIndex: 100,
      description: '国家级非物质文化遗产'
    },
    '省级': { 
      priority: 2, 
      color: '#3B82F6',
      bgColor: 'bg-blue-500/20',
      textColor: 'text-blue-300',
      borderColor: 'border-blue-500/30',
      opacity: 0.9, 
      border: '1px solid rgba(59,130,246,0.6)', 
      shadow: '0 0 4px rgba(59,130,246,0.3)',
      zIndex: 50,
      description: '省级非物质文化遗产'
    },
    '市级': { 
      priority: 1, 
      color: '#6B7280',
      bgColor: 'bg-slate-500/20',
      textColor: 'text-slate-300',
      borderColor: 'border-slate-500/30',
      opacity: 0.8, 
      border: '1px solid rgba(255,255,255,0.3)', 
      shadow: '0 0 2px rgba(255,255,255,0.2)',
      zIndex: 10,
      description: '市级非物质文化遗产'
    }
  };
  
  // 📏 标记尺寸配置
  export const MARKER_SIZE_CONFIG = {
    small: { 
      width: 8, 
      height: 10, 
      fontSize: '8px',
      name: '小' 
    },
    medium: { 
      width: 12, 
      height: 15, 
      fontSize: '10px',
      name: '中' 
    },
    large: { 
      width: 16, 
      height: 20, 
      fontSize: '12px',
      name: '大' 
    }
  };
  
  // 🗺️ 地图配置
  export const MAP_CONFIG = {
    // 陕西省中心点
    defaultCenter: [108.95, 34.27],
    defaultZoom: 7,
    
    // 地图边界（大致陕西省范围）
    bounds: {
      north: 39.8,
      south: 31.4,
      east: 111.3,
      west: 105.5
    },
    
    // 适配视图的内边距
    fitViewPadding: [30, 30, 30, 30]
  };
  
  // 📊 数据工具函数
  export const createStatsFromData = (data) => {
    if (!Array.isArray(data) || data.length === 0) {
      return {
        total: 0,
        byCategory: {},
        byLevel: {},
        byCity: {},
        categories: [],
        cities: [],
        levels: []
      };
    }
  
    return {
      total: data.length,
      
      // 按分类统计
      byCategory: data.reduce((acc, item) => {
        if (item?.category) {
          acc[item.category] = (acc[item.category] || 0) + 1;
        }
        return acc;
      }, {}),
      
      // 按保护级别统计
      byLevel: data.reduce((acc, item) => {
        if (item?.level) {
          acc[item.level] = (acc[item.level] || 0) + 1;
        }
        return acc;
      }, {}),
      
      // 按城市统计
      byCity: data.reduce((acc, item) => {
        if (item?.city) {
          acc[item.city] = (acc[item.city] || 0) + 1;
        }
        return acc;
      }, {}),
  
      // 分类列表
      categories: [...new Set(data.map(item => item?.category).filter(Boolean))],
      
      // 城市列表
      cities: [...new Set(data.map(item => item?.city).filter(Boolean))],
      
      // 保护级别列表
      levels: [...new Set(data.map(item => item?.level).filter(Boolean))]
    };
  };
  
  // 🔍 搜索工具函数
  export const searchHeritage = (query, data) => {
    if (!query.trim() || !Array.isArray(data)) return data;
    
    const searchTerm = query.toLowerCase().trim();
    return data.filter(item => 
      item?.name?.toLowerCase().includes(searchTerm) ||
      item?.city?.toLowerCase().includes(searchTerm) ||
      item?.category?.toLowerCase().includes(searchTerm) ||
      item?.summary?.toLowerCase().includes(searchTerm)
    );
  };
  
  // 🏷️ 筛选工具函数
  export const filterByCategories = (categories, data) => {
    if (!categories || categories.size === 0 || !Array.isArray(data)) return data;
    return data.filter(item => item?.category && categories.has(item.category));
  };
  
  export const filterByLevels = (levels, data) => {
    if (!levels || levels.size === 0 || !Array.isArray(data)) return data;
    return data.filter(item => item?.level && levels.has(item.level));
  };
  
  export const filterByCities = (cities, data) => {
    if (!cities || cities.size === 0 || !Array.isArray(data)) return data;
    return data.filter(item => item?.city && cities.has(item.city));
  };
  