export default function SearchBar({ value, onChange }) {
  return (
    <div className="flex items-center gap-2">
      <input
        className="w-full px-3 py-2 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 outline-none focus:ring-2 focus:ring-slate-500"
        placeholder="搜索名称或摘要（如：戏、技艺、皮影）"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label="搜索"
      />
      {value && (
        <button className="btn-outline" onClick={() => onChange("")}>
          清空
        </button>
      )}
    </div>
  );
}
