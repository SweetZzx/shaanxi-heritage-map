import { useEffect, useMemo, useState } from "react";
import MOCK from "../data/mock";

export const CATEGORIES = [
  "民间文学", "传统音乐", "传统舞蹈", "传统戏剧", "曲艺",
  "传统体育", "传统技艺", "传统医药", "民俗", "传统美术"
];

export default function useHeritageData() {
  const [all, setAll] = useState([]);
  const [query, setQuery] = useState("");
  const [cats, setCats] = useState([]);

  useEffect(() => {
    setAll(MOCK);
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return all.filter((item) => {
      const matchesQuery = q ? 
        (item.name.toLowerCase().includes(q) || 
         item.summary?.toLowerCase().includes(q)) : true;
      const matchesCategory = cats.length ? cats.includes(item.category) : true;
      return matchesQuery && matchesCategory && item.status !== "隐藏";
    });
  }, [all, query, cats]);

  const toggleCat = (category) => {
    setCats((prev) => 
      prev.includes(category) 
        ? prev.filter((c) => c !== category) 
        : [...prev, category]
    );
  };

  const clearCats = () => setCats([]);

  return {
    all,
    filtered,
    total: all.length,
    shown: filtered.length,
    query,
    setQuery,
    cats,
    toggleCat,
    clearCats,
  };
}
