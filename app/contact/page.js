import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { Button } from "@/components/ui/button";
import React from "react";

const page = () => {
  return (
    <MaxWidthWrapper>
      <div className="h-svh flex w-full ">
        <div className="m-auto mx-8  flex flex-col w-full">
          <div className="m-auto border rounded-md p-4 max-w-[600px]">
            <h2 className="text-center mb-4 font-semibold text-green-600  text-xl">
              Contact
            </h2>
            <form className="p-4 space-y-4 ">
              <input
                className="border rounded-full p-4 w-full outline-none"
                placeholder="example@email.com"
              />
              <input
                className="border rounded-full p-4 w-full outline-none"
                placeholder="subject"
              />
              <textarea
                rows={5}
                className="border p-4 w-full rounded-md outline-none"
                placeholder="body..."
              ></textarea>
              <Button className="px-8 rounded-full">Send</Button>
            </form>
          </div>
        </div>
      </div>
    </MaxWidthWrapper>
  );
};

export default page;
