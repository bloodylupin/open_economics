"use server";

import {
  MeasureResultType,
  RegionResultType,
  SpeciesResultType,
} from "@/types/type";
import axios from "axios";

// const tryCatchWrapper = (callback:(...args: any[]) => ResultType, ...args:any[])=> {
// try {
//     return callback(...args)
// } catch (error) {
//     console.error("Si è verificato un errore:", error);
//     // return <p>Si è verificato un errore:</p>
//     // throw error;
//   }
// }

const API_TOKEN =
  "9bb4facb6d23f48efbf424bb05c0c1ef1cf6f468393bc745d42179ac4aca5fee";

const fetchWrapper = async <T>(url: string): Promise<T | undefined> => {
  try {
    const response = await axios.get(
      `https://apiv3.iucnredlist.org/api/v3/${url}?token=${API_TOKEN}`
    );

    if (response.status === 200) {
      if (response.data.results || response.data.result) {
        return response.data;
      } else if (response.data.message) {
        throw new Error(`Errore nella richiesta API: ${response.data.message}`);
      }
    }
  } catch (error) {
    console.error("Si è verificato un errore:", error);
    throw error;
  }
};

export const fetchRegionsData = async () =>
  await fetchWrapper<RegionResultType>("region/list");

export const fetchSpeciesDataByRegion = async (identifier: string) =>
  await fetchWrapper<SpeciesResultType>(`species/region/${identifier}/page/0`);

export const fetchMeasuresById = async (id: number) =>
  await fetchWrapper<MeasureResultType>(`measures/species/id/${id}`);

// export const fetchRegionsData = async () => {
//   try {
//     const response = (await axios.get(
//       "https://apiv3.iucnredlist.org/api/v3/region/list?token=9bb4facb6d23f48efbf424bb05c0c1ef1cf6f468393bc745d42179ac4aca5fee"
//       //   "https://apiv3.iucnredlist.org/api/v3/region/list?token=9bb4facb6d23f48efbf424bb05c0c1ef1cf6f468393bc745d42179ac4aca5fee"
//     )) as RegionResultType;

//     // console.log(response);
//     if (response.status === 200) {
//       if (response.data.results) {
//         return response.data;
//       } else if (response.data.message) {
//         throw new Error(`Errore nella richiesta API: ${response.data.message}`);
//       }
//     }
//   } catch (error) {
//     console.error("Si è verificato un errore:", error);
//     // return <p>Si è verificato un errore:</p>
//     // throw error;
//   }
// };

// export const fetchSpeciesDataByRegion = async (identifier: string) => {
//   try {
//     const response = (await axios.get(
//       `https://apiv3.iucnredlist.org/api/v3/species/region/${identifier}/page/0?token=9bb4facb6d23f48efbf424bb05c0c1ef1cf6f468393bc745d42179ac4aca5fee`
//     )) as SpeciesResultType;

//     return response.data.result;

//     // if (response.status === 200) {
//     //   if (response.data.results) {
//     //     return response.data;
//     //   } else if (response.data.message) {
//     //     throw new Error(`Errore nella richiesta API: ${response.data.message}`);
//     //   }
//     // }
//   } catch (error) {
//     console.error("Si è verificato un errore:", error);
//   }
// };

// export const fetchConservationMeasuresById = async (id: number) => {
//   const response = await axios.get(
//     `/api/v3/species/narrative/id/${id}?token=9bb4facb6d23f48efbf424bb05c0c1ef1cf6f468393bc745d42179ac4aca5fee`
//   );
//   return response.data.result.conservationmeasures;
// };
