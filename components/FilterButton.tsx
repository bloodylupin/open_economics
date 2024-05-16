"use client";

import { useFilteredSpecies } from "@/hooks/useFilteredSpecies";
import clsx from "clsx";

export default function FilterButton() {
  const { isLoading, isFiltered, setIsFiltered, setPageIndex, cancelRequest } =
    useFilteredSpecies();

  const handleOnClick = () => {
    cancelRequest && cancelRequest();
    setIsFiltered && setIsFiltered((prevIsFiltered) => !prevIsFiltered);
    setPageIndex && setPageIndex(0);
  };

  return (
    <button
      className={clsx(
        "bg-blue-500 text-white font-bold py-2 px-4 rounded",
        isLoading ? "cursor-default bg-opacity-25" : "hover:bg-blue-700"
      )}
      onClick={handleOnClick}
      disabled={isLoading}
    >
      {isFiltered ? "remove filter" : "filter for mammals"}
    </button>
  );
}
