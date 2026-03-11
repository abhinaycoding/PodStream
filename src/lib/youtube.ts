const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;

const BASE_URL = "https://www.googleapis.com/youtube/v3/search";

export const fetchPodcastsByInterest = async (
  interests: string[],
  page: number
) => {
  try {
    if (!API_KEY) {
      console.error("❌ YouTube API KEY missing");
      return [];
    }

    const query = interests.join(" OR ") + " podcast";

    const url = `${BASE_URL}?part=snippet&type=video&videoDuration=long&maxResults=12&q=${encodeURIComponent(
      query
    )}&key=${API_KEY}`;

    const response = await fetch(url);
    const data = await response.json();

    return data.items || [];

  } catch (error) {
    console.error("Podcast fetch failed:", error);
    return [];
  }
};
