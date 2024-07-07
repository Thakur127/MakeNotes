import { SignIn } from "@clerk/nextjs";

const page = () => {
  return (
    <div className="h-svh flex w-full">
      <div className="m-auto">
        <SignIn />
      </div>
    </div>
  );
};

export default page;
