import { act, fireEvent, render, screen } from "@testing-library/react";

import App from "./App";
import {
  MockWebSocket,
  flushAsync,
  installBrowserMocks,
  pumpAudio,
} from "./test-utils/browserMocks";

jest.mock("axios", () => ({ __esModule: true, default: { post: jest.fn() } }));

jest.mock("./components/AuraVisualization", () => (props) => (
  <div data-testid="aura" data-sentiment={props.sentiment} />
));

const mainButton = () =>
  screen.getByRole("button", { name: /start|stop & analyze|analyzing/i });

let mocks;

beforeEach(() => {
  jest.useFakeTimers();
  mocks = installBrowserMocks();
  process.env.REACT_APP_DEEPGRAM_API_KEY = "test-deepgram-key";
  process.env.REACT_APP_BACKEND_URL = "http://backend.test";
});

afterEach(() => {
  jest.useRealTimers();
  jest.clearAllMocks();
});

async function startRecording() {
  render(<App />);
  fireEvent.click(mainButton());
  await flushAsync();
  return MockWebSocket.last;
}

async function startAndOpenSocket() {
  const socket = await startRecording();
  await act(async () => {
    socket.emitOpen();
  });
  return socket;
}

describe("idle state", () => {
  it("offers to start recording and reports an inactive microphone", () => {
    render(<App />);

    expect(mainButton()).toHaveTextContent(/start/i);
    expect(screen.getByText(/not recording/i)).toBeInTheDocument();
    expect(MockWebSocket.instances).toHaveLength(0);
  });
});

describe("starting a recording session", () => {
  it("requests a mono 16 kHz stream with noise handling enabled", async () => {
    await startRecording();

    expect(mocks.getUserMedia).toHaveBeenCalledWith({
      audio: {
        channelCount: 1,
        sampleRate: 16000,
        echoCancellation: true,
        noiseSuppression: true,
      },
    });
  });

  it("opens a Deepgram socket with linear16 parameters and token subprotocol auth", async () => {
    const socket = await startRecording();

    expect(socket.url).toContain("wss://api.deepgram.com/v1/listen");
    expect(socket.url).toContain("encoding=linear16");
    expect(socket.url).toContain("sample_rate=16000");
    expect(socket.url).toContain("channels=1");
    expect(socket.protocols).toEqual(["token", "test-deepgram-key"]);
  });

  it("switches to the recording state", async () => {
    await startRecording();

    expect(mainButton()).toHaveTextContent(/stop & analyze/i);
    expect(screen.getByText(/🔴 recording/i)).toBeInTheDocument();
  });

  it("defers building the audio graph until the socket is open", async () => {
    const socket = await startRecording();
    expect(mocks.audioContext.createScriptProcessor).not.toHaveBeenCalled();

    await act(async () => {
      socket.emitOpen();
    });

    expect(mocks.audioContext.options).toEqual({ sampleRate: 16000 });
    expect(mocks.audioContext.createMediaStreamSource).toHaveBeenCalledWith(
      mocks.stream
    );
    expect(mocks.processor.bufferSize).toBe(4096);
    expect(mocks.sourceNode.connect).toHaveBeenCalledWith(mocks.processor);
    expect(mocks.processor.connect).toHaveBeenCalledWith(
      mocks.audioContext.destination
    );
  });

  it("surfaces an error and opens no socket when the Deepgram key is absent", async () => {
    delete process.env.REACT_APP_DEEPGRAM_API_KEY;

    await startRecording();

    expect(screen.getByText(/deepgram api key not found/i)).toBeInTheDocument();
    expect(MockWebSocket.instances).toHaveLength(0);
    expect(mainButton()).toHaveTextContent(/start/i);
  });

  it("surfaces microphone permission failures", async () => {
    mocks.getUserMedia.mockRejectedValue(new Error("Permission denied"));

    await startRecording();

    expect(screen.getByText("Permission denied")).toBeInTheDocument();
    expect(mainButton()).toHaveTextContent(/start/i);
  });
});

describe("audio encoding", () => {
  it("converts clamped Float32 samples to signed 16-bit PCM", async () => {
    const socket = await startAndOpenSocket();

    pumpAudio(mocks.processor, [0, 1, -1, 0.5, -0.5, 2, -2]);

    expect(socket.sentFrames).toHaveLength(1);
    const pcm = new Int16Array(socket.sentFrames[0]);
    expect(Array.from(pcm)).toEqual([0, 32767, -32768, 16383, -16384, 32767, -32768]);
  });

  it("drops audio instead of throwing once the socket is no longer open", async () => {
    const socket = await startAndOpenSocket();
    socket.readyState = MockWebSocket.CLOSED;

    pumpAudio(mocks.processor, [0.25, 0.25]);

    expect(socket.sentFrames).toHaveLength(0);
  });
});

describe("transcript handling", () => {
  it("renders interim transcripts as they stream in", async () => {
    const socket = await startAndOpenSocket();

    await act(async () => {
      socket.emitTranscript("hello there");
      socket.emitTranscript("this is a test");
    });

    expect(screen.getByText("hello there")).toBeInTheDocument();
    expect(screen.getByText("this is a test")).toBeInTheDocument();
  });

  it("ignores metadata frames and empty transcripts", async () => {
    const socket = await startAndOpenSocket();

    await act(async () => {
      socket.emitMessage({ type: "Metadata", channel: { alternatives: [] } });
      socket.emitTranscript("");
      socket.emitTranscript("   ");
      socket.emitMessage({ type: "Results", channel: { alternatives: [] } });
    });

    expect(screen.queryAllByText(/\S/, { selector: "p" })).toHaveLength(0);
  });
});

describe("socket failure handling", () => {
  it("reports transport errors", async () => {
    const socket = await startAndOpenSocket();

    await act(async () => {
      socket.emitError();
    });

    expect(
      screen.getByText(/connection error with transcription service/i)
    ).toBeInTheDocument();
  });

  it("reports abnormal close codes", async () => {
    const socket = await startAndOpenSocket();

    await act(async () => {
      socket.emitClose(1006);
    });

    expect(screen.getByText(/disconnected unexpectedly/i)).toBeInTheDocument();
  });

  it.each([1000, 1005])("treats close code %i as a normal shutdown", async (code) => {
    const socket = await startAndOpenSocket();

    await act(async () => {
      socket.emitClose(code);
    });

    expect(screen.queryByText(/disconnected unexpectedly/i)).not.toBeInTheDocument();
  });
});

describe("teardown", () => {
  it("releases the processor, audio context, socket and media tracks on stop", async () => {
    const socket = await startAndOpenSocket();

    fireEvent.click(mainButton());
    await flushAsync();

    expect(mocks.processor.disconnect).toHaveBeenCalledTimes(1);
    expect(mocks.audioContext.close).toHaveBeenCalledTimes(1);
    expect(socket.closeCalls).toHaveLength(1);
    expect(mocks.track.stop).toHaveBeenCalledTimes(1);
    expect(screen.getByText(/not recording/i)).toBeInTheDocument();
  });
});
