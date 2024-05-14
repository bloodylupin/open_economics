import { fetchRegionsData } from "@/actions/actions";
import SpeciesList from "@/components/SpeciesList";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

export default async function Home() {
  const data = await fetchRegionsData();

  // console.log(data);

  if (data?.results) {
    const randomNumber = Math.round(Math.random() * (data.results.length - 1));
    const randomRegion = data.results[randomNumber];

    return (
      <main>
        <div className="prose max-w-7xl mx-auto">
          <h1>Vulnerable species from {randomRegion.name}</h1>
          <Suspense fallback="loading">
            <SpeciesList region={randomRegion} />
          </Suspense>
        </div>
      </main>
    );

    // console.log(randomRegion);

    // const regionSpeciesData = await fetchSpeciesDataByRegion(
    //   randomRegion.identifier
    // );

    // console.log(regionSpeciesData);
    // return regionSpeciesData?.result.map((region) => <p>{region}</p>);
  } else {
    return <p>si è verificato un errore! {data?.message}</p>;
  }
}
