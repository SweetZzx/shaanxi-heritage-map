import { useEffect, useState } from "react";

export default function Header() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    if (dark) root.classList.add("dark");
    else root.classList.remove("dark");
  }, [dark]);

  return (
    <header className="border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/80 backdrop-blur">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">陕西智慧非遗地图</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">传承千年文化 · 智慧展示未来</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn-outline" onClick={() => setDark((v) => !v)}>
            {dark ? "切换亮色" : "切换暗色"}
          </button>
          <a className="btn" href="https://github.com/${GH_USER}/${REPO_NAME}" target="_blank" rel="noreferrer">
            GitHub
          </a>
        </div>
      </div>
    </header>
  );
}
