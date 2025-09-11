
// 📦 数据模块统一导出
// 便于组件导入和使用

// 导入数据和配置
import heritageData from './heritageData';
import {
  CATEGORY_COLORS,
  LEVEL_CONFIG,
  MARKER_SIZE_CONFIG,
  MAP_CONFIG,
  createStatsFromData,
  searchHeritage,
  filterByCategories,
  filterByLevels,
  filterByCities
} from './heritageConfig';

// 🏛️ 主要数据导出
export { default as heritageData } from './heritageData';

// 🎨 配置数据导出
export {
  CATEGORY_COLORS,
  LEVEL_CONFIG,
  MARKER_SIZE_CONFIG,
  MAP_CONFIG
} from './heritageConfig';

// 🔧 工具函数导出
export {
  createStatsFromData,
  searchHeritage,
  filterByCategories,
  filterByLevels,
  filterByCities
} from './heritageConfig';

// 📊 预计算的统计数据
export const HERITAGE_STATS = createStatsFromData(heritageData);

// 🎯 默认导出（向后兼容）
export default heritageData;
