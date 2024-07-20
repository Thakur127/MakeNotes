"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "./ui/button";
import extractVideoIdFromYoutubeURL from "@/lib/extractVideoIdFromYoutubeURL";
import { axiosInstance } from "@/lib/axios";
import Wait from "./Wait";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "./ui/use-toast";
import makeTranscript from "@/lib/makeTranscript";
import { generativeModel } from "@/gemini/models";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { createEmbedding } from "@/gemini/createEmbedding.mjs";
import { createIndex } from "@/pinecone/createIndex.mjs";
import { upsertVectorToIndex } from "@/pinecone/upsertVectorToIndex.mjs";
import axios from "axios";

const VideourlForm = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { isPending: wait, mutate: createClassroom } = useMutation({
    mutationFn: async (data) => {
      const videoId = await extractVideoIdFromYoutubeURL(data.videourl);

      const response = await axiosInstance.post(
        "/classroom/existing-classroom",
        {
          videoId,
        }
      );
      // console.log(response);

      if (response.status === 200 && response.data.msg === "new classroom") {
        let transcript = "";
        let summary = "";
        let detailed_note = "";
        let title = "";
        let image_url = "";

        // create classroom at client side - Reason: vercel 504 error
        try {
          const { data } = await axiosInstance.get("/caption-from-video", {
            params: {
              videoId,
              lang: "en",
            },
          });
          // console.log(data);
          transcript = await makeTranscript(data.data);
        } catch (error) {
          console.log("Failed for fetch captions for video: ", videoId);
          throw error;
        }

        // generate summary and detailed note of transcript
        if (transcript != "") {
          // summary
          const chat = generativeModel.startChat({ history: [] });
          try {
            const summaryMsg = `Give the summary for the provided context below, max in 200-250 words.
        
            CONTEXT: ${transcript}`;

            const result = await chat.sendMessage(summaryMsg);
            const response = result.response;
            summary = response.text();
            // console.log(summary);

            // detailed note
            const detaileNoteMsg = `Return the detailed note for the information provided in the below context. It should have a MAIN HEADING, necessary SUB-HEADINGS and BULLET-POINTS to make it concise and clear.
              
            CONTEXT = ${transcript}`;

            const dnResult = await chat.sendMessage(detaileNoteMsg);
            const dnResponse = dnResult.response;
            detailed_note = dnResponse.text();
            // console.log(detailed_note);
          } catch (error) {
            console.log("error creating summary and detailed note", error);
            throw error;
          }
        }

        const videoResponse = await axios.get(
          "https://youtube.googleapis.com/youtube/v3/videos",
          {
            params: {
              id: videoId,
              part: "snippet",
              key:
                process.env.YOUTUBE_API_KEY ||
                process.env.NEXT_PUBLIC_YOUTUBE_API_KEY,
            },
          }
        );

        // extract required video info
        const video = videoResponse.data?.items?.[0];
        title = video.snippet.title;
        image_url = video.snippet.thumbnails?.default.url;

        const res = await axiosInstance.post("/classroom/create", {
          videoId,
          image_url,
          title,
          summary,
          detailed_note,
        });

        try {
          const textSplitter = new RecursiveCharacterTextSplitter({
            chunkSize: 5000,
            chunkOverlap: 1000,
          });

          const splits = await textSplitter.splitText(transcript);
          let upsertData = [];

          for (let i = 0; i < splits.length; i++) {
            const embedding = await createEmbedding(splits[i]);
            upsertData.push({
              id: i.toString(), // Ensure the ID is a string
              values: Array.from(embedding), // Ensure values is an array of numbers
              metadata: {
                text: splits[i],
              },
            });
          }
          const indexName = `classroom-${res.data.classroom.id}`;
          await createIndex(indexName);
          await upsertVectorToIndex(indexName, upsertData);
        } catch (error) {
          console.log(error);
          throw error;
        }

        // create classroom at backend
        // const res = await axiosInstance.post("/classrooms/create", {
        //   videoId,
        // });
        // console.log(res.data);
        return res.data;
      }
      return response.data;
    },
    onSuccess: (data) => {
      // console.log(data);
      if (data?.msg !== "Already Created")
        queryClient.setQueryData(["available-classrooms"], (oldData) => {
          return oldData ? [data.classroom, ...oldData] : [data.classroom];
        });
      toast({
        title: "Classroom has been created.",
      });
    },
    onError: () => {
      toast({
        title: "Classroom creation failed!",
        variant: "destructive",
      });
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  return (
    <>
      <Wait message={"Creating classroom..."} show={wait} />
      <h3 className="font-semibold text-lg text-gray-800 ">
        Paste video URL to start
      </h3>
      <span className="text-gray-500 text-xs">
        (NOTE: Video should have captions available in English)
      </span>
      <form onSubmit={handleSubmit(createClassroom)} className="flex gap-1">
        <div className="w-4/5">
          <input
            {...register("videourl", {
              required: "This is required to start making new notes",
            })}
            placeholder="https://www.youtube.com/watch?v=RcYjXbSJBN8"
            type="url"
            className="border px-4 py-2 text-sm xl:text-base outline-none rounded-full w-full"
          />
          <p className="text-pink-600 text-xs lg:text-sm indent-2">
            {errors.videourl?.message}
          </p>
        </div>
        <Button
          disabled={wait}
          type="submit"
          className={`rounded-full px-6 ${wait && "cursor-progress"}`}
        >
          Start
        </Button>
      </form>
    </>
  );
};

export default VideourlForm;
