/**
 * Test doubles for the browser APIs the recording pipeline depends on:
 * getUserMedia, WebSocket and the Web Audio graph. jsdom implements none of them.
 */
import { act } from "@testing-library/react";

/**
 * Let the promise chain a click kicked off (getUserMedia, axios) settle and
 * flush the resulting React updates.
 */
export function flushAsync() {
  return act(async () => {
    await Promise.resolve();
    await Promise.resolve();
  });
}

export class MockWebSocket {
  static CONNECTING = 0;
  static OPEN = 1;
  static CLOSING = 2;
  static CLOSED = 3;

  static instances = [];

  static reset() {
    MockWebSocket.instances = [];
  }

  static get last() {
    return MockWebSocket.instances[MockWebSocket.instances.length - 1];
  }

  constructor(url, protocols) {
    this.url = url;
    this.protocols = protocols;
    this.readyState = MockWebSocket.CONNECTING;
    this.sentFrames = [];
    this.closeCalls = [];
    MockWebSocket.instances.push(this);
  }

  send(data) {
    this.sentFrames.push(data);
  }

  close(code) {
    this.readyState = MockWebSocket.CLOSED;
    this.closeCalls.push(code);
  }

  // --- helpers driven by tests, mirroring Deepgram's socket lifecycle ---

  emitOpen() {
    this.readyState = MockWebSocket.OPEN;
    this.onopen?.({ type: "open" });
  }

  emitMessage(payload) {
    this.onmessage?.({ data: JSON.stringify(payload) });
  }

  emitTranscript(transcript, { isFinal = false } = {}) {
    this.emitMessage({
      type: "Results",
      is_final: isFinal,
      channel: { alternatives: [{ transcript }] },
    });
  }

  emitError() {
    this.onerror?.({ type: "error" });
  }

  emitClose(code) {
    this.readyState = MockWebSocket.CLOSED;
    this.onclose?.({ code });
  }
}

export function createMockAudioGraph() {
  const processor = {
    bufferSize: null,
    onaudioprocess: null,
    connect: jest.fn(),
    disconnect: jest.fn(),
  };

  const sourceNode = { connect: jest.fn() };

  const audioContext = {
    options: null,
    destination: { id: "destination" },
    createMediaStreamSource: jest.fn(() => sourceNode),
    createScriptProcessor: jest.fn((bufferSize) => {
      processor.bufferSize = bufferSize;
      return processor;
    }),
    close: jest.fn(),
  };

  class MockAudioContext {
    constructor(options) {
      audioContext.options = options;
      return audioContext;
    }
  }

  return { MockAudioContext, audioContext, processor, sourceNode };
}

export function createMockMediaStream() {
  const track = { kind: "audio", stop: jest.fn() };
  return {
    stream: { getTracks: () => [track] },
    track,
  };
}

/**
 * Install every browser double onto the global object and hand the handles back
 * so a test can drive the socket and audio graph.
 */
export function installBrowserMocks() {
  MockWebSocket.reset();

  const graph = createMockAudioGraph();
  const media = createMockMediaStream();

  global.WebSocket = MockWebSocket;
  window.AudioContext = graph.MockAudioContext;
  window.webkitAudioContext = undefined;

  Object.defineProperty(navigator, "mediaDevices", {
    configurable: true,
    writable: true,
    value: {
      getUserMedia: jest.fn().mockResolvedValue(media.stream),
    },
  });

  return { ...graph, ...media, getUserMedia: navigator.mediaDevices.getUserMedia };
}

/**
 * Feed one buffer of Float32 samples through the ScriptProcessorNode callback,
 * exactly as the browser would.
 */
export function pumpAudio(processor, samples) {
  processor.onaudioprocess({
    inputBuffer: {
      getChannelData: () => Float32Array.from(samples),
    },
  });
}
