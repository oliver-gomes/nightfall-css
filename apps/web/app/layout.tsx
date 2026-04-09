import type { Metadata } from "next";
import { Sidebar } from "@/components/Sidebar";
import { NightfallProvider } from "@/components/ThemeProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nightfall CSS — The other theme. Reverse-engineered.",
  description:
    "Auto-generate the opposite theme from your existing UI. Dark→light or light→dark. Not filter: invert(). Real theme generation in OKLCH color space.",
  openGraph: {
    title: "Nightfall CSS",
    description: "The other theme. Reverse-engineered.",
    siteName: "Nightfall CSS",
  },
};

const foucScript = `(function(){try{var t=localStorage.getItem('nightfall-theme');if(t==='light'){document.documentElement.setAttribute('data-theme','light');document.documentElement.classList.add('light')}else{document.documentElement.setAttribute('data-theme','dark');document.documentElement.classList.add('dark')}}catch(e){document.documentElement.classList.add('dark')}})()`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: foucScript }} />
      </head>
      <body className="min-h-screen bg-nf-bg text-nf-text antialiased">
        <NightfallProvider defaultTheme="dark">
          <Sidebar />
          <main className="lg:pl-[var(--spacing-sidebar)] min-h-screen">
            <div className="mx-auto max-w-5xl px-6 py-10 lg:px-10">
              {children}
            </div>
          </main>
        </NightfallProvider>
      </body>
    </html>
  );
}
