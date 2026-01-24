import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import axios from "axios";

admin.initializeApp();

const db = admin.firestore();

// ENV KEY
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY as string;

export const getPodcasts = functions.https.onRequest(async (req, res) => {
  try {
    const interests = req.query.interests as string;

    if (!interests) {
      res.status(400).send("Missing interests");
      return;
    }

    const cacheRef = db.collection("cache").doc(interests);
    const cacheSnap = await cacheRef.get();

    const now = Date.now();
    const SIX_HOURS = 6 * 60 * 60 * 1000;

    // ✅ CACHE HIT
    if (cacheSnap.exists) {
      const cached = cacheSnap.data();

      if (cached && now - cached.timestamp < SIX_HOURS) {
        console.log("Serving from cache");
        res.json(cached.data);
        return;
      }
    }

    // ✅ API CALL
    console.log("Calling YouTube API");

    const response = await axios.get(
      "https://www.googleapis.com/youtube/v3/search",
      {
        params: {
          part: "snippet",
          maxResults: 12,
          q: interests + " podcast",
          type: "video",
          key: YOUTUBE_API_KEY,
        },
      }
    );

    const videos = response.data.items;

    // ✅ SAVE CACHE
    await cacheRef.set({
      data: videos,
      timestamp: now,
    });

    res.json(videos);
    return;
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
    return;
  }
});
