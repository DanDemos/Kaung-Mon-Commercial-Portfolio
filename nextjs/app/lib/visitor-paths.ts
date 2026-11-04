import type { ProjectMediaSlug } from "./media";
import type { PageSection } from "./scroll-section";

export type VisitorPath = "hire" | "craft" | "build" | "wander";

export const PATH_STORAGE_KEY = "km-visitor-path";
/** Set after first auto-ask (choose or dismiss). Header Change still reopens. */
export const CHOOSER_SEEN_KEY = "km-path-chooser-seen";
export const DEFAULT_PATH: VisitorPath = "wander";

/** Editable contact. Swap when ready. */
export const CONTACT_EMAIL = "hello@kaungmon.dev";
export const CONTACT_MAILTO = `mailto:${CONTACT_EMAIL}`;

/** Editable social / resume. Swap when ready. */
export const SOCIAL_LINKS = {
  linkedin: "https://www.linkedin.com/",
  youtube: "https://www.youtube.com/",
  resume: "/resume.pdf",
} as const;

export const FOOTER_BLURB =
  "I build clear websites and product UI for teams and small businesses that want something that actually feels like them.";

export type FooterNavItem =
  | { label: string; section: PageSection }
  | { label: string; href: string };

/** In-page items use `section` (no `#` in the URL). Resume stays a real href. */
export const FOOTER_NAV: FooterNavItem[] = [
  { label: "Home", section: "top" },
  { label: "Work", section: "work" },
  { label: "Clients", section: "clients" },
  { label: "About", section: "about" },
  { label: "Voices", section: "voices" },
  { label: "Contact", section: "contact" },
  { label: "Resume", href: SOCIAL_LINKS.resume },
];

export type PathCta =
  | { label: string; section: PageSection }
  | { label: string; href: string };

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
    label: "Developer/Designer",
    hint: "Looking at craft and UI choices",
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
  /** Links to `PROJECT_PREVIEWS` for the work stage video. */
  mediaSlug: ProjectMediaSlug;
};

export type PathVoiceId = "kein" | "khin" | "wai-yan";

export type PathVoice = {
  id: PathVoiceId;
  quote: string;
  name: string;
  role: string;
};

export type PathContent = {
  eyebrow: string;
  /** Quiet rotating line under the brand name. */
  roles: string[];
  headline: string;
  support: string;
  primaryCta: PathCta;
  secondaryCta: PathCta;
  sectionTitle: string;
  sectionSupport: string;
  projects: PathProject[];
  items: { title: string; body: string }[];
  aboutTitle: string;
  aboutBody: string;
  aboutCta: PathCta;
  clientsTitle: string;
  clientsSupport: string;
  /** Empty = hide Voices (Client path). */
  voicesTitle: string;
  voicesSupport: string;
  voices: PathVoice[];
  contactTitle: string;
  contactSupport: string;
};

/** Real work + screen recordings under `public/media/projects/{slug}/`. */
const SHARED_PROJECTS: PathProject[] = [
  {
    title: "Essential",
    meta: "Product walkthrough",
    mediaSlug: "essential",
    outcome: "Here's the product moving around.",
    body: "A screen recording from the live build. Ask if you want the longer story.",
  },
  {
    title: "Genesis",
    meta: "Product walkthrough",
    mediaSlug: "genesis",
    outcome: "Here's the product moving around.",
    body: "A screen recording from the live build. Ask if you want the longer story.",
  },
  {
    title: "MyanGate",
    meta: "Product walkthrough",
    mediaSlug: "myan-gate",
    outcome: "Here's the product moving around.",
    body: "A screen recording from the live build. Ask if you want the longer story.",
  },
  {
    title: "York Yoga",
    meta: "Product walkthrough",
    mediaSlug: "york-yoga",
    outcome: "Here's the product moving around.",
    body: "A screen recording from the live build. Ask if you want the longer story.",
  },
];

/**
 * Colleague voices for hire, craft, and wonderer.
 * Not shown on Client.
 */
const COLLEAGUE_VOICES: PathVoice[] = [
  {
    id: "kein",
    quote:
      "Dan is an Expert in UI/UX. He Literally do UI simple and Easy to Understand Interface.He also see the details and sizes of components in UI and Calculate it based on how many percent is needed to do. Working with Dan is Fun and you can leave everything about UI/UX to him. Thanks, Dan!",
    name: "Kein Pyi Si",
    role: "Backend Developer & Founder of Vocaloid Nation Myanmar",
  },
  {
    id: "khin",
    quote:
      "Dan is one of those rare breeds of professional who is passionate about his work and will go to any length to complete an assignment on time. He is the one who is admired and envied. But it's not just his technical abilities that have me impressed. Dan was a joy to work with because of his incredible positive attitude, emotional intelligence, and commitment to meet deadlines.",
    name: "Khin Myat San",
    role: "Web Developer",
  },
  {
    id: "wai-yan",
    quote:
      "ကောင်းမွန်က အလုပ်လုပ်တဲ့နေရမှာကော ဘာသာစကားပိုင်းမှာကောအကုန် Balance ဖြစ်တယ်။ Website လုပ်တာလည်း စိတ်ရှည်တယ်။ ဘယ်နေရာ၊ ဘယ်နားမှားနေလဲ ဆိုတာကိုလည်း ပြန်ရှာတက်တယ်။",
    name: "Wai Yan Naing",
    role: "Graphic Designer",
  },
];

const SHARED_ABOUT_BODY =
  "I'm Kaung Mon. Friends call me Dan. I make websites and product interfaces for small businesses, shops, and associations. The goal is simple: it should feel like your work, and you should understand how the online side fits together.";

export const DEFAULT_CONTENT: PathContent = {
  eyebrow: "Software engineer",
  roles: ["Web developer", "UI/UX designer", "Product partner"],
  headline: "I build product UI that stays understandable when things get busy.",
  support: "Same work on every path. Switch the lens only if it helps.",
  primaryCta: { label: "View work", section: "work" },
  secondaryCta: { label: "Contact", section: "contact" },
  sectionTitle: "Selected work",
  sectionSupport: "Watch the recordings. Details when you're ready.",
  projects: SHARED_PROJECTS,
  items: [
    {
      title: "Shipping",
      body: "Features that make it to production with clear ownership.",
    },
    {
      title: "Structure",
      body: "Interfaces and data flow that the next person can follow.",
    },
    {
      title: "Working together",
      body: "Short loops with design, product, and whoever owns the outcome.",
    },
  ],
  aboutTitle: "About me",
  aboutBody: SHARED_ABOUT_BODY,
  aboutCta: { label: "Say hello", section: "contact" },
  clientsTitle: "Worked with",
  clientsSupport: "",
  voicesTitle: "Voices",
  voicesSupport: "Faces first. A quick look at people I've built with.",
  voices: COLLEAGUE_VOICES,
  contactTitle: "Want to talk?",
  contactSupport: "Email works. Tell me what you're hiring for or trying to ship.",
};

export const PATH_CONTENT: Record<VisitorPath, PathContent> = {
  hire: {
    eyebrow: "For recruiters",
    roles: [
      "Full-stack product engineer",
      "Interface-minded builder",
      "Calm when delivery is loud",
    ],
    headline: "Engineer who cares about outcomes you can check.",
    support: "Impact, fit, and how I work with a team. We can go deeper later.",
    primaryCta: { label: "See impact", section: "work" },
    secondaryCta: { label: "Email me", section: "contact" },
    sectionTitle: "Work hiring teams can skim",
    sectionSupport: "Proof first. Stack talk when we meet.",
    projects: SHARED_PROJECTS,
    items: [
      {
        title: "What I do",
        body: "Full-stack product work with a strong frontend seat and steady release habits.",
      },
      {
        title: "How I update people",
        body: "Short written decisions, clear status, notes that still make sense after hand-off.",
      },
      {
        title: "What I look for",
        body: "Teams that care about shipping clean work, not looking busy.",
      },
    ],
    aboutTitle: "Who you'd be hiring",
    aboutBody: SHARED_ABOUT_BODY,
    aboutCta: { label: "Email me", section: "contact" },
    clientsTitle: "Worked with",
    clientsSupport: "",
    voicesTitle: "What collaborators say",
    voicesSupport: "A few people I've built with.",
    voices: COLLEAGUE_VOICES,
    contactTitle: "Want to talk?",
    contactSupport:
      "If you need someone who ships and can explain the tradeoffs, email me.",
  },
  craft: {
    eyebrow: "For developers & designers",
    roles: [
      "Systems-minded frontend",
      "Typed APIs & clear edges",
      "UI that earns its complexity",
    ],
    headline: "Architecture, interfaces, and the choices behind the UI.",
    support:
      "How pieces hold together. Structure and tradeoffs, not a code dump.",
    primaryCta: { label: "See craft", section: "work" },
    secondaryCta: { label: "Email", section: "contact" },
    sectionTitle: "How the work is built",
    sectionSupport: "Less pitch. More structure and execution.",
    projects: SHARED_PROJECTS,
    items: [
      {
        title: "System design",
        body: "Module edges, typed contracts, data flow you can point at.",
      },
      {
        title: "Frontend craft",
        body: "Accessible UI, motion that has a reason, budgets that stick.",
      },
      {
        title: "Operability",
        body: "Failure modes, visibility, and deploys you can trust.",
      },
    ],
    aboutTitle: "How I work",
    aboutBody: SHARED_ABOUT_BODY,
    aboutCta: { label: "Talk shop", section: "contact" },
    clientsTitle: "Worked with",
    clientsSupport: "",
    voicesTitle: "Colleague network",
    voicesSupport:
      "Two voices per slide on purpose. One card looks nicer; two shows the network faster. You're not meant to study every line. You should see how many people I've built with. Same kind of call as product UI: pretty focus vs denser signal.",
    voices: COLLEAGUE_VOICES,
    contactTitle: "Want to dig in together?",
    contactSupport: "Happy to walk through architecture or a messy problem space.",
  },
  build: {
    eyebrow: "For clients",
    roles: [
      "Web developer",
      "UI/UX designer",
      "Partner for growing businesses",
    ],
    headline: "You don't just need a website. You need one people trust.",
    support:
      "I help companies and associations grow with custom sites and product interfaces that feel like you, not a template with a logo stuck on.",
    primaryCta: { label: "See work", section: "work" },
    secondaryCta: { label: "Say hello", section: "contact" },
    sectionTitle: "How we usually work together",
    sectionSupport: "Finding clients online shouldn't feel mysterious. Here's what we fix first.",
    projects: SHARED_PROJECTS,
    items: [
      {
        title: "Nobody's booking the call",
        body: "A clear site that shows what you do, and why you're worth trusting, gives people a reason to reach out.",
      },
      {
        title: "Tech feels intimidating",
        body: "I'll walk the online side with you until it makes sense. No jargon wall, and I don't vanish after launch.",
      },
      {
        title: "It has to feel like you",
        body: "No ready-made templates. We design for your products, your voice, and how you actually work.",
      },
    ],
    aboutTitle: "Nice to meet you. I'm Dan",
    aboutBody:
      "I've helped small businesses and local shops with websites that carry the character of their products, so growth online feels like an extension of what they already do well.",
    aboutCta: { label: "Say hello", section: "contact" },
    clientsTitle: "Worked with",
    clientsSupport: "",
    voicesTitle: "Voices",
    voicesSupport: "",
    voices: [],
    contactTitle: "Ready when you are",
    contactSupport: "Tell me what you're trying to grow. We can make something new together.",
  },
  wander: {
    eyebrow: "Welcome",
    roles: [
      "Web developer",
      "UI/UX designer",
      "Builder for growing businesses",
    ],
    headline: "Glad you stopped by. No pitch required.",
    support: "A light look at who I am and what I make. Change the lens anytime.",
    primaryCta: { label: "Start browsing", section: "work" },
    secondaryCta: { label: "Say hello", section: "contact" },
    sectionTitle: "A short tour",
    sectionSupport: "Skim freely. Dig in only where something catches you.",
    projects: SHARED_PROJECTS,
    items: [
      {
        title: "Who I am",
        body: "Engineer and designer. Clear products, and sites that help real businesses grow.",
      },
      {
        title: "What I make",
        body: "Custom web products and interfaces meant to last past launch day.",
      },
      {
        title: "If you stick around",
        body: "Switch the path in the header when you want a different cut of the same work.",
      },
    ],
    aboutTitle: "About me",
    aboutBody: SHARED_ABOUT_BODY,
    aboutCta: { label: "Say hello", section: "contact" },
    clientsTitle: "Worked with",
    clientsSupport: "",
    voicesTitle: "Voices",
    voicesSupport: "Faces first. A quick look at people I've built with.",
    voices: COLLEAGUE_VOICES,
    contactTitle: "If something clicks, say hi.",
    contactSupport: "No form maze. Just email when you're ready.",
  },
};

export function contentFor(path: VisitorPath = DEFAULT_PATH): PathContent {
  return PATH_CONTENT[path] ?? DEFAULT_CONTENT;
}
