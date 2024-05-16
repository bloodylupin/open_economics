/**
 * @jest-environment jsdom
 */
import { findByRole, render, screen, fireEvent } from "@testing-library/react";
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

  //   it("Is darker when hovered", async () => {
  //     render(<FilterButton />);
  //     const button = screen.getByRole("button");
  //     expect(
  //       window.getComputedStyle(button).getPropertyValue("background-color")
  //     ).toBe("rgb(59 130 246)");

  //     fireEvent.mouseEnter(button);
  //     expect(
  //       window.getComputedStyle(button).getPropertyValue("background-color")
  //     ).toBe("rgb(29 78 216)");

  //     fireEvent.mouseLeave(button);
  //     expect(
  //       window.getComputedStyle(button).getPropertyValue("background-color")
  //     ).toBe("rgb(59 130 246)");
  //   });
});
