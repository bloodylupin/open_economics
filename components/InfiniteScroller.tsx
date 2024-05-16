"use client";

import { useFilteredSpecies } from "@/hooks/useFilteredSpecies";
import { useEffect } from "react";

export default function InfiniteScroller() {
  const { observerRef, setPageIndex } = useFilteredSpecies();

  const ref = observerRef?.current;

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const [entry] = entries;
      const isOffset = window.scrollY > 500;
      if (entry.isIntersecting && isOffset) {
        setPageIndex && setPageIndex((prevPageIndex) => prevPageIndex + 1);
      }
    });
    if (ref) observer.observe(ref);
    return () => {
      if (ref) observer.unobserve(ref);
    };
  }, [ref, setPageIndex]);

  return <div ref={observerRef} />;
}
