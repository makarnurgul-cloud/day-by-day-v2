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
 
  // Кіріп болған адам автоматты түрде басты бетке өтеді
  useEffect(() => {
    if (user) router.replace("/");
  }, [user, router]);
 
  const handleSubmit = async () => {
    setError(null);
    setInfo(null);
 
    if (!email.trim() || !password) {
      setError("Email мен құпиясөзді толтырыңыз.");
      return;
    }
    if (mode === "up" && !name.trim()) {
      setError("Атыңды жаз.");
      return;
    }
    if (password.length < 6) {
      setError("Құпиясөз кемінде 6 таңба болуы керек.");
      return;
    }
 
    setBusy(true);
    try {
      if (mode === "in") {
        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });
        if (error) setError("Email немесе құпиясөз қате.");
        else router.replace("/");
      } else {
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: { data: { name: name.trim() } },
        });
        if (error) setError(error.message);
        else if (!data.session)
          setInfo("Поштаңа растау хаты жіберілді. Растап, кейін кір.");
        else router.replace("/");
      }
    } catch (err) {
      console.error("Қате:", err);
      setError("Қате орын алды. Қайта көр.");
    } finally {
      setBusy(false);
    }
  };
 
  const onEnter = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSubmit();
  };
 
  return (
    <main className="grid min-h-screen place-items-center p-4">
      <div className="w-full max-w-md space-y-4 rounded-[2rem] bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-bold text-violet-700">day by day ♡</h1>
        <p className="text-violet-400">
          {mode === "in" ? "Қайта оралғаныңа қуаныштымыз!" : "Жаңа аккаунт құр"}
        </p>
 
        {mode === "up" && (
          <input
            className={field}
            placeholder="Атың"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={onEnter}
          />
        )}
 
        <input
          className={field}
          type="email"
          placeholder="Email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={onEnter}
        />
 
        <input
          className={field}
          type="password"
          placeholder="Құпиясөз (6+ таңба)"
          autoComplete={mode === "in" ? "current-password" : "new-password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={onEnter}
        />
 
        {error && <p className={errBox}>{error}</p>}
        {info && (
          <p className="rounded-xl bg-violet-50 px-4 py-2 text-sm text-violet-700">
            {info}
          </p>
        )}
 
        <button
          type="button"
          onClick={handleSubmit}
          className={`${btn} w-full`}
          disabled={busy}
        >
          {busy ? "…" : mode === "in" ? "Кіру" : "Тіркелу"}
        </button>
 
        <button
          type="button"
          onClick={() => {
            setMode(mode === "in" ? "up" : "in");
            setError(null);
            setInfo(null);
          }}
          className="w-full text-sm text-violet-500 underline"
        >
          {mode === "in" ? "Аккаунтың жоқ па? Тіркел" : "Аккаунтың бар ма? Кіру"}
        </button>
      </div>
    </main>
  );
}