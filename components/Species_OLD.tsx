import { fetchMeasuresById, fetchSpeciesDataByRegion } from "@/actions/actions";
import { RegionType } from "@/types/type";
// import { throttleRequests } from "@/utils/utils";
import { revalidatePath } from "next/cache";
// import { Suspense } from "react";
// import Measures from "./Measures";
// import Loading from "./UI/Loading";

export default async function Species({ region }: { region: RegionType }) {
  // const data = await fetchSpeciesDataByRegion(region.identifier);
  const data = await fetchSpeciesDataByRegion("europe");

  const speciesList =
    data &&
    data.result &&
    data.result.map((data) => ({
      name: data.scientific_name,
      id: data.taxonid,
      category: data.category,
      class: data.class_name,
    }));

  const filteredData =
    speciesList &&
    speciesList
      .filter((species) => species.category === "VU")
      .filter((species) => species.class === "MAMMALIA");

  const requests =
    filteredData &&
    filteredData.map(
      (species) => async () => await fetchMeasuresById(species.id)
    );

  // const measures = requests && (await throttleRequests(requests, 3, 1000));

  const measures =
    filteredData &&
    (await Promise.all(
      filteredData.map(async (species) => await fetchMeasuresById(species.id))
    ));

  const speciesArray =
    filteredData &&
    measures &&
    filteredData.map((data, index) => ({
      ...data,
      measures: measures[index]?.result
        .map((measure) => measure.title)
        .join(" - "),
    }));

  return (
    <div className="grid grid-cols-3 gap-8">
      {speciesArray && speciesArray.length ? (
        speciesArray.map((data) => (
          <div key={data.id} className="p-8 shadow shadow-black">
            <h2>{data.name}</h2>
            <h2>{data.class}</h2>
            <h3>Conservation measures</h3>
            <ul>
              {data.measures ? (
                data.measures
                  .split(" - ")
                  .map((measure, index) => (
                    <li key={`${measure}-${data.id}-${index}`}>{measure}</li>
                  ))
              ) : (
                <li>no data for this species.</li>
              )}
            </ul>

            {/* <Suspense fallback={<Loading />}>
              <Measures id={data.id} />
            </Suspense> */}
          </div>
        ))
      ) : (
        <p>No species for the selected filter</p>
      )}
    </div>
  );
}
