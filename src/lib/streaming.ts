/**
 * SSE (Server-Sent Events) Utility for Real-Time AI Streaming
 */

export interface StreamingOptions {
  onDelta?: (delta: string) => void;
  onComplete?: (fullText: string) => void;
  onError?: (error: any) => void;
}

export class StreamManager {
  private controller: AbortController | null = null;

  async stream(url: string, body: any, options: StreamingOptions) {
    this.controller = new AbortController();
    let fullText = "";

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        signal: this.controller.signal,
      });

      if (!response.ok) throw new Error(`Stream Error: ${response.statusText}`);

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) throw new Error("No reader available");

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        // Assume data: { "delta": "..." } format or raw text for now
        // This can be evolved to handle specific SSE formatting
        fullText += chunk;
        options.onDelta?.(chunk);
      }

      options.onComplete?.(fullText);
    } catch (error: any) {
      if (error.name === "AbortError") {
        console.log("Stream aborted");
      } else {
        options.onError?.(error);
      }
    }
  }

  async simulate(text: string, options: StreamingOptions) {
    this.controller = new AbortController();
    const words = text.split(" ");
    let fullText = "";

    for (let i = 0; i < words.length; i++) {
      if (this.controller.signal.aborted) break;
      const delta = words[i] + " ";
      fullText += delta;
      options.onDelta?.(delta);
      await new Promise(r => setTimeout(r, 40 + Math.random() * 60)); // Simulate network latency
    }
    options.onComplete?.(fullText);
  }

  stop() {
    this.controller?.abort();
  }
}
