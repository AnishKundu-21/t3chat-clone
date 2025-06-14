"use client";

import * as React from "react";
import { SessionProvider } from "next-auth/react";

// Define the props for this component
interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  // This component simply wraps its children with the SessionProvider
  // to make the session context available throughout the app.
  return <SessionProvider>{children}</SessionProvider>;
}
