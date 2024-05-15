/**
 * @jest-environment jsdom
 */
import { render, screen } from "@testing-library/react";
import Container from "@/components/UI/Container";

describe("UI Container Features", () => {
  it("Will display children as content", () => {
    render(<Container>foo</Container>);
    expect(screen.getByRole("main")).toHaveTextContent("foo");
  });

  it("Has prose class", () => {
    render(<Container>bar</Container>);
    const cont = screen.getByText("bar");
    expect(cont.classList[0]).toBe("prose");
  });
  it("Has fixed with", () => {
    render(<Container>baz</Container>);
    const cont = screen.getByText("baz");
    expect(cont.classList[1]).toBe("max-w-7xl");
  });
});
