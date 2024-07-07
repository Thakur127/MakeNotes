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
import { SignedIn, UserButton } from "@clerk/nextjs";
import { MenuIcon } from "lucide-react";
import Link from "next/link";

const MobileNavigation = ({ className, currentPath }) => {
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
              Make<span className="text-green-600">Notes</span>
            </h1>
          </SheetTitle>
        </SheetHeader>
        <div className="mt-4">
          <ol className="space-y-1">
            {navLinks.map((item, idx) => {
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
