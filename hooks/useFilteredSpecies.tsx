"use client";

import {
  MeasureResultType,
  MySpeciesType,
  SpeciesResultType,
} from "@/types/type";
import { useQueries, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

import {
  Dispatch,
  MutableRefObject,
  ReactNode,
  SetStateAction,
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
} from "react";

type FilteredSpeciesContextType = {
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  isFiltered: boolean;
  setIsFiltered: Dispatch<SetStateAction<boolean>> | undefined;
  speciesArray:
    | {
        measures: string | undefined;
        isPending: boolean;
        name: string;
        id: number;
        category: string;
        class: string;
      }[]
    | undefined;
  observerRef: MutableRefObject<HTMLDivElement> | undefined;
  pageIndex: number;
  setPageIndex: Dispatch<SetStateAction<number>> | undefined;
  cancelRequest: (() => void) | undefined;
};

const FilteredSpeciesContext = createContext<FilteredSpeciesContextType>({
  isLoading: false,
  isError: false,
  error: null,
  isFiltered: false,
  setIsFiltered: undefined,
  speciesArray: [],
  observerRef: undefined,
  pageIndex: 0,
  setPageIndex: undefined,
  cancelRequest: undefined,
});
export const useFilteredSpecies = () => useContext(FilteredSpeciesContext);

const fetchWrapper = async <T,>(
  url: string,
  signal?: AbortSignal
): Promise<T | undefined> => {
  try {
    const response = await axios.get(
      `https://apiv3.iucnredlist.org/api/v3/${url}?token=${process.env.NEXT_PUBLIC_API_KEY}`,
      { signal }
    );

    if (response.status === 200) {
      if (response.data.results || response.data.result) {
        return response.data;
      } else if (response.data.message) {
        throw new Error(`API Request error: ${response.data.message}`);
      }
    }
  } catch (error) {
    if (axios.isCancel(error)) {
      console.log(`Request canceled`);
    } else {
      console.error("There was an error:", error);
    }
    throw error;
  }
};

const fetchSpeciesDataByRegion = async (identifier: string) => {
  return fetchWrapper<SpeciesResultType>(`species/region/${identifier}/page/0`);
};

const fetchMeasuresById = async (id: number, signal?: AbortSignal) => {
  return fetchWrapper<MeasureResultType>(`measures/species/id/${id}`, signal);
};

export default function FilteredSpeciesProvider({
  children,
  identifier,
}: {
  children: ReactNode;
  identifier: string;
}) {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["species", identifier],
    queryFn: () => fetchSpeciesDataByRegion(identifier),
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

  const [isFiltered, setIsFiltered] = useState(false);

  const filteredData = speciesList
    ? isFiltered
      ? speciesList
          .filter((species) => species.category === "VU")
          .filter((species) => species.class === "MAMMALIA")
      : speciesList.filter((species) => species.category === "VU")
    : undefined;

  const paginatedFilteredData: MySpeciesType[][] = [];
  const SPECIES_TO_LOAD = 9;
  const filteredDataLength = (filteredData?.length || 0) / SPECIES_TO_LOAD;

  for (let i = 0; i < filteredDataLength; i++) {
    paginatedFilteredData.push([]);
    for (let ii = 0; ii < SPECIES_TO_LOAD; ii++) {
      const INDEX = i * SPECIES_TO_LOAD + ii;
      filteredData && paginatedFilteredData[i].push(filteredData[INDEX]);
    }
  }

  const [pageIndex, setPageIndex] = useState(0);
  const observerRef = useRef<HTMLDivElement>(null!);

  const queryClient = useQueryClient();

  const abortControllersRef = useRef<AbortController[]>([]);

  const cancelRequest = useCallback(() => {
    abortControllersRef.current?.forEach((controller) => controller.abort());
    abortControllersRef.current = [];
    queryClient.cancelQueries({
      queryKey: ["measures"],
    });
  }, [queryClient]);

  const requests =
    filteredData &&
    filteredData
      .filter((_, index) => index < (pageIndex + 1) * SPECIES_TO_LOAD)
      .filter(Boolean)
      .map((species, index) => {
        return async () => {
          try {
            const controller = new AbortController();

            abortControllersRef.current[index] = controller;
            return await fetchMeasuresById(species.id, controller.signal);
          } catch (error) {
            if (axios.isCancel(error)) {
              console.log("Request canceled", error.message);
            } else {
              console.log(error);
            }
          }
        };
      });

  const results = useQueries({
    queries: requests
      ? requests.map((req, index) => ({
          queryKey: ["measures", isFiltered, index],
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
    filteredData
      .filter((_, index) => index < (pageIndex + 1) * SPECIES_TO_LOAD)
      .map((data, index) => ({
        ...data,
        measures: measures[index]?.result
          .map((measure) => measure.title)
          .join(" - "),
        isPending: arePending[index],
      }));

  return (
    <FilteredSpeciesContext.Provider
      value={{
        isLoading,
        isError,
        error,
        isFiltered,
        setIsFiltered,
        speciesArray,
        observerRef,
        pageIndex,
        setPageIndex,
        cancelRequest,
      }}
    >
      {children}
    </FilteredSpeciesContext.Provider>
  );
}
