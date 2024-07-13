import Footer from "@/components/Footer";
import How from "@/components/How";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import Pricing from "@/components/Pricing/Pricing";
import { Button } from "@/components/ui/button";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { ArrowRightIcon, CheckIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div>
      <MaxWidthWrapper>
        <header className="z-50 fixed w-full left-0 top-0 flex items-center justify-between bg-transparent p-4 md:px-8 lg:px-12">
          <span className="font-bold text-lg md:text-2xl text-green-500 cursor-pointer">
            notes.
          </span>
          <div className="space-x-2 flex items-center">
            <SignedOut>
              <Button variant="ghost" asChild className="cursor-pointer px-8">
                <Link href={"/sign-in"}>Login</Link>
              </Button>
              <span className="hidden md:inline">
                <Button asChild>
                  <Link href="/sign-up" className="cursor-pointer">
                    Get Started
                    <ArrowRightIcon size={18} className="ml-2" />
                  </Link>
                </Button>
              </span>
            </SignedOut>
            <SignedIn>
              <UserButton />
              <Button variant="ghost" asChild>
                <Link href={"/dashboard"}>
                  Dashboard <ArrowRightIcon size={18} className="ml-2" />
                </Link>
              </Button>
            </SignedIn>
          </div>
        </header>
      </MaxWidthWrapper>
      <MaxWidthWrapper>
        <main className="">
          <section className="px-8 lg:px-56 text-center relative">
            <Image
              src={
                "https://images.pexels.com/photos/236111/pexels-photo-236111.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
              }
              alt=""
              width={"1280"}
              height={"0"}
              className="object-contain absolute -z-50 top-0 left-0"
            />
            <h1 className="pt-20 md:pt-32 lg:pt-48 text-center text-3xl md:text-4xl lg:text-6xl font-bold">
              Now, Making <span className="text-green-500">notes.</span> from
              youtube videos have become{" "}
              <span className="border-b-2 lg:border-b-4 border-green-500">
                easier
              </span>
              .
            </h1>
            <div className="mt-12">
              <SignedOut>
                <Button asChild>
                  <Link href={"/sign-up"}>
                    Get Started <ArrowRightIcon size={18} className="ml-2" />
                  </Link>
                </Button>
              </SignedOut>
            </div>
          </section>
          <section className="mt-8 flex justify-center"></section>
        </main>
      </MaxWidthWrapper>
      <div className="mt-16 sm:mt-44 md:mt-72 lg:mt-96">
        <How />
      </div>
      <div className="mt-8">
        <Pricing />
      </div>
      <div className="mt-8">
        <Footer />
      </div>
    </div>
  );
}
