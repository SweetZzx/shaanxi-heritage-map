export default function ProjectCard({ item, onClose }) {
  if (!item) return null;
  
  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-end md:items-center justify-center z-50">
      <div className="card w-full md:max-w-xl md:mx-auto m-2 max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold">{item.name}</h3>
          <button className="btn-outline" onClick={onClose}>
            关闭
          </button>
        </div>
        
        <div className="text-sm text-slate-500 mb-3">
          {item.city} · {item.category} · {item.level}
        </div>
        
        {item.media?.image && (
          <img 
            src={item.media.image} 
            alt={item.name}
            className="w-full h-48 object-cover rounded-md mb-3"
          />
        )}
        
        <p className="leading-relaxed">
          {item.summary || "暂无简介"}
        </p>
      </div>
    </div>
  );
}
