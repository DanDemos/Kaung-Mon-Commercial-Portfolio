/**
 * Works index for `/work`.
 * Shape mirrors the old `portfolio-container` items:
 * category filter class + title + kind label + optional external link.
 * Covers: `assets/portfolios/{type}/{slug}/cover.*`
 */

import type { StaticImageData } from "next/image";

import animeMmSub from "../../../assets/portfolios/mobile-apps/anime-mm-sub/cover.jpg";
import avs from "../../../assets/portfolios/mobile-apps/avs/cover.jpg";
import c2 from "../../../assets/portfolios/mobile-apps/c2/cover.jpg";
import chikanero from "../../../assets/portfolios/mmd/chikanero/cover.jpg";
import dandemo from "../../../assets/portfolios/websites/dandemo/cover.jpg";
import essential from "../../../assets/portfolios/websites/essential/cover.jpg";
import finalPrototypeDay from "../../../assets/portfolios/drawings/final-prototype-day/cover.jpg";
import finalPrototypeNight from "../../../assets/portfolios/drawings/final-prototype-night/cover.jpg";
import genesis from "../../../assets/portfolios/websites/genesis/cover.jpg";
import hndProject from "../../../assets/portfolios/websites/hnd-project/cover.jpg";
import hwt from "../../../assets/portfolios/mobile-apps/hwt/cover.jpg";
import iaConqueror from "../../../assets/portfolios/mmd/ia-conqueror/cover.jpg";
import kmd from "../../../assets/portfolios/mobile-apps/kmd/cover.jpg";
import myanBell from "../../../assets/portfolios/websites/myan-bell/cover.jpg";
import myanBellChatbot from "../../../assets/portfolios/chatbots/myan-bell-chatbot/cover.jpg";
import myanGate from "../../../assets/portfolios/websites/myan-gate/cover.jpg";
import myanProSolutions from "../../../assets/portfolios/websites/myan-pro-solutions/cover.jpg";
import potion from "../../../assets/portfolios/drawings/potion/cover.jpg";
import rubiksCube from "../../../assets/portfolios/drawings/rubiks-cube/cover.jpg";
import seiNoGlasses from "../../../assets/portfolios/drawings/sei-no-glasses/cover.jpg";
import slime from "../../../assets/portfolios/drawings/slime/cover.gif";
import slimeAttack from "../../../assets/portfolios/drawings/slime-attack/cover.gif";
import tsukasaTsukuyomi from "../../../assets/portfolios/drawings/tsukasa-tsukuyomi/cover.jpg";
import wizardIdle from "../../../assets/portfolios/drawings/wizard-idle/cover.jpg";
import wizardMove from "../../../assets/portfolios/drawings/wizard-move/cover.gif";
import yorkYoga from "../../../assets/portfolios/websites/york-yoga/cover.jpg";
import zeus from "../../../assets/portfolios/drawings/zeus/cover.gif";
import zeusAttack from "../../../assets/portfolios/drawings/zeus-attack/cover.gif";

/** Same filters as the old `#portfolio-flters` list. */
export type PortfolioCategory =
  | "web"
  | "app"
  | "chatbot"
  | "designs"
  | "mmd";

/** Alternate still/GIF for one grid cell — click cycles (e.g. Move ↔ Attack). */
export type PortfolioMode = {
  id: string;
  /** Short label under the title while this mode is active. */
  label: string;
  cover: StaticImageData;
};

export type PortfolioItem = {
  slug: string;
  /** Visible title (h4 in old markup). */
  title: string;
  /** Filter bucket — old `filter-web` / `filter-app` / … */
  category: PortfolioCategory;
  /** Overlay line under the title — Website, App, Drawing, Animation, … */
  kind: string;
  /** Default / only cover. First `modes` entry should match when modes exist. */
  cover: StaticImageData;
  /** Completion / release year when known. */
  year?: number;
  /** Tool used (drawings) — e.g. Inkscape, Adobe Illustrator. */
  tool?: string;
  /**
   * Optional motion set for one piece (e.g. Slime move + attack).
   * One grid cell; visitor click swaps the active mode.
   */
  modes?: PortfolioMode[];
  /** Live external project link. Omit when the site is gone. */
  href?: string;
  /** Former URL kept for records when `href` is omitted. */
  archivedHref?: string;
  hasWalkthrough?: boolean;
};

/** "2016 · Adobe Illustrator" / "2018" — for overlay + lightbox. */
export function portfolioMetaLabel(item: Pick<PortfolioItem, "year" | "tool">) {
  const parts: string[] = [];
  if (item.year != null) parts.push(String(item.year));
  if (item.tool) parts.push(item.tool);
  return parts.length ? parts.join(" · ") : null;
}

export const PORTFOLIO_FILTERS: {
  id: "all" | PortfolioCategory;
  label: string;
}[] = [
  { id: "all", label: "All" },
  { id: "web", label: "Web" },
  { id: "app", label: "App" },
  { id: "chatbot", label: "Chatbot" },
  { id: "designs", label: "Designs" },
  { id: "mmd", label: "MMD" },
];

/**
 * Newest → oldest by `year`. Same year: web → app → chatbot → designs → mmd.
 */
export const PORTFOLIO_ITEMS: PortfolioItem[] = [
  // 2022
  {
    slug: "dandemo",
    title: "Dan Demo",
    category: "web",
    kind: "Website",
    cover: dandemo,
    year: 2022,
    tool: "HTML · Bootstrap",
    href: "https://dandemo.vercel.app/",
  },
  // 2021
  {
    slug: "genesis",
    title: "Genesis Myanmar",
    category: "web",
    kind: "Website",
    cover: genesis,
    year: 2021,
    tool: "WordPress · Elementor",
    archivedHref: "http://genesismyanmar.com/",
    hasWalkthrough: true,
  },
  {
    slug: "myan-bell",
    title: "Myanbell",
    category: "web",
    kind: "Website",
    cover: myanBell,
    year: 2021,
    tool: "WordPress · Elementor",
    href: "https://myanbell.com/",
  },
  {
    slug: "myan-pro-solutions",
    title: "Myan Pro Solutions",
    category: "web",
    kind: "Website",
    cover: myanProSolutions,
    year: 2021,
    tool: "WordPress · Elementor",
    href: "https://myanprosolutions.com/",
  },
  {
    slug: "myan-bell-chatbot",
    title: "Myanbell",
    category: "chatbot",
    kind: "Chatbot",
    cover: myanBellChatbot,
    year: 2021,
    href: "https://www.facebook.com/Myanbellofficial/",
  },
  {
    slug: "sei-no-glasses",
    title: "Sei Takanashi",
    category: "designs",
    kind: "Drawing",
    cover: seiNoGlasses,
    year: 2021,
    tool: "Inkscape",
  },
  // 2020
  {
    slug: "york-yoga",
    title: "York Yoga Corner",
    category: "web",
    kind: "Website",
    cover: yorkYoga,
    year: 2020,
    tool: "WordPress · Elementor",
    archivedHref: "https://yorkyogacorner.com/",
    hasWalkthrough: true,
  },
  {
    slug: "essential",
    title: "Essential Air Solution",
    category: "web",
    kind: "Website",
    cover: essential,
    year: 2020,
    tool: "WordPress · Elementor",
    archivedHref: "https://essentialairsolution.com/",
    hasWalkthrough: true,
  },
  {
    slug: "myan-gate",
    title: "MyanGate",
    category: "web",
    kind: "Website",
    cover: myanGate,
    year: 2020,
    tool: "Wix",
    href: "https://myangate.com/",
    hasWalkthrough: true,
  },
  {
    slug: "hwt",
    title: "HWT Hardwares",
    category: "app",
    kind: "App",
    cover: hwt,
    year: 2020,
    tool: "React Native",
    href: "https://play.google.com/store/apps/details?id=com.myanshop.hwt",
  },
  {
    slug: "c2",
    title: "Cotton Concept",
    category: "app",
    kind: "App",
    cover: c2,
    year: 2020,
    tool: "React Native",
    href: "https://play.google.com/store/apps/details?id=com.myanshop.c2onlineshoppingmall",
  },
  {
    slug: "avs",
    title: "Av's Online Store",
    category: "app",
    kind: "App",
    cover: avs,
    year: 2020,
    tool: "React Native",
    href: "https://play.google.com/store/apps/details?id=com.myanshop.avsonlinestore",
  },
  {
    slug: "tsukasa-tsukuyomi",
    title: "Tsukasa Tsukuyomi",
    category: "designs",
    kind: "Drawing",
    cover: tsukasaTsukuyomi,
    year: 2020,
    tool: "Inkscape",
  },
  // 2019
  {
    slug: "anime-mm-sub",
    title: "Anime MM Sub",
    category: "app",
    kind: "App",
    cover: animeMmSub,
    year: 2019,
    tool: "Android · Java",
    href: "https://play.google.com/store/apps/details?id=com.jp.ul.nwayoofansub",
  },
  {
    slug: "kmd",
    title: "KMD",
    category: "app",
    kind: "Student project (final year)",
    cover: kmd,
    year: 2019,
    tool: "Android · Java",
  },
  {
    slug: "chikanero",
    title: "Chika Dance Nero Claudius",
    category: "mmd",
    kind: "MMD",
    cover: chikanero,
    year: 2019,
    href: "https://youtu.be/lnps2LOVhkE",
  },
  {
    slug: "ia-conqueror",
    title: "IA — Conqueror",
    category: "mmd",
    kind: "MMD",
    cover: iaConqueror,
    year: 2019,
    href: "https://youtu.be/rtrv5rbjF54",
  },
  // 2018
  {
    slug: "hnd-project",
    title: "Seventh April Online Shop",
    category: "web",
    kind: "Student project (HND)",
    cover: hndProject,
    year: 2018,
    tool: "PHP · HTML · CSS · JavaScript",
    href: "https://docs.google.com/document/d/1Ga7dvY4VtSAej1zeqmTaulGtjXxwedsq/edit?usp=sharing&ouid=103913041693913816097&rtpof=true&sd=true",
  },
  {
    slug: "wizard",
    title: "Black Wizard",
    category: "designs",
    kind: "Animation",
    cover: wizardIdle,
    year: 2018,
    tool: "Inkscape",
    modes: [
      { id: "idle", label: "Idle", cover: wizardIdle },
      { id: "move", label: "Move", cover: wizardMove },
    ],
  },
  {
    slug: "final-prototype-night",
    title: "Smart Car UI",
    category: "designs",
    kind: "Student project design",
    cover: finalPrototypeNight,
    year: 2018,
    tool: "Inkscape",
  },
  {
    slug: "final-prototype-day",
    title: "Smart Car UI — day",
    category: "designs",
    kind: "Student project design",
    cover: finalPrototypeDay,
    year: 2018,
    tool: "Inkscape",
  },
  // 2017
  {
    slug: "slime",
    title: "Slime",
    category: "designs",
    kind: "Animation",
    cover: slime,
    year: 2017,
    tool: "Inkscape",
    modes: [
      { id: "move", label: "Move", cover: slime },
      { id: "attack", label: "Attack", cover: slimeAttack },
    ],
  },
  {
    slug: "zeus",
    title: "Zeus",
    category: "designs",
    kind: "Animation",
    cover: zeus,
    year: 2017,
    tool: "Inkscape",
    modes: [
      { id: "move", label: "Move", cover: zeus },
      { id: "attack", label: "Attack", cover: zeusAttack },
    ],
  },
  // 2016
  {
    slug: "potion",
    title: "Lava Potion",
    category: "designs",
    kind: "Drawing",
    cover: potion,
    year: 2016,
    tool: "Adobe Illustrator",
  },
  {
    slug: "rubiks-cube",
    title: "Rubik's Cube",
    category: "designs",
    kind: "Drawing",
    cover: rubiksCube,
    year: 2016,
    tool: "Adobe Illustrator",
  },
];

export function portfoliosForFilter(
  filter: "all" | PortfolioCategory,
): PortfolioItem[] {
  if (filter === "all") return PORTFOLIO_ITEMS;
  return PORTFOLIO_ITEMS.filter((item) => item.category === filter);
}
