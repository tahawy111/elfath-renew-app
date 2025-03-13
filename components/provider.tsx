"use client";

import { SessionProvider } from "next-auth/react";
import { Toaster } from "react-hot-toast";
function Provider({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SessionProvider>
        <Toaster />
        {children}
      </SessionProvider>
    </>
  );
}

export default Provider;
