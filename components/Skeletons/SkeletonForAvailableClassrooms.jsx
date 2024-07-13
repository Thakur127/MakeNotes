import { Skeleton } from "../ui/skeleton";

const SkeletonForAvailableClassrooms = () => {
  return (
    <>
      <Skeleton className={"w-60 h-6"} />
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 place-content-center">
        <Skeleton className={"w-72 h-72"} />
        <Skeleton className={"w-72 h-72"} />
        <Skeleton className={"w-72 h-72"} />
        <Skeleton className={"w-72 h-72"} />
        <Skeleton className={"w-72 h-72"} />
        <Skeleton className={"w-72 h-72"} />
        <Skeleton className={"w-72 h-72"} />
        <Skeleton className={"w-72 h-72"} />
        <Skeleton className={"w-72 h-72"} />
      </div>
    </>
  );
};

export default SkeletonForAvailableClassrooms;
