import { Inter } from "next/font/google";
import "./globals.css";
import Provider from "./Provider";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "MakeNotes",
  description:
    "Taking notes from video has become easier now. Extract points from the video. Breif summary, detailed notes, suggestion related from the video, Ask questions from the video and many more.",
  "google-site-verification": "eX7-7Yf7KVOzgF3XeGycLJwtvpTTlqhhTHADI-714sg",
};
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <meta
        name="google-site-verification"
        content="eX7-7Yf7KVOzgF3XeGycLJwtvpTTlqhhTHADI-714sg"
      />
      <meta
        name="keywords"
        content="summarize, youtube, youtube video, detailed note, detailed notes, summarize video, summarize youtube video, Question Answer, Question Answer Youtube video, detailed notes youtube video, RAG, Retrieval Augmented Generation, LLM, LLMs, Gemini API, GOOGLE AI API"
      />
      <body className={inter.className}>
        <Provider>
          <SonnerToaster richColors closeButton />
          <Toaster />
          {children}
        </Provider>
      </body>
    </html>
  );
}
