/**
 * @jest-environment jsdom
 */
import { render, screen } from "@testing-library/react";
import Home from "./page";
import { fetchRegionsData, fetchSpeciesDataByRegion } from "../actions/actions";
import { RegionType } from "@/types/type";

jest.mock("../components/Species", () => {
  const MockSpecies = jest.fn(({ region }: { region: RegionType }) => {
    return <div>{`MockSpecies for region: ${region.name}`}</div>;
  });
  return MockSpecies;
});

jest.mock("../actions/actions", () => ({
  fetchRegionsData: jest.fn(),
  fetchSpeciesDataByRegion: jest.fn(),
}));

const mockedFetchRegionsData = fetchRegionsData as jest.MockedFunction<
  typeof fetchRegionsData
>;

const mockedFetchSpeciesDataByRegion =
  fetchSpeciesDataByRegion as jest.MockedFunction<
    typeof fetchSpeciesDataByRegion
  >;

describe("Home Page", () => {
  beforeEach(() => {
    mockedFetchRegionsData.mockImplementation(() =>
      Promise.resolve({
        results: [
          { name: "Europe", identifier: "europe" },
          { name: "Mediterranean", identifier: "mediterranean" },
          { name: "Region 3", identifier: "3" },
        ],
      })
    );
    mockedFetchSpeciesDataByRegion.mockImplementation(() =>
      Promise.resolve({
        result: [
          {
            taxonid: 1,
            kingdom_name: "K",
            phylum_name: "1",
            class_name: "C",
            order_name: "FOO",
            family_name: "BAR",
            genus_name: "BAZ",
            scientific_name: "frog",
            taxonomic_authority: "unknown",
            infra_rank: null,
            infra_name: null,
            population: null,
            category: "VU",
            main_common_name: null,
          },
          {
            taxonid: 2,
            kingdom_name: "K",
            phylum_name: "2",
            class_name: "C",
            order_name: "FOO",
            family_name: "BAR",
            genus_name: "BAZ",
            scientific_name: "frog",
            taxonomic_authority: "unknown",
            infra_rank: null,
            infra_name: null,
            population: null,
            category: "VU",
            main_common_name: null,
          },
          {
            taxonid: 3,
            kingdom_name: "K",
            phylum_name: "3",
            class_name: "C",
            order_name: "FOO",
            family_name: "BAR",
            genus_name: "BAZ",
            scientific_name: "frog",
            taxonomic_authority: "unknown",
            infra_rank: null,
            infra_name: null,
            population: null,
            category: "VU",
            main_common_name: null,
          },
        ],
      })
    );
  });

  it("Will render asynchronously", async () => {
    render(await Home());
    await screen.findByRole("main");
    expect(screen.getByRole("main")).toHaveTextContent(
      /Vulnerable species from/
    );
  });
  it("Will call child components", async () => {
    render(await Home());
    await screen.findByRole("main");
    expect(jest.requireMock("../components/Species")).toHaveBeenCalled();
  });

  it("Renders error message when fetchRegionsData is empty", async () => {
    mockedFetchRegionsData.mockResolvedValueOnce({ results: [] });
    render(await Home());
    await screen.findByText(/an error occurred/i);
    expect(screen.getByText(/error/i)).toBeInTheDocument();
  });
});
