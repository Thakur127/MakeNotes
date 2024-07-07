import VideourlForm from "@/components/VideourlForm";
import React from "react";

const page = () => {
  return (
    <div className="p-4">
      <section className="">
        <h3 className="font-semibold text-lg">Paste video url to start</h3>
        <VideourlForm />
      </section>
    </div>
  );
};

export default page;
