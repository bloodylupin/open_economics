"use client";

import { fetchMeasuresById, fetchSpeciesDataByRegion } from "@/actions/actions";
import { MySpeciesType } from "@/types/type";
import { useQueries, useQuery } from "@tanstack/react-query";
import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

type FilteredSpeciesContextType = {
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  isFiltered: boolean;
  setIsFiltered: Dispatch<SetStateAction<boolean>> | undefined;
  speciesDisplayed:
    | {
        measures: string | undefined;
        isPending: boolean;
        name: string;
        id: number;
        category: string;
        class: string;
      }[]
    | undefined;
};

const FilteredSpeciesContext = createContext<FilteredSpeciesContextType>({
  isLoading: false,
  isError: false,
  error: null,
  isFiltered: false,
  setIsFiltered: undefined,
  speciesDisplayed: [],
});
export const useFilteredSpecies = () => useContext(FilteredSpeciesContext);

export default function FilteredSpeciesProvider({
  children,
  identifier,
}: {
  children: ReactNode;
  identifier: string;
}) {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["species"],
    queryFn: () => fetchSpeciesDataByRegion(identifier),
    // queryFn: () => fetchSpeciesDataByRegion("europe"),
  });

  const speciesList: MySpeciesType[] | undefined =
    data &&
    data.result &&
    data.result.map((data) => ({
      name: data.scientific_name,
      id: data.taxonid,
      category: data.category,
      class: data.class_name,
    }));

  const filteredData =
    speciesList && speciesList.filter((species) => species.category === "VU");

  const requests =
    filteredData &&
    filteredData.map(
      (species) => async () => await fetchMeasuresById(species.id)
    );

  const results = useQueries({
    queries: requests
      ? requests.map((req, index) => ({
          queryKey: ["measures" + index],
          queryFn: req,
        }))
      : [],
    combine: (results) => {
      return {
        data: results.map((result) => result.data),
        arePending: results.map((result) => result.isPending),
        pendingCount: results.filter((result) => result.isPending),
      };
    },
  });

  const measures = results && results.data;
  const arePending = results && results.arePending;

  const speciesArray =
    filteredData &&
    measures &&
    filteredData.map((data, index) => ({
      ...data,
      measures: measures[index]?.result
        .map((measure) => measure.title)
        .join(" - "),
      isPending: arePending[index],
    }));

  const [isFiltered, setIsFiltered] = useState(false);
  const [speciesDisplayed, setSpeciesDisplayed] = useState(speciesArray);

  useEffect(() => {
    if (!speciesArray?.length) return;
    isFiltered
      ? setSpeciesDisplayed(
          speciesArray.filter((species) => species.class === "MAMMALIA")
        )
      : setSpeciesDisplayed(speciesArray);
  }, [isFiltered, speciesArray?.length, results.pendingCount]);

  return (
    <FilteredSpeciesContext.Provider
      value={{
        isLoading,
        isError,
        error,
        isFiltered,
        setIsFiltered,
        speciesDisplayed,
      }}
    >
      {children}
    </FilteredSpeciesContext.Provider>
  );
}
