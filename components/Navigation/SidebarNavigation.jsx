import { navLinks } from "@/constants/navLinks";
import { cn } from "@/lib/utils";
import { SignedIn, UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import React from "react";

const SidebarNavigation = ({ currentPath, currentUser }) => {
  const { user } = useUser();

  return (
    <div className="bg-gray-50/50 h-svh p-4 flex flex-col">
      <section>
        <h1 className="font-bold text-2xl">
          Make<span className="text-green-600">Notes</span>
        </h1>
      </section>
      <section className="mt-4 flex-1">
        <ol className="space-y-1">
          {navLinks.map((item, idx) => {
            return (
              <li key={idx}>
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
