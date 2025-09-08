export default function CategoryFilter({ categories, selected, onToggle, onClear }) {
  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {categories.map((c) => {
          const isActive = selected.includes(c);
          return (
            <button
              key={c}
              className={`tag ${isActive ? "ring-2 ring-slate-400" : ""}`}
              onClick={() => onToggle(c)}
            >
              {c}
            </button>
          );
        })}
      </div>
      <div className="text-right mt-2">
        <button className="text-sm text-slate-500 hover:underline" onClick={onClear}>
          清除筛选
        </button>
      </div>
    </div>
  );
}
