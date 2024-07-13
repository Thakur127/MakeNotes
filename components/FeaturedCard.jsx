import React from "react";
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";

const FeaturedCard = ({ url, title, image_url }) => {
  return (
    <Link href={url}>
      <Card className="overflow-hidden hover:shadow-xl transition-all cursor-pointer max-w-[450px]">
        <CardContent className="p-0">
          <Image
            src={image_url || "/mountain.avif"}
            alt="card photo"
            width={450}
            height={300}
            className="object-contain"
          />
        </CardContent>
        <CardFooter className="p-2">
          <CardTitle className="text-sm font-normal text-gray-800 ">
            {title || "Beauty of Mountain is admirable"}
          </CardTitle>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default FeaturedCard;
