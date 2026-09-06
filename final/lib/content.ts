/**
 * Every fact the page states, in one place.
 *
 * The brief was ordinary content described plainly, so nothing here is
 * written to be clever. It answers, in order, the questions a student
 * actually has: what is this, why does it exist, is it for me, what
 * happens in a session, what will I build, who runs it, and how do I
 * join.
 *
 * THE ONE RULE THIS FILE FOLLOWS: NOTHING CLAIMED THAT IS NOT TRUE. The
 * club launches in September 2026 and has no track record, no alumni and
 * no attendance numbers, so there are none here. Where credibility is
 * needed the page uses what is real: who backs it, who runs it, and
 * exactly what happens in a session.
 *
 * Two things that rule has already caught, so they do not creep back:
 *
 * - SPONSORS ARE NOT NAMED. Outreach to several companies is underway
 *   and none has agreed. Printing their names would read as endorsement
 *   the club has not been given, which is both the oldest trick on a
 *   generated site and a genuine problem with those particular brands.
 *   When one signs, name that one.
 * - NO EM DASHES in anything a reader sees. They are the most reliable
 *   punctuation tell of generated copy, so sentences here are structured
 *   to not need them rather than having the character swapped out.
 */

export const CLUB = {
  name: "AI Ignite",
  fullName: "AI Ignite at York",
  university: "York University",
  faculty: "Lassonde School of Engineering",
  term: "Fall 2026",
  launch: "September 1, 2026",
  tagline: "Ignite the spark. Let AI do the rest.",
  advisor: {
    name: "Professor Enas Altarawneh",
    dept: "EECS, Lassonde School of Engineering",
  },
  contact: "aiignite.yorku@gmail.com",
  sponsors: "aiignite.yorku+sponsors@gmail.com",
  /**
   * The domain the club INTENDS to use. It has not been bought yet, so
   * this is a plan rather than a fact, and nothing renders it — checked.
   *
   * Do not put it on the page until it resolves. A site that prints its
   * own address wrong is a worse tell than one that prints none, and the
   * rule at the top of this file is that nothing here is claimed unless
   * it is true. The live origin comes from SITE_URL in app/layout.tsx,
   * which is where the switch lives when the domain is real.
   */
  site: "aiignite.ca",
  linkedin: "https://www.linkedin.com/company/ai-ignite-at-york",
  instagram: "https://www.instagram.com/aiignite.yorku/",

  /**
   * The Discord invite.
   *
   * !! THIS ONE EXPIRES. !! Checked against Discord's invite API on
   * 2026-09-05: valid, but with `expires_at` 2026-09-21 — about two
   * weeks after the club's own launch date. A link that dies while the
   * page is still up is the single most recognisable slop tell there
   * is, and it is worse here than a `href="#"` would be, because this
   * one works right up until the moment it matters.
   *
   * Replace it with a NEVER-EXPIRING invite: Discord > Server Settings >
   * Invites, or right-click the channel > Invite People > Edit invite
   * link > Expire after: Never, Max uses: No limit. Then paste it here.
   *
   * Re-check with:
   *   curl -s "https://discord.com/api/v10/invites/<code>" | grep expires_at
   */
  discord: "https://discord.gg/CFna7PqT3",

  /**
   * The club's entry in York's official student-organisation registry.
   *
   * The tracking parameters Instagram appends to a link-in-bio
   * (`utm_source`, `utm_medium`, `utm_content`, `fbclid`) are stripped.
   * They describe how someone arrived at Instagram, which is neither
   * true nor ours to assert once the link is on our own site, and
   * app/privacy says this site does not tell other sites where its
   * traffic came from.
   *
   * Note for whoever writes the copy around it: YUConnect redirects an
   * anonymous visitor to a Passport York login before showing the club
   * page. That is York's behaviour, not something we can route around,
   * so the label should not promise a public page.
   */
  yuconnect:
    "https://yuconnect.yorku.ca/feeds?type=club&type_id=36128&tab=about",
} as const;

/** The nav. Kept short on purpose, since five is already too many. */
/**
 * Every place the club exists, in one list.
 *
 * Two things render this — the colophon and the flame block that closes
 * each page — and they were about to hold two hand-written copies of the
 * same four links. One list, so a channel cannot be live in the footer
 * and missing from the call to action, which is exactly the drift that
 * put three copies of the Join block in the codebase to begin with.
 *
 * Order is deliberate and is not alphabetical: it runs from where the
 * club actually talks to where it is merely listed. Discord is first
 * because it is the only one where a reader gets a reply.
 *
 * `long` exists for the colophon, which has the room for a phrase and
 * needs it in YUConnect's case: that link sends an anonymous visitor to
 * Passport York before it shows anything, so the footer says "Listed on"
 * rather than promising a page. The flame block is a compact row and
 * uses the bare `name` there.
 */
export const SOCIALS = [
  { name: "Discord", href: CLUB.discord },
  { name: "Instagram", href: CLUB.instagram },
  { name: "LinkedIn", href: CLUB.linkedin },
  { name: "YUConnect", href: CLUB.yuconnect, long: "Listed on YUConnect" },
] as const;

export const NAV = [
  { label: "Why", href: "/#why" },
  { label: "Tracks", href: "/#tracks" },
  { label: "Team", href: "/#team" },
  { label: "FAQ", href: "/#faq" },
] as const;

/** Surfaced in the first screen, before anyone has to scroll. */
export const LOGISTICS = [
  { k: "Starts", v: CLUB.launch, sub: "Sessions run through the fall term" },
  { k: "Where", v: "Lassonde, York University", sub: "Keele campus, room with the schedule" },
  { k: "Cost", v: "Free", sub: "No application, no interview" },
] as const;

/** The gap the club exists to close. Stated as a problem, not a pitch. */
export const WHY = {
  label: "Why we exist",
  heading: "The gap nobody schedules a class for",
  body: [
    "Most students finish a degree knowing AI exists without ever having built anything with it. The distance between what a course covers and what is assumed on the first day of a job keeps growing.",
    "The students who close that distance before they graduate are the ones who stand out. AI Ignite exists to close it for any York student, whatever they are enrolled in.",
  ],
} as const;

export const PURPOSE = [
  {
    k: "Mission",
    v: "To bridge academic learning and industry-ready AI skills, giving York students hands-on experience building real AI tools before they graduate, whatever faculty they come from and whatever their technical background.",
  },
  {
    k: "Vision",
    v: "To make York students day-one capable practitioners, equipped with the production tools, structured reasoning and evaluation skills the industry actually asks for.",
  },
] as const;

export const ABOUT = [
  "AI Ignite is a student club at York University. We meet through the fall term to build things with AI tools, not to talk about them.",
  "Two tracks run in parallel under one club. They share community events and finish the term with a joint showcase. You pick the one that matches where you are starting from.",
] as const;

/* ---- The tracks -----------------------------------------------------
   Both are described by what a member LEAVES WITH, because that is the
   question being asked and the one most club pages never answer. */

export const TRACKS = [
  {
    key: "spark",
    href: "/spark",
    name: "Spark",
    audience: "If you have never written a line",
    who: "Every faculty, every year",
    shape: "Standalone · 6 sessions",
    blurb:
      "Six sessions, each one self-contained. No code, no prerequisites, nothing to install. Every session opens with a vote, and whatever the room picks is what the room builds that day.",
    outcome:
      "A working AI tool or workflow you built yourself and can use the same evening.",
    cadence: "Drop in to as many as you like. Nothing assumes you were at the last one.",
  },
  {
    key: "forge",
    href: "/forge",
    name: "Forge",
    audience: "If you already code",
    who: "CS, Software Engineering, Data Science, graduate students",
    shape: "Sequential · 4 workshops",
    blurb:
      "Four workshops taken in order, all working on one pipeline that grows in complexity each time. What you deploy in the final session is what you started in the first.",
    outcome:
      "A deployment-ready AI pipeline, layered across four sessions, that belongs in a portfolio rather than a demo folder.",
    cadence: "Biweekly, and each session assumes the one before it. Come to all four.",
  },
] as const;

/** The Spark track in full. Lives at /spark. */
export const SPARK = {
  name: "Spark",
  title: "The Spark Track",
  subtitle: "No experience needed. All faculties, all years.",
  intro: [
    "Spark is the open-access half of AI Ignite, for students from any faculty who want to use AI for real work without a technical background. No code required, no prerequisites.",
    "Six hands-on sessions run through the year. Before each one, members vote on what to build. The group picks the project, then spends the session building it together with the same tools professionals use.",
  ],
  who: [
    "Open to all York students, any faculty, any year, any major.",
    "Absolute beginner through intermediate. If you have used ChatGPT once, or have only been curious about it, you belong here.",
    "Drop-in friendly. Every session stands alone, so come to as many as you want.",
  ],
  outcome:
    "A real AI-powered tool or workflow, built by you during the session. Something you can use immediately.",
  /** The differentiator, and the reason it gets its own block on the
   *  page rather than a bullet: most clubs announce a syllabus. */
  poll: {
    label: "The poll",
    heading: "We ask before we teach",
    body: [
      "One week before each session, a poll goes out on Instagram, WhatsApp and Discord with three or four project ideas. Members vote. The winning idea becomes the session project.",
      "Everyone who turns up leaves with a working version of it. Nothing here is demo-only.",
    ],
  },
  format: [
    { t: "20 min", k: "Topic presentation", v: "What the tool is, why it matters, and how professionals use it." },
    { t: "60 min", k: "Group build", v: "We build the project the room voted for, step by step, together." },
    { t: "10 min", k: "Share and wrap", v: "Members show what they built and get a preview of the next session." },
  ],
  sessions: [
    {
      n: "01",
      name: "Prompt engineering for everyone",
      build:
        "A working prompt-based tool: an email drafter, a study guide generator, a research summariser, or a cover letter helper.",
    },
    {
      n: "02",
      name: "AI automation workflows",
      build:
        "A live automation that runs in the background: a job tracker, a weekly digest emailer, a social scheduler, or a deadline reminder bot.",
    },
    {
      n: "03",
      name: "Vibe coding: build a web app with AI",
      build:
        "A deployed web app with a URL, built from nothing in 90 minutes.",
    },
    {
      n: "04",
      name: "AI for data and research",
      build:
        "A full analysis with charts, findings and a shareable summary.",
    },
    {
      n: "05",
      name: "AI agents: autonomous task completion",
      build:
        "A working agent that finishes a multi-step task without being nudged through it.",
    },
    {
      n: "06",
      name: "AI for your career",
      build:
        "A career tool: a resume optimiser, a LinkedIn analyser, an interview prep bot, or a networking message generator.",
    },
  ],
  tools: [
    "Claude.ai",
    "ChatGPT",
    "n8n",
    "Lovable.dev",
    "Cursor",
    "Bolt.new",
    "Flourish",
    "Google Sheets",
    "Google Docs",
  ],
  leaveWith: [
    "Six working AI tools, one from each session, shaped by what your cohort voted for.",
    "Practical fluency: prompting, automating, building apps, analysing data, running agents.",
    "A network across Business, Science, Arts, Engineering and Law.",
    "The mindset that comes from having shipped things, broken things, and learned what AI cannot do.",
    "A way in to Forge when you want to go deeper.",
  ],
} as const;

/** The Forge track in full. Lives at /forge. */
export const FORGE = {
  name: "Forge",
  title: "The Forge Track",
  subtitle:
    "For CS, Software Engineering and Data Science students ready to build at industry level.",
  intro: [
    "Forge is a sequential curriculum for students who want to stop using AI and start building with it properly. Four structured workshops, all working on one data pipeline that gets more complex each session.",
    "By the end of the term that pipeline is a deployment-ready system rather than a set of exercises.",
  ],
  who: [
    "Best suited to CS, Software Engineering, Data Science and graduate students with some programming behind them.",
    "Third or fourth year undergraduate, or graduate. Basic Python familiarity is recommended.",
    "Biweekly, and each workshop builds directly on the last, so attendance matters here.",
  ],
  outcome:
    "A fully functional, deployment-ready AI pipeline built incrementally across all four sessions.",
  /** The structural idea, and the reason Forge is not four unrelated
   *  workshops. Given its own block for the same reason as Spark's poll. */
  pipeline: {
    label: "One pipeline",
    heading: "The same dataset, four times deeper",
    body: [
      "Unlike a set of standalone workshops, Forge runs one project the whole way through. You choose a domain dataset at the start, whether that is medical records, financial data or academic papers, and every new skill gets applied to that same data.",
      "By workshop four you are holding a layered system: structured prompts feeding a retrieval pipeline, evaluated programmatically, with a fine-tuned model at its core.",
    ],
    layers: [
      { n: "01", k: "Structured prompting", v: "Consistent, parseable output instead of conversation." },
      { n: "02", k: "Retrieval", v: "Real external knowledge grounding every answer." },
      { n: "03", k: "Evaluation", v: "Measured quality in place of a vibe check." },
      { n: "04", k: "Fine-tuning", v: "The model itself adapted to the task." },
    ],
  },
  format: [
    { t: "15 to 30 min", k: "Opening", v: "What is new in AI that bears on today's topic, and why industry cares." },
    { t: "60 to 70 min", k: "Hands-on build", v: "You work in a notebook while tech leads walk the room and debug with you in real time." },
    { t: "10 min", k: "Review and link forward", v: "What got built, and what the next session does to it." },
  ],
  workshops: [
    {
      n: "01",
      name: "Programmatic prompting and structured logic",
      goal: "Move from conversational AI to systematic, production-grade prompt engineering.",
      skills: [
        "Zero-shot and few-shot prompt design",
        "Chain of thought",
        "Schema enforcement with JSON and Pydantic outputs",
        "Prompts that produce consistent, parseable results",
      ],
      build:
        "A reasoning log: a structured system that tracks model output, classifies logic failures, and documents how to fix them across a test dataset.",
      tools: ["Claude API", "Python", "Pydantic", "Jupyter / Colab"],
    },
    {
      n: "02",
      name: "Contextual augmentation and retrieval",
      goal: "Ground the model in real external knowledge to cut hallucination and raise reliability.",
      skills: [
        "Text embedding generation",
        "Semantic vector spaces",
        "Building retrieval loops",
        "Dynamic few-shot retrieval by similarity search",
      ],
      build:
        "A retrieval pipeline that pulls the most relevant domain data into the prompt automatically, plugged straight into the reasoning log from workshop one.",
      tools: ["LangChain / LlamaIndex", "FAISS / ChromaDB", "OpenAI / HuggingFace embeddings", "Python"],
    },
    {
      n: "03",
      name: "Industry tools and programmatic evaluation",
      goal: "Replace gut-feel testing with the deterministic evaluation frameworks used in production.",
      skills: [
        "Developer frameworks such as LangSmith and Weights and Biases",
        "Observability logging",
        "Model-as-judge evaluation patterns",
        "Assertion testing and aggregate failure rates",
      ],
      build:
        "An evaluation suite layered over the existing pipeline, turning manual spot checks into measurable, repeatable metrics.",
      tools: ["LangSmith", "DSPy", "Python", "Custom evaluation scripts"],
    },
    {
      n: "04",
      name: "Specialised optimisation and fine-tuning",
      goal: "Adapt a model's core behaviour for a task when retrieval alone is not enough.",
      skills: [
        "Retrieval against fine-tuning, and how to choose",
        "PEFT and LoRA fundamentals",
        "Preparing a custom task dataset",
        "Open-source model adaptation",
      ],
      build:
        "A fine-tuned open-source model trained on the dataset built across the previous sessions, plus a written outcomes report covering performance boundaries, failure modes and error metrics.",
      tools: ["HuggingFace Transformers", "PEFT / LoRA", "Google Colab"],
    },
  ],
  stack: [
    { k: "Prompting and orchestration", v: "Claude API, OpenAI API, DSPy, LangChain" },
    { k: "Vector databases and retrieval", v: "FAISS, ChromaDB, Pinecone" },
    { k: "Evaluation and observability", v: "LangSmith, Weights and Biases" },
    { k: "Fine-tuning", v: "HuggingFace Transformers, PEFT, LoRA, Google Colab" },
    { k: "Environment", v: "Jupyter, Google Colab, VS Code, Python" },
  ],
  leaveWith: [
    "A complete pipeline: structured prompting, retrieval, programmatic evaluation, fine-tuned model.",
    "A portfolio piece that survives being asked about in an interview.",
    "The tools, frameworks and evaluation methods AI engineering teams actually use.",
    "Responsible practice: you can test, measure and improve a system rather than trusting it.",
    "A technical network built alongside graduate students and other builders.",
  ],
} as const;

/** The club in one block of facts, for anyone scanning rather than reading. */
export const GLANCE = [
  { k: "Open to", v: "All York students. Every faculty, every year, every level." },
  { k: "Format", v: "90-minute hands-on workshops, biweekly." },
  { k: "Tracks", v: "Forge and Spark, running in parallel." },
  { k: "Launch", v: CLUB.launch },
  { k: "Registered under", v: `${CLUB.faculty}, ${CLUB.university}` },
  { k: "Faculty advisor", v: CLUB.advisor.name },
  /** Named companies deliberately omitted. See the note at the top of
   *  this file: nothing has been agreed, so nothing is claimed. */
  { k: "Sponsors", v: "Outreach in progress. We will name them when they sign." },
] as const;

/* ---- Who runs it ----------------------------------------------------
   Real names carrying real responsibility, which is the credibility a
   club with no history actually has. Grouped by what they do rather
   than ranked, apart from the two who founded it. */

export const TEAM = {
  /** LinkedIn URLs are the ones each person posted themselves in the
   *  club chat. Tracking parameters have been stripped: several were
   *  shared from the mobile app with a utm_source trailing on the end,
   *  and forwarding those would quietly tell LinkedIn which page the
   *  click came from, which is not something this site does anywhere
   *  else.
   *
   *  `linkedin` is optional on purpose. Four people have not shared one
   *  yet, and a name without a link renders as plain type rather than as
   *  a dead or guessed link. Never invent one from a name. */
  lead: [
    {
      name: "Sagarpreet Hooda",
      role: "Founder and President",
      linkedin: "https://www.linkedin.com/in/sagarhooda9868702902",
    },
    {
      name: "Nrup Patel",
      role: "Executive Vice President",
      linkedin: "https://www.linkedin.com/in/nruppatel16",
    },
  ],
  groups: [
    {
      k: "Technical leads, Forge",
      people: [
        {
          name: "Nurjahan Ahmed Shiah",
          linkedin: "https://www.linkedin.com/in/nurjahan-shiah-5a9a291a1",
        },
        {
          name: "Mehwish Saiyed",
          linkedin: "https://www.linkedin.com/in/mehwish-saiyed",
        },
      ],
    },
    {
      k: "Technical leads, Spark",
      people: [
        {
          name: "Devyansh Raj",
          linkedin: "https://www.linkedin.com/in/devyansh-raj-",
        },
        { name: "Angad Ahluwalia" },
      ],
    },
    {
      k: "Finance",
      people: [
        {
          name: "Tatiana Dzyubenko",
          linkedin: "https://www.linkedin.com/in/tadzyu",
        },
        {
          name: "Sebastien Ming Huang Mach",
          linkedin: "https://www.linkedin.com/in/sebastien-mach-0997b3238",
        },
        {
          name: "Vianka Maria Fung Lu",
          linkedin: "https://www.linkedin.com/in/viankafunglu",
        },
        { name: "Frances Chikezie" },
      ],
    },
    {
      k: "Marketing",
      people: [
        {
          name: "Arushi Bisht",
          linkedin: "https://www.linkedin.com/in/arushi-b-44787a224",
        },
        {
          name: "Ghalib Hassan",
          linkedin: "https://www.linkedin.com/in/ghalibhassan",
        },
        {
          name: "Saharra Dhamrait",
          linkedin: "https://www.linkedin.com/in/saharrad",
        },
      ],
    },
    {
      k: "Support management",
      people: [
        { name: "Andrei Outkin Perez" },
        { name: "Manpreet Singh" },
        {
          name: "Saharra Dhamrait",
          linkedin: "https://www.linkedin.com/in/saharrad",
        },
      ],
    },
  ],
} as const;

export const FAQ = [
  {
    q: "I have never written any code. Is this actually for me?",
    a: "Yes. That is exactly who the Spark track is for. Six standalone sessions, no prerequisites, nothing to install. If you can use a browser you can keep up.",
  },
  {
    q: "What does it cost?",
    a: "Nothing. There is no membership fee, and every tool we use in a session has a free tier that covers what we do with it.",
  },
  {
    q: "Do I need to be in Lassonde?",
    a: "No. The club is registered under Lassonde and open to every York student, from any faculty and any year. Spark sessions are built on the assumption that the room is mixed.",
  },
  {
    q: "What if I miss a session?",
    a: "Fine for Spark, since every session stands alone. For Forge you can still come. You will just be picking up a pipeline mid-build, and we will point you at what you missed.",
  },
  {
    q: "Can I do both tracks?",
    a: "Yes, and some people should. They run in parallel and share community events, so the only real limit is your calendar.",
  },
  {
    q: "What do I actually leave with?",
    a: "Something that runs. Spark sends you home with a working tool the same evening. Forge ends with a deployed pipeline you can put in front of an interviewer.",
  },
  /**
   * YorkPulse.
   *
   * Placed here rather than in the footer or under the sign-up because
   * the honest version of this is an ANSWER, not a promotion: a reader
   * deciding whether to join a new club with no history is weighing
   * whether the people running it actually ship things, and this is
   * evidence that they do. It earns its place by answering that.
   *
   * The wording is load-bearing and was checked before it was written.
   * "Some of the same people build it" is true and is the whole claim;
   * it is explicitly NOT a club activity, NOT a partnership, and NOT
   * endorsed by the club, because none of those are true and the file
   * header bans claiming what has not been given. If the relationship
   * ever changes, this sentence has to change with it.
   */
  {
    q: "Do you build things outside the club?",
    a: "Some of us do. A few of the same people build YorkPulse, a community and safety platform for York students that verifies members by yorku.ca email. It is a separate project rather than a club activity, but you are welcome on it either way.",
    link: { href: "https://www.yorkpulse.com/", label: "Visit YorkPulse" },
  },
] as const;
