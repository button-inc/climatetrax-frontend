"use client";

import { ReactNode } from "react";
import { SessionProvider } from "next-auth/react";
import StyledJsxRegistry from "@/utils/registry";
import "@/styles/globals.css";

interface DefaultLayoutProps {
  children: ReactNode;
}

export default function DefaultLayout({ children }: DefaultLayoutProps) {
  return (
    <>
      {/* 👇️  Wrap root layout with the registry for styled-jsx components (currently client side only) */}
      <StyledJsxRegistry>
        {/* 👇️  Wrapping the next-auth SessionProvider to have access to client side information in both client and server pages. i.e: COOKIE */}
        <SessionProvider>
          <div className="py-4 px-6">{children}</div>
        </SessionProvider>
      </StyledJsxRegistry>
    </>
  );
}
