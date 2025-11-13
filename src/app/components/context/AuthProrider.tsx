"use client";

import { SessionProvider, signIn, signOut, useSession } from "next-auth/react";
import { createContext, useContext } from "react";
import LoadingScreen from "../LoadingScreen";
import { Session } from "next-auth";

interface AuthContextType {
  session: Session | null;
  status: "loading" | "authenticated" | "unauthenticated";
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProviders({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <AuthProviderContent>{children}</AuthProviderContent>
    </SessionProvider>
  );
}

function AuthProviderContent({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();

  const handleSignIn = async () => {
    try {
      await signIn("google", { callbackUrl: window.location.href });
    } catch (error) {
      console.error("Sign in error:", error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut({ callbackUrl: window.location.href });
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  const value = {
    session,
    status,
    signIn: handleSignIn,
    signOut: handleSignOut,
  };

  if (status === "loading") {
    return <LoadingScreen />;
  };



  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthContextProvider");
  }
  return context;
}
