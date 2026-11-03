export type VisitorPath = "hire" | "craft" | "build" | "wander";

export const PATH_STORAGE_KEY = "km-visitor-path";
/** Set after first auto-ask (choose or dismiss). Header Change still reopens. */
export const CHOOSER_SEEN_KEY = "km-path-chooser-seen";
export const DEFAULT_PATH: VisitorPath = "wander";

/** Editable contact — swap when ready. */
export const CONTACT_EMAIL = "hello@kaungmon.dev";
export const CONTACT_MAILTO = `mailto:${CONTACT_EMAIL}`;

export const ROLE_OPTIONS: {
  id: Exclude<VisitorPath, "wander">;
  label: string;
  hint: string;
}[] = [
  {
    id: "hire",
    label: "Recruiter",
    hint: "Hiring for a role",
  },
  {
    id: "craft",
    label: "Developer",
    hint: "Reviewing the technical work",
  },
  {
    id: "build",
    label: "Client",
    hint: "Need a product built",
  },
];

export const WANDER_OPTION = {
  id: "wander" as const,
  label: "Wonderer",
  hint: "Just looking around",
};

/** All selectable paths, including the quiet browse escape. */
export const PATH_OPTIONS = [...ROLE_OPTIONS, WANDER_OPTION];

export type PathProject = {
  title: string;
  meta: string;
  outcome: string;
  body: string;
};

export type PathContent = {
  eyebrow: string;
  headline: string;
  support: string;
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
  sectionTitle: string;
  sectionSupport: string;
  /** Featured proof — first viewport of trust below the hero. */
  projects: PathProject[];
  items: { title: string; body: string }[];
  contactTitle: string;
  contactSupport: string;
};

const SHARED_PROJECTS: PathProject[] = [
  {
    title: "Commerce ops console",
    meta: "Product engineering · React / Node",
    outcome: "Cut fulfillment exceptions ~40% in the first quarter after launch.",
    body: "Rebuilt the internal order desk around clear states, typed APIs, and a UI operators could learn in a shift—not a week. Focus: fewer dead-ends, faster recovery when something breaks.",
  },
  {
    title: "Member onboarding system",
    meta: "Full-stack delivery · Next.js",
    outcome: "Time-to-first-value dropped from days to the same session for most new accounts.",
    body: "One continuous flow from invite → setup → first successful action, with observability on every drop-off. Handed off with runbooks and ownership boundaries the team still uses.",
  },
];

export const DEFAULT_CONTENT: PathContent = {
  eyebrow: "Software engineer",
  headline: "I ship product systems that stay clear under pressure.",
  support: "Same work throughout — choose a lens only if it helps.",
  primaryCta: { label: "View selected work", href: "#work" },
  secondaryCta: { label: "Contact", href: "#contact" },
  sectionTitle: "Selected work",
  sectionSupport: "Outcomes first. Depth when you want it.",
  projects: SHARED_PROJECTS,
  items: [
    {
      title: "Product delivery",
      body: "End-to-end features with measurable release quality.",
    },
    {
      title: "Systems thinking",
      body: "Interfaces, data flow, and maintainable architecture.",
    },
    {
      title: "Clear collaboration",
      body: "Tight loops with design, product, and stakeholders.",
    },
  ],
  contactTitle: "Open to the right conversation.",
  contactSupport: "Email is fine. Say what you’re trying to ship or hire for.",
};

export const PATH_CONTENT: Record<VisitorPath, PathContent> = {
  hire: {
    eyebrow: "For recruiters",
    headline: "Senior-minded engineer focused on outcomes you can verify.",
    support:
      "Impact, role fit, and how I work with a team — before the deep dive.",
    primaryCta: { label: "See impact", href: "#work" },
    secondaryCta: { label: "Email me", href: "#contact" },
    sectionTitle: "Signal for hiring teams",
    sectionSupport:
      "Proof first. Stack and process details when we talk.",
    projects: [
      {
        title: "Commerce ops console",
        meta: "Staff-level ownership · B2B product",
        outcome:
          "Exception rate down ~40%; on-call noise down with clearer state machines.",
        body: "Led the rebuild of a high-traffic internal desk: prioritization UX, API contracts, and release discipline so the team could ship weekly without fear.",
      },
      {
        title: "Member onboarding system",
        meta: "Cross-functional delivery",
        outcome: "Activation improved; support tickets on setup fell sharply.",
        body: "Partnered with design and success to collapse a fragmented signup into one measurable journey—instrumented, owned, and documented for the next hire.",
      },
    ],
    items: [
      {
        title: "Role shape",
        body: "Full-stack product engineering with strong frontend ownership and calm production habits.",
      },
      {
        title: "How I communicate",
        body: "Written decisions, concise updates, and incident notes that survive hand-off.",
      },
      {
        title: "What I look for",
        body: "Teams that care about clarity, craft, and shipping — not theater.",
      },
    ],
    contactTitle: "Open to the right conversation.",
    contactSupport:
      "If the role needs someone who ships and explains the trade-offs, email me.",
  },
  craft: {
    eyebrow: "For developers",
    headline: "Architecture, interfaces, and the decisions behind the UI.",
    support:
      "Code quality, system boundaries, and how the pieces hold together.",
    primaryCta: { label: "Read the craft", href: "#work" },
    secondaryCta: { label: "Email", href: "#contact" },
    sectionTitle: "How the work is built",
    sectionSupport: "Less pitch. More structure, trade-offs, and execution.",
    projects: [
      {
        title: "Commerce ops console",
        meta: "React · typed APIs · observability",
        outcome: "Predictable state, fewer impossible UI modes, safer deploys.",
        body: "Domain model first, then UI. Explicit transitions, error boundaries that mean something, and metrics on the paths that used to page people at 2am.",
      },
      {
        title: "Member onboarding system",
        meta: "Next.js · progressive disclosure",
        outcome: "One pipeline; drop-offs finally visible.",
        body: "Server/client boundaries kept boring on purpose. Forms that fail loudly, retries that don’t double-write, and a hand-off the next engineer can extend.",
      },
    ],
    items: [
      {
        title: "System design",
        body: "Clear module edges, typed contracts, and predictable data flow.",
      },
      {
        title: "Frontend craft",
        body: "Accessible UI, intentional motion, and performance budgets.",
      },
      {
        title: "Operability",
        body: "Observability, failure modes, and deploy confidence.",
      },
    ],
    contactTitle: "Want to dig into the code together?",
    contactSupport: "Happy to walk through architecture or review a problem space.",
  },
  build: {
    eyebrow: "For clients",
    headline: "From messy problem to a product people can actually use.",
    support:
      "Discovery, delivery rhythm, and results — without the agency fog.",
    primaryCta: { label: "See engagements", href: "#work" },
    secondaryCta: { label: "Start a conversation", href: "#contact" },
    sectionTitle: "How engagements usually run",
    sectionSupport: "Problem → approach → shipped result. One thread at a time.",
    projects: [
      {
        title: "Commerce ops console",
        meta: "Ops-facing product · multi-week delivery",
        outcome: "Team moved from spreadsheets and chat chaos to one desk.",
        body: "Started with the real constraint (exceptions, not “a nicer UI”), then shipped in visible slices so stakeholders could steer without stopping progress.",
      },
      {
        title: "Member onboarding system",
        meta: "Growth-critical journey",
        outcome: "New members reached value in-session instead of over days.",
        body: "Framed success as first meaningful action, not account creation. Built, measured, iterated — then left docs and ownership with your team.",
      },
    ],
    items: [
      {
        title: "Problem framing",
        body: "We define the real constraint before writing code.",
      },
      {
        title: "Build cadence",
        body: "Visible progress every week, with room to change course.",
      },
      {
        title: "Hand-off ready",
        body: "Documentation, ownership, and a system your team can keep.",
      },
    ],
    contactTitle: "Tell me what you want to ship.",
    contactSupport:
      "A short note on the problem and timeline is enough to start.",
  },
  wander: {
    eyebrow: "Welcome",
    headline: "Glad you stopped by — no pitch required.",
    support:
      "A light tour of who I am and what I make. Change your lens anytime.",
    primaryCta: { label: "Start browsing", href: "#work" },
    secondaryCta: { label: "Say hello", href: "#contact" },
    sectionTitle: "A short tour",
    sectionSupport: "Skim freely. Dig in only where something catches you.",
    projects: SHARED_PROJECTS,
    items: [
      {
        title: "Who I am",
        body: "A software engineer who cares about clear products and steady delivery.",
      },
      {
        title: "What I make",
        body: "Web products, interfaces, and systems meant to last past launch day.",
      },
      {
        title: "If you stick around",
        body: "Switch the path in the header whenever you want a sharper cut of the same work.",
      },
    ],
    contactTitle: "If something resonates, say hi.",
    contactSupport: "No form maze — just email when you’re ready.",
  },
};

export function contentFor(path: VisitorPath = DEFAULT_PATH): PathContent {
  return PATH_CONTENT[path] ?? DEFAULT_CONTENT;
}
