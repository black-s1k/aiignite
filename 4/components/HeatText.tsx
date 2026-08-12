import type { JSX } from "react";

/**
 * Splits a line into per-character spans that the heat field can drive
 * individually. It holds no state and runs no loop of its own — every
 * span just carries `data-heat="type"`, and HeatField.tsx finds it.
 *
 * That split is deliberate: one component owns the simulation and the
 * frame budget, and everything else is only markup. Adding a second
 * heated headline costs nothing but characters.
 *
 * Rendered on the server, so the full line is in the HTML — readable and
 * selectable with no JS. `aria-label` on the host with the pieces hidden
 * means a screen reader gets the sentence rather than a stream of
 * letters.
 */
export function HeatText({
  children,
  className = "",
  as: Tag = "span",
}: {
  children: string;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
}) {
  const parts = Array.from(children);

  return (
    <Tag className={`heat ${className}`} aria-label={children}>
      {parts.map((ch, i) =>
        ch === " " ? (
          <span key={i} data-space aria-hidden />
        ) : (
          <span key={i} data-heat="type" aria-hidden>
            {ch}
          </span>
        ),
      )}
    </Tag>
  );
}
