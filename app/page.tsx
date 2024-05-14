import { fetchRegionsData } from "@/actions/actions";
import Species from "@/components/Species";
import Container from "@/components/UI/Container";
import Loading from "@/components/UI/Loading";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

export default async function Home() {
  const data = await fetchRegionsData();

  if (data?.results) {
    const randomNumber = Math.round(Math.random() * (data.results.length - 1));
    const randomRegion = data.results[randomNumber];

    return (
      <Container>
        <h1>Vulnerable species from {randomRegion.name}</h1>
        <Suspense fallback={<Loading />}>
          <Species region={randomRegion} />
        </Suspense>
      </Container>
    );
  } else {
    return <p>an error occurred: {data?.message}</p>;
  }
}
