import { SignUp } from "@clerk/nextjs";

const page = () => {
  return (
    <div className="h-svh flex w-full">
      <div className="m-auto">
        <SignUp />
      </div>
    </div>
  );
};

export default page;
