"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "./ui/button";
import extractVideoIdFromYoutubeURL from "@/lib/extractVideoIdFromYoutubeURL";
import { axiosInstance } from "@/lib/axios";
import Wait from "./Wait";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "./ui/use-toast";

const VideourlForm = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { isPending: wait, mutate: createClassroom } = useMutation({
    mutationFn: async (data) => {
      const videoId = await extractVideoIdFromYoutubeURL(data.videourl);
      const res = await axiosInstance.post("/classrooms/create", {
        videoId,
      });
      // console.log(res.data);
      return res.data;
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
