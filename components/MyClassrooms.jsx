"use client";

import Link from "next/link";
import FeaturedCard from "./FeaturedCard";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios";
import { useUser } from "@clerk/nextjs";
import SkeletonForAvailableClassrooms from "./Skeletons/SkeletonForAvailableClassrooms";

const MyClassrooms = () => {
  const { user } = useUser();
  const { data: availableClassrooms } = useQuery({
    queryKey: ["available-classrooms"],
    queryFn: async () => {
      const res = await axiosInstance.get("/classrooms/retrieve", {
        params: {
          userId: user.id,
        },
      });
      //   console.log(res.data);
      return res.data;
    },
  });

  if (!availableClassrooms) return <SkeletonForAvailableClassrooms />;

  return (
    <>
      {availableClassrooms && availableClassrooms?.length > 0 && (
        <h3 className="font-medium text-lg">Available classrooms</h3>
      )}
      {availableClassrooms && availableClassrooms?.length == 0 && (
        <div className="w-full text-center h-96 flex">
          <h3 className="m-auto">
            No Classroom available. <br />
            Create classroom to start making notes.
            <br />{" "}
            <Link href={"#"} className="text-blue-500 hover:underline">
              What is classrooms? and How can I have one?
            </Link>
          </h3>
        </div>
      )}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 place-content-center">
        {availableClassrooms &&
          availableClassrooms?.map((item, idx) => {
            {
              return (
                <FeaturedCard
                  key={idx}
                  url={"/classroom/" + item.id}
                  title={item.title}
                  image_url={item.image_url}
                />
              );
            }
          })}
      </div>
    </>
  );
};

export default MyClassrooms;
