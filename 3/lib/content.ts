/**
 * Everything the page repeats or lists. One-off prose stays inline in
 * the section that says it — pulling single sentences out here just
 * means reading two files to understand one paragraph.
 */

export const CLUB = {
  name: "AI Ignite",
  at: "York University",
  tagline: "Ignite the spark. Let AI do the rest.",
  launch: "September 1, 2026",
  term: "Fall 2026",
  home: "Lassonde School of Engineering",
  advisor: {
    name: "Professor Enas Altarawneh",
    dept: "EECS, Lassonde School of Engineering",
  },
  sponsorEmail: "sponsors@aiignite.ca",
} as const;

export const TRACKS = [
  {
    key: "forge",
    name: "Forge",
    who: "for students who code",
    blurb:
      "Four workshops, taken in order. Each one picks up the pipeline you finished in the last, so the thing you deploy in session four is the thing you started in session one.",
    count: "4 workshops",
    shape: "Sequential",
  },
  {
    key: "spark",
    name: "Spark",
    who: "for everyone else",
    blurb:
      "Six standalone sessions, no prerequisites and no order. Every session opens with a vote, and what the room picks is what the room builds that day.",
    count: "6 sessions",
    shape: "Standalone",
  },
] as const;

/**
 * Numbered, because the order is load-bearing information: you cannot
 * evaluate a retrieval loop you have not built yet.
 */
export const FORGE_WORKSHOPS = [
  {
    n: "01",
    title: "Programmatic prompting",
    body: "Moving off conversational prose and onto systematic prompt engineering — zero-shot, few-shot, chain-of-thought — then forcing structured output with JSON and Pydantic. You leave with a reasoning log that tracks where your model fails across a test set.",
  },
  {
    n: "02",
    title: "Retrieval and context",
    body: "Grounding a model in knowledge it was never trained on, so it stops inventing answers. Embeddings, vector space, semantic search. You build a retrieval loop that pulls the right context into the prompt on its own.",
  },
  {
    n: "03",
    title: "Evaluation that isn't vibes",
    body: "Replacing gut-feel testing with something you can put a number on. Observability logging, LLM-as-judge, assertion tests, and tracking a real failure rate across runs instead of trusting the last one you looked at.",
  },
  {
    n: "04",
    title: "Fine-tuning, and when not to",
    body: "The honest comparison against retrieval, which usually wins. PEFT and LoRA, adapting an open model to one narrow task, and an outcomes report that states plainly where the thing stops working.",
  },
] as const;

/**
 * Deliberately unnumbered. These run in any order and the room votes on
 * the build, so numbering them would assert a sequence that isn't real.
 */
export const SPARK_SESSIONS = [
  {
    title: "Prompting, properly",
    vote: "Business email drafter · study guide generator · research summariser",
    tools: null,
  },
  {
    title: "Automation workflows",
    vote: "Co-op job tracker · weekly digest emailer · form-to-spreadsheet pipeline",
    tools: "Claude · n8n",
  },
  {
    title: "Building a web app with AI",
    vote: "Portfolio · club event page · productivity tool",
    tools: "Claude · Lovable",
  },
  {
    title: "Data and research",
    vote: "Survey results · campus data · research papers",
    tools: null,
  },
  {
    title: "Agents that finish the task",
    vote: "News tracking · site change monitoring · weekly report compiling",
    tools: null,
  },
  {
    title: "AI for your career",
    vote: "Résumé tailoring · mock interview coach · co-op application tracker",
    tools: null,
  },
] as const;

export const FACTS = [
  { label: "Open to", value: "Every York student. Any faculty, any year, any skill level." },
  { label: "Format", value: "90-minute hands-on sessions, bi-weekly, both tracks in parallel." },
  { label: "Launch", value: CLUB.launch },
  { label: "Registered through", value: CLUB.home },
] as const;

/** A real chronology, so these are numbered too. */
export const TIMELINE = [
  { n: "01", phase: "Foundation and recruitment", when: "June – July 4" },
  { n: "02", phase: "Team finalised, club registered", when: "July 5 – 15" },
  { n: "03", phase: "Curriculum built and rehearsed", when: "July – August" },
  { n: "04", phase: "Venue, schedule, signup opens", when: "Late August" },
  { n: "05", phase: "First sessions run", when: "September 2026" },
] as const;
