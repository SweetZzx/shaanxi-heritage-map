export default function Footer() {
  return (
    <footer className="mt-6 border-t border-slate-200 dark:border-slate-800">
      <div className="container mx-auto px-4 py-6 text-sm text-slate-500 dark:text-slate-400">
        © {new Date().getFullYear()} 陕西智慧非遗 · 数据示例仅用于演示。地图服务由高德地图提供。
      </div>
    </footer>
  );
}
