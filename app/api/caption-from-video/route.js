// app/api/captions/route.js

import axios from "axios";
import { YoutubeTranscript } from "youtube-transcript";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const videoId = searchParams.get("videoId");
  const lang = searchParams.get("lang") || "en";

  if (!videoId) {
    return new Response(JSON.stringify({ error: "videoId is required" }), {
      status: 400,
    });
  }

  // console.log(process.env.RAPID_API_KEY);

  // const options = {
  //   method: "GET",
  //   url: "https://youtube-captions-and-transcripts.p.rapidapi.com/getCaptions",
  //   params: {
  //     videoId,
  //     lang,
  //     format: "json",
  //   },
  //   headers: {
  //     "x-rapidapi-key": process.env.RAPID_API_KEY,
  //     "x-rapidapi-host": "youtube-captions-and-transcripts.p.rapidapi.com",
  //   },
  // };

  try {
    // const response = await axios.request(options);
    const res = await YoutubeTranscript.fetchTranscript(videoId);
    console.log(res);
    return new Response(JSON.stringify(res), { status: 200 });
  } catch (error) {
    // console.log(error);
    return new Response(JSON.stringify({ error: "Failed to fetch captions" }), {
      status: 500,
    });
  }
}
