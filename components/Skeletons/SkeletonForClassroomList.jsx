import { Skeleton } from "../ui/skeleton";

const SkeletonForClassroomList = () => {
  return (
    <div className="space-y-2">
      <Skeleton className={"w-full h-12"} />
      <Skeleton className={"w-full h-12"} />
      <Skeleton className={"w-full h-12"} />
      <Skeleton className={"w-full h-12"} />
      <Skeleton className={"w-full h-12"} />
      <Skeleton className={"w-full h-12"} />
      <Skeleton className={"w-full h-12"} />
    </div>
  );
};

export default SkeletonForClassroomList;
