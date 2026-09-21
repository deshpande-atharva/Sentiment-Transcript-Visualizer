import { render, screen } from "@testing-library/react";

import KeywordsDisplay from "./KeywordsDisplay";

const TAG = { selector: ".keyword-tag" };

it("renders one tag per keyword", () => {
  render(<KeywordsDisplay keywords={["storm", "ocean", "calm"]} />);

  expect(screen.getAllByText(/\S/, TAG)).toHaveLength(3);
  expect(screen.getByText("storm", TAG)).toBeInTheDocument();
  expect(screen.getByText("ocean", TAG)).toBeInTheDocument();
  expect(screen.getByText("calm", TAG)).toBeInTheDocument();
});

it("staggers the entry animation across tags", () => {
  render(<KeywordsDisplay keywords={["a", "b", "c"]} />);

  const delays = screen
    .getAllByText(/\S/, TAG)
    .map((tag) => tag.style.animationDelay);

  expect(delays).toEqual(["0s", "0.15s", "0.3s"]);
});

it("renders no tags before any analysis has run", () => {
  render(<KeywordsDisplay keywords={[]} />);

  expect(screen.getByText("Keywords")).toBeInTheDocument();
  expect(screen.queryAllByText(/\S/, TAG)).toHaveLength(0);
});

it("tolerates duplicate keywords returned by the model", () => {
  render(<KeywordsDisplay keywords={["calm", "calm"]} />);

  expect(screen.getAllByText("calm", TAG)).toHaveLength(2);
});
