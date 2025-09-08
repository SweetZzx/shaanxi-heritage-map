export default function MapControls({ base, setBase, roadnet, setRoadnet, onReset, visible, setVisible }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <button className="btn" onClick={() => setVisible((v) => !v)}>
        {visible ? "隐藏全部" : "显示全部"}
      </button>
      <button className="btn" onClick={onReset}>
        回到陕西
      </button>

      <div className="flex items-center gap-2 ml-2">
        <span className="text-sm font-medium">底图:</span>
        <button 
          className={`btn-outline ${base === "vector" ? "ring-2 ring-slate-400" : ""}`} 
          onClick={() => setBase("vector")}
        >
          矢量
        </button>
        <button 
          className={`btn-outline ${base === "satellite" ? "ring-2 ring-slate-400" : ""}`} 
          onClick={() => setBase("satellite")}
        >
          卫星
        </button>
      </div>

      <label className="inline-flex items-center gap-2 ml-2">
        <input 
          type="checkbox" 
          checked={roadnet} 
          onChange={(e) => setRoadnet(e.target.checked)} 
        />
        <span className="text-sm">路网叠加</span>
      </label>
    </div>
  );
}
