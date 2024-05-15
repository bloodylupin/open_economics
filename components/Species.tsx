"use client";

import { RegionType } from "@/types/type";
import Loading from "./UI/Loading";
import FilterButton from "./FilterButton";
import { useFilteredSpecies } from "@/hooks/useFilteredSpecies";

export default function Species({ region }: { region: RegionType }) {
  const { speciesDisplayed, isLoading, isError, error } = useFilteredSpecies()!;

  if (isLoading) return <Loading />;
  if (isError) return `an error occurred: ${error?.message}`;

  return (
    <div className="grid grid-cols-3 gap-8">
      {/* {speciesArray && speciesArray.length ? (
          speciesArray.map((data) => ( */}
      {speciesDisplayed && speciesDisplayed.length ? (
        speciesDisplayed.map((data) => (
          <div key={data.id} className="p-8 shadow shadow-black">
            <h2>{data.name}</h2>
            <h3>{data.class}</h3>
            <h4 className="p-4 shadow shadow-black w-fit">
              Conservation measures
            </h4>
            <ul>
              {!data.isPending ? (
                data.measures ? (
                  data.measures
                    .split(" - ")
                    .map((measure, index) => (
                      <li key={`${measure}-${data.id}-${index}`}>{measure}</li>
                    ))
                ) : (
                  <li>no data for this species.</li>
                )
              ) : (
                <Loading />
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
