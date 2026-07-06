import type { ReactNode } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";

export function PageShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-dvh">
      <Header />
      <main className="pt-24">{children}</main>
      <Footer />
    </div>
  );
}
