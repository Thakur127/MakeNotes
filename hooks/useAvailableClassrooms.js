import { axiosInstance } from "@/lib/axios";
import { auth } from "@clerk/nextjs/server";

const useAvailableClassrooms = async () => {
  const { userId } = auth();

  try {
    const res = await axiosInstance.get("/classrooms/retrieve", {
      params: {
        userId,
      },
    });
    // console.log(res.data);
    return res.data;
  } catch (error) {
    console.log(error);
    return [];
  }
};

export default useAvailableClassrooms;
