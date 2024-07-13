import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { CheckIcon, XIcon } from "lucide-react";

const Pricecard = ({ plan, availableService, notAvailableService }) => {
  return (
    <Card className="w-80 h-[400px] flex flex-col hover:shadow-lg">
      <CardHeader>
        <CardTitle className="text-green-500">{plan}</CardTitle>
      </CardHeader>
      <CardContent className={"space-y-2 flex-1"}>
        <ol className="space-y-2">
          {availableService?.map((item, idx) => {
            return (
              <li key={idx} className="text-gray-800 flex gap-2 items-center">
                <CheckIcon size={18} className="text-green-500" />{" "}
                <span>{item.name}</span>
              </li>
            );
          })}
        </ol>
        <ol className="space-y-2">
          {notAvailableService?.map((item, idx) => {
            return (
              <li
                key={idx}
                className="flex gap-2 text-gray-400 line-through items-center"
              >
                <XIcon size={18} /> <span>{item.name}</span>
              </li>
            );
          })}
        </ol>
      </CardContent>
      <CardFooter>
        <h4 className="font-medium text-green-500">$00.00/month</h4>
      </CardFooter>
    </Card>
  );
};

export default Pricecard;
