"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/components/AuthProvider";
import { btn, errBox, field } from "@/lib/ui";

export default function LoginPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [mode, setMode] = useState<"in" | "up">("in");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => { if (user) router.replace("/"); }, [user, router]);

  const handleLoginClick = async () => {
    console.log("Кіру батырмасы тікелей басылды!");
    setError(null);
    setInfo(null);

    if (!email || !password) {
      setError("Email мен құпиясөзді толтырыңыз.");
      return;
    }

    setBusy(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      console.log("Supabase нәтижесі:", { data, error });
      
      if (error) {
        setError(error.message);
      } else {
        console.log("Кіру сәтті өтті, басты бетке өтуде...");
        router.replace("/");
      }
    } catch (err: any) {
      console.error("Қате:", err);
      setError("Қате орын алды.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="grid min-h-screen place-items-center p-4">
      <div className="w-full max-w-md space-y-4 rounded-[2rem] bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-bold text-violet-700">day by day ♡</h1>
        <p className="text-violet-400">{mode === "in" ? "Қайта оралғаныңа қуаныштымыз!" : "Жаңа аккаунт құр"}</p>
        
        {mode === "up" && (
          <input 
            className={field} 
            placeholder="Атың" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
          />
        )}
        
        <input 
          className={field} 
          type="email" 
          placeholder="Email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
        />
        
        <input 
          className={field} 
          type="password" 
          placeholder="Құпиясөз (6+ таңба)" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
        />

        {error && <p className={errBox}>{error}</p>}
        {info && <p className="rounded-xl bg-violet-50 px-4 py-2 text-sm text-violet-700">{info}</p>}

        {/* Форма орнына тікелей onClick қолданамыз, бұл игнор проблемасын 100% шешеді */}
        <button 
          type="button" 
          onClick={handleLoginClick} 
          className={`${btn} w-full`} 
          disabled={busy}
        >
          {busy ? "…" : mode === "in" ? "Кіру" : "Тіркелу"}
        </button>

        <button 
          type="button" 
          onClick={() => { setMode(mode === "in" ? "up" : "in"); setError(null); }} 
          className="w-full text-sm text-violet-500 underline"
        >
          {mode === "in" ? "Аккаунтың жоқ па? Тіркел" : "Аккаунтың бар ма? Кіру"}
        </button>
      </div>
    </main>
  );
}
