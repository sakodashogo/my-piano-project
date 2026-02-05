import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Piano Lesson Manager",
  description: "ピアノ教室運営管理システム",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <body className="antialiased bg-slate-950 text-slate-100">
        {children}
      </body>
    </html>
  );
}
