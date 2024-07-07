import { ClerkProvider } from "@clerk/nextjs";

const Provider = ({ children }) => {
  return <ClerkProvider>{children}</ClerkProvider>;
};

export default Provider;
