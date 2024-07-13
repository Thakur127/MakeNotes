import { navLinks } from "@/constants/navLinks";
import { axiosInstance } from "@/lib/axios";
import { cn } from "@/lib/utils";
import { SignedIn, UserButton, useUser } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import { ChevronDownIcon, ChevronRightIcon, SchoolIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Separator } from "../ui/separator";
import SkeletonForClassroomList from "../Skeletons/SkeletonForClassroomList";

const SidebarNavigation = ({ currentPath }) => {
  const [showClasses, setShowClasses] = useState(false);

  const { user } = useUser();
  // console.log(user);

  const { data: availableClassrooms } = useQuery({
    queryKey: ["available-classrooms"],
    queryFn: async () => {
      const res = await axiosInstance.get("/classrooms/retrieve", {
        params: { userId: user.id },
      });
      // console.log(res);
      return res.data;
    },
  });

  // console.log(availableClassrooms);

  return (
    <div className="bg-gray-50/50 h-svh p-4 flex flex-col overflow-hidden border-r">
      <section>
        <h1 className="font-bold text-2xl">
          <span className="text-green-500">notes.</span>
        </h1>
      </section>
      <section className="mt-4 flex-1">
        <ol className="space-y-1">
          {navLinks.slice(0, 1).map((item, idx) => {
            return (
              <li key={idx}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex gap-2 p-4 rounded-lg cursor-pointer",
                    currentPath == item.href
                      ? "bg-green-400"
                      : "hover:bg-green-100"
                  )}
                >
                  {item.icon}
                  {item.name}
                </Link>
              </li>
            );
          })}

          <li>
            <div
              onClick={() => {
                setShowClasses(!showClasses);
              }}
              className={cn(
                "flex justify-between items-center p-4 cursor-pointer rounded-lg",
                !showClasses && currentPath.startsWith("/classroom")
                  ? "bg-green-400"
                  : "hover:bg-green-100"
              )}
            >
              <div className="flex gap-2">
                <SchoolIcon size={24} />
                <p>Classrooms</p>
              </div>
              {showClasses ? <ChevronDownIcon /> : <ChevronRightIcon />}
            </div>
            {showClasses && (
              <ol className="space-y-2 ml-4 overflow-auto max-h-96 2xl:max-h-[600px] mt-2">
                {availableClassrooms ? (
                  availableClassrooms?.map((item, idx) => {
                    // console.log(item);
                    return (
                      <li key={idx}>
                        <Link
                          href={"/classroom/" + item.id}
                          className={cn(
                            `ml-2 text-sm p-2 px-3 flex rounded-lg`,
                            currentPath === "/classroom/" + item.id
                              ? "bg-green-300"
                              : "hover:bg-green-100/60"
                          )}
                        >
                          {item.title}
                        </Link>
                      </li>
                    );
                  })
                ) : (
                  <SkeletonForClassroomList />
                )}
              </ol>
            )}
          </li>
          <Separator />
          {navLinks.slice(1).map((item, idx) => {
            return (
              <li key={idx}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex gap-2 p-4 rounded-lg cursor-pointer",
                    currentPath == item.href
                      ? "bg-green-400"
                      : "hover:bg-green-100"
                  )}
                >
                  {item.icon}
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ol>
      </section>
      <section className="flex items-center gap-4 p-4">
        <SignedIn>
          <div className="scale-125">
            <UserButton />
          </div>

          <div>
            <h3 className="text-lg">{user?.fullName}</h3>
            <p className="text-xs text-gray-600">
              {user?.primaryEmailAddress.emailAddress}
            </p>
          </div>
        </SignedIn>
      </section>
    </div>
  );
};

export default SidebarNavigation;
