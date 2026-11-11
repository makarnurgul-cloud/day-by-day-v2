import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "day by day ♡",
  description: "Өзіме уақыт",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="kk">
      <head>
        {/* Tailwind CSS CDN - GitHub Pages үшін стильдерді 100% ұстап тұрады */}
        <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
      </head>
      <body className="bg-[#f5f3ff] min-h-screen text-slate-800">
        {children}
      </body>
    </html>
  );
}