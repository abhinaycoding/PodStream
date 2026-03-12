import { useState, useCallback, useRef } from "react";
import { StreamManager, StreamingOptions } from "../lib/streaming";

export function useStreaming() {
  const [data, setData] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const streamRef = useRef<StreamManager>(new StreamManager());

  const startStream = useCallback(async (url: string, body: any) => {
    setData("");
    setError(null);
    setIsStreaming(true);

    const options: StreamingOptions = {
      onDelta: (delta) => {
        setData((prev) => prev + delta);
      },
      onComplete: () => {
        setIsStreaming(false);
      },
      onError: (err) => {
        setError(err);
        setIsStreaming(false);
      },
    };

    await streamRef.current.stream(url, body, options);
  }, []);

  const startSimulation = useCallback(async (text: string) => {
    setData("");
    setError(null);
    setIsStreaming(true);

    const options: StreamingOptions = {
      onDelta: (delta) => setData((prev) => prev + delta),
      onComplete: () => setIsStreaming(false),
      onError: (err) => { setError(err); setIsStreaming(false); },
    };

    await streamRef.current.simulate(text, options);
  }, []);

  const stopStream = useCallback(() => {
    streamRef.current.stop();
    setIsStreaming(false);
  }, []);

  return { data, isStreaming, error, startStream, startSimulation, stopStream };
}
