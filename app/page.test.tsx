/**
 * @jest-environment jsdom
 */
import { render, screen } from "@testing-library/react";
import Home from "./page";
import { fetchRegionsData } from "../actions/actions";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

jest.mock("../components/Species", () => {
  const MockSpecies = jest.fn(() => {
    return <div>{`MockSpecies for region`}</div>;
  });
  return MockSpecies;
});
jest.mock("../components/FilterButton", () => {
  const MockFilterButton = jest.fn(() => {
    return <button>{`MockFilterButton`}</button>;
  });
  return MockFilterButton;
});
jest.mock("../components/InfiniteScroller", () => {
  const MockInfiniteScroller = jest.fn(() => {
    return <div>{`MockInfiniteScroller`}</div>;
  });
  return MockInfiniteScroller;
});

jest.mock("../actions/actions", () => ({
  fetchRegionsData: jest.fn(),
}));

const mockedFetchRegionsData = fetchRegionsData as jest.MockedFunction<
  typeof fetchRegionsData
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
  });

  it("Will render asynchronously", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        {await Home()}
      </QueryClientProvider>
    );
    await screen.findByRole("main");
    expect(screen.getByRole("main")).toHaveTextContent(
      /Vulnerable species from/
    );
  });
  it("Will call child components", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        {await Home()}
      </QueryClientProvider>
    );
    await screen.findByRole("main");
    expect(jest.requireMock("../components/Species")).toHaveBeenCalled();
    expect(jest.requireMock("../components/FilterButton")).toHaveBeenCalled();
    expect(
      jest.requireMock("../components/InfiniteScroller")
    ).toHaveBeenCalled();
  });

  it("Renders error message when fetchRegionsData is empty", async () => {
    mockedFetchRegionsData.mockResolvedValueOnce({ results: [] });
    render(await Home());
    await screen.findByText(/an error occurred/i);
    expect(screen.getByText(/error/i)).toBeInTheDocument();
  });
});
