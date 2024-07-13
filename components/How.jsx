"use client";

import ReactPlayer from "react-player";
import MaxWidthWrapper from "./MaxWidthWrapper";

const How = () => {
  return (
    <MaxWidthWrapper>
      <div className="flex flex-col justify-center space-y-4">
        <h1 className="text-3xl font-semibold text-center">
          How can you make notes?
        </h1>
        <div className="flex justify-center w-full flex-col items-center">
          <ReactPlayer url={"https://www.youtube.com/watch?v=gsnqXt7d1mU"} />
          <span className="text-xs">
            <span className="text-red-500">*</span>Placeholder video
          </span>
        </div>
      </div>
    </MaxWidthWrapper>
  );
};

export default How;
