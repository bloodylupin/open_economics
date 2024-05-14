import { fetchMeasuresById } from "@/actions/actions";

export default async function Measures({ id }: { id: number }) {
  const data = await fetchMeasuresById(id);
  return (
    <ul>
      {data && data.result && data.result.length ? (
        data.result.map((result) => <li key={result.code}>{result.title}</li>)
      ) : (
        <li>no data for this specie.</li>
      )}
    </ul>
  );
}
