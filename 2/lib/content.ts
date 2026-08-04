/**
 * All site copy that repeats or lists. One-off prose stays inline in its
 * section component; anything that maps over an array lives here.
 */

export const CLUB = {
  name: "AI Ignite at York",
  tagline: "Ignite the Spark. Let AI do the Rest.",
  launch: "September 1, 2026",
  home: "Lassonde School of Engineering, York University",
  advisor: {
    name: "Professor Enas Altarawneh",
    dept: "EECS, Lassonde School of Engineering",
  },
  sponsorEmail: "sponsors@aiignite.ca",
} as const;

/** Sequential. The numbers are real information — each session needs the last. */
export const FORGE_WORKSHOPS = [
  {
    n: "01",
    title: "Programmatic Prompting & Structured Logic",
    body: "Moving from conversational prose to systematic prompt engineering: zero-shot, few-shot, chain-of-thought. Enforcing structured outputs with JSON and Pydantic. Students build a reasoning log to track and fix model failures across a test dataset.",
  },
  {
    n: "02",
    title: "Contextual Augmentation & Retrieval (RAG)",
    body: "Grounding LLMs in external knowledge to eliminate hallucinations. Text embeddings, vector spaces, semantic search. Students build a dynamic retrieval loop that pulls relevant context into the prompt.",
  },
  {
    n: "03",
    title: "Industry Tools & Programmatic Evaluation",
    body: "Moving from gut-feel testing to deterministic evaluation. AI developer frameworks, observability logging, LLM-as-a-judge patterns, assertion testing, and aggregate failure-rate tracking.",
  },
  {
    n: "04",
    title: "Specialized Optimization & Fine-Tuning",
    body: "When to fine-tune versus retrieve. PEFT and LoRA fundamentals, open-source model adaptation. Students fine-tune a model on a custom task and produce an outcomes report with performance boundaries.",
  },
] as const;

/**
 * Independent and poll-driven — deliberately unnumbered. Numbering would
 * imply a prerequisite chain that does not exist.
 */
export const SPARK_SESSIONS = [
  {
    title: "Prompt Engineering for Everyone",
    vote: "Vote on a project: business email drafter, study guide generator, or research summarizer.",
    tools: null,
  },
  {
    title: "AI Automation Workflows",
    vote: "Vote on an automation: co-op job tracker, weekly digest emailer, or form-to-spreadsheet pipeline.",
    tools: "Claude · n8n",
  },
  {
    title: "Vibe Coding — Build a Web App with AI",
    vote: "Vote on an app: portfolio, club event page, or productivity tool.",
    tools: "Claude · Lovable",
  },
  {
    title: "AI for Data & Research",
    vote: "Vote on a dataset: survey results, campus data, or research papers. Clean it, analyze it, present it.",
    tools: null,
  },
  {
    title: "AI Agents — Autonomous Task Completion",
    vote: "Vote on an agent task: news tracking, website change monitoring, or weekly report compiling.",
    tools: null,
  },
  {
    title: "AI for Your Career",
    vote: "Vote on a career tool: resume tailoring assistant, mock interview coach, or co-op application tracker.",
    tools: null,
  },
] as const;

export const GLANCE = [
  { label: "Open to", value: "All York students — every faculty, every year, every level" },
  { label: "Format", value: "90-minute hands-on workshops, bi-weekly, both tracks in parallel" },
  { label: "Launch", value: CLUB.launch },
  { label: "Registered through", value: "Lassonde School of Engineering" },
] as const;

/** Genuinely sequential, so the numbering carries meaning here too. */
export const TIMELINE = [
  {
    n: "01",
    phase: "Foundation & Recruitment",
    when: "June – July 4",
    detail: "Executive team recruitment and curriculum scoping.",
  },
  {
    n: "02",
    phase: "Team Finalization & Registration",
    when: "July 5 – 15",
    detail: "Roles confirmed and club registration filed with Lassonde.",
  },
  {
    n: "03",
    phase: "Content Development & Dry Runs",
    when: "July – August",
    detail: "Workshop material built, then rehearsed end to end.",
  },
  {
    n: "04",
    phase: "Pre-Launch Preparation",
    when: "Late August",
    detail: "Venue, scheduling, and signup opened ahead of the term.",
  },
  {
    n: "05",
    phase: "Public Launch",
    when: "September 2026",
    detail: "First sessions run; both tracks begin in parallel.",
  },
] as const;
