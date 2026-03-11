const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;

const BASE_URL = "https://www.googleapis.com/youtube/v3/search";

// High-quality fallback data in case the YouTube API hits its daily quota limit (very common on the free tier)
const FALLBACK_PODCASTS = [
  { id: { videoId: "h1sOuxWIsfE" }, snippet: { title: "Naval Ravikant on Happiness, Reducing Anxiety, Crypto, Fasting, Startups, and Aliens", channelTitle: "Lex Fridman", description: "Naval Ravikant is an entrepreneur, philosopher, and investor.", thumbnails: { high: { url: "https://i.ytimg.com/vi/h1sOuxWIsfE/hqdefault.jpg" } } } },
  { id: { videoId: "n3Xv_g3g-mA" }, snippet: { title: "Dr. Andrew Huberman: Maximize Productivity, Physical & Mental Health", channelTitle: "Huberman Lab", description: "Dr. Andrew Huberman discusses science-based tools for maximizing focus and health.", thumbnails: { high: { url: "https://i.ytimg.com/vi/n3Xv_g3g-mA/hqdefault.jpg" } } } },
  { id: { videoId: "L_Guz73e6fw" }, snippet: { title: "Sam Altman: OpenAI CEO on GPT-4, ChatGPT, and the Future of AI", channelTitle: "Lex Fridman", description: "Sam Altman is the CEO of OpenAI, the company behind ChatGPT.", thumbnails: { high: { url: "https://i.ytimg.com/vi/L_Guz73e6fw/hqdefault.jpg" } } } },
  { id: { videoId: "vIorTEYErCg" }, snippet: { title: "NVIDIA CEO Jensen Huang: The AI Revolution", channelTitle: "Acquired", description: "Jensen Huang discusses building NVIDIA into a trillion-dollar company.", thumbnails: { high: { url: "https://i.ytimg.com/vi/vIorTEYErCg/hqdefault.jpg" } } } },
  { id: { videoId: "XkWJ2-l-qxk" }, snippet: { title: "Nikhil Kamath on Building Zerodha & The Future of India", channelTitle: "WTF is", description: "Deep dive into financial markets and tech startups.", thumbnails: { high: { url: "https://i.ytimg.com/vi/XkWJ2-l-qxk/hqdefault.jpg" } } } },
  { id: { videoId: "U_A_BwIapU4" }, snippet: { title: "Chris Williamson: How To Be 1% Better Every Day", channelTitle: "Modern Wisdom", description: "Practical life hacks and productivity routines.", thumbnails: { high: { url: "https://i.ytimg.com/vi/U_A_BwIapU4/hqdefault.jpg" } } } },
];

export const fetchPodcastsByInterest = async (
  interests: string[],
  page: number
) => {
  try {
    if (!API_KEY) {
      console.warn("YouTube API KEY missing. Falling back to default data.");
      return FALLBACK_PODCASTS;
    }

    const query = interests.join(" OR ") + " podcast";

    const url = `${BASE_URL}?part=snippet&type=video&videoDuration=long&maxResults=12&q=${encodeURIComponent(
      query
    )}&key=${API_KEY}`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.error) {
      console.warn(`YouTube API Error: ${data.error.message}. Using fallback data.`);
      return FALLBACK_PODCASTS;
    }

    return data.items && data.items.length > 0 ? data.items : FALLBACK_PODCASTS;

  } catch (error) {
    console.error("Podcast fetch failed, using fallback:", error);
    return FALLBACK_PODCASTS;
  }
};
