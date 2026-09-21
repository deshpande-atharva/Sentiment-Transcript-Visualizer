import { act, fireEvent, render, screen } from "@testing-library/react";
import axios from "axios";

import App from "./App";
import {
  MockWebSocket,
  flushAsync,
  installBrowserMocks,
} from "./test-utils/browserMocks";

jest.mock("axios", () => ({ __esModule: true, default: { post: jest.fn() } }));

jest.mock("./components/AuraVisualization", () => (props) => (
  <div
    data-testid="aura"
    data-sentiment={props.sentiment}
    data-emotion={props.emotion}
    data-keywords={props.keywords.join("|")}
  />
));

const mainButton = () =>
  screen.getByRole("button", { name: /start|stop & analyze|analyzing/i });

const aura = () => screen.getByTestId("aura");

beforeEach(() => {
  jest.useFakeTimers();
  installBrowserMocks();
  process.env.REACT_APP_DEEPGRAM_API_KEY = "test-deepgram-key";
  process.env.REACT_APP_BACKEND_URL = "http://backend.test";
});

afterEach(() => {
  jest.useRealTimers();
  jest.clearAllMocks();
});

/** Record a session that produced one finalized transcript, then stop it. */
async function recordAndStop({ finalText = "I am absolutely thrilled" } = {}) {
  render(<App />);

  fireEvent.click(mainButton());
  await flushAsync();

  const socket = MockWebSocket.last;
  await act(async () => {
    socket.emitOpen();
  });

  if (finalText !== null) {
    await act(async () => {
      socket.emitTranscript(finalText, { isFinal: true });
    });
  }

  fireEvent.click(mainButton());
  await flushAsync();
}

describe("successful analysis", () => {
  const analysis = {
    sentiment: 0.8,
    emotion: "excited",
    keywords: ["thrilled", "grateful", "wonderful"],
  };

  it("posts the trimmed transcript to the backend with a bounded timeout", async () => {
    axios.post.mockResolvedValue({ data: analysis });

    await recordAndStop({ finalText: "I am absolutely thrilled" });

    expect(axios.post).toHaveBeenCalledTimes(1);
    expect(axios.post).toHaveBeenCalledWith(
      "http://backend.test/process_text",
      { text: "I am absolutely thrilled" },
      { timeout: 30000 }
    );
  });

  it("propagates emotion and keywords into the visualization", async () => {
    axios.post.mockResolvedValue({ data: analysis });

    await recordAndStop();

    expect(aura()).toHaveAttribute("data-emotion", "excited");
    expect(aura()).toHaveAttribute(
      "data-keywords",
      "thrilled|grateful|wonderful"
    );
  });

  it("renders the extracted keywords", async () => {
    axios.post.mockResolvedValue({ data: analysis });

    await recordAndStop();

    expect(screen.getByText("thrilled")).toBeInTheDocument();
    expect(screen.getByText("grateful")).toBeInTheDocument();
    expect(screen.getByText("wonderful")).toBeInTheDocument();
  });

  it("eases the sentiment toward the target instead of snapping to it", async () => {
    axios.post.mockResolvedValue({ data: analysis });

    await recordAndStop();
    expect(Number(aura().getAttribute("data-sentiment"))).toBe(0);

    await act(async () => {
      jest.advanceTimersByTime(500);
    });
    const midpoint = Number(aura().getAttribute("data-sentiment"));
    expect(midpoint).toBeGreaterThan(0);
    expect(midpoint).toBeLessThan(analysis.sentiment);

    await act(async () => {
      jest.advanceTimersByTime(3000);
    });
    expect(Number(aura().getAttribute("data-sentiment"))).toBe(analysis.sentiment);
  });

  it("shows a blocking analyzing state while the request is in flight", async () => {
    let resolveRequest;
    axios.post.mockReturnValue(
      new Promise((resolve) => {
        resolveRequest = resolve;
      })
    );

    await recordAndStop();

    expect(mainButton()).toHaveTextContent(/analyzing/i);
    expect(mainButton()).toBeDisabled();
    expect(
      screen.getByText(/analyzing sentiment and extracting keywords/i)
    ).toBeInTheDocument();

    await act(async () => {
      resolveRequest({ data: analysis });
    });

    expect(mainButton()).toHaveTextContent(/start/i);
    expect(mainButton()).toBeEnabled();
  });
});

describe("analysis is skipped when there is nothing to analyze", () => {
  it("reports that no speech was detected and never calls the backend", async () => {
    await recordAndStop({ finalText: null });

    expect(axios.post).not.toHaveBeenCalled();
    expect(screen.getByText(/no speech detected/i)).toBeInTheDocument();
  });

  it("ignores interim-only transcripts that were never finalized", async () => {
    render(<App />);
    fireEvent.click(mainButton());
    await flushAsync();

    const socket = MockWebSocket.last;
    await act(async () => {
      socket.emitOpen();
      socket.emitTranscript("interim only", { isFinal: false });
    });

    fireEvent.click(mainButton());
    await flushAsync();

    expect(axios.post).not.toHaveBeenCalled();
    expect(screen.getByText(/no speech detected/i)).toBeInTheDocument();
  });

  it("reports a missing backend URL without issuing a request", async () => {
    delete process.env.REACT_APP_BACKEND_URL;

    await recordAndStop();

    expect(axios.post).not.toHaveBeenCalled();
    expect(screen.getByText(/backend url not configured/i)).toBeInTheDocument();
  });
});

describe("backend failure handling", () => {
  it("distinguishes a client-side timeout", async () => {
    axios.post.mockRejectedValue({ code: "ECONNABORTED" });

    await recordAndStop();

    expect(screen.getByText(/analysis timed out/i)).toBeInTheDocument();
  });

  it("reports the upstream status code when the backend responds with an error", async () => {
    axios.post.mockRejectedValue({
      response: { status: 503, statusText: "Service Unavailable" },
    });

    await recordAndStop();

    expect(
      screen.getByText("Analysis failed: 503 - Service Unavailable")
    ).toBeInTheDocument();
  });

  it("distinguishes an unreachable backend from an error response", async () => {
    axios.post.mockRejectedValue({ request: {} });

    await recordAndStop();

    expect(screen.getByText(/cannot connect to backend/i)).toBeInTheDocument();
  });

  it("leaves the app usable after a failure", async () => {
    axios.post.mockRejectedValue({ request: {} });

    await recordAndStop();

    expect(mainButton()).toHaveTextContent(/start/i);
    expect(mainButton()).toBeEnabled();
  });

  it("lets the user dismiss the error banner", async () => {
    axios.post.mockRejectedValue({ request: {} });

    await recordAndStop();

    fireEvent.click(screen.getByRole("button", { name: "×" }));

    expect(screen.queryByText(/cannot connect to backend/i)).not.toBeInTheDocument();
  });
});
