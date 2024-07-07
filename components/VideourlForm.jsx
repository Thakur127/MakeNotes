"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { Button } from "./ui/button";
import extractVideoIdFromYoutubeURL from "@/lib/extractVideoIdFromYoutubeURL";
import axios from "axios";
import makeTranscript from "@/lib/makeTranscript";

const VideourlForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    const videoId = await extractVideoIdFromYoutubeURL(data.videourl);
    console.log(videoId);

    try {
      const { data } = await axios.get(
        "http://localhost:3000/api/caption-from-video",
        {
          params: {
            videoId,
            lang: "en",
          },
        }
      );
      const transcript = await makeTranscript(data.data);
    } catch (error) {}
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex gap-1">
      <div className="w-4/5">
        <input
          {...register("videourl", {
            required: "This is required to start making new notes",
          })}
          placeholder="https://www.youtube.com/watch?v=RcYjXbSJBN8"
          type="url"
          className="border px-4 py-2 text-base outline-none rounded-full w-full"
        />
        <p className="text-pink-600 text-xs lg:text-sm indent-2">
          {errors.videourl?.message}
        </p>
      </div>
      <Button type="submit" className="rounded-full px-6">
        Start
      </Button>
    </form>
  );
};

export default VideourlForm;
