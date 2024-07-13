import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import Image from "next/image";

const Wait = ({ show, className, message, ...props }) => {
  if (!show) return <></>;
  return (
    <div className="absolute top-0 left-0 w-full h-svh flex bg-gray-100/50">
      <Card className="min-w-96 max-w-xl m-auto">
        <CardHeader>
          <CardTitle className="text-xl text-gray-800">{message}</CardTitle>
        </CardHeader>
        <CardContent>
          <Image
            src={"/hourglass.svg"}
            alt="spinner"
            width={44}
            height={44}
            className="text-center animate-spin"
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default Wait;
