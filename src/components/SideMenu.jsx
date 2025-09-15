// src/components/SideMenu.jsx
import React, { useState, useCallback } from "react";

const SideMenu = ({ isOpen, onToggle }) => {
  const [activeWidget, setActiveWidget] = useState("widget1"); // 默认选中的小组件

  // 切换组件的处理函数
  const handleWidgetChange = useCallback((e) => {
    setActiveWidget(e.target.value);
  }, []);

  return (
    <>
      {/* 悬浮触发球 */}
      {!isOpen && (
        <div className="fixed top-6 left-6 z-[1000] pointer-events-auto">
          <button
            onClick={onToggle}
            className="w-14 h-14 rounded-full bg-slate-800 border-2 border-cyan-400 transition-transform duration-300 transform hover:scale-110 shadow-lg"
            aria-label="打开侧边菜单"
          >
            <svg
              className="w-6 h-6 text-cyan-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      )}

      {/* 侧边菜单 */}
      {isOpen && (
        <div className="fixed inset-0 z-[999] pointer-events-auto">
          <div className="absolute top-0 left-0 h-full w-80 pointer-events-auto transform transition-transform duration-300 ease-out translate-x-0">
            <div className="h-full bg-slate-900/95 backdrop-blur-xl shadow-2xl border-r border-cyan-500/20 relative flex flex-col">
              {/* 菜单头部 */}
              <div className="p-6 border-b border-slate-700 flex-shrink-0">
                <h2 className="text-white text-lg font-semibold">侧边菜单</h2>
              </div>

              {/* 组件选择下拉菜单 */}
              <div className="p-4 border-b border-slate-700/30 flex-shrink-0">
                <label className="block text-white text-sm font-medium mb-2">选择功能模块</label>
                <select
                  value={activeWidget}
                  onChange={handleWidgetChange}
                  className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400/50 transition-all"
                >
                  <option value="widget1">功能模块 1</option>
                  <option value="widget2">功能模块 2</option>
                  <option value="widget3">功能模块 3</option>
                </select>
              </div>

              {/* 动态组件内容区域 */}
              <div className="flex-1 overflow-y-auto p-4 pb-6">
                {/* 在这里渲染动态组件 - 功能模块 */}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SideMenu;
