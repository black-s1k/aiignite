/**
 * The section shell, and the page's only layout idea: a narrow left
 * gutter carrying the section's mono slug, and the measure beside it.
 *
 * It comes straight off a printed spec sheet, where the margin holds
 * the labels and the body column holds the text. It also does real
 * work — every section is self-identifying without needing a heading
 * to say what kind of thing it is.
 *
 * `press` names which chapter of the ink animation this section owns.
 */
export function Sheet({
  id,
  slug,
  press,
  children,
  className,
  rule = true,
}: {
  id?: string;
  slug?: string;
  press?: string;
  children: React.ReactNode;
  className?: string;
  /** Drop the top rule where two sections should read as one block. */
  rule?: boolean;
}) {
  return (
    <section
      id={id}
      data-press={press}
      className={[
        "mx-auto w-full max-w-6xl px-5 py-24 sm:px-8 sm:py-32",
        rule ? "border-t border-graphite/25" : "",
        className ?? "",
      ].join(" ")}
    >
      <div className="grid gap-x-10 gap-y-8 md:grid-cols-[7rem_minmax(0,1fr)]">
        <div className="md:pt-2">
          {slug && <p className="tag">{slug}</p>}
        </div>
        <div className="min-w-0">{children}</div>
      </div>
    </section>
  );
}
