import { ReactNode } from "react";

export default function Container({ children }: { children: ReactNode }) {
  return (
    <main>
      <div className="prose max-w-7xl mx-auto px-4 py-8">{children}</div>
    </main>
  );
}
