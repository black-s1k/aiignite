import { Fragment, type JSX } from "react";

/**
 * Splits a line into per-character spans that the heat field can drive
 * individually. It holds no state and runs no loop of its own — every
 * span carries `data-heat="type"`, and HeatField.tsx finds it.
 *
 * That split is deliberate: one component owns the simulation and the
 * frame budget, everything else is only markup. Adding another heated
 * headline costs nothing but characters.
 *
 * ---- Why the words are wrapped, not just the characters ----
 * Characters have to be `inline-block` for the width axis to move them,
 * and an inline-block is a break opportunity — so a plain per-character
 * split lets the browser wrap in the MIDDLE OF A WORD. It rendered
 * "What actually happe / ns" before this. Each word is therefore its own
 * nowrap inline-block, and the real spaces between those wrappers are
 * the only places a line can break.
 *
 * Rendered on the server, so the whole line is in the HTML — readable
 * and selectable with no JS. `aria-label` on the host with the pieces
 * hidden means a screen reader gets the sentence rather than a stream of
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
  const words = children.split(" ");

  return (
    <Tag className={`heat ${className}`} aria-label={children}>
      {words.map((word, w) => (
        <Fragment key={w}>
          <span className="heat-word" aria-hidden>
            {Array.from(word).map((ch, i) => (
              <span key={i} data-heat="type">
                {ch}
              </span>
            ))}
          </span>
          {/* A real space BETWEEN the wrappers, never inside one. An
              inline-block trims its own trailing whitespace, so a space
              placed within the word simply disappears and the words run
              together — it rendered "Whatactually happens". Out here it
              survives, and it is the only break opportunity in the line. */}
          {w < words.length - 1 ? " " : null}
        </Fragment>
      ))}
    </Tag>
  );
}
