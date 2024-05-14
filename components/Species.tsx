import { fetchMeasuresById, fetchSpeciesDataByRegion } from "@/actions/actions";
import { RegionType } from "@/types/type";
import { Suspense } from "react";
import Measures from "./Measures";
import Loading from "./UI/Loading";

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

  // console.log(speciesList);

  // const measures =
  //   speciesList &&
  //   (await Promise.all(
  //     speciesList.map(async (species) => await fetchMeasuresById(species.id))
  //   ));

  // console.log(measures);

  const filteredData =
    speciesList &&
    speciesList
      .filter((species) => species.category === "VU")
      .filter((species) => species.class === "MAMMALIA");

  return (
    <div className="grid grid-cols-3 gap-8">
      {filteredData && filteredData.length ? (
        filteredData.map((data) => (
          <div key={data.id} className="p-8 shadow shadow-black">
            <h2>{data.name}</h2>
            <h2>{data.class}</h2>
            <h3>Conservation measures</h3>
            <Suspense fallback={<Loading />}>
              <Measures id={data.id} />
            </Suspense>
          </div>
        ))
      ) : (
        <p>No species for the selected filter</p>
      )}
    </div>
  );
}
