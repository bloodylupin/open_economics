/**
 * @jest-environment jsdom
 */
import { render, screen } from "@testing-library/react";
import FilterButton from "@/components/FilterButton";

describe("FilterButton Features", () => {
  it("Will display as button", () => {
    render(<FilterButton />);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("Will display as blue", () => {
    render(<FilterButton />);
    const button = screen.getByRole("button");
    expect(button.classList[0]).toBe("bg-blue-500");
  });
});
