import { cn } from "@/lib/utils";

/**
 * The one section shell. A hairline on top, an eyebrow label, then content.
 * Keeping this in one place is what stops the page drifting into six
 * slightly different paddings.
 */
export function Section({
  id,
  eyebrow,
  children,
  className,
  bare = false,
}: {
  id?: string;
  eyebrow?: string;
  children: React.ReactNode;
  className?: string;
  /** Skip the top hairline — used where two sections should read as one block. */
  bare?: boolean;
}) {
  return (
    <section
      id={id}
      className={cn(
        "mx-auto w-full max-w-5xl px-5 py-20 sm:px-8 sm:py-28",
        !bare && "border-border border-t",
        className,
      )}
    >
      {eyebrow && <p className="eyebrow mb-10 sm:mb-14">{eyebrow}</p>}
      {children}
    </section>
  );
}
