import { fetchRegionsData } from "@/actions/actions";
import FilterButton from "@/components/FilterButton";
import InfiniteScroller from "@/components/InfiniteScroller";
import Species from "@/components/Species";
import Container from "@/components/UI/Container";
import Loading from "@/components/UI/Loading";
import FilteredSpeciesProvider from "@/hooks/useFilteredSpecies";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

export default async function Home() {
  const data = await fetchRegionsData();

  if (!data || !data?.results || data.results.length === 0)
    return <p>an error occurred: {data?.message}</p>;

  const randomNumber = Math.round(Math.random() * (data.results.length - 1));
  const randomRegion = data.results[randomNumber];

  return (
    <FilteredSpeciesProvider identifier={randomRegion.identifier}>
      <Container>
        <div className="flex justify-between items-center mb-4">
          <h1 className="mb-0">Vulnerable species from {randomRegion.name}</h1>
          <FilterButton />
        </div>
        <Suspense fallback={<Loading />}>
          <Species />
        </Suspense>
        <InfiniteScroller />
      </Container>
    </FilteredSpeciesProvider>
  );
}
