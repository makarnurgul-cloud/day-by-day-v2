"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "./AuthProvider";
import { supabase } from "@/lib/supabase";
import { card } from "@/lib/ui";

const NAV = [
  ["/", "Басты бет", "🏠"], ["/tasks", "Тапсырмалар", "✅"], ["/calendar", "Күнтізбе", "📅"],
  ["/mood", "Көңіл күй", "😊"], ["/diary", "Күнделік", "📖"], ["/stats", "Статистика", "📊"], ["/profile", "Профиль", "👤"],
];

export default function Shell({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const path = usePathname();

  // Авторизациядан өтпеген болса, автоматты түрде /login бетіне жіберу
  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [loading, user, router]);

  // Деректер әлі жүктеліп жатқан кезде көрсетілетін экран
  if (loading)
    return <div className="grid min-h-screen place-items-center text-violet-400">Жүктелуде…</div>;

  // Қолданушы жоқ болса, бос қайтару (login бетіне бағытталғанша)
  if (!user) return null;

  const active = (h: string) => (h === "/" ? path === "/" : path.startsWith(h));

  return (
    <div className="mx-auto flex min-h-screen max-w-6xl gap-6 p-3 pb-24 md:p-6 md:pb-6">
      <aside className="hidden w-60 shrink-0 md:block">
        <div className={`${card} sticky top-6 bg-white shadow-sm`}>
          <p className="mb-4 text-2xl font-bold text-violet-700">day by day ♡</p>
          <nav className="space-y-1">
            {NAV.map(([href, label, icon]) => (
              <Link key={href} href={href}
                className={`flex items-center gap-3 rounded-2xl px-4 py-3 font-medium transition ${active(href) ? "bg-violet-100 text-violet-700" : "text-violet-400 hover:bg-violet-50"}`}>
                <span>{icon}</span>{label}
              </Link>
            ))}
          </nav>
        </div>
      </aside>

      <main className="min-w-0 flex-1">
        <div className="rounded-[2rem] bg-white p-5 shadow-sm md:p-8">{children}</div>
      </main>

      <nav className="fixed inset-x-0 bottom-0 z-10 flex overflow-x-auto border-t border-violet-100 bg-white/95 backdrop-blur md:hidden">
        {NAV.map(([href, label, icon]) => (
          <Link key={href} href={href}
            className={`flex min-w-[72px] flex-1 flex-col items-center py-2 text-[11px] ${active(href) ? "text-violet-700" : "text-violet-300"}`}>
            <span className="text-xl">{icon}</span>{label}
          </Link>
        ))}
      </nav>
    </div>
  );
}