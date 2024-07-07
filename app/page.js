import { Button } from "@/components/ui/button";
import { SignedOut } from "@clerk/nextjs";
import { ArrowRightIcon, CheckIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div>
      <header className="flex items-center justify-between bg-gray-100 p-4 md:px-8 lg:px-12 shadow-lg">
        <span className="font-bold text-lg md:text-2xl">
          Make<span className="text-green-600">Notes</span>
        </span>
        <div className="space-x-2">
          <SignedOut>
            <Button variant="ghost" asChild className="">
              <Link href={"/sign-in"}>Login</Link>
            </Button>
            <span className="hidden md:inline">
              <Button asChild>
                <Link href="/sign-up">
                  Get Started
                  <ArrowRightIcon size={24} className="ml-2" />
                </Link>
              </Button>
            </span>
          </SignedOut>
        </div>
      </header>
      <main className="grid grid-cols-1 md:grid-cols-2 place-content-between gap-4 my-4 p-4 md:px-8 lg:px-12">
        <div>
          <h1 className="font-bold text-4xl md:text-6xl lg:text-7xl">
            Now, <span className="text-green-600">Making notes</span> from the
            video have become{" "}
            <span className="border-green-600 border-b-2 md:border-b-4  px-1 py-0">
              easier
            </span>
            .
          </h1>
          <section className="mt-4 md:mt-6">
            <h3 className="font-semibold md:text-lg">What are you getting?</h3>
            <ol className="text-sm md:text-base">
              <li className="flex gap-1 items-center">
                <CheckIcon className="text-green-500 w-4 h-4 md:h-6 md:w-6" />{" "}
                Breif Summary
              </li>
              <li className="flex gap-1 items-center">
                <CheckIcon className="text-green-500 w-4 h-4 md:h-6 md:w-6" />{" "}
                Bullet pointed detailed notes
              </li>
              <li className="flex gap-1 items-center">
                <CheckIcon className="text-green-500 w-4 h-4 md:h-6 md:w-6" />{" "}
                Ask question from the video
              </li>
              <li className="flex gap-1 items-center">
                <CheckIcon className="text-green-500 w-4 h-4 md:h-6 md:w-6" />{" "}
                Suggestion related from the video
              </li>
              <li className="flex gap-1 items-center">
                <CheckIcon className="text-green-500 w-4 h-4 md:h-6 md:w-6" />{" "}
                Everything free of charge
              </li>
            </ol>
          </section>

          <SignedOut>
            <section className="mt-4 lg:mt-6">
              <Button asChild>
                <Link href="/sign-up">
                  Get Started
                  <ArrowRightIcon size={24} className="ml-2" />
                </Link>
              </Button>
            </section>
          </SignedOut>
        </div>
        <div className="self-center">
          <Image src={"/hero.jpg"} alt="hero image" width={700} height={900} />
        </div>
      </main>
    </div>
  );
}
