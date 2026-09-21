import { render, screen } from "@testing-library/react";

import TranscriptDisplay from "./TranscriptDisplay";

const LINE = { selector: "p" };

it("renders each transcript chunk in order", () => {
  render(<TranscriptDisplay transcript={["first chunk", "second chunk"]} />);

  const lines = screen.getAllByText(/\S/, LINE).map((line) => line.textContent);
  expect(lines).toEqual(["first chunk", "second chunk"]);
});

it("renders an empty panel when nothing has been transcribed", () => {
  render(<TranscriptDisplay transcript={[]} />);

  expect(screen.getByText("Transcript")).toBeInTheDocument();
  expect(screen.queryAllByText(/\S/, LINE)).toHaveLength(0);
});

it("keeps the newest chunk in view as the transcript grows", () => {
  const { rerender } = render(<TranscriptDisplay transcript={["one"]} />);

  // The scroll container is a plain div with no accessible role, so reach for it
  // directly; jsdom also reports zero layout, hence the explicit scrollHeight.
  // eslint-disable-next-line testing-library/no-node-access
  const panel = screen.getByText("Transcript").closest(".transcript-display");
  Object.defineProperty(panel, "scrollHeight", { value: 640, configurable: true });

  rerender(<TranscriptDisplay transcript={["one", "two"]} />);

  expect(panel.scrollTop).toBe(640);
});
