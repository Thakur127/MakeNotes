import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { navLinks } from "@/constants/navLinks";
import { cn } from "@/lib/utils";
import { SignedIn, UserButton, useUser } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import {
  ChevronDownIcon,
  ChevronRightIcon,
  MenuIcon,
  SchoolIcon,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const MobileNavigation = ({ className, currentPath }) => {
  const [showClasses, setShowClasses] = useState(false);

  const { user } = useUser();
  // console.log(user);

  const { data: availableClassrooms } = useQuery({
    queryKey: ["available-classrooms"],
    queryFn: async () => {
      const res = await axiosInstance.get("/classrooms/retrieve", {
        params: { userId: user.id },
      });
      console.log(res);
      return res.data;
    },
  });

  return (
    <Sheet className={cn(className)}>
      <header className="flex items-center justify-between">
        <SheetTrigger asChild>
          <MenuIcon className="cursor-pointer text-green-600" />
        </SheetTrigger>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </header>
      <SheetContent side={"left"} className="lg:hidden">
        <SheetHeader>
          <SheetTitle>
            <h1 className="text-left font-bold text-xl">
              <span className="text-green-600">notes.</span>
            </h1>
          </SheetTitle>
        </SheetHeader>
        <div className="mt-4">
          <ol className="space-y-1">
            {navLinks.slice(0, 1).map((item, idx) => {
              return (
                <li key={idx}>
                  <SheetClose asChild>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex gap-2 p-4 rounded-lg cursor-pointer",
                        currentPath == item.href
                          ? "bg-green-400"
                          : "hover:bg-green-200/40"
                      )}
                    >
                      {item.icon}
                      {item.name}
                    </Link>
                  </SheetClose>
                </li>
              );
            })}
            <li className="transition-all">
              <div
                onClick={() => {
                  setShowClasses(!showClasses);
                }}
                className={cn(
                  "flex justify-between items-center p-4 cursor-pointer rounded-lg",
                  !showClasses && currentPath.startsWith("/classrooms")
                    ? "bg-green-400"
                    : "hover:bg-green-100"
                )}
              >
                <div className="flex gap-2">
                  <SchoolIcon size={24} />
                  <p>Classroom</p>
                </div>
                {showClasses ? <ChevronDownIcon /> : <ChevronRightIcon />}
              </div>
              {showClasses && (
                <ol className="space-y-2 ml-4 overflow-auto max-h-96 2xl:max-h-[600px]">
                  {availableClassrooms?.map((item, idx) => {
                    // console.log(item);
                    return (
                      <li key={idx}>
                        <SheetClose asChild>
                          <Link
                            href={"/classrooms/" + item.id}
                            className={cn(
                              `ml-2 text-sm p-2 px-3 flex rounded-lg`,
                              currentPath === "/classrooms/" + item.id
                                ? "bg-green-300"
                                : "hover:bg-green-100/60"
                            )}
                          >
                            {item.title}
                          </Link>
                        </SheetClose>
                      </li>
                    );
                  })}
                </ol>
              )}
            </li>
            {navLinks.slice(1).map((item, idx) => {
              return (
                <li key={idx}>
                  <SheetClose asChild>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex gap-2 p-4 rounded-lg cursor-pointer",
                        currentPath == item.href
                          ? "bg-green-400"
                          : "hover:bg-green-200/40"
                      )}
                    >
                      {item.icon}
                      {item.name}
                    </Link>
                  </SheetClose>
                </li>
              );
            })}
          </ol>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNavigation;
