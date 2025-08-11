import { SessionProvider } from "next-auth/react";
import { PropsWithChildren } from "react";

export default function NextAuthWrapper({ children }: PropsWithChildren) {
  return <SessionProvider>{children}</SessionProvider>;
}
