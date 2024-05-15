"use client";

import { useFilteredSpecies } from "@/hooks/useFilteredSpecies";

export default function FilterButton() {
  const { isFiltered, setIsFiltered } = useFilteredSpecies();
  const handleOnClick = () => {
    setIsFiltered && setIsFiltered((prevIsFiltered) => !prevIsFiltered);
  };

  return (
    <button
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      onClick={handleOnClick}
    >
      {isFiltered ? "remove filter" : "filter for mammals"}
    </button>
  );
}
