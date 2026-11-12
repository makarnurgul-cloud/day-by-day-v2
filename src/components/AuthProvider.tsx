"use client";
import { createContext, useContext, useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
 
type Ctx = { user: User | null; name: string; loading: boolean };
const AuthCtx = createContext<Ctx>({ user: null, name: "", loading: true });
export const useAuth = () => useContext(AuthCtx);
 
export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
 
  useEffect(() => {
    let active = true;

    // Қауіпсіздік үшін: егер Supabase 2 секунд ішінде жауап бермесе, 
    // loading күйін автоматты түрде тоқтату (қатып қалудың алдын алу үшін)
    const timer = setTimeout(() => {
      if (active && loading) {
        console.warn("Auth timeout, forcing loading to false");
        setLoading(false);
      }
    }, 2000);
 
    supabase.auth.getSession().then(({ data, error }) => {
      if (!active) return;
      if (error) console.error("Session error:", error);
      setUser(data.session?.user ?? null);
      setLoading(false);
      clearTimeout(timer);
    }).catch((err) => {
      if (!active) return;
      console.error("Get session catch:", err);
      setLoading(false);
      clearTimeout(timer);
    });
 
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (!active) return;
      setUser(session?.user ?? null);
      setLoading(false);
    });
 
    return () => {
      active = false;
      clearTimeout(timer);
      authListener.subscription.unsubscribe();
    };
  }, []);
 
  const name = (user?.user_metadata?.name as string) || user?.email?.split("@")[0] || "";
  return <AuthCtx.Provider value={{ user, name, loading }}>{children}</AuthCtx.Provider>;
}
 