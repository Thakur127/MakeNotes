import React from "react";
import MaxWidthWrapper from "../MaxWidthWrapper";
import Pricecard from "./Pricecard";
import {
  freeAvailableServices,
  freeNotAvailableServices,
} from "@/constants/services";

const Pricing = () => {
  return (
    <MaxWidthWrapper>
      <div>
        <h1 className="text-3xl font-semibold text-center">Pricing</h1>
        <div className="flex flex-wrap gap-4 justify-center mt-4">
          <Pricecard
            plan={"Free"}
            availableService={freeAvailableServices}
            notAvailableService={freeNotAvailableServices}
          />
          <Pricecard
            plan={"Free"}
            availableService={freeAvailableServices}
            notAvailableService={freeNotAvailableServices}
          />
          <Pricecard
            plan={"Free"}
            availableService={freeAvailableServices}
            notAvailableService={freeNotAvailableServices}
          />
        </div>
      </div>
    </MaxWidthWrapper>
  );
};

export default Pricing;
