"use client";

import Container from "@/components/UI/Container";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <Container>
      <h2>Something went wrong!</h2>
      <h3>{error.name}</h3>
      <p>{error.message}</p>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={
          // Attempt to recover by trying to re-render the segment
          () => reset()
        }
      >
        Try again
      </button>
    </Container>
  );
}
