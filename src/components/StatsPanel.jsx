export default function StatsPanel({ total = 0, shown = 0 }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="rounded-lg bg-slate-100 dark:bg-slate-800 p-4 text-center">
        <div className="text-2xl font-bold">{total}</div>
        <div className="text-xs text-slate-500 mt-1">项目总数</div>
      </div>
      <div className="rounded-lg bg-slate-100 dark:bg-slate-800 p-4 text-center">
        <div className="text-2xl font-bold">{shown}</div>
        <div className="text-xs text-slate-500 mt-1">已显示</div>
      </div>
    </div>
  );
}
