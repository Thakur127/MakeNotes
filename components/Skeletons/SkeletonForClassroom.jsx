import { Skeleton } from "../ui/skeleton";

const SkeletonForClassroom = () => {
  return (
    <div className="p-4 space-y-6">
      <Skeleton className={"w-[500px] h-10"} />
      <div className="flex my-4">
        <Skeleton className={"w-[600px] h-[380px] m-auto"} />
      </div>
      <Skeleton className={"w-full h-10 mb-4"} />
      <Skeleton className={"w-full h-10"} />
    </div>
  );
};

export default SkeletonForClassroom;
