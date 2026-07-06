import { useReveal } from "@/hooks/use-reveal";
import type { ReactNode } from "react";

export function Section({
  id,
  eyebrow,
  title,
  description,
  children,
  className = "",
}: {
  id?: string;
  eyebrow?: string;
  title?: ReactNode;
  description?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  const ref = useReveal<HTMLDivElement>();
  return (
    <section id={id} className={`relative py-16 sm:py-24 lg:py-32 ${className}`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {(eyebrow || title || description) && (
          <div ref={ref} className="reveal mx-auto max-w-3xl text-center mb-12 sm:mb-16">
            {eyebrow && (
              <span className="inline-flex items-center rounded-full glass px-3 py-1 text-xs font-medium text-muted-foreground">
                {eyebrow}
              </span>
            )}
            {title && (
              <h2 className="mt-4 font-display text-4xl sm:text-5xl font-bold tracking-tight text-gradient">
                {title}
              </h2>
            )}
            {description && (
              <p className="mt-5 text-base sm:text-lg text-muted-foreground">
                {description}
              </p>
            )}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}
