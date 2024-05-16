"use server";

import { RegionResultType } from "@/types/type";
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
    if (axios.isCancel(error)) {
      console.log(`Request canceled`);
    } else {
      console.error("There was an error:", error);
    }
    throw error;
  }
};

export const fetchRegionsData = async () =>
  await fetchWrapper<RegionResultType>("region/list");
