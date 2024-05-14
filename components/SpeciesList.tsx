import { fetchSpeciesDataByRegion } from "@/actions/actions";
import { RegionType } from "@/types/type";
import { Suspense } from "react";
import Measures from "./Measures";

export default async function SpeciesList({ region }: { region: RegionType }) {
  // const data = await fetchSpeciesDataByRegion(region.identifier);
  const data = await fetchSpeciesDataByRegion("europe");

  const filteredData =
    data &&
    data.result &&
    data.result
      .filter((data) => data.category === "VU")
      .filter((data) => data.class_name === "MAMMALIA");

  return (
    <div className="grid grid-cols-3 gap-4">
      {filteredData && filteredData.length ? (
        filteredData.map((data) => (
          <div key={data.taxonid} className="p-4 shadow shadow-white">
            <h2>{data.scientific_name}</h2>
            <h2>{data.class_name}</h2>
            <h3>Conservation measures</h3>
            <Suspense fallback="loading">
              <Measures id={data.taxonid} />
            </Suspense>
          </div>
        ))
      ) : (
        <p>No species for the selected filter</p>
      )}
    </div>
  );
}
