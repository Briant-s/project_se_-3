import { createContext, useEffect, useState, useContext, type ReactNode } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "../SupabaseClient";

interface AuthResult {
  success: boolean;
  error?: string | null;
  data?: unknown;
}

interface AuthContextValue {
  session: Session | null;
  loading: boolean;
  signInUser: (email: string, password: string) => Promise<AuthResult>;
  signUpUser: (name: string, email: string, password: string) => Promise<AuthResult>;
  signOutUser: () => Promise<void>;
  signInWithGoogle: () => Promise<AuthResult>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  const signInUser = async (email: string, password: string): Promise<AuthResult> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        console.error("sign in error occured: ", error);
        return { success: false, error: error.message };
      }
      return { success: true, data };
    } catch (error) {
      console.error("an error occured:", error);
      return { success: false, error: error instanceof Error ? error.message : "An unknown error occurred" };
    }
  };

  const signUpUser = async (name: string, email: string, password: string): Promise<AuthResult> => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name },
        },
      });
      if (error) {
        console.error("Error in sign up: ", error);
        return { success: false, error: error.message };
      }
      return { success: true, data };
    } catch (error) {
      console.error("an error occured:", error);
      return { success: false, error: error instanceof Error ? error.message : "An unknown error occurred" };
    }
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOutUser = async (): Promise<void> => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("there was error: ", error);
    }
  };

  const signInWithGoogle = async (): Promise<AuthResult> => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/my-business/business-profile`,
        },
      });
      if (error) {
        console.error("Google sign in error: ", error);
        return { success: false, error: error.message };
      }
      return { success: true, data };
    } catch (error) {
      console.error("Google sign in error:", error);
      return { success: false, error: error instanceof Error ? error.message : "An unknown error occurred" };
    }
  };

  return (
    <AuthContext.Provider
      value={{ session, loading, signUpUser, signInUser, signOutUser, signInWithGoogle }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const UserAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("UserAuth must be used within AuthContextProvider");
  }
  return context;
};
