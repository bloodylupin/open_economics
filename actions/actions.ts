"use server";

import {
  MeasureResultType,
  RegionResultType,
  SpeciesResultType,
} from "@/types/type";
import axios from "axios";

const fetchWrapper = async <T>(url: string): Promise<T | undefined> => {
  try {
    const response = await axios.get(
      `https://apiv3.iucnredlist.org/api/v3/${url}?token=${process.env.API_KEY}`
    );

    if (response.status === 200) {
      if (response.data.results || response.data.result) {
        return response.data;
      } else if (response.data.message) {
        throw new Error(`API Request error: ${response.data.message}`);
      }
    }
  } catch (error) {
    console.error("There was an error:", error);
    throw error;
  }
};

export const fetchRegionsData = async () =>
  await fetchWrapper<RegionResultType>("region/list");

export const fetchSpeciesDataByRegion = async (identifier: string) =>
  await fetchWrapper<SpeciesResultType>(`species/region/${identifier}/page/0`);

export const fetchMeasuresById = async (id: number) =>
  await fetchWrapper<MeasureResultType>(`measures/species/id/${id}`);
