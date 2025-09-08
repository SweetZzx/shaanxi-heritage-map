import { useMemo, useState } from "react";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import StatsPanel from "../components/StatsPanel.jsx";
import SearchBar from "../components/SearchBar.jsx";
import CategoryFilter from "../components/CategoryFilter.jsx";
import MapControls from "../components/MapControls.jsx";
import MapView from "../components/MapView.jsx";
import ProjectCard from "../components/ProjectCard.jsx";
import useHeritageData, { CATEGORIES } from "../hooks/useHeritageData.js";

const XI_AN_CENTER = [108.9398, 34.3416]; // [lng, lat]

export default function Home() {
  const { filtered, total, shown, query, setQuery, cats, toggleCat, clearCats } = useHeritageData();
  const [visible, setVisible] = useState(true);
  const [base, setBase] = useState("vector");
  const [roadnet, setRoadnet] = useState(false);
  const [center, setCenter] = useState(XI_AN_CENTER);
  const [zoom, setZoom] = useState(7);
  const [active, setActive] = useState(null);

  const resetView = () => {
    setCenter([...XI_AN_CENTER]);
    setZoom(7);
  };

  const stats = useMemo(() => ({ total, shown }), [total, shown]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-4">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
          <section className="xl:col-span-4 space-y-4">
            <div className="card">
              <h2 className="text-lg font-semibold mb-2">项目概览</h2>
              <StatsPanel {...stats} />
            </div>

            <div className="card">
              <SearchBar value={query} onChange={setQuery} />
              <div className="mt-3">
                <CategoryFilter
                  categories={CATEGORIES}
                  selected={cats}
                  onToggle={toggleCat}
                  onClear={clearCats}
                />
              </div>
            </div>

            <div className="card">
              <MapControls
                base={base}
                setBase={setBase}
                roadnet={roadnet}
                setRoadnet={setRoadnet}
                onReset={resetView}
                visible={visible}
                setVisible={setVisible}
              />
            </div>

            <div className="card">
              <h3 className="font-semibold mb-2">当前显示的项目（{shown}/{total}）</h3>
              <ul className="max-h-72 overflow-auto space-y-2">
                {filtered.map((it) => (
                  <li key={it.id} className="p-2 rounded hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer"
                      onClick={() => setActive(it)}>
                    <div className="font-medium">{it.name}</div>
                    <div className="text-sm text-slate-500">{it.city} · {it.category} · {it.level}</div>
                  </li>
                ))}
                {!filtered.length && <li className="text-slate-500">无匹配结果</li>}
              </ul>
            </div>
          </section>

          <section className="xl:col-span-8">
            <div className="h-[70vh] xl:h-[78vh] rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700">
              <MapView
                items={filtered}
                visible={visible}
                base={base}
                roadnet={roadnet}
                center={center}
                zoom={zoom}
                onMarkerClick={setActive}
              />
            </div>
          </section>
        </div>
      </main>

      <Footer />
      {active && <ProjectCard item={active} onClose={() => setActive(null)} />}
    </div>
  );
}
