import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;
const BASE_URL = "https://www.googleapis.com/youtube/v3/search";
const CACHE_TTL_MS = 23 * 60 * 60 * 1000; // 23 hours

// ─── Curated per-topic fallback (used only if quota is truly exhausted & no cache) ───
const TOPIC_FALLBACKS: Record<string, any[]> = {
  default: [
    { id: { videoId: "h1sOuxWIsfE" }, snippet: { title: "Naval Ravikant on Happiness, Startups, and Meaning", channelTitle: "Lex Fridman", thumbnails: { high: { url: "https://img.youtube.com/vi/h1sOuxWIsfE/hqdefault.jpg" } } } },
    { id: { videoId: "n3Xv_g3g-mA" }, snippet: { title: "Andrew Huberman: Tools for Better Focus and Health", channelTitle: "Huberman Lab", thumbnails: { high: { url: "https://img.youtube.com/vi/n3Xv_g3g-mA/hqdefault.jpg" } } } },
    { id: { videoId: "L_Guz73e6fw" }, snippet: { title: "Sam Altman: OpenAI CEO on GPT-4 and the Future of AI", channelTitle: "Lex Fridman", thumbnails: { high: { url: "https://img.youtube.com/vi/L_Guz73e6fw/hqdefault.jpg" } } } },
    { id: { videoId: "vIorTEYErCg" }, snippet: { title: "Jensen Huang: The AI Revolution and NVIDIA", channelTitle: "Acquired", thumbnails: { high: { url: "https://img.youtube.com/vi/vIorTEYErCg/hqdefault.jpg" } } } },
  ],
  "Technology": [
    { id: { videoId: "WqYBx2gB6vA" }, snippet: { title: "How AI is Changing Software Development", channelTitle: "Fireship", thumbnails: { high: { url: "https://img.youtube.com/vi/WqYBx2gB6vA/hqdefault.jpg" } } } },
    { id: { videoId: "kCc8FmEb1nY" }, snippet: { title: "Let's build GPT: from scratch, in code, step by step", channelTitle: "Andrej Karpathy", thumbnails: { high: { url: "https://img.youtube.com/vi/kCc8FmEb1nY/hqdefault.jpg" } } } },
  ],
  "Business": [
    { id: { videoId: "U_A_BwIapU4" }, snippet: { title: "How To Build a Business From Scratch", channelTitle: "Modern Wisdom", thumbnails: { high: { url: "https://img.youtube.com/vi/U_A_BwIapU4/hqdefault.jpg" } } } },
    { id: { videoId: "XkWJ2-l-qxk" }, snippet: { title: "Nikhil Kamath on Building Zerodha & Startups", channelTitle: "WTF is", thumbnails: { high: { url: "https://img.youtube.com/vi/XkWJ2-l-qxk/hqdefault.jpg" } } } },
  ],
  "Finance": [
    { id: { videoId: "PHe0bXAIuk0" }, snippet: { title: "How the Economic Machine Works by Ray Dalio", channelTitle: "Principles by Ray Dalio", thumbnails: { high: { url: "https://img.youtube.com/vi/PHe0bXAIuk0/hqdefault.jpg" } } } },
  ],
  "Health & Wellness": [
    { id: { videoId: "n3Xv_g3g-mA" }, snippet: { title: "Andrew Huberman: The Science of Sleep and Health", channelTitle: "Huberman Lab", thumbnails: { high: { url: "https://img.youtube.com/vi/n3Xv_g3g-mA/hqdefault.jpg" } } } },
  ],
  "Artificial Intelligence": [
    { id: { videoId: "L_Guz73e6fw" }, snippet: { title: "Sam Altman: The Future of AI and Humanity", channelTitle: "Lex Fridman", thumbnails: { high: { url: "https://img.youtube.com/vi/L_Guz73e6fw/hqdefault.jpg" } } } },
    { id: { videoId: "vIorTEYErCg" }, snippet: { title: "Jensen Huang: AI Will Change Everything", channelTitle: "Acquired", thumbnails: { high: { url: "https://img.youtube.com/vi/vIorTEYErCg/hqdefault.jpg" } } } },
  ],
};

// ─── Fetch from YouTube API with Firestore caching ───
const fetchWithCache = async (topic: string): Promise<any[]> => {
  const cacheKey = `youtubeCache_${topic.toLowerCase().replace(/\s+/g, "_")}`;
  const cacheRef = doc(db, "youtubeCache", cacheKey);

  // 1. Check Firestore cache first
  try {
    const cached = await getDoc(cacheRef);
    if (cached.exists()) {
      const { items, fetchedAt } = cached.data();
      const age = Date.now() - fetchedAt;
      if (age < CACHE_TTL_MS && items?.length > 0) {
        console.log(`[Cache HIT] ${topic}`);
        return items;
      }
    }
  } catch (e) {
    // Cache read failed — continue to live fetch
  }

  // 2. Fetch from YouTube API
  if (!API_KEY) {
    return TOPIC_FALLBACKS[topic] || TOPIC_FALLBACKS["default"];
  }

  try {
    const query = encodeURIComponent(`${topic} podcast`);
    const url = `${BASE_URL}?part=snippet&type=video&videoDuration=long&maxResults=8&q=${query}&key=${API_KEY}`;
    const res = await fetch(url);
    const data = await res.json();

    if (data.error || !data.items?.length) {
      console.warn(`[YouTube] Error or empty for "${topic}" — using cache/fallback`);
      return TOPIC_FALLBACKS[topic] || TOPIC_FALLBACKS["default"];
    }

    // 3. Save to Firestore cache
    try {
      await setDoc(cacheRef, { items: data.items, fetchedAt: Date.now(), topic });
    } catch (e) {
      // Cache write failed — not critical
    }

    console.log(`[Live] fetched ${data.items.length} results for "${topic}"`);
    return data.items;

  } catch (e) {
    console.error(`[YouTube] fetch failed for "${topic}":`, e);
    return TOPIC_FALLBACKS[topic] || TOPIC_FALLBACKS["default"];
  }
};

// ─── Main export: fetch one topic at a time, rotating by page ───
export const fetchPodcastsByInterest = async (
  interests: string[],
  page: number
): Promise<any[]> => {
  if (!interests.length) return TOPIC_FALLBACKS["default"];

  // rotate through topics as the user pages through the feed
  const topic = interests[(page - 1) % interests.length];
  return fetchWithCache(topic);
};
