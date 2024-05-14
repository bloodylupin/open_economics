export type RegionType = {
  name: string;
  identifier: string;
};
export type RegionResultType = {
  results?: RegionType[];
  message?: string;
};
export type SpeciesType = {
  taxonid: number;
  kingdom_name: string;
  phylum_name: string;
  class_name: string;
  order_name: string;
  family_name: string;
  genus_name: string;
  scientific_name: string;
  taxonomic_authority: string;
  infra_rank: string | null;
  infra_name: string | null;
  population: number | null;
  category: string;
  main_common_name: string | null;
};
export type SpeciesResultType = {
  result?: SpeciesType[];
  message?: string;
};
export type MySpeciesType = {
  name: string;
  id: number;
  category: string;
  class: string;
}[];

export type MeasureResultType = {
  id: string;
  result: { code: string; title: string }[];
};
