import MyClassrooms from "@/components/MyClassrooms";
import { Separator } from "@/components/ui/separator";
import VideourlForm from "@/components/VideourlForm";

const Page = async () => {
  return (
    <div className="p-4">
      <section className="mt-2 mb-4">
        <h3 className="font-semibold text-lg text-gray-800">
          Paste video url to start
        </h3>
        <VideourlForm />
      </section>
      <Separator />
      <section className="mt-4">
        <MyClassrooms />
      </section>
    </div>
  );
};

export default Page;
