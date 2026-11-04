import type { ProjectMediaSlug } from "./media";
import type { PageSection } from "./scroll-section";

export type VisitorPath = "hire" | "craft" | "build" | "wander";

export const PATH_STORAGE_KEY = "km-visitor-path";
/** Set after first auto-ask (choose or dismiss). Header Change still reopens. */
export const CHOOSER_SEEN_KEY = "km-path-chooser-seen";
/** Wonderer is the quiet default; roles are one Lens click away. */
export const DEFAULT_PATH: VisitorPath = "wander";

/** Public contact address (mailto / copy). Form delivery uses server env. */
export const CONTACT_EMAIL = "kaungmonsoe14613@gmail.com";
export const CONTACT_MAILTO = `mailto:${CONTACT_EMAIL}`;

/** Editable social / resume. Swap when ready. */
export const SOCIAL_LINKS = {
  linkedin: "https://www.linkedin.com/",
  youtube: "https://www.youtube.com/",
  resume: "/resume.pdf",
} as const;

export const FOOTER_BLURB =
  "I build websites and product UI for teams and small businesses that want work that feels like theirs.";

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
  /** Optional help / objection rail. Empty items = section hidden. */
  focusTitle: string;
  focusSupport: string;
  items: { title: string; body: string }[];
  /** Work stage (project videos). */
  sectionTitle: string;
  sectionSupport: string;
  projects: PathProject[];
  aboutTitle: string;
  aboutBody: string;
  aboutCta: PathCta;
  clientsTitle: string;
  clientsSupport: string;
  /** Empty voices array = hide Voices section. */
  voicesTitle: string;
  voicesSupport: string;
  voices: PathVoice[];
  contactTitle: string;
  contactSupport: string;
};

/** Screen recordings under `public/media/projects/{slug}/`. Copy is path-specific. */
const PROJECT_SLUGS = [
  { title: "Essential", mediaSlug: "essential" as const },
  { title: "Genesis", mediaSlug: "genesis" as const },
  { title: "MyanGate", mediaSlug: "myan-gate" as const },
  { title: "York Yoga", mediaSlug: "york-yoga" as const },
];

type ProjectCopy = { meta: string; outcome: string; body: string };

function projectsWith(copy: Record<(typeof PROJECT_SLUGS)[number]["mediaSlug"], ProjectCopy>): PathProject[] {
  return PROJECT_SLUGS.map(({ title, mediaSlug }) => ({
    title,
    mediaSlug,
    ...copy[mediaSlug],
  }));
}

const HIRE_PROJECTS = projectsWith({
  essential: {
    meta: "Shipped product",
    outcome: "Live walkthrough of a product UI I owned end to end.",
    body: "Skim the flow for delivery quality. Stack and process details on request.",
  },
  genesis: {
    meta: "Shipped product",
    outcome: "Another live product cut. Same bar: clear screens, finished edges.",
    body: "Useful for a quick read on interface judgment under real constraints.",
  },
  "myan-gate": {
    meta: "Shipped product",
    outcome: "Production UI in motion, not a mock.",
    body: "Watch how navigation and content hierarchy hold up in use.",
  },
  "york-yoga": {
    meta: "Client site",
    outcome: "A small-business site built to convert visitors into contact.",
    body: "Shows the freelance side of the same craft: clarity over decoration.",
  },
});

const CRAFT_PROJECTS = projectsWith({
  essential: {
    meta: "UI walkthrough",
    outcome: "Layout, density, and motion choices in a working product.",
    body: "Look at spacing, component rhythm, and how screens stay readable under load.",
  },
  genesis: {
    meta: "UI walkthrough",
    outcome: "Structure first. Decoration stay out of the way.",
    body: "Good place to judge hierarchy, states, and whether the UI earns its chrome.",
  },
  "myan-gate": {
    meta: "UI walkthrough",
    outcome: "Navigation and content packing in a denser product surface.",
    body: "Watch how information is grouped when the screen has a lot to say.",
  },
  "york-yoga": {
    meta: "Marketing UI",
    outcome: "A quieter site: fewer screens, harder to hide weak type or layout.",
    body: "Small surface area. Every section has to carry its weight.",
  },
});

const BUILD_PROJECTS = projectsWith({
  essential: {
    meta: "Product for a real team",
    outcome: "People open this and know what to do next.",
    body: "Built so the product is usable without a training manual. Ask if you want the longer story.",
  },
  genesis: {
    meta: "Product for a real team",
    outcome: "Same idea: clear screens that match how the work actually runs.",
    body: "Custom build, not a template with a logo stuck on.",
  },
  "myan-gate": {
    meta: "Product for a real team",
    outcome: "A denser tool that still stays readable.",
    body: "Watch the walkthrough, then tell me what you need your own site or product to do.",
  },
  "york-yoga": {
    meta: "Business website",
    outcome: "Visitors can tell what the business offers and how to get in touch.",
    body: "The kind of site a shop or studio needs when growth depends on being found online.",
  },
});

const WANDER_PROJECTS = projectsWith({
  essential: {
    meta: "A product I built",
    outcome: "Press play if it looks interesting.",
    body: "No homework. Skip anything that doesn't catch you.",
  },
  genesis: {
    meta: "A product I built",
    outcome: "Another short walkthrough.",
    body: "Stay as long as you like.",
  },
  "myan-gate": {
    meta: "A product I built",
    outcome: "More of the same craft, different surface.",
    body: "Open it or keep scrolling. Either is fine.",
  },
  "york-yoga": {
    meta: "A site I built",
    outcome: "A quieter piece for a small business.",
    body: "Good stop if you prefer calm pages over product chrome.",
  },
});

/**
 * Colleague voices for hire, craft, and wonderer.
 * Not shown on Client. Quotes stay verbatim.
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

export const PATH_CONTENT: Record<VisitorPath, PathContent> = {
  /* Recruiter: crisp, scannable, evidence-first. */
  hire: {
    eyebrow: "Hiring",
    roles: [
      "Product engineer",
      "Frontend-strong full stack",
      "Ships and explains tradeoffs",
    ],
    headline: "Screen recordings and coworker notes. Role fit without the brochure.",
    support:
      "I ship product UI and the APIs that feed it. Watch the work, read what collaborators wrote, email if the shape fits.",
    primaryCta: { label: "See impact", section: "work" },
    secondaryCta: { label: "Email me", section: "contact" },
    focusTitle: "",
    focusSupport: "",
    items: [],
    sectionTitle: "Recent delivery",
    sectionSupport: "Short clips from live builds. Stack and process when we talk.",
    projects: HIRE_PROJECTS,
    aboutTitle: "Who you'd be hiring",
    aboutBody:
      "I'm Kaung Mon (Dan). Product engineer with a bias for clear interfaces and finished edges. I've shipped for teams and for small businesses. I write and speak plainly about what shipped and what I'd change next.",
    aboutCta: { label: "Email me", section: "contact" },
    clientsTitle: "Worked with",
    clientsSupport: "",
    voicesTitle: "From people I've shipped with",
    voicesSupport: "Unedited. Useful for culture and collaboration fit.",
    voices: COLLEAGUE_VOICES,
    contactTitle: "Open to the right role",
    contactSupport:
      "Send the role, timeline, and location or remote expectations. I'll reply with a straight yes, no, or clarifying question.",
  },

  /* Developer/Designer: peer tone, tradeoffs, no sales pitch. */
  craft: {
    eyebrow: "Craft",
    roles: [
      "Frontend systems",
      "Typed edges between UI and API",
      "Layout that stays readable",
    ],
    headline: "How the screens hold together when you press play.",
    support:
      "I'm interested in structure, states, and what complexity is worth. Not a portfolio pitch deck.",
    primaryCta: { label: "Watch builds", section: "work" },
    secondaryCta: { label: "Talk shop", section: "contact" },
    focusTitle: "",
    focusSupport: "",
    items: [],
    sectionTitle: "Builds worth pausing on",
    sectionSupport: "Judge hierarchy, density, and motion yourself. I'll fill in constraints if you ask.",
    projects: CRAFT_PROJECTS,
    aboutTitle: "How I tend to work",
    aboutBody:
      "I start from the real screen and the data it needs. Types at the edges, CSS that maps to the design tokens we mean, and motion only when it clarifies a state change. Happy to disagree in public about a tradeoff.",
    aboutCta: { label: "Talk shop", section: "contact" },
    clientsTitle: "Worked with",
    clientsSupport: "",
    voicesTitle: "Colleague network",
    voicesSupport: "Two faces per slide on purpose. Density over theatre.",
    voices: COLLEAGUE_VOICES,
    contactTitle: "Got a knotty UI or API edge?",
    contactSupport:
      "Email a link, a loom, or a short description. I'll answer with how I'd cut the problem, not a sales call.",
  },

  /* Client: warm, practical, business-owner speak. */
  build: {
    eyebrow: "For your business",
    roles: [
      "Websites that get used",
      "Custom, not template-kit",
      "Someone you can reach after launch",
    ],
    headline: "A site your customers understand, and you aren't afraid to update.",
    support:
      "I build custom websites for companies, shops, and associations that want to grow. Plain language. Yours, not a theme with a logo slapped on.",
    primaryCta: { label: "See examples", section: "work" },
    secondaryCta: { label: "Say hello", section: "contact" },
    focusTitle: "What usually gets in the way",
    focusSupport:
      "Getting found online does not have to feel hard. People already work with people they trust. Here is what we fix first.",
    items: [
      {
        title: "Nobody books the call",
        body: "If the site shows what you do and why you are worth trusting, people have a reason to reach out.",
      },
      {
        title: "Tech feels like a wall",
        body: "I walk you through the online side until it makes sense. Plain language, and I stay reachable after launch.",
      },
      {
        title: "It has to feel like you",
        body: "No ready-made templates. We design around your products, your voice, and how you already work.",
      },
    ],
    sectionTitle: "Examples you can watch",
    sectionSupport: "Real sites and products. Ask if you want the longer story behind any of them.",
    projects: BUILD_PROJECTS,
    aboutTitle: "Nice to meet you. I'm Dan",
    aboutBody:
      "I'm Kaung Mon. Friends call me Dan. I make websites for small businesses and local shops so customers can see what you offer and get in touch. You should understand how the online side works, not just own a file you can't change.",
    aboutCta: { label: "Say hello", section: "contact" },
    clientsTitle: "Worked with",
    clientsSupport: "",
    voicesTitle: "Voices",
    voicesSupport: "",
    voices: [],
    contactTitle: "Tell me what you want to grow",
    contactSupport:
      "A sentence about your business is enough to start. We'll figure out whether a new site, a redesign, or something smaller is the right next step.",
  },

  /* Wonderer: light, zero pressure, invite to switch lens. */
  wander: {
    eyebrow: "Just looking",
    roles: [
      "Web developer",
      "UI designer",
      "Someone who builds for small teams",
    ],
    headline: "Wander around. Nothing here asks you to decide today.",
    support:
      "Clips of work, a few people I've built with, and a quiet about section. Use Lens in the header if you arrived with a job to do.",
    primaryCta: { label: "Browse work", section: "work" },
    secondaryCta: { label: "Say hello", section: "contact" },
    focusTitle: "",
    focusSupport: "",
    items: [],
    sectionTitle: "Things I've made",
    sectionSupport: "Skip freely. Pause only where something pulls you in.",
    projects: WANDER_PROJECTS,
    aboutTitle: "About me",
    aboutBody:
      "I'm Kaung Mon, also Dan. I build websites and product interfaces. Some days that means a shop that needs to be found online. Other days it's denser product UI for a team. Either way I care that the screen makes sense.",
    aboutCta: { label: "Say hello", section: "contact" },
    clientsTitle: "Worked with",
    clientsSupport: "",
    voicesTitle: "People I've worked beside",
    voicesSupport: "Optional reading. Faces first.",
    voices: COLLEAGUE_VOICES,
    contactTitle: "If you feel like saying hi",
    contactSupport: "No form. Email when you want. Silence is fine too.",
  },
};

export const DEFAULT_CONTENT: PathContent = PATH_CONTENT.build;

export function contentFor(path: VisitorPath = DEFAULT_PATH): PathContent {
  return PATH_CONTENT[path] ?? DEFAULT_CONTENT;
}
