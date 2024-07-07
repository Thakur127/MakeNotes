import { Inter } from "next/font/google";
import "./globals.css";
import Provider from "./Provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "MakeNotes",
  description:
    "Taking notes from video has become easier now. Extract points from the video. Breif summary, detailed notes, suggestion related from the video, Ask questions from the video and many more.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
